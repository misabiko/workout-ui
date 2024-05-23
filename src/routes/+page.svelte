<script lang='ts'>
	import type { PageData } from './$types';
	import Timer from "./Timer.svelte";
	import {untrack} from "svelte";

	// TODO Configure eslint

	let {data}: {
		data: PageData
	} = $props();

	// TODO Handle not-workout day
	const values = data.values;
	const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${data.spreadsheetId}/edit#gid=0`;

	let timerComponent = $state<Timer>();

	// TODO Ignore storage if different day
	const storageRep = localStorage.getItem('WorkoutUI:currentRep');
	//Storing previousRep so that the $effect doesn't reset the timer on page load
	let previousRep = storageRep?.length ? parseInt(storageRep) : 0;
	let currentRep = $state(previousRep);
	$effect(() => {
		localStorage.setItem('WorkoutUI:currentRep', currentRep.toString());
		if (currentRep !== previousRep) {
			previousRep = currentRep;
			untrack(() => {
				if (timerComponent)
					timerComponent.externalResetTimer(true);
			});
		}
	});
	let currentRepWrapped = $derived(currentRep % 3);
	const MAX_REP = 18;

	type ExerciceInfo = {
		progression: string;
		name: string;
		goalReps: number[]
		doneReps: number[];
		notes: string | null;
	}

	let currentExerciseIndex = $derived(Math.floor(currentRep / 3));
	let currentExerciceRaw = $derived(values[currentExerciseIndex]);
	let currentExerciceInfo = $derived<ExerciceInfo>({
		progression: currentExerciceRaw[0],
		name: currentExerciceRaw[1].replace(/^\d+ - /, ''),
		goalReps: parseReps(currentExerciceRaw[2]),
		doneReps: parseReps(currentExerciceRaw[3]),
		notes: currentExerciceRaw[4] ?? null,
	});

	function parseReps(reps: string): number[] {
		if (currentExerciseIndex <= 6)
			return reps.split('.').map(rep => {
				return parseInt(rep);
			});
		else
			return [0];
	}
</script>

<style>
:global(body) {
	margin: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	padding: 1em;
	font-family: Roboto, sans-serif;
	/*height: max - padding*/
	height: calc(100vh - 2em);
}

#progress-bar {
	position: absolute;
	width: 100vw;
	background-color: #ccccff;
	bottom: 0;
	z-index: -100;
}

/*#exercise-selector {*/
/*	margin-bottom: 12vh;*/
/*}*/

#goal-reps {
	display: flex;
	justify-content: space-around;
	width: 100%;
	font-size: 1.5em
}

#goal-reps > div {
	position: relative;
	height: 3.5em;
	text-align: center;
}

#goal-reps > div > span {
	position: absolute;
	translate: -50%;
}

#current-rep {
	font-size: 3.5em;
}

footer {
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>

<div id='date-selector'>
	<!--	<button onclick={() => date.setDate(date.getDate() - 1)}>{'<'}</button>-->
	{data.date}
	<!--	<button onclick={() => date.setDate(date.getDate() + 1)}>{'>'}</button>-->
</div>

<!--TODO Make button position fixed-->
<div id='exercise-selector'>
	<button onclick={() => currentRep -= 3} disabled={currentExerciseIndex <= 0}>{'<'}</button>
	{currentExerciceInfo.name}
	<button onclick={() => currentRep = Math.min(MAX_REP, currentRep + 3)} disabled={currentExerciseIndex >= 6}>{'>'}</button>
</div>

<div id='goal-reps'>
	{#each currentExerciceInfo.goalReps as goalRep, i}
		<div>
			<span id={i === currentRepWrapped ? 'current-rep' : undefined}>{goalRep}</span>
		</div>
	{/each}
</div>

<div id='set-info'>
	<button onclick={() => currentRep--} disabled={currentRep === 0}>-</button>
	<button onclick={() => currentRep++} disabled={currentRep === MAX_REP}>+</button>
</div>

<!--TODO Editable notes-->
<!--TODO Format note in markdown-->
<textarea readonly>{currentExerciceInfo.notes}</textarea>
<!--<div id='previous-notes'>-->
<!--TODO Fetch data from previous days-->
<!--</div>-->

<Timer bind:this={timerComponent}/>

<footer>
	<a href={spreadsheetUrl}>Spreadsheet</a>
	<a href='http://www.startbodyweight.com/p/start-bodyweight-basic-routine.html'>Start Bodyweight basic routine</a>
</footer>

<!--TODO Changes color on exercice-->
<!--TODO Animate height transition-->
<div id='progress-bar' style='height:{100 / 3 * currentRepWrapped}vh'></div>