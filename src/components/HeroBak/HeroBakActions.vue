<script setup>
import { useI18n } from 'vue-i18n'
import { attributeColors } from '@/utils/attributeColors.js'
import { calculateDiceAndBonus } from '../../utils/DiceCalculator.js'
import { computed } from 'vue'
import { createActionToast } from '@/utils/Toast.js'

const props = defineProps({
  hero: {
    type: Object,
    required: true,
  },
  editMode: {
    type: Boolean,
    default: false,
  }
})
/**
 * @typedef {import('@/models/Hero.js').Hero} Hero
 */
/**
 * @type Hero
 */
const hero = props.hero
const { t } = useI18n()

const actions = [
  {
    id: '1',
    name: 'Zweihänder',
    tags: ['long', 'garstig', 'heavy'],
    attribute: 'strength',
    damage: [
      {
        type: 'dice',
        sides: 6,
        count: 2,
      },
      {
        type: 'bonus',
        value: 2,
      },
    ],
    notation: '2W6+2',
  },
  {
    id: '2',
    name: 'Bogen',
    tags: ['reach (8/15)', 'light', 'piercing'],
    attribute: 'dexterity',
    damage: [
      {
        type: 'dice',
        sides: 8,
        count: 1,
      },
      {
        type: 'dice',
        sides: 6,
        count: 1,
      },
      {
        type: 'bonus',
        value: 2,
      },
    ],
    notation: 'W8+W6+W4+2',
  },
]

const attributeNotations = computed(() => {
  const attributeNotations = {}

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

    attributeNotations[key] = notation
  }

  return attributeNotations
})

function rollAction(action) {
  createActionToast(action)
}
</script>

<template>
  <h2>{{ t('Weapons & Actions') }}</h2>
  <div class="actions list-group">
    <div
      v-for="action in actions"
      :key="`weapon_${action.id}`"
      class="actions__action list-group-item list-group-item-action d-flex flex-row justify-content-between align-items-center"
      @click="rollAction(action)"
    >
      <div class="d-flex flex-column">
        <h3>{{ action.name }}</h3>
        <div>{{ action.tags.join(', ') }}</div>
        <div>
          <div class="d-flex flex-row align-items-center gap-2">
            <b :style="{ color: attributeColors[action.attribute] }">
              {{ t(`attribute.${action.attribute}Short`) }}
            </b>
            <span>{{ attributeNotations[action.attribute] }}</span>
          </div>
        </div>
        <div class="d-flex flex-row align-items-center gap-2">
          <b>Schaden</b>
          <span>{{ action.notation }}</span>
        </div>
      </div>
      <div>
        <i class="fas fa-fw fa-dice text-primary"></i>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.actions {
  &__action {
    cursor: pointer;
  }
}
</style>
