	
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

		
        {#each items as item (item.id)}
        	{/each}
            		
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
				
			</div>
<div class="slot" on:dropped={(e) => putInShelf(e.detail, index)}>
								
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
							
							</div>
                            <Col>	<button on:click={reset}>Resetta</button></Col>
	<Col>	 <button  on:click={arrange}>Sistema in automatico</button></Col>
    	<Legenda scholars={cart}></Legenda>