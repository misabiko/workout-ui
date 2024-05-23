<script lang='ts'>
	import {untrack} from 'svelte';

	export const externalResetTimer = resetTimer;

	const storageStartTime = localStorage.getItem('WorkoutUI:startTime');
	const storageElapsedTime = storageStartTime?.length ? Date.now() - parseFloat(storageStartTime) : 0;

	const DURATION = 60;
	let elapsedTime = $state((storageElapsedTime > DURATION * 1000) ? 0 : storageElapsedTime);
	let elapsedSeconds = $derived(Math.floor(elapsedTime / 1000));

	let startTime = $state(storageStartTime?.length ? parseFloat(storageStartTime) : 0);

	let frame = $state<number | null>(null);
	const timerExpiredAudio = new Audio('/TimerExpired.mp3');

	function update() {
		frame = requestAnimationFrame(update);

		elapsedTime = Date.now() - startTime;

		if (elapsedSeconds >= DURATION) {
			timerExpiredAudio.currentTime = 0;
			timerExpiredAudio.play();
			alert('Timer over');
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
	}

	#seconds {
		font-size: 6em;
	}
</style>

<div id='timer'>
	<!--TODO Clamp at 0 and add separate "extra time" counter-->
	<span id='seconds'>{DURATION - elapsedSeconds}</span>
	<progress value='{elapsedSeconds / DURATION}'></progress>

	<button onclick='{() => startTimer()}' disabled='{frame !== null}'>Play</button>

	<button onclick='{() => resetTimer(true)}' disabled='{frame === null}'>Reset</button>
</div>

<svelte:window onclick='{() => timerExpiredAudio.pause()}'></svelte:window>