<script lang='ts'>
	import {untrack} from 'svelte';

	export const externalResetTimer = resetTimer;

	const storageStartTime = localStorage.getItem('WorkoutUI:startTime');
	const storageElapsedTime = storageStartTime?.length ? Date.now() - parseFloat(storageStartTime) : 0;

	const DURATION = 60;
	let elapsedTime = $state((storageElapsedTime > DURATION * 1000) ? 0 : storageElapsedTime);
	let elapsedRatio = $derived(elapsedTime / (DURATION * 1000));
	let elapsedSeconds = $derived(Math.floor(elapsedTime / 1000));

	let startTime = $state(storageStartTime?.length ? parseFloat(storageStartTime) : 0);

	let frame = $state<number | null>(null);
	const timerExpiredAudio = new Audio('/TimerExpired.mp3');

	function update() {
		frame = requestAnimationFrame(update);

		elapsedTime = Date.now() - startTime;

		if (elapsedRatio > 1) {
			timerExpiredAudio.currentTime = 0;
			timerExpiredAudio.play();
			//Alert messes up a few things by stopping the animation and stuff
			// alert('Timer over');
			resetTimer(false, true);
		}
	}

	$effect(() => {
		untrack(() => {
			if (storageStartTime?.length && !frame)
				update();
		});

		return () => resetTimer(false);
	});

	function startTimer() {
		startTime = Date.now();
		localStorage.setItem('WorkoutUI:startTime', startTime.toString());
		elapsedTime = 0;
		timerExpiredAudio.pause();
		update();
	}

	function resetTimer(resetElapsedTime: boolean, keepAudio = false) {
		cancelAnimationFrame(frame ?? 0);
		frame = null;
		if (!keepAudio)
			timerExpiredAudio.pause();
		if (resetElapsedTime) {
			elapsedTime = 0;
			localStorage.removeItem('WorkoutUI:startTime');
		}
	}
</script>

<style>
	#timer {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5em;
	}

	#progress-circle {
		position: relative;
		width: 8em;
		height: 8em;
		line-height: 8em;
		text-align: center;
	}
	#progress-circle > svg, #progress-circle > span {
		position: absolute;
		translate: -50%;
	}
	#progress-circle > svg {
		width: 100%;
		height: 100%;
	}
	#progress-circle span {
		font-size: 5em;
	}

	#progress-circle circle {
		stroke-width: 5px;
		fill: transparent;
	}
	#progress-circle-overlay {
		/*2PI * svg size * radius*/
		stroke-dasharray: calc(2 * PI * 8em * .45);
		stroke: blue;
		transform: rotate(90deg);
		transform-origin: 50% 50%;
	}
	#progress-circle-background {
		stroke: lightgray;
	}
</style>

<div id='timer'>
	<div id='progress-circle'>
		<svg>
			<circle id='progress-circle-background' cx='50%' cy='50%' r='45%'/>
			<circle id='progress-circle-overlay' cx='50%' cy='50%' r='45%' stroke-dashoffset='calc(2 * PI * 8em * .45 * {Math.max(0, 1 - elapsedRatio)})'/>
		</svg>
		<!--TODO Clamp at 0 and add separate "extra time" counter-->
		<span>{DURATION - elapsedSeconds}</span>
	</div>

	<button onclick='{() => startTimer()}' disabled='{frame !== null}'>Play</button>

	<button onclick='{() => resetTimer(true)}' disabled='{frame === null}'>Reset</button>
</div>

<svelte:window onclick='{() => timerExpiredAudio.pause()}'></svelte:window>