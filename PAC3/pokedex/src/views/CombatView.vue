<template>
  <div class="combat-view">
    <h2>Combat de Pokemons! 🥊 </h2>
    <p class="instruction">
        Selecciona dues cartes per començar un combat! (Atac vs. Defensa)
    </p>

    <div v-if="combatMessage" :class="['result-message', resultStatus]">
        {{ combatMessage }}
    </div>

    <button 
        @click="resetCombat" 
        :disabled="!isCombatFinished" 
        class="reset-button"
    >
        Nou Combat
    </button>
    
    <div v-if="loading" class="loading-message">
        Carregant 10 Pokemons aleatoris per al combat... 🎲
    </div>

    <div class="card-grid">
      <CombatCard 
        v-for="(pokemon) in pokemons" 
        :key="pokemon.id"
        :pokemon="pokemon"
        :is-selected="selectedCards.some(c => c.id === pokemon.id)"
        :is-flipped="flippedCardIds.includes(pokemon.id)"
        :is-game-locked="isCombatFinished"
        @card-selected="handleCardSelection"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CombatCard from '../components/CombatCard.vue';
import { fetchPokemons } from '../services/PokemonService';

// Dades de l'estat del joc
const pokemons = ref([]); // Llista dels 10 Pokemons
const selectedCards = ref([]); // Array per guardar les 2 cartes seleccionades
const flippedCardIds = ref([]); // Array d'IDs de les cartes que han de mostrar el front
const loading = ref(false);
const combatMessage = ref(''); // Missatge del resultat
const isCombatFinished = ref(false); // Bloqueja la selecció fins al reset
const resultStatus = ref(''); // 'win' o 'loss' per estils

// Mètodes
/**
 * Carrega els 10 Pokemons aleatoris al muntar la vista.
 */
const loadPokemons = async () => {
    loading.value = true;
    pokemons.value = await fetchPokemons();
    loading.value = false;
};

/**
 * Gestiona la selecció de cartes.
 * @param {Object} pokemon - El Pokemon de la carta seleccionada.
 */
const handleCardSelection = (pokemon) => {
    if (selectedCards.value.length < 2) {
        // Afegim el Pokemon a les seleccionades
        selectedCards.value.push(pokemon);
        // Girem la carta
        flippedCardIds.value.push(pokemon.id); 

        if (selectedCards.value.length === 2) {
            // Un cop tenim dues cartes, iniciem el combat
            isCombatFinished.value = true;
            setTimeout(executeCombat, 1500); // Donem temps a l'animació de girar
        }
    }
};

/**
 * Executa la lògica de combat un cop seleccionades les dues cartes.
 */
const executeCombat = () => {
    const card1 = selectedCards.value[0]; // Primera carta: Atacant 
    const card2 = selectedCards.value[1]; // Segona carta: Defensor 

    // Compara Atac de Card1 amb Defensa de Card2
    if (card1.attack > card2.defense) {
        // Guanya Card1 
        combatMessage.value = `${capitalize(card1.name)} ataca i guanya a ${capitalize(card2.name)}`;
        resultStatus.value = 'win';
    } else {
        // Guanya Card2 (atac és inferior o igual a defensa) 
        combatMessage.value = `${capitalize(card1.name)} ataca i perd contra ${capitalize(card2.name)}`; 
        resultStatus.value = 'loss';
    }

    // El botó de reset s'activa (isCombatFinished = true) i ens movem a dalt
    window.scrollTo(0,0);
};

/**
 * Reseteja l'estat de la vista per un nou combat.
 */
const resetCombat = async () => {
    // 1. Resetejar missatges i estat
    combatMessage.value = '';
    resultStatus.value = '';
    isCombatFinished.value = false;
    
    // 2. Resetejar selecció i cartes girades
    selectedCards.value = [];
    flippedCardIds.value = [];

    // 3. Carregar un nou lot de Pokemons (per garantir 10 noves cartes girades)
    await loadPokemons();
};

/**
 * Funció d'utilitat per capitalitzar el nom.
 */
const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Cicle de Vida
onMounted(() => {
    loadPokemons();
});
</script>

<style scoped>
.combat-view {
    padding: 20px;
    text-align: center;
}

.instruction {
    font-style: italic;
    margin-bottom: 20px;
    color: var(--text-color);
}

.card-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 30px;
    gap: 10px;
}

/* Missatge de resultat */
.result-message {
    padding: 15px;
    margin: 20px auto;
    border-radius: 8px;
    font-size: 1.2em;
    font-weight: bold;
    max-width: 80%;
}

.result-message.win {
    background-color: #4CAF50; /* Verd */
    color: white;
}

.result-message.loss {
    background-color: #f44336; /* Vermell */
    color: white;
}

.reset-button {
    padding: 10px 20px;
    font-size: 1em;
    margin-top: 10px;
    cursor: pointer;
    background-color: var(--link-background-color);
    color: var(--link-text-color);
    border: none;
    border-radius: 5px;
    transition: background-color 0.3s;
}

.reset-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>