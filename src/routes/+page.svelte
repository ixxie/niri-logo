<script lang="ts">
	import { onMount } from 'svelte';


	// https://stackoverflow.com/a/53973230
	function setOrUpdateHashParameter(hashParameterName: string, hashParameterValue: string) {
		let theURL = new URL(window.location.origin);
		theURL.search = window.location.hash.substring(1);
		theURL.searchParams.set(hashParameterName, hashParameterValue);
		window.location.hash = theURL.searchParams.toString();
	}

	let circle = $state({
		count: 5,
		alpha: 0.5,
		lightness: 50,
		chroma: 90,
		radius: 250,
		padding: 210,
		reverse: false,
		blur: 0
	});
	// Object.preventExtensions(circle);

	let hue = $state({
		shift: 190,
		range: 180
	});
	// Object.preventExtensions(hue);

	let background = $state({
		alpha: 1,
		lightness: 0,
		chroma: 25,
		hue: 320,
		visible: true
	});
	// Object.preventExtensions(background);

	let backlight = $state({
		alpha: 1,
		lightness: 60,
		chroma: 0,
		hue: 0,
		visible: true
	});
	// Object.preventExtensions(backlight);

	let border = $state({
		show: false,
		thickness: 0
	});

	let circles = $derived(
		[...Array(circle.count).keys()].map((index) => ({
			index,
			hue: hue.shift + (index * hue.range) / (circle.count - 1),
			offset:
				500 - circle.padding + (index * (1000 - 2 * (500 - circle.padding))) / (circle.count - 1)
		}))
	);

	function shareUrlHash() {
		setOrUpdateHashParameter('circle', JSON.stringify(circle));
		setOrUpdateHashParameter('hue', JSON.stringify(hue));
		setOrUpdateHashParameter('background', JSON.stringify(background));
		setOrUpdateHashParameter('backlight', JSON.stringify(backlight));
		window.navigator.clipboard.writeText(window.location.href);
		console.log(window.location.hash);
	}
	function jsonparse(str: string) {
		return JSON.parse(str.replaceAll(/<|>|;/g, ''));
	}

	onMount(() => {
		let hash = window.location.hash.substr(1);

		let startHash = hash.split('&').reduce(function (res: Record<string, string>, item) {
			var parts = item.split('=');
			res[parts[0]] = decodeURIComponent(parts[1]);
			return res;
		}, {});

		console.log(startHash);

		circle = jsonparse(startHash.circle);

		hue = jsonparse(startHash.hue);
		background = jsonparse(startHash.background);
		backlight = jsonparse(startHash.backlight);

		circle.alpha = newCircle.alpha;

		console.log(hue);
	});

	$effect(() => {
		document
			.querySelector(':root')
			.style.setProperty('--background-hue', background.hue.toString());
	});
</script>

<h1
	style="margin-left: auto; margin-right: auto; text-align: center; font-size: x-large; color: lch(80 100 var(--background-hue))"
>
	niri color-a-tron
</h1>
<main>
	<div>
		<svg viewBox="0 0 1000 1000" version="1.1" id="svg1" xmlns="http://www.w3.org/2000/svg">
			{#if backlight.visible}
				<rect
					style="fill: lch({backlight.lightness}% {backlight.chroma} {backlight.hue} / {backlight.alpha})"
					x="0"
					y="0"
					width="1000"
					height="1000"
				/>
			{/if}
			{#each circles as { hue, offset }}
				<circle
					style="fill: lch({circle.lightness}% {circle.chroma} {hue} / {circle.alpha}); filter: blur({circle.blur}px);"
					cx={offset}
					cy="500"
					r={circle.radius}
				/>
			{/each}
			{#if background.visible}
				<path
					id="bg"
					style="fill: lch({background.lightness}% {background.chroma} {background.hue} / {background.alpha})"
					d="m -25.423439,-1403.1068 v 525.31889 H 499.8954 v -525.31889 z m 407.691389,160.6528 c 16.99897,0.1271 48.56887,20.4587 50.77365,48.5154 1.35903,17.2941 -12.69698,31.2151 -29.93616,31.2151 -15.42707,0 -29.93564,-12.7653 -29.93564,-31.2151 0,-18.1448 -9.00463,-43.7583 4.33927,-47.8922 1.39802,-0.4331 3.00037,-0.6363 4.75888,-0.6232 z m -194.39847,0.1907 c 16.99897,0.127 48.56887,20.4587 50.77365,48.5153 1.35903,17.2942 -12.69698,31.2152 -29.93616,31.2152 -15.42707,0 -29.93564,-12.7653 -29.93564,-31.2152 0,-18.1447 -9.00463,-43.7582 4.33927,-47.8921 1.39802,-0.4331 3.00037,-0.6363 4.75888,-0.6232 z m -120.688236,79.2189 c 9.72271,0 15.778294,4.4348 18.166334,13.3046 2.04689,-2.2175 5.287483,-4.2644 9.722403,-6.1407 4.6055,-2.0469 9.808319,-3.0706 15.607829,-3.0706 13.13419,0 23.88021,3.3263 32.23834,9.9787 8.35813,6.6524 14.41371,15.8633 18.16634,27.6329 3.9232,11.5991 5.79916,25.0743 5.62859,40.426 0,7.8464 -0.76753,15.0109 -2.3027,21.4927 -1.36459,6.3113 -3.83765,11.4284 -7.4197,15.3516 -3.41148,3.7526 -8.27289,5.6291 -14.58412,5.6291 -6.82296,0 -11.68437,-1.8765 -14.58413,-5.6291 -2.72919,-3.9232 -4.34948,-8.7847 -4.8612,-14.5842 -0.51172,-5.9701 -0.76791,-11.9399 -0.76791,-17.91 0,-9.0404 -1.2794,-16.2902 -3.83801,-21.7485 -2.5586,-5.629 -7.0786,-8.4434 -13.56041,-8.4434 -5.799508,0 -10.063825,2.8144 -12.793015,8.4434 -2.72918,5.4583 -4.093807,12.7081 -4.093807,21.7485 0,5.9701 -0.255665,11.8547 -0.767395,17.6542 -0.34115,5.7996 -1.876214,10.661 -4.605404,14.5842 -2.72918,3.7526 -7.676328,5.6286 -14.840438,5.6286 -5.28779,0 -9.722564,-1.9612 -13.304614,-5.8844 -3.41148,-3.9232 -6.055496,-9.0408 -7.931816,-15.3521 -1.87631,-6.3112 -3.240937,-13.1338 -4.093807,-20.4685 -0.6823,-7.3347 -1.023193,-14.4135 -1.023193,-21.2364 0,-6.823 0.340893,-13.8165 1.023193,-20.9806 0.68229,-7.1642 1.876471,-13.8168 3.582211,-19.9575 1.87631,-6.1406 4.520335,-11.0873 7.931815,-14.8399 3.41148,-3.7526 7.846244,-5.6286 13.304614,-5.6286 z m 210.318426,1.7906 c 4.60549,0 8.78459,1.1089 12.53722,3.3264 3.75263,2.0469 6.14046,5.2023 7.1639,9.4666 3.92321,-3.582 8.86983,-6.1403 14.83992,-7.6755 6.14067,-1.7057 12.45192,-2.5585 18.93373,-2.5585 5.45837,0 11.00209,1.3646 16.63103,4.0938 5.62894,2.5586 10.40512,6.1406 14.32832,10.7461 3.92321,4.6055 5.8844,9.8078 5.8844,15.6073 0,4.9467 -1.87597,9.6376 -5.6286,14.0726 -3.58206,4.4349 -8.69965,6.6523 -15.35203,6.6523 -2.89976,0 -5.2876,-0.3414 -7.16391,-1.0237 -1.87631,-0.8529 -3.66757,-1.6204 -5.37331,-2.3027 -1.70574,-0.6823 -3.75216,-1.0232 -6.1402,-1.0232 -6.31123,0 -12.11115,2.5582 -17.39894,7.6755 -5.11722,4.9466 -7.6755,11.6845 -7.6755,20.2132 0,4.4349 -0.17096,9.2963 -0.51211,14.5841 -0.17057,5.1172 -0.93811,10.0639 -2.3027,14.8399 -1.19401,4.7761 -3.4114,8.6995 -6.65231,11.7699 -3.24091,2.8997 -7.93134,4.3496 -14.07201,4.3496 -5.79951,0 -10.57569,-1.8765 -14.32832,-5.6291 -3.58205,-3.9232 -6.31131,-9.1255 -8.18762,-15.6074 -1.87631,-6.4818 -3.1557,-13.902 -3.838,-22.2601 -0.68229,-8.3581 -1.0232,-16.972 -1.0232,-25.8418 0,-5.9701 0.0852,-12.0257 0.2558,-18.1664 0.34115,-6.3112 1.19391,-12.1106 2.5585,-17.3984 1.53517,-5.2878 4.00822,-9.5521 7.4197,-12.793 3.58205,-3.4115 8.61443,-5.1175 15.09624,-5.1175 z m -68.05941,12.2814 c 6.82296,0 11.85481,1.9617 15.09572,5.8849 3.41148,3.7526 5.71461,9.7225 6.90862,17.91 1.19402,8.1876 1.79059,18.6779 1.79059,31.471 0.17057,12.793 -0.34077,23.2834 -1.53479,31.4709 -1.19401,8.017 -3.49714,13.9874 -6.90862,17.9106 -3.41148,3.9232 -8.52856,5.8849 -15.35152,5.8849 -6.82296,0 -11.94004,-1.9617 -15.35152,-5.8849 -3.24091,-3.9232 -5.45829,-9.8936 -6.65231,-17.9106 -1.02344,-8.1875 -1.62053,-18.6779 -1.7911,-31.4709 0,-12.7931 0.51186,-23.2834 1.5353,-31.471 1.19402,-8.1875 3.49663,-14.1574 6.90811,-17.91 3.41148,-3.9232 8.52856,-5.8849 15.35152,-5.8849 z m 193.43108,0 c 6.82296,0 11.85481,1.9617 15.09572,5.8849 3.41148,3.7526 5.71409,9.7225 6.90811,17.91 1.19402,8.1876 1.7911,18.6779 1.7911,31.471 0.17057,12.793 -0.34077,23.2834 -1.53479,31.4709 -1.19402,8.017 -3.49714,13.9874 -6.90862,17.9106 -3.41148,3.9232 -8.52856,5.8849 -15.35152,5.8849 -6.82296,0 -11.94003,-1.9617 -15.35151,-5.8849 -3.24091,-3.9232 -5.4583,-9.8936 -6.65231,-17.9106 -1.02345,-8.1875 -1.62054,-18.6779 -1.79111,-31.4709 0,-12.7931 0.51134,-23.2834 1.53479,-31.471 1.19401,-8.1875 3.49715,-14.1574 6.90863,-17.91 3.41148,-3.9232 8.52855,-5.8849 15.35151,-5.8849 z"
					transform="matrix(1.9036058,0,0,1.9036056,48.396206,2670.962)"
				/>
			{/if}
		</svg>
		<svg viewBox="0 0 1000 1000" version="1.1" id="svg1" xmlns="http://www.w3.org/2000/svg">
			{#if backlight.visible}
				<rect
					style="fill: lch({backlight.lightness}% {backlight.chroma} {backlight.hue} / {backlight.alpha})"
					x="0"
					y="0"
					width="1000"
					height="1000"
				/>
			{/if}
			{#each circles as { hue, offset }}
				<circle
					style="fill: lch({circle.lightness}% {circle.chroma} {hue} / {circle.alpha}); filter: blur({circle.blur}px);"
					cx={offset}
					cy="500"
					r={circle.radius}
				/>
			{/each}
			{#if background.visible}
				<path
					id="bg"
					style="fill: lch({100 -
						background.lightness}% {background.chroma} {background.hue} / {background.alpha})"
					d="m -25.423439,-1403.1068 v 525.31889 H 499.8954 v -525.31889 z m 407.691389,160.6528 c 16.99897,0.1271 48.56887,20.4587 50.77365,48.5154 1.35903,17.2941 -12.69698,31.2151 -29.93616,31.2151 -15.42707,0 -29.93564,-12.7653 -29.93564,-31.2151 0,-18.1448 -9.00463,-43.7583 4.33927,-47.8922 1.39802,-0.4331 3.00037,-0.6363 4.75888,-0.6232 z m -194.39847,0.1907 c 16.99897,0.127 48.56887,20.4587 50.77365,48.5153 1.35903,17.2942 -12.69698,31.2152 -29.93616,31.2152 -15.42707,0 -29.93564,-12.7653 -29.93564,-31.2152 0,-18.1447 -9.00463,-43.7582 4.33927,-47.8921 1.39802,-0.4331 3.00037,-0.6363 4.75888,-0.6232 z m -120.688236,79.2189 c 9.72271,0 15.778294,4.4348 18.166334,13.3046 2.04689,-2.2175 5.287483,-4.2644 9.722403,-6.1407 4.6055,-2.0469 9.808319,-3.0706 15.607829,-3.0706 13.13419,0 23.88021,3.3263 32.23834,9.9787 8.35813,6.6524 14.41371,15.8633 18.16634,27.6329 3.9232,11.5991 5.79916,25.0743 5.62859,40.426 0,7.8464 -0.76753,15.0109 -2.3027,21.4927 -1.36459,6.3113 -3.83765,11.4284 -7.4197,15.3516 -3.41148,3.7526 -8.27289,5.6291 -14.58412,5.6291 -6.82296,0 -11.68437,-1.8765 -14.58413,-5.6291 -2.72919,-3.9232 -4.34948,-8.7847 -4.8612,-14.5842 -0.51172,-5.9701 -0.76791,-11.9399 -0.76791,-17.91 0,-9.0404 -1.2794,-16.2902 -3.83801,-21.7485 -2.5586,-5.629 -7.0786,-8.4434 -13.56041,-8.4434 -5.799508,0 -10.063825,2.8144 -12.793015,8.4434 -2.72918,5.4583 -4.093807,12.7081 -4.093807,21.7485 0,5.9701 -0.255665,11.8547 -0.767395,17.6542 -0.34115,5.7996 -1.876214,10.661 -4.605404,14.5842 -2.72918,3.7526 -7.676328,5.6286 -14.840438,5.6286 -5.28779,0 -9.722564,-1.9612 -13.304614,-5.8844 -3.41148,-3.9232 -6.055496,-9.0408 -7.931816,-15.3521 -1.87631,-6.3112 -3.240937,-13.1338 -4.093807,-20.4685 -0.6823,-7.3347 -1.023193,-14.4135 -1.023193,-21.2364 0,-6.823 0.340893,-13.8165 1.023193,-20.9806 0.68229,-7.1642 1.876471,-13.8168 3.582211,-19.9575 1.87631,-6.1406 4.520335,-11.0873 7.931815,-14.8399 3.41148,-3.7526 7.846244,-5.6286 13.304614,-5.6286 z m 210.318426,1.7906 c 4.60549,0 8.78459,1.1089 12.53722,3.3264 3.75263,2.0469 6.14046,5.2023 7.1639,9.4666 3.92321,-3.582 8.86983,-6.1403 14.83992,-7.6755 6.14067,-1.7057 12.45192,-2.5585 18.93373,-2.5585 5.45837,0 11.00209,1.3646 16.63103,4.0938 5.62894,2.5586 10.40512,6.1406 14.32832,10.7461 3.92321,4.6055 5.8844,9.8078 5.8844,15.6073 0,4.9467 -1.87597,9.6376 -5.6286,14.0726 -3.58206,4.4349 -8.69965,6.6523 -15.35203,6.6523 -2.89976,0 -5.2876,-0.3414 -7.16391,-1.0237 -1.87631,-0.8529 -3.66757,-1.6204 -5.37331,-2.3027 -1.70574,-0.6823 -3.75216,-1.0232 -6.1402,-1.0232 -6.31123,0 -12.11115,2.5582 -17.39894,7.6755 -5.11722,4.9466 -7.6755,11.6845 -7.6755,20.2132 0,4.4349 -0.17096,9.2963 -0.51211,14.5841 -0.17057,5.1172 -0.93811,10.0639 -2.3027,14.8399 -1.19401,4.7761 -3.4114,8.6995 -6.65231,11.7699 -3.24091,2.8997 -7.93134,4.3496 -14.07201,4.3496 -5.79951,0 -10.57569,-1.8765 -14.32832,-5.6291 -3.58205,-3.9232 -6.31131,-9.1255 -8.18762,-15.6074 -1.87631,-6.4818 -3.1557,-13.902 -3.838,-22.2601 -0.68229,-8.3581 -1.0232,-16.972 -1.0232,-25.8418 0,-5.9701 0.0852,-12.0257 0.2558,-18.1664 0.34115,-6.3112 1.19391,-12.1106 2.5585,-17.3984 1.53517,-5.2878 4.00822,-9.5521 7.4197,-12.793 3.58205,-3.4115 8.61443,-5.1175 15.09624,-5.1175 z m -68.05941,12.2814 c 6.82296,0 11.85481,1.9617 15.09572,5.8849 3.41148,3.7526 5.71461,9.7225 6.90862,17.91 1.19402,8.1876 1.79059,18.6779 1.79059,31.471 0.17057,12.793 -0.34077,23.2834 -1.53479,31.4709 -1.19401,8.017 -3.49714,13.9874 -6.90862,17.9106 -3.41148,3.9232 -8.52856,5.8849 -15.35152,5.8849 -6.82296,0 -11.94004,-1.9617 -15.35152,-5.8849 -3.24091,-3.9232 -5.45829,-9.8936 -6.65231,-17.9106 -1.02344,-8.1875 -1.62053,-18.6779 -1.7911,-31.4709 0,-12.7931 0.51186,-23.2834 1.5353,-31.471 1.19402,-8.1875 3.49663,-14.1574 6.90811,-17.91 3.41148,-3.9232 8.52856,-5.8849 15.35152,-5.8849 z m 193.43108,0 c 6.82296,0 11.85481,1.9617 15.09572,5.8849 3.41148,3.7526 5.71409,9.7225 6.90811,17.91 1.19402,8.1876 1.7911,18.6779 1.7911,31.471 0.17057,12.793 -0.34077,23.2834 -1.53479,31.4709 -1.19402,8.017 -3.49714,13.9874 -6.90862,17.9106 -3.41148,3.9232 -8.52856,5.8849 -15.35152,5.8849 -6.82296,0 -11.94003,-1.9617 -15.35151,-5.8849 -3.24091,-3.9232 -5.4583,-9.8936 -6.65231,-17.9106 -1.02345,-8.1875 -1.62054,-18.6779 -1.79111,-31.4709 0,-12.7931 0.51134,-23.2834 1.53479,-31.471 1.19401,-8.1875 3.49715,-14.1574 6.90863,-17.91 3.41148,-3.9232 8.52855,-5.8849 15.35151,-5.8849 z"
					transform="matrix(1.9036058,0,0,1.9036056,48.396206,2670.962)"
				/>
			{/if}
		</svg>
	</div>
	<menu>
		<h1>colors</h1>
		<label>
			<input autocomplete="off" type="range" bind:value={hue.shift} min={0} max={360} />
			hue
			{hue.shift}
		</label>
		<label>
			<input autocomplete="off" type="range" bind:value={hue.range} min={0} max={360} />
			hue range
			{hue.range}
		</label>
		<h1>pattern</h1>
		<label>
			<input autocomplete="off" type="range" bind:value={circle.count} min={3} max={8} />
			steps
			{circle.count}
		</label>
		<label>
			<input
				autocomplete="off"
				type="range"
				bind:value={circle.alpha}
				min={0}
				max={1}
				step="0.01"
			/>
			opacity
			{circle.alpha}
		</label>
		<label>
			<input autocomplete="off" type="range" bind:value={circle.lightness} min={0} max={100} />
			lightness
			{circle.lightness}
		</label>
		<label>
			<input autocomplete="off" type="range" bind:value={circle.chroma} min={0} max={250} />
			saturation
			{circle.chroma}
		</label>
		<label>
			<input autocomplete="off" type="range" bind:value={circle.radius} min={0} max={500} />
			size
			{circle.radius}
		</label>
		<label>
			<input autocomplete="off" type="range" bind:value={circle.padding} min={0} max={500} />
			spread
			{circle.padding}
		</label>
		<label>
			<input autocomplete="off" type="range" bind:value={circle.blur} min={0} max={150} />
			blur
			{circle.blur}
		</label>
		<h1>background</h1>
		<label>
			<input autocomplete="off" type="checkbox" bind:checked={background.visible} />
			show
		</label>
		<label>
			<input
				autocomplete="off"
				type="range"
				bind:value={background.alpha}
				min={0}
				max={1}
				step="0.01"
			/>
			opacity
			{background.alpha}
		</label>
		<label>
			<input autocomplete="off" type="range" bind:value={background.lightness} min={0} max={100} />
			lightness
			{background.lightness}
		</label>
		<label>
			<input autocomplete="off" type="range" bind:value={background.chroma} min={0} max={250} />
			saturation
			{background.chroma}
		</label>
		<label>
			<input autocomplete="off" type="range" bind:value={background.hue} min={0} max={360} />
			hue
			{background.hue}
		</label>
		<h1>pattern lighting</h1>
		<label>
			<input autocomplete="off" type="checkbox" bind:checked={backlight.visible} />
			show
		</label>
		<label>
			<input
				autocomplete="off"
				type="range"
				bind:value={backlight.alpha}
				min={0}
				max={1}
				step="0.01"
			/>
			opacity
			{backlight.alpha}
		</label>
		<label>
			<input autocomplete="off" type="range" bind:value={backlight.lightness} min={0} max={100} />
			lightness
			{backlight.lightness}
		</label>
		<label>
			<input autocomplete="off" type="range" bind:value={backlight.chroma} min={0} max={250} />
			saturation
			{backlight.chroma}
		</label>
		<label>
			<input autocomplete="off" type="range" bind:value={backlight.hue} min={0} max={360} />
			hue
			{backlight.hue}
		</label>
		<h1>sharing</h1>
		<button
			onclick={() => {
				shareUrlHash();
			}}>copy url</button
		>
	</menu>
</main>

<style>
	svg,
	menu {
		width: 100%;
		display: flex;
		flex-flow: column;
		align-items: stretch;
	}

	div {
		display: flex;
		flex-flow: column;
		gap: 1rem;
		padding: 1rem;
		width: 100%;
	}

	label {
		display: flex;
		flex-flow: row;
		align-items: center;
		gap: 1rem;
	}

	main {
		display: flex;
		flex-flow: row nowrap;
		width: fit-content;
		margin: auto;
	}

	h1 {
		font-size: large;
	}

	@media (max-aspect-ratio: 1 / 1) {
		main {
			flex-flow: column;
		}
	}

	:global(body) {
		background: lch(10 10 var(--background-hue));
		color: lch(100 40 var(--background-hue));
		accent-color: lch(60 40 var(--background-hue));
		transition:
			color 1s,
			background 1s;
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			Oxygen,
			Ubuntu,
			Inter,
			Cantarell,
			'Open Sans',
			'Helvetica Neue',
			sans-serif;
	}

	:global(html) {
		--background-hue: 0;
	}

	button {
		background: lch(25 10 var(--background-hue));
		color: #fff;
		border: none;
		padding: 10px;
		font-size: medium;
		transition: all 0.05s;
		border-radius: 5px;

		&:hover {
			background: lch(30 10 var(--background-hue));
		}
		&:active {
			transform: scale(0.96);
		}
	}
</style>
