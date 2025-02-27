<script setup>
import { useI18n } from 'vue-i18n'
import { attributeColors } from '@/utils/attributeColors.js'
import { computed } from 'vue'
import { calculateDiceAndBonus } from '@/utils/DiceCalculator.js'
import { createAttributeCheckToast } from '@/utils/Toast.js'

const props = defineProps({
  hero: {
    type: Object,
    required: true,
  }
})
const hero = props.hero
const { t } = useI18n()

const attributes = computed(() => {
  const attributes = {}

  for (const [key, value] of Object.entries(hero.attributes)) {
    const diceBonus = calculateDiceAndBonus(value)

    attributes[key] = {
      name: key,
      value: value,
      dice: diceBonus.dice,
      bonus: diceBonus.bonus,
      pool: diceBonus.pool,
      notation: diceBonus.notation,
    }
  }

  return attributes;
})

function rollAttribute(attribute) {
  createAttributeCheckToast(attribute)
}
</script>

<template>
  <h2>{{ t('hero.attributes') }}</h2>
  <div class="attributes">
    <div v-for="(attribute, key) in attributes" :key="`attribute_${key}`" class="attribute">
      <button
        class="btn d-flex flex-row w-100 gap-2 align-items-center justify-content-between cursor-pointer"
        @click.prevent="rollAttribute(attribute)"
      >
        <b :style="{ color: attributeColors[key] }">{{ t(`attribute.${key}`) }}</b>
        <span>
          <i class="fas fa-fw fa-dice text-primary"></i>
        </span>
      </button>
      <div class="input-group">
        <button class="btn btn-outline-primary"
                @click.prevent="hero.attributes[key] += 5"
        >
          +5
        </button>
        <input
          type="number"
          v-model="hero.attributes[key]"
          class="form-control form-control-sm"
        />
      </div>
      <span>{{ attribute.notation }}</span>
    </div>
  </div>
</template>

<style scoped>
.attributes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, max-content);
  grid-auto-flow: column;
  text-align: center;
  gap: 0.5rem;
}
</style>
