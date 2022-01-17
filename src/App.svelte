<script>
	import ChooseClasses from './ChooseClasses.svelte';
    import { InputGroup, InputGroupText, Input } from 'sveltestrap';
    import StepWizard from 'svelte-step-wizard'
import Placing from './Placing.svelte';

	let numberOfClasses = "5";
</script>

<StepWizard initialStep={3}>
    <StepWizard.Step num={1} let:nextStep>
		<h1>Scegli il numero di classi</h1>
        <p>
			<InputGroup>
				<InputGroupText>#</InputGroupText>
				<Input bind:value={numberOfClasses} />
			</InputGroup>
        </p>
        <button on:click={nextStep}>
            Next Step	>
        </button>
    </StepWizard.Step>
    <StepWizard.Step num={2} let:previousStep let:nextStep>
        <p>
            {numberOfClasses}
        </p>
		<p>
			Insert here the file
		</p>
        <button on:click={previousStep}>
            Go Back
        </button>
        <button on:click={nextStep}>
            Next Step	>
        </button>
    </StepWizard.Step>
    <StepWizard.Step num={3} let:previousStep>
		<div>
			<Placing {numberOfClasses} />
    	</div>
	    <button on:click={previousStep}>
            Go Back
        </button>
    </StepWizard.Step>
</StepWizard>