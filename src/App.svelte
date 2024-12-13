<script>
	import ChooseClasses from './ChooseClasses.svelte';
    import { InputGroup, InputGroupText, Input , Form, FormGroup, Col, Container, Row , Label, Button} from 'sveltestrap';
    import StepWizard from 'svelte-step-wizard';
    import Header from './components/Header.svelte';
import Placing from './Placing.svelte';

	let numberOfClasses;
  let numberTotForClasses;
  let selectedFile; 
 let file;
  let fileContent = null;

 
  function handleFileUpload(event) {
     const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        fileContent = reader.result; 
      };
      reader.readAsText(uploadedFile);  
    }
    
  }
  

  function saveData() {
    const formData = {
      numberOfClasses,
      numberTotForClasses,
      selectedFile: fileContent ? fileContent : null, 
    };
    localStorage.setItem('formData', JSON.stringify(formData));
  }


  if (localStorage.getItem("formData")) {
    const savedData = JSON.parse(localStorage.getItem("formData"));
    numberOfClasses = savedData.numberOfClasses || '';
    numberTotForClasses = savedData.numberTotForClasses || '';
    selectedFile = savedData.selectedFile || null;
  }

</script>

<StepWizard initialStep={2} >
    <StepWizard.Step num={1} let:nextStep >
    <Header/>

  <Form>

  <Container>
  <Row>
  <Col> 
   <p>Numero sezioni</p>
   <FormGroup floating label="Inserire numero delle sezioni">
    <Input   required bind:value={numberOfClasses}/>
  </FormGroup>

  </Col>
  <Col> 
  
    <p>Numero totale alunni per sezione</p>
   <FormGroup floating label="Inserire numero totale alunni per classe">
    <Input bind:value={numberTotForClasses}  required/>
  </FormGroup>
  </Col>
  
  </Row>
  
  </Container>
 <Container>
 
 <Row>
 <Col>
 <p>Carica il file cvs</p>
  <FormGroup >
     
              <Input type="file" id="csvFile" on:change={handleFileUpload} accept=".txt" />
                    {#if fileContent}
  <pre>{fileContent}</pre>  <!-- Visualizza il contenuto del file -->
{/if}
            </FormGroup>
 </Col>
 
 </Row>
 </Container>
           
  <Container>
        <Row>
       
       
          <Col class="d-flex justify-content-center">
            <button type="button" on:click={saveData}>Salva i dati</button>
          </Col>
          <Col class="d-flex justify-content-center">
            <button type="button" on:click={nextStep}>Next step --> </button>
          </Col>
        </Row>
      </Container>
  






</Form>
			
    </StepWizard.Step>

    <StepWizard.Step num={2} let:previousStep>
		<div>
		<Placing /> 
    	</div>
	    <button on:click={previousStep}>
            Go Back
        </button>
    </StepWizard.Step>
</StepWizard>

