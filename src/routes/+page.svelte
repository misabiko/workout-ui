<script lang="ts">
	import type { PageData } from './$types';
	import { Date } from 'svelte/reactivity';

	let {data}: {
		data: PageData
	} = $props();

	const values = data.values;

	let date = $state(new Date());
</script>

<style>
#date-selector {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 1rem;
}
</style>

<div id='date-selector'>
<!--	<button onclick={() => date.setDate(date.getDate() - 1)}>{'<'}</button>-->
	<p>{date.toDateString()}</p>
<!--	<button onclick={() => date.setDate(date.getDate() + 1)}>{'>'}</button>-->
</div>

{values}