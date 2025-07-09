<script setup>
import { computed } from 'vue';
import { attributeColors } from '@/utils/attributeColors.js';
import { calculateDiceAndBonus } from '@/utils/diceCalculator.js';
import { createAttributeCheck } from '@/services/rollService.js';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {useRollContextMenu} from "@/composables/useRollContextMenu";

const props = defineProps({
  hero: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(['update:attribute']);

const { openRollContextMenu } = useRollContextMenu();

const attributes = computed(() => {
  const attributes = {};

  for (const [key, value] of Object.entries(props.hero.attributes)) {
    const { dice, bonus, pool, notation } = calculateDiceAndBonus(value);

    attributes[key] = {
      name: key,
      value,
      dice,
      bonus,
      pool,
      notation,
    };
  }

  return attributes;
});

function performAttributeRoll(attribute, modifierOptions = {}) {
  createAttributeCheck(attribute, modifierOptions);
}

function onAttributeRollModify(event, attribute) {
  openRollContextMenu(event, (finalSelectedModifiers) => {
    performAttributeRoll(attribute, finalSelectedModifiers)
  })
}

function updateAttributeValue(key, event) {
  // Ensure the value is a number, as input type="number" can still return strings
  const newValue = Number(event.target.value);
  emits('update:attribute', key, newValue);
}

function incrementAttribute(key) {
  const newValue = props.hero.attributes[key] + 5;
  emits('update:attribute', key, newValue);
}
</script>

<template>
  <div class="attributes">
    <div v-for="(attribute, key) in attributes" :key="key" class="attribute">
      <button
        class="btn d-flex flex-row w-100 gap-2 align-items-center justify-content-between cursor-pointer"
        @click.prevent="performAttributeRoll(attribute)"
        @contextmenu="onAttributeRollModify($event, attribute)"
      >
        <b :style="{ color: attributeColors[key] }">
          {{ $t(`attribute.${key}`) }}
        </b>
        <span>
          <font-awesome-icon :icon="['fas', 'fa-dice']" fixed-width class="text-primary"/>
        </span>
      </button>
      <div class="input-group">
        <button
          class="btn btn-outline-primary"
          @click.prevent="incrementAttribute(key)"
        >
          +5
        </button>
        <input
          type="number"
          :value="hero.attributes[key]"
          @input="updateAttributeValue(key, $event)"
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
