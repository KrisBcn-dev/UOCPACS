<template>
  <div class="pokemon-list-view">
    <h2>Llista de Pokemons</h2>

    <button 
        @click="loadPokemons(true)" 
        :disabled="loading"
        class="reload-button"
    >
        {{ loading ? 'Carregant...' : 'Recarregar llista aleatòria 🔄' }}
    </button>
    
    <div class="filter-container">
        <input 
            type="text" 
            v-model="filterText" 
            placeholder="Filtrar per nom (p.ex. cha)" 
            class="filter-input"
        />
        <p v-if="!filteredPokemons.length && !loading">
            No s'ha trobat cap Pokemon amb el nom "{{ filterText }}".
        </p>
    </div>

    <div class="card-container">
      <PokemonCard 
        v-for="pokemon in filteredPokemons" 
        :key="pokemon.id" 
        :pokemon="pokemon"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import PokemonCard from '../components/PokemonCard.vue';
// Importem la funció d'API modificada
import { fetchPokemons } from '../services/PokemonService'; 

// Dades
const pokemons = ref([]); 
const filterText = ref(''); 
const loading = ref(false); 

// Propietat computada (es manté igual)
const filteredPokemons = computed(() => {
    if (!filterText.value) {
        return pokemons.value; 
    }
    
    const filterLower = filterText.value.toLowerCase();
    
    return pokemons.value.filter(pokemon => 
        pokemon.name.toLowerCase().includes(filterLower)
    );
});

// Mètodes
/**
 * Crida al servei per obtenir els Pokemons.
 * @param {boolean} forceReload - Si és true, ignora la cache i carrega nous.
 */
const loadPokemons = async (forceReload = false) => {
    loading.value = true;
    // Crida a fetchPokemons, que decideix si usa cache o API
    pokemons.value = await fetchPokemons(forceReload); 
    loading.value = false;
};

// Cicle de Vida
onMounted(() => {
  // En muntar, no forcem la recàrrega (forceReload=false), així es recupera la cache
  loadPokemons(false); 
});
</script>

<style scoped>
/* ... (Estils anteriors) ... */

.pokemon-list-view {
    padding: 20px;
    text-align: center; /* Centrem el títol i el botó */
}

.card-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
}

.filter-container {
  display: block;
    margin: 30px 0; /* Espai entre el botó i el filtre */
    text-align: center;
}

.reload-button {
    padding: 10px 15px;
    font-size: 1em;
    cursor: pointer;
    background-color: var(--link-background-color);
    color: var(--link-text-color);
    border: none;
    border-radius: 5px;
    margin-bottom: 10px;
    transition: background-color 0.3s;
}

.reload-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.filter-input {
    padding: 10px;
    font-size: 1em;
    width: 300px;
    max-width: 80%;
    border: 1px solid var(--card-border-color);
    border-radius: 5px;
    background-color: var(--card-background-color);
    color: var(--text-color);
}


</style>