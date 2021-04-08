import { History } from './base'

export class AbstractHistory extends History {
    constructor (router, base) {
        super(router, base)
        this.stack = []
        this.index = -1
    }

    async push (location) {
        let route = await this.transitionTo(location)
        this.stack.push(route)
        this.index++
    }

    async replace (location) {
        let route = await this.transitionTo(location)
        this.stack = this.stack.slice(0, this.index).concat(route)
    }

    async go (n) {
        const targetIndex = this.index + n
        if (targetIndex < 0 || targetIndex >= this.stack.length) {
            return
        }
        const route = this.stack[targetIndex]
        await this.confirmTransition(route)
    }

    getCurrentLocation () {
        const current = this.stack[this.stack.length - 1]
        return current ? current.fullPath : '/'
    }

    ensureURL () {
        // noop
    }
}
