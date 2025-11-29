// Constants
const POKEAPI_BASE = "https://pokeapi.co/api/v2/pokemon/";
const POKEMON_COUNT = 10;
const MAX_POKEMON_ID = 1025; 
const STORAGE_KEY = 'pokedexInitialList'; 

// Variables globals
let allPokemonsData = []; 
let selectedCards = []; 
let isProcessingCombat = false; 

// --- Funcions de l'API i Dades ---

function getRandomId() {
    return Math.floor(Math.random() * MAX_POKEMON_ID) + 1;
}

/**
 * Consulta les dades d'un Pokémon per ID (extreu ID, nom, imatge, atac, defensa).
 */
async function fetchPokemonData(id) {
    try {
        const response = await fetch(`${POKEAPI_BASE}${id}/`);
        const data = await response.json();
        
        // Extracció de stats
        const attackStat = data.stats.find(stat => stat.stat.name === "attack");
        const defenseStat = data.stats.find(stat => stat.stat.name === "defense");

        return {
            id: data.id,
            name: data.name,
            image: data.sprites.front_default,
            attack: attackStat ? attackStat.base_stat : 0,
            defense: defenseStat ? defenseStat.base_stat : 0,
            abilities : data.abilities,
        };
    } catch (error) {
        console.error("Error obtenint dades del Pokémon ID", id, ":", error);
        return null;
    }
}

/**
 * Obté un array de 10 Pokémon aleatoris i el guarda a localStorage.
 */
async function fetchAndStoreRandomPokemons() {
    console.log("Consultant PokeAPI i guardant a localStorage...");
    const promises = [];
    const usedIds = new Set();
    
    while (usedIds.size < POKEMON_COUNT) {
        let randomId = getRandomId();
        if (!usedIds.has(randomId)) {
            usedIds.add(randomId);
            promises.push(fetchPokemonData(randomId));
        }
    }
    
    const pokemons = (await Promise.all(promises)).filter(p => p !== null);
    
    // Guarda el llistat a localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pokemons));
    console.log(pokemons);
    return pokemons;
}

// --- Funció de Maquetació ---

/**
 * Crea l'element HTML de la targeta d'un Pokémon.
 */
function createPokemonCard(pokemon, isCombatCard = false) {
    const card = document.createElement('div');
    card.classList.add('pokemon-card', 'card-container');
    
    // Utilitzem data-attributes per guardar les dades de combat/filtre
    card.dataset.id = pokemon.id;
    card.dataset.name = pokemon.name;
    card.dataset.attack = pokemon.attack;
    card.dataset.defense = pokemon.defense;

    card.innerHTML = `
        <div class="card-flipper ${isCombatCard ? 'flipped' : ''}">
            <div class="card-front">
                <p>#${pokemon.id} - ${pokemon.name.toUpperCase()}</p>
                <img src="${pokemon.image}" alt="${pokemon.name}">
                <p>Atac: <strong>${pokemon.attack}</strong></p>
                <p>Defensa: <strong>${pokemon.defense}</strong></p>                
                ${isCombatCard ? '' : '<a href="index.html?pokeID='+pokemon.id+'" class="detail-btn">Veure Detall</a>'}
            </div>
            <div class="card-back">
                <p>?</p>
            </div>
        </div>
    `;
    
    if (isCombatCard) {
        card.addEventListener('click', handleCombatCardClick);
    }

    return card;
}

// --- Lògica de la Pàgina Inicial (`index.html`) ---

function displayPokemonList(pokemons) {
    const listContainer = document.getElementById('pokemon-list');
    listContainer.innerHTML = '';
    
    pokemons.forEach(pokemon => {
        const card = createPokemonCard(pokemon);
        listContainer.appendChild(card);
    });
}

function displayDetailedPokemon(pokemon) {
    const detailContainer = document.getElementById('pokemon-detail');
    const listContainer = document.getElementById('pokemon-list');
    const filterSection = document.getElementById('filter-section');
    console.log(pokemon);
    // Oculta llista i filtre, mostra detall
    listContainer.classList.add('hidden');
    filterSection.classList.add('hidden');
    detailContainer.classList.remove('hidden');

    let dettext="";
    dettext = `
        <button id="back-btn">← Tornar al Llistat</button>
        <h2>Detall de ${pokemon.name.toUpperCase()} (#${pokemon.id})</h2>
        <div class="detailed-card">
            <img src="${pokemon.image}" alt="${pokemon.name}">
            <div class=""><p>Atac Base:</p><p><strong>${pokemon.attack}</strong></p></div>
            <div class=""><p>Defensa Base:</p><p><strong>${pokemon.defense}</strong></p></div>`;
    
            for(let a=0;a<pokemon.abilities.length;a++){
                if(!pokemon.abilities[a].is_hidden){
                    dettext += `<div><p>Habilitat:</p><p><strong>${pokemon.abilities[a].ability.name}</strong></p></div>`;
                    console.log(pokemon.abilities[a].ability.name);
                }
                
            }
    dettext +=`</div>`;

    detailContainer.innerHTML = dettext;

    document.getElementById('back-btn').addEventListener('click', () => {
        // Torna a mostrar llista i filtre, amaga detall
        listContainer.classList.remove('hidden');
        filterSection.classList.remove('hidden');
        detailContainer.classList.add('hidden');
        
        // Neteja el paràmetre pokeID de la URL sense recarregar
        history.pushState(null, '', 'index.html');
    });
}

function setupFilter() {
    const filterInput = document.getElementById('pokemon-filter');
    const listContainer = document.getElementById('pokemon-list');
    
    filterInput.addEventListener('input', (event) => {
        const filterText = event.target.value.toLowerCase();
        const cards = listContainer.querySelectorAll('.pokemon-card');
        cards.forEach(card => {
            const pokemonName = card.dataset.name.toLowerCase();
            if (pokemonName.includes(filterText)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}



async function initIndexPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const pokeID = urlParams.get('pokeID');
    const storedData = localStorage.getItem(STORAGE_KEY);

    if (storedData) {
        console.log("Carregant llista des de localStorage...");
        allPokemonsData = JSON.parse(storedData);
    } else {
        allPokemonsData = await fetchAndStoreRandomPokemons();
    }
    displayPokemonList(allPokemonsData);
    setupFilter();
    if (pokeID) {
        // 1. VISTA DETALLADA
        // Per si s'accedeix directament amb el paràmetre
        const pokemon = await fetchPokemonData(pokeID);
        if (pokemon) {
            displayDetailedPokemon(pokemon);
        }
    } 
    /* */
    document.getElementById('btn-rst-list').addEventListener('click', reloadPokemonsList);
}

async function reloadPokemonsList() {
    allPokemonsData = await fetchAndStoreRandomPokemons();
    displayPokemonList(allPokemonsData);
    setupFilter();
}


// --- Lògica de la Pàgina de Combat (`combat.html`) ---

/**
 * Lògica per gestionar el clic a una carta en mode combat.
 */
function handleCombatCardClick() {
    // Si estem processant combat o ja hi ha 2 seleccionades, ignora
    if (isProcessingCombat || selectedCards.length >= 2) return;
    const card = this;
    const flipper = card.querySelector('.card-flipper');
    // Si la carta ja ha estat seleccionada, no fem res (evitem doble selecció)
    if (card.classList.contains('selected-combat')) return;
    // Gira la carta, marca com a seleccionada i afegeix a la llista
    flipper.classList.remove('flipped');
    card.classList.add('selected-combat'); 
    selectedCards.push(card);
    // Si ja hi ha dues cartes seleccionades, inicia el combat
    if (selectedCards.length === 2) {
        isProcessingCombat = true;
        // posicionem la icona al centre de la secció de cartes i mostrem animació icona de combat
        let anicon = document.getElementById('icon-container');
        let ccardsSection = document.getElementById('combat-cards');
        anicon.style.left = (ccardsSection.offsetLeft+(ccardsSection.offsetWidth / 2)-(100))+"px";
        anicon.style.top = (((window.innerHeight/2) + window.scrollY)- 150) +"px";
        anicon.classList.remove("hidden");
        setTimeout(startCombat, 1500); 
    }
}

/**
 * Inicia la lògica del combat entre les dues cartes seleccionades.
 */
function startCombat() {
    // Segons l'enunciat: Card 1 (selectedCards[0]) Ataca, Card 2 (selectedCards[1]) Defensa
    const cardAttacker = selectedCards[0]; 
    const cardDefender = selectedCards[1];
    
    const msgContainer = document.getElementById('message');
    const restartBtn = document.getElementById('restart-combat-btn');

    // Dades
    const nameAttacker = cardAttacker.dataset.name.toUpperCase();
    const attackValue = parseInt(cardAttacker.dataset.attack);
    const nameDefender = cardDefender.dataset.name.toUpperCase();
    const defenseValue = parseInt(cardDefender.dataset.defense);

    let message = "";
    

    if (attackValue > defenseValue) {
        // Guanya l'atacant
        message = `🏆 ${nameAttacker} ataca (${attackValue}) i guanya a ${nameDefender} (${defenseValue})!`;
    } else {
        // Guanya el defensor (inclou empat)
        message = `⚔️ ${nameAttacker} ataca (${attackValue}) i perd contra ${nameDefender} (${defenseValue}).`;
    }
    // Amaguem l'animació de combat abans de mostrar el missatge
    document.getElementById('icon-container').classList.add("hidden");

    msgContainer.innerHTML = message;
    msgContainer.classList.add("rescombat");

    // Mostra el botó per reiniciar el combat
    restartBtn.classList.remove('hidden');

    // Mou la vista al top quan acaba el comat per a veure el missatge i el botó de reset
    window.scrollTo(0,0);
}

/**
 * Obté un array de 10 Pokémon aleatoris.
 * @returns {Promise<Array>} Array d'objectes Pokémon.
 */
async function fetchRandomPokemons() {
    const promises = [];
    const usedIds = new Set();
    
    while (usedIds.size < POKEMON_COUNT) {
        let randomId = getRandomId();
        // Assegurar que no es repeteixi ID
        if (!usedIds.has(randomId)) {
            usedIds.add(randomId);
            promises.push(fetchPokemonData(randomId));
        }
    }
    // Esperar que totes les consultes es resolguin
    return (await Promise.all(promises)).filter(p => p !== null);
}

/**
 * Inicialitza la pàgina de combat.
 */
function initCombatPage() {
    const cardContainer = document.getElementById('combat-cards');
    const restartBtn = document.getElementById('restart-combat-btn');

    async function loadCombatCards() {
        cardContainer.innerHTML = '';
        const pokemons = await fetchRandomPokemons(); // Nova llista aleatòria

        pokemons.forEach(pokemon => {
            cardContainer.appendChild(createPokemonCard(pokemon, true));
        });

        // Reinicia l'estat global del combat
        selectedCards = [];
        isProcessingCombat = false;
        
        // Neteja les marques de selecció de les targetes (necessari si no netegéssim el DOM)
        document.querySelectorAll('.pokemon-card').forEach(card => card.classList.remove('selected-combat'));
        
        // Restaura els missatges i amaga el botó de reinici
        document.getElementById('message').innerHTML = 'Selecciona la primera carta (Atacant) i després la segona (Defensora).';
        restartBtn.classList.add('hidden');
    }

    loadCombatCards();
    // Botó per tornar a l'estat inicial (càrrega de noves cartes i neteja)
    restartBtn.addEventListener('click', loadCombatCards);
}


// --- Inicialització (Execució al carregar el DOM) ---
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('combat.html')) {
        initCombatPage();
    } else {
        initIndexPage();
    }
});