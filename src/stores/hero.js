import { defineStore } from 'pinia'
/**
 * @typedef {import('@/models/Hero.js').Hero} Hero
 */

export const useHeroStore = defineStore('hero', {
  state: () => ({
    heroes: [],
  }),
  getters: {
    getHeroes(state) {
      return () => state.heroes
    },
    getHeroById(state) {
      return (id) => {
        const hero = state.heroes.find((hero) => hero.id === id)
        if (!hero) {
          return null
        }

        return hero
      }
    },
  },
  actions: {
    saveHero(heroToSave) {
      const index = this.heroes.findIndex((hero) => hero.id === heroToSave.id)
      if (index !== -1) {
        this.heroes[index] = heroToSave
      } else {
        this.heroes.push(heroToSave)
      }
    },
    deleteHero(heroToDelete) {
      const index = this.heroes.findIndex((hero) => hero.id === heroToDelete.id)
      if (index !== -1) {
        this.heroes.splice(index, 1)
      }
    },
  },
})
