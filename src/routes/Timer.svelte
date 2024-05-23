<script lang='ts'>
	import {untrack} from 'svelte';

	const storageStartTime = localStorage.getItem('WorkoutUI:startTime');

	let elapsedTime = $state(storageStartTime?.length ? Date.now() - parseFloat(storageStartTime) : 0);
	let elapsedSeconds = $derived(Math.floor(elapsedTime / 1000));
	const DURATION = 60;

	let startTime = $state(storageStartTime?.length ? parseFloat(storageStartTime) : 0);

	let frame = $state<number | null>(null);

	function update() {
		frame = requestAnimationFrame(update);

		elapsedTime = Date.now() - startTime;

		if (elapsedSeconds >= DURATION)
			resetTimer(false);
	}

	$effect(() => {
		untrack(() => {
			if (storageStartTime?.length && !frame)
				update();
		});

		return () => resetTimer(false);
	});

	function resetTimer(resetElapsedTime: boolean) {
		cancelAnimationFrame(frame ?? 0);
		frame = null;
		if (resetElapsedTime)
			elapsedTime = 0;
	}
</script>

<style>
	#seconds {
		font-size: 6em;
	}
</style>

<!--TODO End timer changes rep-->
<!--TODO Clamp at 0 and add separate "extra time" counter-->
<span id='seconds'>{DURATION - elapsedSeconds}</span>
<progress value={elapsedSeconds / DURATION}></progress>

<button onclick={() => {
	startTime = Date.now();
	localStorage.setItem('WorkoutUI:startTime', startTime.toString());
	elapsedTime = 0;
	update();
}} disabled={frame !== null}>Play</button>

<button onclick={() => resetTimer(true)} disabled={frame === null}>Reset</button>