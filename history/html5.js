import { History } from './base'
import { cleanPath } from '../utils/path'
import { setupScroll, handleScroll } from '../utils/scroll'
import { pushState, replaceState, supportsPushState } from '../utils/push-state'

export class HTML5History extends History {
    constructor (router) {
        super(router)

        const supportsScroll = supportsPushState

        if (supportsScroll) {
            setupScroll()
        }

        const initLocation = getWindowLocation()

        window.addEventListener('popstate', async e => {
            // console.log(this.current)
            // Avoiding first `popstate` event dispatched in some browsers but first
            // history route not updated since async guard at the same time.
            const location = getWindowLocation()
            // if (this.current === undefined && location === initLocation) {
            //     return
            // }
        
            let route = await this.transitionTo(location)
            if (supportsScroll) {
                handleScroll(router, route, true)
            }
        })
    }

    async go (n) {
        window.history.go(n)
    }

    async push (location) {
        let route = await this.transitionTo(location)
        pushState(cleanPath(route.url))
        handleScroll(this.router, route, false)
    }

    async replace (location) {
        let route = await this.transitionTo(location)
        replaceState(cleanPath(route.url))
        handleScroll(this.router, route, false)
    }

    ensureURL (push) {
        console.log(push, this.current.path)
        if (getWindowLocation() !== this.current.path) {
            const current = cleanPath(this.current.path)
            push ? pushState(current) : replaceState(current)
        }
    }

    getCurrentLocation () {
        return getWindowLocation()
    }
}

export function getWindowLocation () {
    let path = decodeURI(window.location.pathname)
    return (path || '/') + window.location.search + window.location.hash
}
