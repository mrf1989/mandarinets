import { Router } from "https://deno.land/x/oak/router.ts";
import { ApplicationContext } from "../../main-core/application-context/mandarineApplicationContext.ts";
import { ComponentRegistryContext } from "../../main-core/components-registry/componentRegistryContext.ts";
import { ControllerComponent } from "../core/internal/components/routing/controllerContext.ts";
import { RoutingAction } from "../core/internal/components/routing/routingAction.ts";
import { requestResolver } from "../core/internal/components/routing/routingResolver.ts";
import { HttpMethods } from "../core/enums/http/httpMethods.ts";
import { MandarineLoading } from "../../main-core/mandarineLoading.ts";
import { Log } from "../../logger/log.ts";
import { ServerRequest } from "https://deno.land/std@v1.0.0-rc1/http/server.ts";
import { Request } from "https://deno.land/x/oak/request.ts";
import { SessionMiddleware } from "../core/middlewares/sessionMiddleware.ts";

export class MandarineMvcFrameworkStarter {

    private router: Router = new Router();

    private logger: Log = Log.getLogger(MandarineMvcFrameworkStarter);

    constructor() {

        MandarineLoading();

        this.resolveComponentsDependencies();
        this.initializeControllers();
        this.intializeControllersRoutes();
    }

    private resolveComponentsDependencies(): void {
        ApplicationContext.getInstance().getComponentsRegistry().resolveDependencies();
    }

    private initializeControllers() {
        ApplicationContext.getInstance().getComponentsRegistry().getControllers().forEach((controller) => {
            (<ControllerComponent>controller.componentInstance).initializeControllerFunctionality();
        })
    }

    private intializeControllersRoutes(): void {
        let mvcControllers: ComponentRegistryContext[] = ApplicationContext.getInstance().getComponentsRegistry().getControllers();

        if(mvcControllers.length == 0) {
            this.logger.warn("No controllers have been found"); 
            return;
        }

        try {

            mvcControllers.forEach((component: ComponentRegistryContext, index) => {
                let controller: ControllerComponent = <ControllerComponent> component.componentInstance;
                controller.getActions().forEach((value, key) => {
                    this.router = this.addPathToRouter(this.router, value, controller);
                });
            });

            this.logger.info(`A total of ${mvcControllers.length} controllers have been initialized`);
        }catch(error){
            this.logger.error(`Controllers could not be initialized`, error);
        }

    }

    private preRequestInternalMiddlewares(response: any, request: Request): void {
        new SessionMiddleware().createSessionCookie(request, response);
    }

    private postRequestInternalMiddlewares(response: any, request: Request): void {
        new SessionMiddleware().storeSession(request, response);
    }

    private addPathToRouter(router: Router, routingAction: RoutingAction, controllerComponent: ControllerComponent): Router {
        let route: string = controllerComponent.getActionRoute(routingAction);

        let responseHandler = async ({ response, params, request }) => {
            this.preRequestInternalMiddlewares(response, request);
            response.body = await requestResolver(routingAction, <Request> request, response, params);
            this.postRequestInternalMiddlewares(response, request);
        };

        switch(routingAction.actionType) {
            case HttpMethods.GET:
                return router.get(route, responseHandler);
            case HttpMethods.POST:
                return router.post(route, responseHandler);
            case HttpMethods.DELETE:
                return router.delete(route, responseHandler);
            case HttpMethods.OPTIONS:
                return router.options(route, responseHandler);
            case HttpMethods.PUT:
                return router.put(route, responseHandler);
            case HttpMethods.PATCH:
                return router.patch(route, responseHandler);
            case HttpMethods.HEAD:
                return router.head(route, responseHandler);
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}