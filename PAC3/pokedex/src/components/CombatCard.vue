<template>
  <div
    :class="[
      'combat-card-container',
      { flipped: isFlipped, selected: isSelected },
    ]"
    @click="handleCardClick"
  >
    <div class="flipper">
      <div class="card-back">?</div>

      <div class="card-front">
        <img :src="pokemon.image" :alt="pokemon.name" class="card-image" />
        <h4>{{ capitalize(pokemon.name) }}</h4>
        <p>⚡ Atac: {{ pokemon.attack }}</p>
        <p>🛡️ Defensa: {{ pokemon.defense }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  pokemon: {
    type: Object,
    required: true,
  },
  // Rep l'estat si la carta està seleccionada (per estil)
  isSelected: {
    type: Boolean,
    default: false,
  },
  // Rep l'estat si ha de mostrar la cara (per lògica de combat)
  isFlipped: {
    type: Boolean,
    default: false,
  },
  // Indica si el joc està en estat de bloqueig (esperant reset)
  isGameLocked: {
    type: Boolean,
    default: false,
  },
});

// Emissor per comunicar la selecció a la vista pare
const emit = defineEmits(["card-selected"]);

/**
 * Gestiona el clic a la carta. Només permet seleccionar si no està bloquejada o ja girada.
 */
const handleCardClick = () => {
  // Només permet el clic si no està girada i el joc no està bloquejat
  if (!props.isFlipped && !props.isGameLocked) {
    // Emet l'esdeveniment i passa el propi Pokemon
    emit("card-selected", props.pokemon);
  }
};

/**
 * Funció d'utilitat per capitalitzar el nom del Pokemon.
 */
const capitalize = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Observa 'isFlipped' si es vol afegir lògica addicional en el canvi d'estat
</script>

<style scoped>
/* Contenidor base per la carta (aplicació del tema) */
.combat-card-container {
  width: 150px;
  height: 200px;
  margin: 10px;
  perspective: 1000px; /* Necessari per l'efecte 3D */
  cursor: pointer;
  border-radius: 8px;
  transition: transform 0.3s, box-shadow 0.3s;
}

/* Estil quan la carta és seleccionada (indicador visual) */
.combat-card-container.selected {
  box-shadow: 0 0 15px 5px var(--link-background-color);
}

/* El flipper és l'element que gira */
.flipper {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

/* Estat girat: rotació de 180 graus */
.combat-card-container.flipped .flipper {
  transform: rotateY(180deg);
}

/* Estil base per les dues cares */
.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden; /* Oculta la cara posterior durant la rotació */
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
}

/* Cara Posterior (esquena de la carta) */
.card-back {
  background-color: var(
    --link-background-color
  ); /* Color de fons del darrere */
  color: white;
  font-size: 3em;
  font-weight: bold;
  border: 4px solid var(--text-color);
}

/* Cara Anterior (informació del Pokemon) */
.card-front {
  background-color: var(--card-background-color);
  color: var(--text-color);
  transform: rotateY(180deg); /* La cara davantera està rotada inicialment */
  border: 2px solid var(--card-border-color);
  text-align: center;
}

.card-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  background-color: var(--image-background-color);
  border-radius: 50%;
  margin-bottom: 5px;
}
</style>
