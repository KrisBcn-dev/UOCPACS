<template>
  <div class="pokemon-card">
    <img :src="pokemon.image" :alt="pokemon.name" class="card-image" />

    <h3>{{ capitalize(pokemon.name) }}</h3>
    <p>⚡ Atac: {{ pokemon.attack }}</p>
    <p>🛡️ Defensa: {{ pokemon.defense }}</p>

    <router-link
      :to="{ name: 'PokemonDetail', params: { id: pokemon.id } }"
      class="detail-link"
    >
      Veure Detall
    </router-link>
  </div>
</template>

<script setup>
// Definim les 'props' (paràmetres) que rep el component
// Rebrà un objecte 'pokemon' amb les dades bàsiques
const props = defineProps({
  pokemon: {
    type: Object,
    required: true,
    default: () => ({
      name: "desconegut",
      image: "",
      attack: 0,
      defense: 0,
      id: null,
    }),
  },
});

/**
 * Funció d'utilitat per capitalitzar el nom del Pokemon.
 */
const capitalize = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};
</script>

<style scoped>
/* Estils de la carta */
.pokemon-card {
  /* Els colors de fons i text seran injectats per App.vue (tema clar/fosc) */
  border: 1px solid var(--card-border-color);
  padding: 15px;
  margin: 10px;
  border-radius: 8px;
  width: 200px;
  text-align: center;
  box-shadow: 2px 2px 5px var(--shadow-color);
  transition: all 0.3s ease;
  background-color: var(--card-background-color);
  color: var(--text-color);
}

.card-image {
  width: 100px;
  height: 100px;
  object-fit: contain;
}

.detail-link {
  display: block;
  margin-top: 10px;
  padding: 8px;
  background-color: var(--link-background-color);
  color: var(--link-text-color);
  text-decoration: none;
  border-radius: 4px;
}
</style>
