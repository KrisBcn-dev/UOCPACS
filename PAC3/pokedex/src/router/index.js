import { createRouter, createWebHistory } from "vue-router";
import PokemonListView from "../views/PokemonListView.vue";
import PokemonDetailView from "../views/PokemonDetailView.vue";


const routes = [
  {
    path: "/",
    name: "PokemonList",
    component: PokemonListView,
    meta: { title: "Llista de Pokemons" },
  },
  {
    path: "/pokemon/:id", // Ruta amb paràmetre per carregar el detall
    name: "PokemonDetail",
    component: PokemonDetailView,
    meta: { title: "Detall de Pokemon" },
  },
  {
    path: "/combat", // Vista opcional 
    name: "Combat",
    // lazy-loaded, només es carrega si s'accedeix
    component: () => import("../views/CombatView.vue"),
    meta: { title: "Combat de Cartes" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
export default router
