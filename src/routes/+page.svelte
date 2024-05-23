<script lang="ts">
	import type { PageData } from './$types';

	let {data}: {
		data: PageData
	} = $props();

	// TODO Handle not-workout day
	const values = data.values;
	const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${data.spreadsheetId}/edit#gid=0`;

	let currentRep = $state(0);
	let currentRepWrapped = $derived(currentRep % 3)
	let currentExercise = $state(0);
</script>

<style>
:global(body) {
	margin: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: .5em;
	padding: 1em;
}

footer {
	display: flex;
	flex-direction: column;
	position: absolute;
	bottom: 0;
	padding: 1em;
}

/*TODO body roboto font*/
/*TODO center body*/
/*#date-selector, #exercise-selector, #set-info {*/
/*	display: flex;*/
/*	justify-content: center;*/
/*	align-items: center;*/
/*	gap: 1rem;*/
/*}*/

#progress-bar {
	position: absolute;
	width: 100vw;
	background-color: #ccccff;
	bottom: 0;
	z-index: -100;
}
</style>

<div id='date-selector'>
<!--	<button onclick={() => date.setDate(date.getDate() - 1)}>{'<'}</button>-->
	{data.date}
<!--	<button onclick={() => date.setDate(date.getDate() + 1)}>{'>'}</button>-->
</div>

<!--TODO Make button position fixed (take max exercice text length)-->
<div id='exercise-selector'>
	<button onclick={() => currentRep -= 3} disabled={currentExercise <= 0}>{'<'}</button>
	{values[Math.floor(currentRep / 3)][1]}
	<button onclick={() => currentRep += 3} disabled={currentExercise >= 6}>{'>'}</button>
</div>

<!--TODO Persist rep on reload-->
<div id='set-info'>
	{values[Math.floor(currentRep / 3)][2]}
	<!--TODO Add current rep marker-->
	Rep: {currentRepWrapped + 1}
	<button onclick={() => currentRep--}>-</button>
	<button onclick={() => currentRep++}>+</button>
</div>

<!--TODO Add timer, with play pause stop-->
<!--TODO Use animate request to update timer?-->
<!--TODO Persist timer-->
<!--TODO End timer changes rep-->

<!--TODO Add note-->
<!--TODO Format note in markdown-->

<footer>
	<a href={spreadsheetUrl}>Spreadsheet</a>
	<a href='http://www.startbodyweight.com/p/start-bodyweight-basic-routine.html'>Start Bodyweight basic routine</a>
</footer>

<!--TODO Changes color on exercice-->
<!--TODO Animate height transition-->
<div id='progress-bar' style='height:{100 / 3 * currentRepWrapped}vh'></div>