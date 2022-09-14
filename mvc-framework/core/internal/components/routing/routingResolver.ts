// Copyright 2020-2020 The Mandarine.TS Framework authors. All rights reserved. MIT license.

import { ApplicationContext } from "../../../../../main-core/application-context/mandarineApplicationContext.ts";
import { DI } from "../../../../../main-core/dependency-injection/di.ns.ts";
import { MandarineException } from "../../../../../main-core/exceptions/mandarineException.ts";
import { Mandarine } from "../../../../../main-core/Mandarine.ns.ts";
import { MandarineConstants } from "../../../../../main-core/mandarineConstants.ts";
import { Reflect } from "../../../../../main-core/reflectMetadata.ts";
import { Optional } from "../../../../../plugins/optional.ts";
import type { ControllerComponent } from "./controllerContext.ts";

/**
 * Resolves the request made to an endpoint. 
 * This method works along with the DI container.
 */
export const requestResolver = async (routingAction: Mandarine.MandarineMVC.Routing.RoutingAction, context: Mandarine.Types.RequestContext) => {
    if(routingAction.actionParent == undefined) return;
    let objectContext: Mandarine.MandarineCore.ComponentRegistryContext | undefined = ApplicationContext.getInstance().getComponentsRegistry().get(routingAction.actionParent);
    
    if(!objectContext) {
        throw new MandarineException(MandarineException.INVALID_COMPONENT_CONTEXT);
    }
    
    let component: ControllerComponent = <ControllerComponent> objectContext.componentInstance;
    let handler: any = component.getClassHandler();

    let methodArgs: DI.ArgumentValue[] | null = await DI.Factory.methodArgumentResolver(handler, routingAction.actionMethodName, context);

    // Modify Response Status
    if(routingAction.routingOptions != undefined && routingAction.routingOptions.responseStatus != (undefined || null)) {
        context.response.status = <any> routingAction.routingOptions.responseStatus;
    } else if(component.options.responseStatus != (undefined || null)) {
        context.response.status = <any> component.options.responseStatus;
    } else {
        context.response.status = <any> Mandarine.MandarineMVC.HttpStatusCode.OK;
    }

    // We dont use the variable handlerMethod because if we do it will loose the context and so the dependency injection will fail.
    // So if the method we are invoking uses dependents, the dispatcher will fail.
    // with that said we have to use nativaly the class and the method as if we are invoking the whole thing.
    let methodValue: any = undefined;
    if(handler[routingAction.actionMethodName] instanceof Mandarine.AsyncFunction) {
        methodValue = (methodArgs == null) ? await handler[routingAction.actionMethodName]() : await handler[routingAction.actionMethodName](...methodArgs);
    } else {
        methodValue = (methodArgs == null) ? handler[routingAction.actionMethodName]() : handler[routingAction.actionMethodName](...methodArgs);
    }
    let isRenderable: boolean = false;

    let renderInformation: Mandarine.MandarineMVC.TemplateEngine.Decorators.RenderData = Reflect.getMetadata(`${MandarineConstants.REFLECTION_MANDARINE_METHOD_ROUTE_RENDER}:${routingAction.actionMethodName}`, handler, routingAction.actionMethodName);
    isRenderable = renderInformation != undefined;
    if(isRenderable) {
        //context.response.body = Mandarine.MandarineMVC.TemplateEngine.RenderEngine.render(renderInformation, renderInformation.engine, (methodValue == (null || undefined)) ? {} : methodValue);
    } else {
        context.response.body = Optional.ofNullable(methodValue).orElseGet(undefined);
    }
};

/**
 * Resolves the middleware request made to an endpoint. 
 */
export const middlewareResolver = async (preRequest: boolean, middlewareComponent: Mandarine.Types.MiddlewareComponent, context: Mandarine.Types.RequestContext): Promise<boolean | undefined> => {

    let handler = middlewareComponent.getClassHandler();
    let methodName: string = (preRequest) ? "onPreRequest" : "onPostRequest";

    let methodArgs: DI.ArgumentValue[] | null = await DI.Factory.methodArgumentResolver(handler, methodName, context);

    if(preRequest) {
        if(methodArgs == null) {
            return handler[methodName]();
        } else {
            return handler[methodName](...methodArgs);
        }
    } else {
        if(methodArgs == null) {
            handler[methodName]();
            return undefined;
        } else {
            handler[methodName](...methodArgs);
            return undefined;
        }
    }
};