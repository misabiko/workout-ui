<script lang='ts'>
	import type { PageData } from './$types';
	import Timer from './Timer.svelte';
	import {untrack} from 'svelte';

	let {data}: {
		data: PageData
	} = $props();

	// TODO Handle not-workout day
	const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${data.spreadsheetId}/edit#gid=0`;

	let timerComponent = $state<Timer>();

	// TODO Ignore storage if different day
	const storageRep = localStorage.getItem('WorkoutUI:currentRep');
	let previousRep = storageRep?.length ? parseInt(storageRep) : 0;
	let currentRep = $state(previousRep);
	let currentRepWrapped = $derived(currentRep % 3);
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
	const MAX_REP = 18;

	type ExerciceInfo = {
		progression: string
		name: string
		goalReps: number[]
		doneReps: number[]
		notes: string | null
	};

	let currentExerciseIndex = $derived(Math.floor(currentRep / 3));
	let currentExerciceRaw = $derived(data.currentDay[currentExerciseIndex]);
	let currentExerciceInfo = $derived<ExerciceInfo>({
		progression: currentExerciceRaw[0],
		name: currentExerciceRaw[1].replace(/^\d+ - /, ''),
		goalReps: parseReps(currentExerciceRaw[2]),
		doneReps: parseReps(currentExerciceRaw[3]),
		notes: currentExerciceRaw[4] ?? null,
	});

	function parseReps(reps: string): number[] {
		if (!reps?.length)
			return [];
		else// if (currentExerciseIndex <= 6)
			return reps.split('.').map(rep => {
				return parseInt(rep);
			});
	}

	const repProgressBarColors = [...Array(6).keys()].map(i => {
		return `hsl(${((i + 1) % 6) * 60}, 100%, 90%)`;
	});

	let noteIndex = $state(data.todayIndex);
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
	height: calc(100dvh - 2em);
}

#exercise-selector {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
}
#set-info {
	width: 100%;
	display: flex;
	justify-content: space-around;
}
#exercise-selector > button, #set-info > button {
	margin: 0 1.5em;
}

#previous-notes {
	display: flex;
	justify-content: space-around;
	align-items: flex-start;
	width: 100%;
}
#previous-notes > div {
	display: flex;
	flex-direction: column;
	align-items: center;
}
#previous-notes textarea {
	width: 60dvw;
	height: 4em;
}

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

.current-rep {
	font-size: 3.5em;
}

footer {
	display: flex;
	flex-direction: column;
	align-items: center;
}

#progress-bar {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: -100;
}

.progress-bar-overlay {
	position: absolute;
	background-color: #ccccff;
	bottom: 0;
	width: 100%;
	transition: height 0.5s;
}
</style>

<div id='date-selector'>
	<!--	<button onclick={() => date.setDate(date.getDate() - 1)}>{'<'}</button>-->
	{data.date}
	<!--	<button onclick={() => date.setDate(date.getDate() + 1)}>{'>'}</button>-->
</div>

<div id='exercise-selector'>
	<button onclick='{() => currentRep -= 3}' disabled='{currentExerciseIndex <= 0}'>{'<'}</button>
	<span>{currentExerciceInfo.name}</span>
	<button onclick='{() => currentRep = Math.min(MAX_REP, currentRep + 3)}' disabled='{currentExerciseIndex >= 6}'>{'>'}</button>
</div>

<div id='goal-reps'>
	{#each currentExerciceInfo.goalReps as goalRep, i}
		<div>
			<span class:current-rep='{i === currentRepWrapped}'>{goalRep}</span>
		</div>
	{/each}
</div>

<div id='set-info'>
	<button onclick='{() => currentRep--}' disabled='{currentRep === 0}'>-</button>
	<button onclick='{() => currentRep++}' disabled='{currentRep === MAX_REP}'>+</button>
</div>

<!--TODO Editable notes-->
<!--TODO Format note in markdown-->
<div id='previous-notes'>
	<button onclick='{() => noteIndex--}' disabled='{noteIndex === 0}'>-</button>
	<div>
		<span>{data.datesWithNotes[noteIndex].date}</span>
		<textarea readonly>{data.datesWithNotes[noteIndex].notes[currentExerciseIndex] ?? ''}</textarea>
	</div>
	<button onclick='{() => noteIndex++}' disabled='{noteIndex === data.todayIndex}'>+</button>
</div>

<Timer bind:this={timerComponent}/>

<footer>
	<a href={spreadsheetUrl}>Spreadsheet</a>
	<a href='http://www.startbodyweight.com/p/start-bodyweight-basic-routine.html'>Start Bodyweight basic routine</a>
</footer>

<div id='progress-bar'>
	{#each repProgressBarColors as color, i}
		<div class='progress-bar-overlay' style='background-color:{color}; height:{100 * (Math.max(i * 3, Math.min(currentRep, (i + 1) * 3)) - i * 3) / 3}dvh;'></div>
	{/each}
</div>