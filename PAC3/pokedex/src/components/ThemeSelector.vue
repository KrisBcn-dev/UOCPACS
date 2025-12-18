<template>
  <div class="theme-selector">
    <label>Tema: </label>
    <label>
      <input
        type="radio"
        value="light"
        v-model="selectedTheme"
        @change="setTheme"
      />
      Clar
    </label>
    <label>
      <input
        type="radio"
        value="dark"
        v-model="selectedTheme"
        @change="setTheme"
      />
      Fosc
    </label>
    <label v-if="supportsSystemTheme">
      <input
        type="radio"
        value="system"
        v-model="selectedTheme"
        @change="setTheme"
      />
      Sistema
    </label>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// L'emissor d'esdeveniments comunicarà a App.vue el canvi de tema
const emit = defineEmits(["theme-changed"]);

// Dades
const selectedTheme = ref("light"); // Valor per defecte 
const supportsSystemTheme = ref(
  window.matchMedia("(prefers-color-scheme)").matches
);

// Mètodes
/**
 * Aplica el tema i el desa a Local Storage.
 */
const setTheme = () => {
  // Desem la preferència de l'usuari
  localStorage.setItem("user-theme", selectedTheme.value);
  // Emetem l'esdeveniment per a que App.vue apliqui la classe CSS
  emit("theme-changed", selectedTheme.value);
};

// Cicle de Vida
onMounted(() => {
  // 1. Intentem carregar la preferència desada (Local Storage) 
  const savedTheme = localStorage.getItem("user-theme");

  if (savedTheme) {
    selectedTheme.value = savedTheme;
  } else if (supportsSystemTheme.value) {
    // 2. Si no hi ha preferència, mirem si l'opció 'sistema' està activada
    selectedTheme.value = "light"; // Opcionalment 'system' si es vol per defecte. Deixem 'light' per complir l'enunciat 
  }

  // Apliquem el tema carregat/per defecte
  setTheme();
});

// Aquest component només envia el tema, l'aplicació real es fa a App.vue
</script>

<style scoped>
/* Estils del selector */
.theme-selector {
  padding: 10px;
  border-left: 1px solid #ccc;
  display: grid;
  min-width: 100px;
  font-size: 10px
}

label {
  margin-right: 10px;
}
</style>
