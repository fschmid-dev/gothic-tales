<script setup>
import { computed } from 'vue'
import { calculateDiceAndBonus } from '@/utils/DiceCalculator.js'
import { useI18n } from 'vue-i18n'
import { attributeColors } from '@/utils/attributeColors.js'
import { createAttributeCheckToast } from '@/utils/Toast.js'

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
const hero = props.hero
const { t } = useI18n()

const attributes = computed(() => {
  const attributes = {}

  for (const [key, value] of Object.entries(hero.attributes)) {
    const diceAndBonus = calculateDiceAndBonus(value)

    let notation = ''
    diceAndBonus.pool.forEach((item) => {
      if (notation.length > 0) {
        notation += '+'
      }
      switch (item.type) {
        case 'dice':
          notation += `${item.count > 1 ? item.count : ''}${t('diceShort')}${item.sides}`
          break
        case 'bonus':
          notation += item.bonus > 0 ? item.bonus : ''
          break
      }
    })

    attributes[key] = {
      name: key,
      value: value,
      dice: diceAndBonus.dice,
      bonus: diceAndBonus.bonus,
      pool: diceAndBonus.pool,
      notation: notation,
    }
  }

  return attributes
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
      <input
        type="number"
        v-model="attribute.value"
        class="form-control form-control-sm"
        disabled
        readonly
      />
      <span>{{ attribute.notation }}</span>
    </div>
  </div>
</template>

<style>
.attributes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, max-content);
  grid-auto-flow: column;
  text-align: center;
  gap: 0.5rem;
}
</style>
