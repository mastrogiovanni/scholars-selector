<script>
    import { flip } from "svelte/animate";
	import { draggable } from "./dragdrop.js";

    export let voto = 7;
    export let sesso;
    export let item;

    // high = green
    function colors(min, max, value) {
        let delta = 255 / (max - min)
        let r = (value - min) * delta
        let g = (max - value) * delta
        return "rgb(" + Math.round(r) + "," + Math.round(g) + ",0)"
    }
</script>

<div class="item" in:receive={item.id} out:send={item.id} use:draggable={{ data: item, targets: [".slot", ".slot .item"] }} style="backgound-color: {colors(1, 10, voto)}; border-color: {sesso === 'm' ? 'black' : 'white'}">
</div>

<style>
    .item {
        width: 16px;
        height: 16px;
        border: 50%;
		background: red;
		position: relative;
		display: inline-block;
		margin: 4px;
		box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
    }
</style>