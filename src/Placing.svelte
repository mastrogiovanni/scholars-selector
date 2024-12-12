<script>
	import Legenda from './Legenda.svelte';
	import { flip } from "svelte/animate";
	import { elasticOut, quintOut } from "svelte/easing";
	import { crossfade } from "svelte/transition";
	import { draggable } from "./dragdrop.js";
    import { Button, Col, Container, Row } from 'sveltestrap';
    import Scholar from './Scholar.svelte';
	 import { onMount } from 'svelte';
 
 const savedData = JSON.parse(localStorage.getItem("formData"));
    let numberOfClasses= savedData.numberOfClasses ;
	let numberTotForClasses=savedData.numberTotForClasses || '';;
	let  fileContent = savedData.selectedFile || null;
	// array di studenti dal file
	let students =[];
	// dichiarazione funzione di conversione di studenti dal file in array

  function parseFileContent() {
    if (fileContent !== null) {
        console.log("File content:", fileContent); 

        const lines = fileContent.split('\n'); 
        console.log("Lines:", lines); // Verifica le righe

       
        students = lines.slice(1)
            .map(line => line.trim()) 
            .filter(Boolean); 

        console.log("Students:", students); 
    } else {
        console.error("fileContent is empty or undefined.");
    }
}


parseFileContent();
// conversione di numero di sezioni in lettere dell'alfabeto
function convertNumberToExcelStyleLetter(number) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';

    while (number > 0) {
        const index = (number - 1) % 26;
        result = alphabet[index] + result;
        number = Math.floor((number - 1) / 26);
    }

    return result;
}
// generazione delle sezioni in base alla lettera dell'alfabeto
function generateSections(numberOfSections) {
    const sections = [];
    for (let i = 1; i <= numberOfSections; i++) {
        sections.push(convertNumberToExcelStyleLetter(i));
    }
    return sections;
}
// creazione di uno scaffale vuoto
  let shelf = Array.from(Array(parseInt(numberOfClasses)).keys()).map(x => []);

  // conversione dell'array di stringhe in un array di oggetti per lavorare meglio con gli elementi
  const scholars = students.map(row => {
	const [nome, cognome, sesso, dataNascita, sostegno, tipoSostegno, religione, votoUscita, stessaScuola] = row.split(",");
	return {
	 nome,
    cognome,
    sesso,
    dataNascita,
    sostegno: sostegno === "Sì",
    tipoSostegno: tipoSostegno || null,
    religione: religione === "Sì",
    votoUscita: parseInt(votoUscita, 10),
    stessaScuola: stessaScuola === "Sì"
	};
  });
// funzioni per la creazione del contenitore degli studenti
function createCartFromStudents(students) {
  let result = [];
  let studentId = 1; // Contatore per l'ID univoco dello studente

  students.forEach(student => {
    const cluster = {
      id: result.length + 1, // ID univoco per il gruppo
      scholars: [{ ...student, id: studentId++ }] // Un solo studente nel gruppo
    };
    result.push(cluster);
  });

  return result;
}

let cart = createCartFromStudents(scholars);

// funzione per dividere gli studenti in base al colore
function sexColor(scholar) {
    if (scholar.sesso === "M") {
        return "#2196F3";  // Blu per maschi
    }
    if (scholar.sesso === "F") {
        return "#E91E63"; // Rosa per femmine
    }
    return "#9C27B0";   // Colore misto per gender non specificato
}

// funzione per fare il bordo se ha bisogno di supporto o meno
function calculateBorder(scholar) {
    const supportHexColor = "#FF7043"; // Colore per supporto
    const sameSchoolHexColor = "#FFC107"; // Colore per stessa scuola

    if (scholar.sostegno) {
      return supportHexColor;
    } else if (scholar.stessaScuola) {
      return sameSchoolHexColor;
    } else {
      return "transparent"; // Nessun bordo
    }
  }


// console.log utili
  onMount(() => {
   console.log("Cart", cart)
   console.log ("scholars", scholars)
   console.log("shelf", shelf)
   
	
  });


function putInShelf(item, index) {
  // Rimuovi l'elemento da tutte le altre liste nello scaffale
  shelf.forEach((itemList) => {
    const foundIndex = itemList.indexOf(item);
    if (foundIndex !== -1) {
      itemList.splice(foundIndex, 1); // Rimuovi l'elemento se esiste
    }
  });

  // Aggiungi l'elemento alla lista corrispondente, se non è già presente
  if (shelf[index].indexOf(item) === -1) {
    shelf[index].push(item);
  }

  // Rimuovi l'elemento dal carrello, se presente
  const cartIndex = cart.indexOf(item);
  if (cartIndex !== -1) {
    cart.splice(cartIndex, 1);
  }
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



	function moveItem(item, target, targetIndex) {
    // Rimuovi l'elemento da tutte le sezioni dello scaffale
    shelf.forEach(section => {
        const index = section.indexOf(item);
        if (index !== -1) {
            section.splice(index, 1);
        }
    });

    // Rimuovi l'elemento dal carrello, se presente
    const cartIndex = cart.indexOf(item);
    if (cartIndex !== -1) {
        cart.splice(cartIndex, 1);
    }

    // Aggiungi l'elemento al target appropriato
    if (target === "shelf") {
        shelf[targetIndex].push(item);
    } else if (target === "cart") {
        cart.push(item);
    }
	 shelf = [...shelf];
    cart = [...cart];
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
        const element = cart.pop();
        shelf[index].push(element);
        index = (index + 1) % shelf.length;
    }
    shelf = [...shelf];
    cart = [...cart];
}


function reset() {
    cart = [];
    shelf.forEach(section => {
        cart = cart.concat(section);
        section.length = 0; // Svuota la sezione
    });
    shelf = [...shelf];
    cart = [...cart];
}


const sectionLetters = generateSections(numberOfClasses);
</script>

<div class="text-center py-3" >
  <h1 class="fw-semibold  ">Gestione delle classi</h1>
<p >Clicca il bottone del sistema automatico o trascina gli alunni nelle sezioni</p>
</div>

<Container>
	<Row>
		{#each shelf as items, index}
			<Col class="d-flex flex-column align-items-center my-2 shelf">
				<h2>Sezione {sectionLetters[index]}</h2>
			
				<div class="slot  rounded border border-1" on:dropped={(e) => moveItem(e.detail, "shelf", index)}>
					 {#each items as item, i}
					 {#each item.scholars as scholar, i}

       <div
    class="ball"
    style="
        background-color: {sexColor(scholar)};
        border: 3px solid {calculateBorder(scholar)};
    "
    use:draggable={{
        data: item, 
        targets: [".slot", ".cart"]
    }}
   
>
    <span>{scholar.votoUscita}</span>
</div>
      {/each}
      {/each}
				</div>
				<Legenda scholars={items} />
			</Col>
		{/each}
	</Row>
</Container>

    <div class="cart rounded border border-1 container"  on:dropped={(e) => moveItem(e.detail, "cart")} >
    {#each cart as item, index (item.id)}
    <div animate:flip>
      {#each item.scholars as scholar, i}
       <div
    class="ball"
    style="
        background-color: {sexColor(scholar)};
        border: 3px solid {calculateBorder(scholar)};
    "
    use:draggable={{
        data: item, 
        targets: [".slot", ".cart"]
    }}
   
>
    <span>{scholar.votoUscita}</span>
</div>
      {/each}
    </div>
  {/each}
    <Legenda scholars={cart}></Legenda>
    </div>
 

		
				
<Container>
	<Row style="padding: 20px; margin: 20px;">
	
	<Col>	 <button  >Scarica file</button></Col>
            <Col>	<button on:click={reset}>Resetta</button></Col>
	<Col>	 <button  on:click={arrange}>Sistema in automatico</button></Col>
	</Row>
</Container>


<style>

	.cart {
		position: relative;
		background: #eee;
		box-shadow: 5px 5px 10px -10px black inset;
		min-height: 300px;
	}
	
	:global(.dragged) {
		pointer-events: none;
		z-index: 100;
	}
	:global(.slot.droptarget, .cart.droptarget) {
		background: #ddd;
	}
</style>
