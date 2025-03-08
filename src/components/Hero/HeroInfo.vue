<script setup>
import { useI18n } from 'vue-i18n'
import { toRaw, watch } from 'vue'
import { useHeroStore } from '@/stores/hero.js'
import { storeToRefs } from 'pinia'

const props = defineProps({
  hero: {
    type: Object,
    required: true
  }
})
const { t } = useI18n()

const heroStore = useHeroStore()

function updateHeroName($event) {
  const newName = $event.target.value.trim()
  if (!newName) {
    return
  }
  const heroToSave = JSON.parse(JSON.stringify(props.hero))
  heroToSave.name = newName
  saveHero(heroToSave)
}

function saveHero(heroToSave) {
  heroStore.saveHero(heroToSave)
}
</script>

<template>
  <div class="d-flex flex-column gap-2">
    <div class="d-flex flex-row">
      <input type="text" class="form-control"
             :value="hero.name" @change="updateHeroName"
      >
    </div>
  </div>
</template>
