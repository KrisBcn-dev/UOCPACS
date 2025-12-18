<template>
  <div class="pokemon-detail-view">
    <div v-if="pokemon" class="detail-content">
      <h2>{{ capitalize(pokemon.name) }} (ID: {{ pokemon.id }})</h2>

      <img :src="pokemon.image" :alt="pokemon.name" class="detail-image" />

      <div class="stats-box">
        <p>⚡ Atac: {{ pokemon.attack }}</p>
        <p>🛡️ Defensa: {{ pokemon.defense }}</p>

        <p>🔥 Tipus: {{ pokemon.types }}</p>
      </div>
    </div>
    <div v-else-if="loading" class="loading-message">
      Carregant informació detallada... 🔍
    </div>
    <div v-else class="error-message">No s'ha pogut trobar el Pokemon.</div>

    <router-link to="/" class="back-link"> ← Tornar a la llista </router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { fetchPokemonDetail } from "../services/PokemonService";

// Hooks de Vue Router per obtenir el paràmetre de l'ID
const route = useRoute();

// Dades
const pokemon = ref(null);
const loading = ref(false);

// Mètodes
/**
 * Carrega les dades detallades del Pokemon utilitzant l'ID de la URL.
 */
const loadPokemonDetail = async () => {
  const pokemonId = route.params.id; // Obtenim l'ID des de la URL
  if (pokemonId) {
    loading.value = true;
    pokemon.value = await fetchPokemonDetail(pokemonId);
    loading.value = false;
  }
};

/**
 * Funció d'utilitat per capitalitzar el nom.
 */
const capitalize = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Cicle de Vida
onMounted(() => {
  loadPokemonDetail();
});
</script>

<style scoped>
.pokemon-detail-view {
  padding: 20px;
  text-align: center;
}

.detail-content {
  background-color: var(--card-background-color);
  color: var(--text-color);
  border: 1px solid var(--card-border-color);
  padding: 30px;
  margin: 20px auto;
  border-radius: 10px;
  max-width: 600px;
  box-shadow: 0 4px 8px var(--shadow-color);
}

.detail-image {
  width: 150px;
  height: 150px;
  object-fit: contain;
  margin-bottom: 20px;
  background-color: var(--image-background-color);
  border-radius: 50%;
  padding: 10px;
}

.stats-box {
  margin-top: 20px;
  padding: 15px;
  border: 1px dashed var(--text-color);
  border-radius: 5px;
}

.back-link {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 15px;
  background-color: var(--link-background-color);
  color: var(--link-text-color);
  text-decoration: none;
  border-radius: 5px;
}
</style>
