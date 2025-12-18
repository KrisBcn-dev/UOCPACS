// src/services/PokemonService.js

// Variable a nivell de mòdul per guardar la llista de Pokemons carregada (cache)
let cachedPokemons = []; 

/**
 * Funció per obtenir les dades d'atac, defensa i tipus d'un objecte Pokemon de l'API.
 * ... (extractPokemonData es manté igual) ...
 */
const extractPokemonData = (pokeData) => {
    const types = pokeData.types.map(t => t.type.name); 
    const attack = pokeData.stats.find(s => s.stat.name === 'attack')?.base_stat; 
    const defense = pokeData.stats.find(s => s.stat.name === 'defense')?.base_stat; 
    const image = pokeData.sprites.front_default; 
    
    return {
        id: pokeData.id,
        name: pokeData.name,
        attack: attack,
        defense: defense,
        types: types.join(' | '), 
        image: image
    };
};

/**
 * Funció interna per carregar Pokemons des de l'API.
 * @returns {Promise<Array>} Promesa que resol a un array d'objectes Pokemon.
 */
async function loadNewRandomPokemons() {
    const MAX_POKEMON_ID = 898; 
    const POKEMON_COUNT = 10; 
    const pokemons = [];

    const randomIds = new Set();
    while (randomIds.size < POKEMON_COUNT) {
        const randomId = Math.floor(Math.random() * MAX_POKEMON_ID) + 1;
        randomIds.add(randomId);
    }
    
    const promises = Array.from(randomIds).map(id => 
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json())
    );

    try {
        const results = await Promise.all(promises);
        results.forEach(pokeData => {
            if (pokeData) {
                pokemons.push(extractPokemonData(pokeData));
            }
        });

        // Actualitzem la cache abans de retornar
        cachedPokemons = pokemons;
        return pokemons;

    } catch (error) {
        console.error("Error durant la consulta de Pokemons:", error);
        return []; 
    }
}

/**
 * Obté la llista de Pokemons. Si ja hi ha dades en cache, les retorna.
 * Si no, les carrega de l'API.
 * @param {boolean} forceReload - Si és true, ignora la cache i carrega nous Pokemons.
 * @returns {Promise<Array>} 
 */
export async function fetchPokemons(forceReload = false) {
    if (!forceReload && cachedPokemons.length > 0) {
        console.log("Retornant Pokemons des de la cache.");
        return cachedPokemons;
    }
    
    console.log(forceReload ? "Forçant nova càrrega de Pokemons..." : "Cache buida. Carregant Pokemons...");
    return loadNewRandomPokemons();
}

/**
 * Obté la informació detallada d'un Pokemon pel seu ID o nom.
 * ... (fetchPokemonDetail es manté igual) ...
 */
export async function fetchPokemonDetail(identifier) {
    try {
        const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`);
        if (!resp.ok) {
            throw new Error(`Pokemon amb ID/nom ${identifier} no trobat.`);
        }
        const pokeData = await resp.json();
        return extractPokemonData(pokeData); 
    } catch (error) {
        console.error(`Error obtenint el detall del Pokemon ${identifier}:`, error);
        return null;
    }
}