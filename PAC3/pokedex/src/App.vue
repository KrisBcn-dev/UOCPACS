<template>
  <div :class="appTheme" class="app-container">
    <header class="navbar">
      <nav>
        <router-link to="/">Llista de Pokemons</router-link>
        <router-link to="/combat">Combat</router-link>
      </nav>

      <ThemeSelector @theme-changed="updateTheme" />
    </header>

    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ThemeSelector from "./components/ThemeSelector.vue";

// Dades
const appTheme = ref("theme-light"); // Valor per defecte 

// Mètodes
/**
 * Funció cridada pel component ThemeSelector per canviar el tema de tota l'aplicació.
 * @param {string} themeName - 'light', 'dark' o 'system'.
 */
const updateTheme = (themeName) => {
  // Basem la classe CSS en el tema seleccionat.
  if (themeName === "dark") {
    appTheme.value = "theme-dark";
  } else if (themeName === "system") {
    // Si és 'system', comprovem la preferència del navegador
    const systemIsDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    appTheme.value = systemIsDark ? "theme-dark" : "theme-light"; 
  } else {
    appTheme.value = "theme-light";
  }
};

onMounted(() => {
  // Es crida a updateTheme des de ThemeSelector.vue via 'theme-changed'
  // al muntar, garantint que es carrega la preferència de Local Storage.
});
</script>

<style scoped>
/* Estils Globals i Variables CSS per al Tema  */
:root, .theme-light {
  /* Tema CLAR (Valors per defecte - s'apliquen si la classe és theme-light) */
  --background-color: #f8f8f8; 
  --text-color: #1c1c1c; 
  --text-color-active: #42b883; /* Verd Vue */
  --card-background-color: #ffffff;
  --card-border-color: #e0e0e0;
  --link-background-color: #42b883; /* Verd Vue */
  --link-text-color: #ffffff;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --image-background-color: #f0f0f0;
}

/* Tema FOSC  */
.theme-dark {
  --background-color: #121212;
  --text-color: #e0e0e0;
  --text-color-active: #298836;
  --card-background-color: #1e1e1e;
  --card-border-color: #333333;
  --link-background-color: #007bff; /* Un blau fosc */
  --link-text-color: #ffffff;
  --shadow-color: rgba(0, 0, 0, 0.4);
  --image-background-color: #2c2c2c;
}

/* Estils Aplicació Base */
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  transition: background-color 0.5s, color 0.5s; /* Transició suau */
}

/* Apliquem els colors globals definits per les variables CSS */
.app-container {
  min-height: 100vh;
  background-color: var(--background-color);
  color: var(--text-color);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: var(--card-background-color);
  border-bottom: 1px solid var(--card-border-color);
  box-shadow: 0 2px 4px var(--shadow-color);
}

.navbar nav a {
  margin-right: 15px;
  text-decoration: none;
  color: var(--text-color); /* Utilitzem el color de text del tema */
  padding: 5px 10px;
  transition: color 0.3s;
}

.navbar nav a:hover {
  color: var(--link-background-color);
}
</style>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  font-size: 12px;
  text-align: center;
  min-width: 70%;
}

nav a.router-link-exact-active {
  color: var(--text-color-active);
  border-bottom: 1px solid var(--text-color-active);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
  }
}
</style>