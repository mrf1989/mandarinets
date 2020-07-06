export { Orange, Test } from "https://x.nest.land/Orange@0.2.4/mod.ts";
export * as DenoAsserts from "https://deno.land/std/testing/asserts.ts"; 

// Mocking a decorator will give us "design:paramtypes", otherwise it will fail
export function mockDecorator() {
    return (target: any, propertyName?: string) => {}
}