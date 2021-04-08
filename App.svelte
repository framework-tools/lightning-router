<svelte:component this={component} route={route} {...data}/>
<script>
import { getContext, setContext } from 'svelte'

export let router

setContext('router', router)

$: route = router.currentRoute
$: component = route.component
$: data = route.data

</script>