const table = [
    ['a', ['b', 'c', 'd'], 'm', 7],
]

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function randomSex() {
    return ['M', 'F'][getRandomInt(2)]
}

function randomPreferences(alumn, numAlumns, maxPreferences) {
    const hasPreferences = getRandomInt(2) > 0
    const numPrefs = hasPreferences ? getRandomInt(maxPreferences - 1) + 1 : 0
    const prefs = []
    while (prefs.length < numPrefs) {
        const selected = getRandomInt(numAlumns)
        if (selected !== alumn && !prefs.includes(selected)) {
            prefs.push(selected)
        }
    }
    return prefs
}

function randomAlumn(alumn, numAlumns, maxPreferences) {
    const prefs = randomPreferences(alumn, numAlumns, maxPreferences)
    const sex = randomSex()
    const vote = getRandomInt(3)
    return [alumn, prefs, sex, vote]
}

function randomGeneration(numAlumns, maxPreferences) {
    const results = []
    for (let i = 0; i < numAlumns; i++) {
        results.push(randomAlumn(i, numAlumns, maxPreferences))
    }
    return results
}

function pairs(alumns) {
    const result = new Set()
    for (let alumn of alumns) {
        for (let pref of alumn[1]) {
            result.add([alumn[0], pref])
        }
    }
    return Array.from(result)
}

function outgoing(element, pairs) {
    return pairs.filter(pair => pair[0] == element).map(pair => pair[1])
}

function outgoingClique(clique, pairs) {
    const result = new Set();
    for (let element of clique) {
        outgoing(element, pairs).forEach(x => result.add(x))
    }
    return Array.from(result).filter(x => !clique.includes(x))
}

function cliquePlusOne(cliques, pairs) {
    let present = {}
    let result = []
    for (let clique of cliques) {
        for (let neighbor of outgoingClique(clique, pairs)) {
            const twoHopNeighborood = outgoing(neighbor, pairs)
            if (!clique.every(x => twoHopNeighborood.includes(x))) {
                continue
            }
            if (!clique.every(x => outgoing(x, pairs).includes(neighbor))) {
                continue
            }
            const newClique = [...clique, neighbor]
            const key = newClique.sort().join(",")
            if (present[key]) {
                continue
            }
            present[key] = true
            result.push(newClique)
        }
    }
    return result;
}

/**
 * Return all cliques of the graph
 */
function computeCliques(singletons, pairs) {
    const result = {}
    result[1] = singletons
    let current = singletons
    let currentIndex = 1

    while (true) {
        const next = cliquePlusOne(current, pairs)
        if (next.length <= 0) {
            break;
        }
        result[currentIndex+1] = next
        currentIndex = currentIndex + 1
        current = next
    }
    return {
        result,
        size: currentIndex
    }
}

// Explode all the cliques of same size if them share at least an element 
function explodeCliques(singletons, pairs) {
    const { result, size } = computeCliques(singletons, pairs)
    /*
    console.log(size, result)
    for (let element of singletons) {
        const item = element[0]
        console.log("Item", item)
        let index = size;
        while (true) {
            console.log(result[index].filter(x => x.includes(item)))
            const howManyCliques = result[index].filter(x => x.includes(item)).length
            console.log("Is in", howManyCliques, "of size", index)
            if (howManyCliques > 1) {
                result[index] = result[index].filter(x => !x.includes(item))
                console.log("Reduced", index, result[index])
                index = index - 1
                if (index < 0) {
                    break
                }
            }
            else {
                break
            }
        }
    }
    */
    return { result, size }
}

/*
function algorithm(singletons, pairs) {
    const results = []
    while (true) {
        const { result, size } = computeCliques(singletons, pairs)
        console.log("Size", size)
        if (size > 1) {
            result[size-1].forEach(x => {
                console.log("Found", x)
                results.push(x)
                singletons = singletons.filter(ss => !x.includes(ss[0]))
            })
        }
        else {
            break
        }
    }
    singletons.forEach(x => results.add(x))
    return results
}
*/

const numScholars = 100

const alumns = randomGeneration(numScholars, 60)

for (let alumn of alumns) {
    console.log('- ' + alumn)
}

const pair = pairs(alumns)
const singletons = Array.from(Array(numScholars).keys()).map(x => [x])

/*
const couples = cliquePlusOne(singletons, pair) 
console.log("Clique 2", couples)

const s = new Set()
couples.forEach(c => c.forEach(d => s.add(d)))
console.log(s)
console.log("Remained", singletons.filter(x => x.every(y => !s.has(y))))
*/

console.log(JSON.stringify(explodeCliques(singletons, pair)))

/*
const triplet = cliquePlusOne(couples, pair) 
console.log("Clique 3", triplet)

const quartets = cliquePlusOne(triplet, pair) 
console.log("Clique 4", quartets)

const pentas = cliquePlusOne(quartets, pair) 
console.log("Clique 5", pentas)
*/