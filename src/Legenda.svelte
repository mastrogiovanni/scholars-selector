<script>
    import { onMount } from 'svelte';

    import { ListGroup, ListGroupItem } from 'sveltestrap';

    export let scholars = []

    let maschi = 0;
    let femmine = 0;
    let avgVote = 0;
    let support = 0;
    let sameSchool = 0;


    $: {
        maschi = 0;
        femmine = 0;
        avgVote = 0;
        support = 0;
        sameSchool = 0;
        scholars.forEach(_item => {
            _item.scholars.forEach(item => {
                if (item.sesso === 'M') {
                    maschi ++
                }
                else {
                    femmine ++;                
                }
                avgVote += item.votoUscita
                if(item.sostegno){
                    support ++
                } else if (item.stessaScuola){
                    sameSchool ++
                }
            })
		})
        avgVote = avgVote / (maschi + femmine)
        if (maschi + femmine === 0) {
            avgVote = 0;
        }

    }
</script>

<ListGroup>
    <ListGroupItem >Maschi: {maschi == 0 ? 0 : (maschi / (maschi + femmine) * 100.0).toFixed(2)}%</ListGroupItem>
    <ListGroupItem>Femmine: {femmine == 0 ? 0 : (femmine / (maschi + femmine) * 100.0).toFixed(2)}%</ListGroupItem>
    <ListGroupItem > Media Voti: {avgVote.toFixed(2)}</ListGroupItem>
    <ListGroupItem >Studenti che hanno bisogno di sostegno: {support}</ListGroupItem>
    <ListGroupItem > Studenti che vengono dalla stessa scuola: {sameSchool}</ListGroupItem>
    <ListGroupItem >Alunni: {maschi + femmine}</ListGroupItem>
    <!--
    <ListGroupItem color="success">{JSON.stringify(scholars)}</ListGroupItem>
    -->
</ListGroup>

