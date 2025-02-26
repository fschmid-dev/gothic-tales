<script setup>
const props = defineProps({
  hero: {
    type: Object,
    required: true,
  },
})
/**
 * @typedef {import('@/models/Hero.js').Hero} Hero
 */
/**
 * @type Hero
 */
const hero = props.hero;
</script>

<template>

</template>
