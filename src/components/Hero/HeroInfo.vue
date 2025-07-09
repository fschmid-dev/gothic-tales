<script setup>
import {useHeroStore} from '@/pinia/hero.store';

const props = defineProps({
  hero: {
    type: Object,
    required: true,
  },
});

const heroStore = useHeroStore();

function updateHeroName($event) {
  const newName = $event.target.value.trim();
  if (!newName) {
    return;
  }
  const heroToSave = JSON.parse(JSON.stringify(props.hero));
  heroToSave.name = newName;
  saveHero(heroToSave);
}

function saveHero(heroToSave) {
  heroStore.saveHero(heroToSave);
}
</script>

<template>
  <div class="d-flex flex-column gap-2">
    <div class="d-flex flex-row">
      <input type="text" class="form-control" @input="updateHeroName"/>
    </div>
  </div>
</template>
