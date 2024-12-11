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
  for (let i = 0; i < students.length; i += students.length) {
    const cluster = students.slice(i, i + students.length);
    result.push({
      id: students.length,
      scholars: cluster
    });
  }
  return result;
}


let cart = createCartFromStudents(scholars);

// funzione per dividere gli studenti in base al colore
function sexColor(scholars) {
    console.log(scholars);

    // Colori HEX per maschi e femmine
    const femaleHex = "#E91E63"; // Rosa
    const maleHex = "#2196F3";   // Blu
    const mixedHex = "#9C27B0";  // Colore misto (per esempio, viola)

    // Conversione da HEX a RGB
    function hexToRgb(hex) {
        return [
            parseInt(hex.slice(1, 3), 16),
            parseInt(hex.slice(3, 5), 16),
            parseInt(hex.slice(5, 7), 16),
        ];
    }

    const femaleRgb = hexToRgb(femaleHex);
    const maleRgb = hexToRgb(maleHex);
    const mixedRgb = hexToRgb(mixedHex);

    // Generare il colore per ogni scholar
    const colors = scholars.map(scholar => {
        if (scholar.sesso === "M") {
            return maleHex;  // Blu per maschi
        }
        if (scholar.sesso === "F") {
            return femaleHex; // Rosa per femmine
        }
        return mixedHex;   // Colore misto per gender non specificato
    });

    console.log("Generated colors:", colors);
    return colors;
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



  onMount(() => {
   console.log("Cart", cart)
   console.log ("scholars", scholars)
   
	
  });

const sectionLetters = generateSections(numberOfClasses);
</script>

<div class="text-center py-3" >
  <h1 class="fw-semibold  ">Gestione delle classi</h1>
<p >Clicca il bottone del sistema automatico o trascina gli alunni nelle sezioni</p>
</div>


<div class="shelf">
	<Container>
		<Row>
			{#each shelf as items, index}
       
		<Col class="d-flex flex-column align-items-center">
		<h2>Sezione {sectionLetters[index]}</h2>
		<div class="slot rounded border border-1"></div>				
		<Legenda scholars={shelf[index]}></Legenda>								
				
		</Col>
					
		 {/each}		
			
			
		</Row>
	</Container>

    <div >
    {#each cart as item, index (item.id)}
    <div animate:flip>
      {#each item.scholars as scholar, i}
        <div
          class="ball"
          style="
            background-color: {sexColor(item.scholars)[i]};
            border: 3px solid {calculateBorder(scholar)};
          "
          use:draggable={{ data: item, targets: [".slot", ".slot .item"] }}
          in:receive={item.id}
          out:send={item.id}
        >
          <span>{scholar.votoUscita}</span>
        </div>
      {/each}
    </div>
  {/each}
    </div>
    <Legenda scholars={cart}></Legenda>
 

</div>
		
				
<Container>
	<Row style="padding: 20px; margin: 20px;">
	
	<Col>	 <button  >Scarica file</button></Col>

	</Row>
</Container>


<style>

	.cart {
		position: relative;
		background: #eee;
		box-shadow: 5px 5px 10px -10px black inset;
		min-height: 300px;
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
