<script setup>
const props = defineProps({
  hero: {
    type: Object,
    required: true,
  },
});
/**
 * @typedef {import('@/models/Hero.js').Hero} Hero
 */
/**
 * @type Hero
 */
const hero = props.hero;
</script>

<template>
  <div class="d-flex flex-column flex-md-row justify-content-between gap-3">
    <div class="list-group">
      <div class="list-group-item list-group-item-danger">Trefferpunkte</div>
      <div class="list-group-item">
        <input
          type="number"
          class="form-control"
          v-model="hero.currentHitPoints"
        />
      </div>
      <div class="list-group-item d-flex flex-row gap-2 align-items-center">
        <b>Max: {{ hero.maxHitPoints }}</b>
        <small>erholt: +10</small>
      </div>
    </div>
    <div class="list-group">
      <div class="list-group-item list-group-item-primary">Mana</div>
      <div class="list-group-item">
        <input
          type="number"
          class="form-control"
          v-model="hero.currentManaPoints"
        />
      </div>
      <div class="list-group-item d-flex flex-column">
        <b>Max: {{ hero.maxManaPoints }}</b>
      </div>
    </div>
  </div>
</template>
