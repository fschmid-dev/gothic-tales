<script setup>
import { useI18n } from 'vue-i18n'
import { attributeColors } from '@/utils/attributeColors.js'
import { computed, ref } from 'vue'
import { calculateDiceAndBonus } from '@/utils/DiceCalculator.js'
import { createActionToast } from '@/utils/Toast.js'
import Swal from 'sweetalert2'
import { heroAttributes } from '@/utils/HeroFactory.js'

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

const actions = ref([
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
])

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

function newAction() {
  const shortDice = t('diceShort')

  const action = {
    id: `action_${Math.random().toString(36).substring(2, 15)}`,
    name: 'Volles Pfund aufs Maul',
    tags: [],
    attribute: 'strength',
    damage: [],
    notation: `1${shortDice}4`,
  }

  openActionModal(action)
}

function isDamageNotationValid(notation) {
  const shortDice = t('diceShort')
  const regex = new RegExp(
    `^([+-]?\\d*${shortDice}\\d+|[+-]?\\d+)([+-]?\\d*${shortDice}\\d+|[+-]?\\d+)*$`,
    'i',
  )
  return regex.test(notation)
}

function parseDamageNotation(notation) {
  const shortDice = t('diceShort')
  const regex = new RegExp(`([+-]?\\d*${shortDice}\\d+|[+-]?\\d+)`, 'gi')
  const parts = notation.match(regex)

  const pool = parts.map((part) => {
    const diceRegex = new RegExp(`(\\d*)${shortDice}(\\d+)`, 'i')
    const diceMatch = part.match(diceRegex)

    if (diceMatch) {
      return {
        type: 'dice',
        count: diceMatch[1] ? parseInt(diceMatch[1], 10) : 1,
        sides: parseInt(diceMatch[2], 10),
      }
    } else {
      return {
        type: 'bonus',
        value: parseInt(part, 10),
      }
    }
  })

  return pool
}

function openActionModal(action) {
  let options = Object.keys(heroAttributes).map((attribute) => {
    return `<option value="${attribute}"${action.attribute === attribute ? 'selected' : ''}>${t(`attribute.${attribute}`)}</option>`
  })

  Swal.fire({
    title: 'Anlegen/Bearbeiten',
    html: `
      <div class="form-floating mb-3">
        <input type="text" class="form-control" id="action-name" placeholder="Name" value="${action.name}">
        <label for="action-name">Name</label>
      </div>
      <div class="form-floating mb-3">
        <input type="text" class="form-control" id="action-tags" placeholder="Tags" value="${action.tags.join(', ')}">
        <label for="action-tags">Tags (Komma getrennte Liste)</label>
      </div>
      <div class="form-floating mb-3">
        <select id="action-attribute" class="form-select">
        ${options}
        </select>
        <label for="action-attribute">Attribut</label>
      </div>
      <div class="form-floating">
        <input type="text" class="form-control" id="action-damage" placeholder="Damage" value="${action.notation}">
        <label for="action-damage">Damage</label>
      </div>
    `,
    confirmButtonColor: 'var(--bs-success)',
    confirmButtonText: t('save'),
    showCancelButton: true,
    cancelButtonColor: 'var(--bs-danger)',
    cancelButtonText: t('cancel'),
    preConfirm: () => {
      const name = document.getElementById('action-name').value
      const tags = document
        .getElementById('action-tags')
        .value.split(',')
        .map((tag) => tag.trim())
      const attribute = document.getElementById('action-attribute').value
      const notation = document.getElementById('action-damage').value

      if (!isDamageNotationValid(notation)) {
        Swal.showValidationMessage(
          'Ungültige Schaden-Notation. Bitte das Format "xWy+z" verwenden.',
        )
        return false
      }

      const damagePool = parseDamageNotation(notation)

      return {
        name,
        tags,
        attribute,
        notation,
        damage: damagePool,
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const updatedAction = { ...action, ...result.value }

      const index = actions.value.findIndex((item) => item.id === action.id)
      if (index !== -1) {
        actions.value[index] = updatedAction
      } else {
        actions.value.push(updatedAction)
      }
    }
  })
}

function deleteAction(action) {
  const index = actions.value.findIndex((item) => item.id === action.id)
  if (index === -1) {
    return
  }

  Swal.fire({
    title: t('deleteActionModal.title', { name: action.name }),
    text: t('deleteActionModal.text'),
    icon: 'warning',
    confirmButtonText: t('delete'),
    confirmButtonColor: 'var(--bs-primary)',
    showCancelButton: true,
    cancelButtonColor: 'var(--bs-danger)',
    cancelButtonText: t('cancel'),
    preConfirm: () => {
      actions.value.splice(index, 1)

      Swal.fire({
        title: t('deleteActionModal.deletedModal.title', { name: hero.name }),
        html: t('deleteActionModal.deletedModal.text'),
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        confirmButtonText: t('close'),
        confirmButtonColor: 'var(--bs-primary)',
      })
    }
  })
}
</script>

<template>
  <div class="d-flex flex-row justify-content-center align-items-center gap-2">
    <h2>{{ t('Weapons & Actions') }}</h2>
    <button class="btn btn-primary" @click.stop="newAction">
      <i class="fas fa-fw fa-plus"></i>
    </button>
  </div>
  <div class="actions list-group">
    <div
      v-for="action in actions"
      :key="`weapon_${action.id}`"
      class="actions__action list-group-item list-group-item-action d-flex flex-row gap-2 align-items-center"
      @click="rollAction(action)"
    >
      <div class="flex-grow-0">
        <i class="fas fa-fw fa-dice text-primary"></i>
      </div>
      <div class="d-flex flex-column flex-grow-1">
        <h3 class="mb-2">{{ action.name }}</h3>
        <div v-if="action.tags" class="d-flex gap-2">
          <span
            class="badge rounded-pill text-bg-dark"
            v-for="(tag, index) in action.tags"
            :key="`weapon_${action.id}_tag_${index}`"
          >
            {{ tag }}
          </span>
        </div>
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
      <div class="btn-group-vertical">
        <button class="btn btn-dark" @click.stop="openActionModal(action)">
          <i class="fas fa-fw fa-edit"></i>
        </button>
        <button class="btn btn-danger" @click.stop="deleteAction(action)">
          <i class="fas fa-fw fa-trash"></i>
        </button>
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
