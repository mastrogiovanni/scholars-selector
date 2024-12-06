<script>
	import Legenda from './Legenda.svelte';
	import { flip } from "svelte/animate";
	import { elasticOut, quintOut } from "svelte/easing";
	import { crossfade } from "svelte/transition";
	import { draggable } from "./dragdrop.js";
    import { Button, Col, Container, Row } from 'sveltestrap';
    import Scholar from './Scholar.svelte';
	 import { onMount } from 'svelte';

    export let numberOfClasses = "5";
  
  onMount(() => {
    console.log("Number of classes:", numberOfClasses);
  });

	let shelf = Array.from(Array(parseInt(numberOfClasses)).keys()).map(x => []);

	function randomScholar() {
		return {
			sex: Math.random() < 0.5 ? 'm' : 'f',
			vote: Math.floor(Math.random() * 10) + 1
		}
	}

	function randomCluster() {
		const size = Math.floor(Math.random() * 3) + 1
		let result = []	
		for (let i = 0; i < size; i ++) {
			result.push(randomScholar())
		}
		return result;
	}

	function randomCart(size) {
		let result = []
		for (let i = 0; i < size; i ++) {
			result.push({
				id: i,
				scholars: randomCluster()
			})
		}
		return result;
	}

	let cart = randomCart(100)

	function putInShelf(item, index) {
		shelf.forEach((itemList, i) => {
			if (i == index) {
				if (itemList.indexOf(item) < 0) {
					itemList.push(item)
				}
			}
			else {
				let found = itemList.indexOf(item)
				if (found >= 0) {
					itemList.splice(found, 1);
				}
			}
		})
		shelf = shelf
		if (cart.indexOf(item) !== -1) cart.splice(cart.indexOf(item), 1);
		cart = cart

		/*
		const oldItem = shelf[index];
		const oldShelfIndex = shelf.indexOf(item);
		if (cart.indexOf(item) !== -1) cart.splice(cart.indexOf(item), 1);
		if (oldShelfIndex !== -1) shelf[oldShelfIndex] = oldItem;
		else if (oldItem) cart.push(oldItem);
		shelf[index] = item;
		cart = cart;
		*/
	}

	function putInCart(item) {
		if (cart.indexOf(item) !== -1) cart.splice(cart.indexOf(item), 1);
		cart.push(item);
		cart = cart;
		for (let index = 0; index < shelf.length; index ++) {
			let container = shelf[index]
			shelf[index] = container.filter(e => {
				return e.id !== item.id
			})
		}
		shelf = shelf
	}

	const [send, receive] = crossfade({
		duration: (d) => 600,
		easing: elasticOut,
		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === "none" ? "" : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
			transform: ${transform} scale(${t});
			opacity: ${t}
		  `,
			};
		},
	});

	function arrange() {
		let index = 0;
		while (cart.length > 0) {
			let element = cart.pop();
			putInShelf(element, index)
			index = (index + 1) % shelf.length;
		}
	}

	function reset() {
		for (let item of shelf) {
			for (let scholar of item) {
				putInCart(scholar)
			}
		}
	}

	function sexColor(scholars) {
		console.log(scholars)
		const female = [ parseInt("ff", 16), parseInt("69", 16), parseInt("b4", 16) ]
		const male = [ parseInt("00", 16), parseInt("00", 16), parseInt("ff", 16) ]
		const count = scholars.filter(item => item.sex === "m").length;
		const delta = count / scholars.length;
		const rgb = [
			Math.floor((male[0] - female[0]) * delta + female[0]),
			Math.floor((male[1] - female[1]) * delta + female[1]),
			Math.floor((male[2] - female[2]) * delta + female[2]),
		]
		const result = "#" + rgb[0].toString(16) + rgb[1].toString(16) + rgb[2].toString(16)
		console.log(result)
		return result;
	}

</script>

<div class="container">
	<div class="row" style="padding: 20px; margin: 20px;">
		<Button color="primary" on:click={arrange}>Sistema in automatico</Button>
	</div>
</div>

<div class="shelf">
	<Container>
		<Row>
			<Col xs={9}>
				<Container>
					{#each shelf as items, index}
					<Row>
						<Col xs={3}>
							<Legenda scholars={shelf[index]}></Legenda>
						</Col>
						<Col xs={9}>
							<div class="slot" on:dropped={(e) => putInShelf(e.detail, index)}>
								{#each items as item (item.id)}
									<div
										class="item"
										style="font-size: 10px; background-color: {sexColor(item.scholars)};"
										use:draggable={{
											data: item,
											targets: [".cart", ".slot", ".slot .item"],
										}}
										in:receive={item.id}
										out:send={item.id}
										on:dropped={(e) => putInShelf(e.detail, index)}
									>
										<span>{item.scholars.length > 1 ? item.scholars.length : ''}</span>
									</div>
								{/each}
							</div>
						</Col>
					</Row>
					{/each}
				</Container>
			
			</Col>
			<Col xs={3}>
				<div class="cart" on:dropped={(e) => putInCart(e.detail)}>
					{#each cart as item, index (item.id)}
						<div
							class="item"
							style="font-size: 10px; background-color: {sexColor(item.scholars)};"
							animate:flip
							use:draggable={{ data: item, targets: [".slot", ".slot .item"] }}
							in:receive={item.id}
							out:send={item.id}
						>
							<span>{item.scholars.length > 1 ? item.scholars.length : ''}</span>
						</div>
					{/each}
				</div>
				<Legenda scholars={cart}></Legenda>
			</Col>
		</Row>
	</Container>
</div>

<div class="container">
	<div class="row" style="padding: 20px; margin: 20px;">
		<Button color="primary" on:click={reset}>Resetta</Button>
	</div>
</div>

<style>
	.slot {
		position: relative;
		display: inline-block;
		background: #eee;
		box-shadow: 5px 5px 10px -10px black inset;
		width: 300px;
		height: 300px;
		margin: 3px;
		vertical-align: top;
	}
	.cart {
		position: relative;
		background: #eee;
		box-shadow: 5px 5px 10px -10px black inset;
		min-height: 300px;
	}
	.item {
		width: 16px;
        height: 16px;
        border-radius: 50%;
		/* background: red;*/
		position: relative;
		display: inline-block;
		margin: 5px;
		/*
		box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
		*/
	}
	.slot .item {
		/* position: absolute; */
	}
	:global(.dragged) {
		pointer-events: none;
		z-index: 100;
	}
	:global(.slot.droptarget, .cart.droptarget) {
		background: #ddd;
	}
</style>
