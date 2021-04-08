import { Path as PathRegex } from 'path-parser'
import { HTML5History } from './history/html5'
import { AbstractHistory } from './history/abstract'
import { parseURL } from './utils/parseURL'
import { inBrowser } from './utils/dom'

export class Path {
    constructor (url, component) {
        this.url = url
        this.middleware = []
        this.component = component
    }

    get regex () {
        return new PathRegex(this.url)
    }

    async doMiddleware() {
        // future for middleware
    }

    async getRoute(route) {
        if(typeof this.component === 'function') {
            let comp = await this.component(route)
            if(comp.default) return comp.default
            
            return comp
        } else {
            return this.component
        }
    }
}

export class Router {
    constructor({ routes }) {
        this.routes = routes
        this.listeners = []

        if (inBrowser) { // history api
            this.history = new HTML5History(this)
        } else {
            this.history = new AbstractHistory(this)
        }
    }

    addListener(listener){
        if(typeof listener !== 'function') throw new Error('Listener must be a function')
        this.listeners.push(listener)
    }

    get currentRoute() {
        return this.history && this.history.current
    }

    async match (url) {
        let { path, query, hash } = parseURL(url)
        let params
        let matched = this.routes.find(route => {
            params = route.regex.test(path)
            return !!params
        })

        if(!matched) throw new Error(`Could not match route: ${url}`)
        
        return {
            url,
            path,
            query,
            hash,
            matched,
            params
        }
    }

    async push(url) {
        await this.history.push(url)
    }

    async go(n) {
        await this.history.go(n)
    }

    async back () {
        await this.go(-1)
    }

    async forward () {
        await this.go(1)
    }

    async mount (App, target) {
        await this.history.transitionTo(this.history.getCurrentLocation())

        let app = new App({
            target,
            props: { router: this },
            hydrate: true
        })

        this.addListener(() => app.$set({router: this}))

        return app
    }
}

export function prefix(prefix, paths){
    return paths.map(path => {
        path.url = prefix + path.url
        return path
    })
}

export function middleware(fns, paths) {
    if(typeof fns === 'function') fns = [fns]
    return paths.map(path => {
        path.middleware.push(...fns)
        return path
    })
}
