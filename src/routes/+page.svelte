<script lang="ts">
	import type { PageData } from './$types';
	import { Date } from 'svelte/reactivity';

	let {data}: {
		data: PageData
	} = $props();

	const values = data.values;
	$inspect(values);

	let date = $state(new Date());

	let currentExercise = $state(0);
</script>

<style>
#date-selector, #exercise-selector, #set-info {
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

<div id='exercise-selector'>
	<button onclick={() => currentExercise -= 1} disabled={currentExercise <= 0}>{'<'}</button>
	{values[currentExercise][1]}
	<button onclick={() => currentExercise += 1} disabled={currentExercise >= 6}>{'>'}</button>
</div>

<div id='set-info'>
	{values[currentExercise][2]}
	<!--TODO Add current rep marker-->
</div>

<!--TODO Add timer, with play pause stop-->

<!--TODO Add note-->
<!--TODO Format note in markdown-->