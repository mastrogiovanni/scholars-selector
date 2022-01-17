<script>
    import { onMount } from 'svelte';

    import { ListGroup, ListGroupItem } from 'sveltestrap';

    export let scholars = []

    let maschi = 0;
    let femmine = 0;
    let avgVote = 0;

    $: {
        maschi = 0;
        femmine = 0;
        avgVote = 0;
        scholars.forEach(_item => {
            _item.scholars.forEach(item => {
                if (item.sex === 'm') {
                    maschi ++
                }
                else {
                    femmine ++;                
                }
                avgVote += item.vote
            })
		})
        avgVote = avgVote / (maschi + femmine)
        if (maschi + femmine === 0) {
            avgVote = 0;
        }
    }
</script>

<ListGroup>
    <ListGroupItem color="primary">Maschi: {maschi == 0 ? 0 : (maschi / (maschi + femmine) * 100.0).toFixed(2)}%</ListGroupItem>
    <ListGroupItem color="primary">Femmine: {femmine == 0 ? 0 : (femmine / (maschi + femmine) * 100.0).toFixed(2)}%</ListGroupItem>
    <ListGroupItem color="secondary">Voto: {avgVote.toFixed(2)}</ListGroupItem>
    <ListGroupItem color="success">Alunni: {maschi + femmine}</ListGroupItem>
    <!--
    <ListGroupItem color="success">{JSON.stringify(scholars)}</ListGroupItem>
    -->
</ListGroup>

