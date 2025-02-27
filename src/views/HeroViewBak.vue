<script setup>
import { useRoute } from 'vue-router'
import { useHeroStore } from '@/stores/hero.js'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

import HeroBakAttributes from '@/components/HeroBak/HeroBakAttributes.vue'
import HeroBakStats from '@/components/HeroBak/HeroBakStats.vue'
import HeroBakInfo from '@/components/HeroBak/HeroBakInfo.vue'
import HeroBakAbilities from '@/components/HeroBak/HeroBakAbilities.vue'
import HeroBakActions from '@/components/HeroBak/HeroBakActions.vue'
import HeroBakTalents from '@/components/HeroBak/HeroBakTalents.vue'
import { deleteHeroModal } from '@/utils/deleteHeroModal.js'
import router from '@/router/index.js'

const route = useRoute()

const heroStore = useHeroStore()
const { getHeroById } = storeToRefs(heroStore)

const heroId = ref(+route.params.heroId)
const hero = computed(() => {
  return getHeroById.value(heroId.value)
})

const editMode = ref(false);
const tmpHero = ref(null);

function startEditMode() {
  tmpHero.value = JSON.parse(JSON.stringify(hero.value));
  editMode.value = true;
}

function cancelEditMode() {
  console.warn('cancelEditMode');
  editMode.value = false;
}

function saveChanges() {

}

function deleteHero() {
  deleteHeroModal(hero.value, () => {
    heroStore.deleteHero(hero.value)
    router.push({ name: 'heroes' })
  })
}

watch(
  () => route.params.heroId,
  (newHeroId) => {
    heroId.value = +newHeroId
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
        <template v-if="editMode">
          <div class="btn-group">
            <button class="btn btn-success" @click="saveChanges">
              <i class="fas fa-fw fa-save"></i>
            </button>
            <button class="btn btn-danger" @click="cancelEditMode">
              <i class="fas fa-fw fa-cancel"></i>
            </button>
          </div>
        </template>
        <template v-if="!editMode">
          <button class="btn btn-primary" @click="startEditMode">
            <i class="fas fa-edit fa-fw"></i>
          </button>
          <button class="btn btn-danger" @click="deleteHero">
            <i class="fas fa-fw fa-trash-alt"></i>
          </button>
        </template>
      </div>
    </div>
    <hr>
    <div class="hero">
      <div class="hero__attribute">
        <HeroBakAttributes :hero="hero" :editMode="editMode" />
      </div>
      <div class="hero__stats">
        <HeroBakStats :hero="hero" :editMode="editMode" />
      </div>
      <div class="hero__info">
        <HeroBakInfo :hero="hero" :editMode="editMode" />
      </div>
      <div class="hero__abilities">
        <HeroBakAbilities :hero="hero" :editMode="editMode" />
      </div>
      <div class="hero__actions">
        <HeroBakActions :hero="hero" :editMode="editMode" />
      </div>
      <div class="hero__talents">
        <HeroBakTalents :hero="hero" :editMode="editMode" />
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
