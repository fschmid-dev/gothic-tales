<script setup>
defineProps({
  hero: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(["update:name"]);

function updateHeroName($event) {
  const newName = $event.target.value;
  if (!newName.trim()) {
    return;
  }

  emits("update:name", newName.trim());
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
        :value="hero.name"
        @input="updateHeroName"
      />
      <label for="hero:name">{{ $t("hero.name.label") }}</label>
    </div>
  </div>
</template>
