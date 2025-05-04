<script lang="ts">
	let {
		value = $bindable(),
		label,
		min,
		max,
		step
	}: { value: number; label: string; min: number; max: number; step: number } = $props();
</script>

<label>
	<input type="number" autocomplete="off" bind:value {min} {max} {step} />
	<input type="range" autocomplete="off" {min} {max} {step} />
	{label}
</label>

<style>
	input[type='number'] {
		width: fit-content;
	}
	label {
		display: flex;
		flex-flow: row;
		align-items: center;
		gap: 1rem;
		width: 500px;
	}
</style>
