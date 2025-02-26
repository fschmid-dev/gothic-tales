<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { calculateDiceAndBonus } from '@/utils/DiceCalculator.js'
import { attributeColors } from '@/utils/attributeColors.js'
import { createAbilityCheckToast } from '@/utils/Toast.js'

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

const abilityList = computed(() => {
  const abilityList = {}

  hero.abilities.forEach((ability) => {
    const attributeA = hero.attributes[ability.attributes[0]]
    const attributeB = hero.attributes[ability.attributes[1]]

    const abilityValue = Math.floor((attributeA + attributeB) / 2)
    const diceAndBonus = calculateDiceAndBonus(abilityValue)

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

    ability.value = abilityValue
    ability.dice = diceAndBonus.dice
    ability.bonus = diceAndBonus.bonus
    ability.pool = diceAndBonus.pool
    ability.notation = notation

    if (!abilityList[ability.category]) {
      abilityList[ability.category] = []
    }

    abilityList[ability.category].push(ability)
  })

  return abilityList
})

function rollAbility(ability) {
  createAbilityCheckToast(ability)
}
</script>

<template>
  <h2>{{ t('hero.abilities') }}</h2>
  <div
    v-for="(abilities, category) in abilityList"
    :key="`abilities_${category}`"
    class="abilities list-group mb-3"
  >
    <h3 class="abilities__category list-group-item list-group-item-primary">
      {{ t(`abilities.${category}`) }}
    </h3>
    <div
      v-for="(ability, index) in abilities"
      :key="`ability_${category}_${index}`"
      class="abilities__ability list-group-item list-group-item-action"
      @click.prevent="rollAbility(ability)"
    >
      <div class="d-flex flex-row align-items-center gap-2">
        <div class="d-flex flex-column flex-grow-1 justify-content-between gap-1">
          <div class="d-flex justify-content-between align-items-center">
            <b>{{ ability.name }}</b>
            <span>{{ ability.value }}</span>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <span>
              <b :style="{ color: attributeColors[ability.attributes[0]] }">
                {{ t(`attribute.${ability.attributes[0]}Short`) }}
              </b>
              &
              <b :style="{ color: attributeColors[ability.attributes[1]] }">
                {{ t(`attribute.${ability.attributes[1]}Short`) }}
              </b>
            </span>
            <span>{{ ability.notation }}</span>
          </div>
        </div>
        <div class="flex-grow-0">
          <i class="fas fa-fw fa-dice text-primary"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.abilities {
  &__ability {
    cursor: pointer;
  }
}
</style>
