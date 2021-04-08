import { getContext } from 'svelte/internal'

export default function link (a) {
	let router = getContext('router')
	async function onClick (event) {
        event.preventDefault()
        router.push(a.getAttribute('href'))
	}
	a.addEventListener('click', onClick)
}

Object.defineProperty(link, 'href', {
	get(){
		let router = getContext('router')

		return router.currentRoute.path
	}
})