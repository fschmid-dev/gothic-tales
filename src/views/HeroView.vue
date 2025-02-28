<script setup>
import { useRoute } from 'vue-router'
import { useHeroStore } from '@/stores/hero.js'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

import { deleteHeroModal } from '@/utils/deleteHeroModal.js'
import router from '@/router/index.js'
import HeroAttributes from '@/components/Hero/HeroAttributes.vue'
import HeroAbilities from '@/components/Hero/HeroAbilities.vue'
import HeroActions from '@/components/Hero/HeroActions.vue'

const route = useRoute()

const heroStore = useHeroStore()
const { getHeroById } = storeToRefs(heroStore)

const heroId = ref(route.params.heroId)
const hero = computed(() => {
  const hero = getHeroById.value(heroId.value)
  if (!hero) {
    return null
  }

  return Object.assign({}, hero)
})

function deleteHero() {
  deleteHeroModal(hero.value, () => {
    heroStore.deleteHero(hero.value)
    router.push({ name: 'heroes' })
  })
}

watch(
  () => route.params.heroId,
  (newHeroId) => {
    heroId.value = newHeroId
  },
)
</script>

<template>
  <div v-if="hero">
    <div class="d-flex flex-row justify-content-between align-items-center">
      <div class="d-flex align-items-center">
        <RouterLink :to="{ name: 'heroes' }" class="btn btn-link" title="">
          <i class="fas fa-fw fa-chevron-left"></i>
        </RouterLink>
        <h1>{{ hero.name }}</h1>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-danger" @click="deleteHero">
          <i class="fas fa-fw fa-trash-alt"></i>
        </button>
      </div>
    </div>
    <hr />
    <div class="hero">
      <div class="hero__attribute">
        <HeroAttributes :hero="hero" />
      </div>
      <div class="hero__stats">
        <h2>HeroStats</h2>
      </div>
      <div class="hero__info">
        <h2>HeroInfo</h2>
      </div>
      <div class="hero__abilities">
        <HeroAbilities :hero="hero" />
      </div>
      <div class="hero__actions">
        <HeroActions :hero="hero" />
      </div>
      <div class="hero__talents">
        <h2>HeroTalents</h2>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.hero {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, max-content);
  grid-auto-columns: 1fr;
  gap: 0.5rem;
  grid-auto-flow: row;
  grid-template-areas:
    'Attribute Stats Info'
    'Abilities Actions Actions'
    'Abilities Talents Talents';

  > * h2 {
    text-align: center;
  }

  &__attribute {
    grid-area: Attribute;
  }

  &__stats {
    grid-area: Stats;
  }

  &__info {
    grid-area: Info;
  }

  &__abilities {
    grid-area: Abilities;
  }

  &__actions {
    grid-area: Actions;
  }

  &__talents {
    grid-area: Talents;
  }
}
</style>
