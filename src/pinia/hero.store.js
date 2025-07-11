import { defineStore } from "pinia";

export const useHeroStore = defineStore("hero", {
  state: () => ({
    heroes: [],
    loaded: false,
  }),
  persist: {
    key: "heroes",
    paths: ["heroes"],
  },
  getters: {
    getHeroes: (state) => state.heroes,
    getHeroById: (state) => (id) => {
      return state.heroes.find((hero) => hero.id === id);
    },
  },
  actions: {
    saveHero(heroToSave) {
      const index = this.heroes.findIndex((hero) => hero.id === heroToSave.id);
      if (index !== -1) {
        this.heroes[index] = heroToSave;
      } else {
        this.heroes.push(heroToSave);
      }
    },
    deleteHero(heroToDelete) {
      const index = this.heroes.findIndex(
        (hero) => hero.id === heroToDelete.id,
      );
      if (index !== -1) {
        this.heroes.splice(index, 1);
      }
    },
  },
});
