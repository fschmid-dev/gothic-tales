<script setup>
import { useHeroStore } from "@/pinia/hero.store";

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
  <div>
    <div class="form-floating">
      <input
        type="text"
        class="form-control"
        id="hero:name"
        :placeholder="$t('hero.name.placeholder')"
        @input="updateHeroName"
      />
      <label for="hero:name">{{ $t("hero.name.label") }}</label>
    </div>
  </div>
</template>
