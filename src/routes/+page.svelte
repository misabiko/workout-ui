<script lang='ts'>
	import type { PageData } from './$types';
	import Timer from "./Timer.svelte";

	// TODO Configure eslint

	let {data}: {
		data: PageData
	} = $props();

	// TODO Handle not-workout day
	const values = data.values;
	const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${data.spreadsheetId}/edit#gid=0`;

	// TODO Ignore storage if different day
	const storageRep = localStorage.getItem('WorkoutUI:currentRep');
	let currentRep = $state(storageRep?.length ? parseInt(storageRep) : 0);
	$effect(() => {
		localStorage.setItem('WorkoutUI:currentRep', currentRep.toString());
	});
	let currentRepWrapped = $derived(currentRep % 3);
	const MAX_REP = 18;

	let currentExerciseIndex = $state(0);

	type ExerciceInfo = {
		progression: string;
		//TODO Remove index from name
		name: string;
		//TODO Parse reps to number array
		goalReps: string;
		doneReps: string;
		notes: string | null;
	}

	let currentExerciceRaw = $derived(values[Math.floor(currentRep / 3)]);
	let currentExerciceInfo = $derived<ExerciceInfo>({
		progression: currentExerciceRaw[0],
		name: currentExerciceRaw[1],
		goalReps: currentExerciceRaw[2],
		doneReps: currentExerciceRaw[3],
		notes: currentExerciceRaw[4] ?? null,
	});
</script>

<style>
:global(body) {
	margin: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: .5em;
	padding: 1em;
	font-family: Roboto, sans-serif;
}

footer {
	display: flex;
	flex-direction: column;
	position: absolute;
	bottom: 0;
	padding: 1em;
}

#progress-bar {
	position: absolute;
	width: 100vw;
	background-color: #ccccff;
	bottom: 0;
	z-index: -100;
}
</style>

<Timer/>

<!--TODO Make button position fixed-->
<div id='exercise-selector'>
	<button onclick={() => currentRep -= 3} disabled={currentExerciseIndex <= 0}>{'<'}</button>
	{currentExerciceInfo.name}
	<button onclick={() => currentRep = Math.min(MAX_REP, currentRep + 3)} disabled={currentExerciseIndex >= 6}>{'>'}</button>
</div>

<!--TODO Persist rep on reload-->
<div id='set-info'>
	{currentExerciceInfo.goalReps}
	Rep: {currentRepWrapped + 1}
	<button onclick={() => currentRep--} disabled={currentRep === 0}>-</button>
	<button onclick={() => currentRep++} disabled={currentRep === MAX_REP}>+</button>
</div>

<!--TODO Editable notes-->
<!--TODO Format note in markdown-->
<textarea readonly>{currentExerciceInfo.notes}</textarea>
<!--<div id='previous-notes'>-->
<!--TODO Fetch data from previous days-->
<!--</div>-->

<div id='date-selector'>
	<!--	<button onclick={() => date.setDate(date.getDate() - 1)}>{'<'}</button>-->
	{data.date}
	<!--	<button onclick={() => date.setDate(date.getDate() + 1)}>{'>'}</button>-->
</div>

<footer>
	<a href={spreadsheetUrl}>Spreadsheet</a>
	<a href='http://www.startbodyweight.com/p/start-bodyweight-basic-routine.html'>Start Bodyweight basic routine</a>
</footer>

<!--TODO Changes color on exercice-->
<!--TODO Animate height transition-->
<div id='progress-bar' style='height:{100 / 3 * currentRepWrapped}vh'></div>