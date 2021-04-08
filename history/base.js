export class History {
    constructor (router) {
        this.router = router
        this.current = undefined
    }

    async transitionTo (location) {
        let route = await this.router.match(location)
        route.component = await route.matched.getRoute(route)
        route.data = route.component.preload ? await route.component.preload(route) : {}
        this.current = route
        this.router.listeners.forEach(listener => listener())
        return route
    }
}