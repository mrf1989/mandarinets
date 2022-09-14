// Copyright 2020-2020 The Mandarine.TS Framework authors. All rights reserved. MIT license.

import { ApplicationContext } from "../../main-core/application-context/mandarineApplicationContext.ts";
import { DI } from "../../main-core/dependency-injection/di.ns.ts";
import type { Mandarine } from "../../main-core/Mandarine.ns.ts";
import type { ControllerComponent } from "../../mvc-framework/core/internal/components/routing/controllerContext.ts";
//import { ViewModel } from "../../mvc-framework/core/modules/view-engine/viewModel.ts";
import { MVCDecoratorsProxy } from "../../mvc-framework/core/proxys/mvcCoreDecorators.ts";
import { MandarineMvcFrameworkStarter } from "../../mvc-framework/engine/mandarineMvcFrameworkStarter.ts";
import { MandarineMvc } from "../../mvc-framework/mandarine-mvc.ns.ts";
import { DenoAsserts, mockDecorator, Orange, Test } from "../mod.ts";

export class HttpHandlersTest {

    constructor() {
        Orange.setOptions(this, {
            hooks: {
                beforeEach: () => ApplicationContext.getInstance().getComponentsRegistry().clearComponentRegistry()
            }
        })
    }

    @Test({
        name: "Test HTTP Route Creation",
        description: "Test the creation for every type of route (GET, POST...)"
    })
    public testHTTPRouteCreation() {

        @mockDecorator()
        class MyControllerWithRoutes {

            @mockDecorator()
            public getRoute() {
            }

            @mockDecorator()
            public postRoute() {
            }

            @mockDecorator()
            public putRoute() {
            }

            @mockDecorator()
            public deleteRoute() {
            }

            @mockDecorator()
            public headRoute() {
            }

            @mockDecorator()
            public optionsRoute() {
            }

            @mockDecorator()
            public patchRoute() {
            }
        }

        MVCDecoratorsProxy.registerHttpAction("/api-get", MandarineMvc.HttpMethods.GET, MyControllerWithRoutes.prototype, "getRoute", <any><unknown>undefined);
        MVCDecoratorsProxy.registerHttpAction("/api-post", MandarineMvc.HttpMethods.POST, MyControllerWithRoutes.prototype, "postRoute", <any><unknown>undefined);
        MVCDecoratorsProxy.registerHttpAction("/api-put", MandarineMvc.HttpMethods.PUT, MyControllerWithRoutes.prototype, "putRoute", <any><unknown>undefined);
        MVCDecoratorsProxy.registerHttpAction("/api-delete", MandarineMvc.HttpMethods.DELETE, MyControllerWithRoutes.prototype, "deleteRoute", <any><unknown>undefined);
        MVCDecoratorsProxy.registerHttpAction("/api-head", MandarineMvc.HttpMethods.HEAD, MyControllerWithRoutes.prototype, "headRoute", <any><unknown>undefined);
        MVCDecoratorsProxy.registerHttpAction("/api-options", MandarineMvc.HttpMethods.OPTIONS, MyControllerWithRoutes.prototype, "optionsRoute", <any><unknown>undefined);
        MVCDecoratorsProxy.registerHttpAction("/api-patch", MandarineMvc.HttpMethods.PATCH, MyControllerWithRoutes.prototype, "patchRoute", <any><unknown>undefined);
        MVCDecoratorsProxy.registerControllerComponent(MyControllerWithRoutes, undefined);
        ApplicationContext.getInstance().getComponentsRegistry().initializeControllers();
        new MandarineMvcFrameworkStarter()["intializeControllersRoutes"]();
        let actions: Map<String, Mandarine.MandarineMVC.Routing.RoutingAction> = ApplicationContext.getInstance().getComponentsRegistry().get("MyControllerWithRoutes")?.componentInstance.getActions();
        DenoAsserts.assertArrayContains(Array.from(actions.values()), [
              {
                actionParent: "MyControllerWithRoutes",
                actionType: 0,
                actionMethodName: "getRoute",
                route: "/api-get",
                routingOptions: {
                    middleware: []
                },
                initializationStatus: 1,
                routeParams: [],
                routeSignature: ["0", "api-get"]
              },
              {
                actionParent: "MyControllerWithRoutes",
                actionType: 1,
                actionMethodName: "postRoute",
                route: "/api-post",
                routingOptions: {
                    middleware: []
                },
                initializationStatus: 1,
                routeParams: [],
                routeSignature: ["1", "api-post"]
              },
              {
                actionParent: "MyControllerWithRoutes",
                actionType: 2,
                actionMethodName: "putRoute",
                route: "/api-put",
                routingOptions: {
                    middleware: []
                },
                initializationStatus: 1,
                routeParams: [],
                routeSignature: ["2", "api-put"]
              },
              {
                actionParent: "MyControllerWithRoutes",
                actionType: 4,
                actionMethodName: "deleteRoute",
                route: "/api-delete",
                routingOptions: {
                    middleware: []
                },
                initializationStatus: 1,
                routeParams: [],
                routeSignature: ["4", "api-delete"]
              },
              {
                actionParent: "MyControllerWithRoutes",
                actionType: 3,
                actionMethodName: "headRoute",
                route: "/api-head",
                routingOptions: {
                    middleware: []
                },
                initializationStatus: 1,
                routeParams: [],
                routeSignature: ["3", "api-head"]
              },
              {
                actionParent: "MyControllerWithRoutes",
                actionType: 6,
                actionMethodName: "optionsRoute",
                route: "/api-options",
                routingOptions: {
                    middleware: []
                },
                initializationStatus: 1,
                routeParams: [],
                routeSignature: ["6", "api-options"]
              },
              {
                actionParent: "MyControllerWithRoutes",
                actionType: 5,
                actionMethodName: "patchRoute",
                route: "/api-patch",
                routingOptions: {
                    middleware: []
                },
                initializationStatus: 1,
                routeParams: [],
                routeSignature: ["5", "api-patch"]
              }
        ]);
    }

    @Test({
        name: "Test HTTP @QueryParam",
        description: "Test the creation & use of `@QueryParam`"
    })
    public async testHTTPQueryParamDecorator() {

        @mockDecorator()
        class MyController {
            
            @mockDecorator()
            public getRoute(invalidParam: any, invalidParam2:any, nameQueryParam: any, invalidParam3: any, frameworkQueryParam: any) {
            }

        }

        MVCDecoratorsProxy.registerHttpAction("/api-get-2", MandarineMvc.HttpMethods.GET, MyController.prototype, "getRoute", <any><unknown>undefined);
        MVCDecoratorsProxy.registerRoutingParam(MyController.prototype, DI.InjectionTypes.QUERY_PARAM, "getRoute", 2, "name");
        MVCDecoratorsProxy.registerRoutingParam(MyController.prototype, DI.InjectionTypes.QUERY_PARAM, "getRoute", 4, "framework");
        MVCDecoratorsProxy.registerControllerComponent(MyController, undefined);
        ApplicationContext.getInstance().getComponentsRegistry().resolveDependencies();
        ApplicationContext.getInstance().getComponentsRegistry().initializeControllers();
        let controller: ControllerComponent = ApplicationContext.getInstance().getComponentsRegistry().get("MyController")?.componentInstance;
        let actions: Map<String, Mandarine.MandarineMVC.Routing.RoutingAction> = controller.getActions();
        let action = actions.get(controller.getActionName("getRoute"));
        if(!action) throw new Error();
        let args = await DI.Factory.methodArgumentResolver(controller.getClassHandler(), action.actionMethodName, <any> {
            request: {
                url: new URL("http://localhost/api-get-2?name=testing&framework=Mandarine")
            }
        });
        // We test undefined parameters because order should not matter
        DenoAsserts.assertEquals(args, [undefined, undefined, "testing", undefined, "Mandarine"]);
    }

    @Test({
        name: "Test HTTP @RouteParam",
        description: "Test the creation & use of `@RouteParam`"
    })
    public async testHTTPRouteParamDecorator() {

        @mockDecorator()
        class MyController {
            
            @mockDecorator()
            public getRoute(invalidParam: any, nameRouteParam: any, lastnameRouteParam: any, lastInvalidParam: any) {
            }

        }

        MVCDecoratorsProxy.registerHttpAction("/api-get-3/:name/:lastname", MandarineMvc.HttpMethods.GET, MyController.prototype, "getRoute", <any><unknown>undefined);
        MVCDecoratorsProxy.registerRoutingParam(MyController.prototype, DI.InjectionTypes.ROUTE_PARAM, "getRoute", 1, "name");
        MVCDecoratorsProxy.registerRoutingParam(MyController.prototype, DI.InjectionTypes.ROUTE_PARAM, "getRoute", 2, "lastname");
        MVCDecoratorsProxy.registerControllerComponent(MyController, undefined);
        ApplicationContext.getInstance().getComponentsRegistry().resolveDependencies();
        ApplicationContext.getInstance().getComponentsRegistry().initializeControllers();
        let controller: ControllerComponent = ApplicationContext.getInstance().getComponentsRegistry().get("MyController")?.componentInstance;
        let actions: Map<String, Mandarine.MandarineMVC.Routing.RoutingAction> = controller.getActions();
        let action = actions.get(controller.getActionName("getRoute"));
        if(!action) throw new Error();
        let args = await DI.Factory.methodArgumentResolver(controller.getClassHandler(), action.actionMethodName, <any> {
            request: {
                url: new URL("http://localhost/api-get-3/Steve/Jobs")
            },
            params: {
                name: "Steve",
                lastname: "Jobs"
            }
        });

        DenoAsserts.assertEquals(args, [undefined, "Steve", "Jobs", undefined]);
    }

    @Test({
        name: "Test HTTP @Session",
        description: "Test the creation & use of `@Session`"
    })
    public async testHTTPSessionDecorator() {

        @mockDecorator()
        class MyController {
            
            @mockDecorator()
            public getRoute(invalidParam: any, mySession: any) {
            }

        }

        MVCDecoratorsProxy.registerHttpAction("/api-get-4", MandarineMvc.HttpMethods.GET, MyController.prototype, "getRoute", <any><unknown>undefined);
        MVCDecoratorsProxy.registerRoutingParam(MyController.prototype, DI.InjectionTypes.SESSION_PARAM, "getRoute", 1, undefined);
        MVCDecoratorsProxy.registerControllerComponent(MyController, undefined);
        ApplicationContext.getInstance().getComponentsRegistry().resolveDependencies();
        ApplicationContext.getInstance().getComponentsRegistry().initializeControllers();
        let controller: ControllerComponent = ApplicationContext.getInstance().getComponentsRegistry().get("MyController")?.componentInstance;
        let actions: Map<String, Mandarine.MandarineMVC.Routing.RoutingAction> = controller.getActions();
        let action = actions.get(controller.getActionName("getRoute"));
        if(!action) throw new Error();
        let args = await DI.Factory.methodArgumentResolver(controller.getClassHandler(), action.actionMethodName, <any> {
            request: {
                url: new URL("http://localhost/api-get-4"),
                session: {}
            }
        });
        if(!args) throw new Error();

        DenoAsserts.assertEquals(args, [undefined, {}]);
        let session = args[1];
        DenoAsserts.assertEquals(session.times, undefined);
        session.times = 0;
        DenoAsserts.assertEquals(args[1].times, 0);
        session.times = 1;
        DenoAsserts.assertEquals(args[1].times, 1);

    }

    @Test({
        name: "Test HTTP @ViewModel",
        description: "Test the creation & use of `@ViewModel`"
    })
    public async testHTTPViewModelDecorator() {

        @mockDecorator()
        class MyController {
            
            @mockDecorator()
            public getRoute(invalidParam: any, myTemplateModel: any) {
            }

        }

        MVCDecoratorsProxy.registerHttpAction("/api-get-5", MandarineMvc.HttpMethods.GET, MyController.prototype, "getRoute", <any><unknown>undefined);
        MVCDecoratorsProxy.registerRoutingParam(MyController.prototype, DI.InjectionTypes.TEMPLATE_MODEL_PARAM, "getRoute", 1, undefined);
        MVCDecoratorsProxy.registerControllerComponent(MyController, undefined);
        ApplicationContext.getInstance().getComponentsRegistry().resolveDependencies();
        ApplicationContext.getInstance().getComponentsRegistry().initializeControllers();
        let controller: ControllerComponent = ApplicationContext.getInstance().getComponentsRegistry().get("MyController")?.componentInstance;
        let actions: Map<String, Mandarine.MandarineMVC.Routing.RoutingAction> = controller.getActions();
        let action = actions.get(controller.getActionName("getRoute"));
        if(!action) throw new Error();
        let args = await DI.Factory.methodArgumentResolver(controller.getClassHandler(), action.actionMethodName, <any> {
            request: {
                url: new URL("http://localhost/api-get-5")
            }
        });
        if(!args) throw new Error();

        DenoAsserts.assertEquals(args[0], undefined);
        DenoAsserts.assert(args[1] instanceof ViewModel);
    }

    @Test({
        name: "Test @Parameters",
        description: "should get all the parameters (query, route) present in the request"
    })
    public async testHTTPParametersDecorator() {

        @mockDecorator()
        class MyController {
            
            @mockDecorator()
            public getRoute(invalidParam: any, myAllParameters: any) {
            }

        }

        MVCDecoratorsProxy.registerHttpAction("/api-get-test-parameters/:param1/:param2", MandarineMvc.HttpMethods.GET, MyController.prototype, "getRoute", <any><unknown>undefined);
        MVCDecoratorsProxy.registerRoutingParam(MyController.prototype, DI.InjectionTypes.PARAMETERS_PARAM, "getRoute", 1, undefined);
        MVCDecoratorsProxy.registerControllerComponent(MyController, undefined);
        ApplicationContext.getInstance().getComponentsRegistry().resolveDependencies();
        ApplicationContext.getInstance().getComponentsRegistry().initializeControllers();
        let controller: ControllerComponent = ApplicationContext.getInstance().getComponentsRegistry().get("MyController")?.componentInstance;
        let actions: Map<String, Mandarine.MandarineMVC.Routing.RoutingAction> = controller.getActions();
        let action = actions.get(controller.getActionName("getRoute"));

        if(!action) throw new Error();

        let args = await DI.Factory.methodArgumentResolver(controller.getClassHandler(), action.actionMethodName, <any> {
            request: {
                url: new URL("http://localhost/api-get-test-parameters/hello/world?favoriteMovie=Interstellar")
            },
            params: {
                param1: "hello",
                param2: "world"
            }
        });

        DenoAsserts.assertEquals((<any>args)[0], undefined);
        DenoAsserts.assertEquals((<any>args)[1], {
            query: {
                favoriteMovie: "Interstellar"
            },
            route: {
                param1: "hello",
                param2: "world"
            }
        });

    }

    @Test({
        name: "Set responsestatus by decorator",
        description: "Should set a responsestatus by decorator on the controller and method level"
    })
    public setResponseStatusByDecorator() {
        @mockDecorator()
        @mockDecorator()
        class MyController {
            
            @mockDecorator()
            @mockDecorator()
            public getRoute(invalidParam: any, myAllParameters: any) {
            }

        }

        MVCDecoratorsProxy.registerResponseStatusDecorator(MyController, 400, <any><unknown>undefined);
        MVCDecoratorsProxy.registerHttpAction("/response-status-decorator", MandarineMvc.HttpMethods.GET, MyController.prototype, "getRoute", <any><unknown>undefined);
        MVCDecoratorsProxy.registerRoutingParam(MyController.prototype, DI.InjectionTypes.PARAMETERS_PARAM, "getRoute", 1, undefined);
        MVCDecoratorsProxy.registerResponseStatusDecorator(MyController.prototype, 301, "getRoute");
        MVCDecoratorsProxy.registerControllerComponent(MyController, undefined);
        ApplicationContext.getInstance().getComponentsRegistry().resolveDependencies();
        ApplicationContext.getInstance().getComponentsRegistry().initializeControllers();
        let controller: ControllerComponent = ApplicationContext.getInstance().getComponentsRegistry().get("MyController")?.componentInstance;
        let actions: Map<String, Mandarine.MandarineMVC.Routing.RoutingAction> = controller.getActions();
        let action = actions.get(controller.getActionName("getRoute"));
        DenoAsserts.assertEquals(action?.routingOptions?.responseStatus, 301);
        DenoAsserts.assertEquals(controller.options.responseStatus, 400);
    }


}