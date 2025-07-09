<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { attributeColors } from '@/utils/attributeColors.js';
import { createAbilityCheck } from '@/services/rollService.js';
import { calculateDiceAndBonus } from '@/utils/diceCalculator.js';
import { ABILITY_HONE_LEVEL_DETAILS } from '@/utils/abilityHoneLevels.js';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {useRollContextMenu} from "@/composables/useRollContextMenu";

const props = defineProps({
  hero: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(['update:abilityHoneLevel']);

const { openRollContextMenu } = useRollContextMenu();

const { t } = useI18n();

// Make the hone level details available in the template
const honeLevelOptions = computed(() => ABILITY_HONE_LEVEL_DETAILS);

// Computed property to process abilities and their calculated values
const abilityList = computed(() => {
  // Use an object to group abilities by category
  const categories = {};

  props.hero.abilities.forEach((ability) => {
    const attributeAValue = props.hero.attributes[ability.attributes[0]];
    const attributeBValue = props.hero.attributes[ability.attributes[1]];

    // Ensure attribute values are numbers, especially if theycome from inputs
    const abilityBaseValue = Math.floor(
      (Number(attributeAValue) + Number(attributeBValue)) / 2
    );

    // Use the calculateDiceAndBonus function direclty for pool and notation
    // Pass the ability.honeLevel directly to the calculator
    const { dice, bonus, pool, notation } = calculateDiceAndBonus(
      abilityBaseValue,
      ability.honeLevel
    );

    // Create a new object for the ability with all calculated properties
    const processedAbility = {
      ...ability,
      value: abilityBaseValue,
      dice,
      bonus,
      pool,
      notation,
    };

    if (!categories[ability.category]) {
      categories[ability.category] = [];
    }

    categories[ability.category].push(processedAbility);
  });

  return categories;
});

function updateHoneLevel(abilityName, event) {
  const newHoneLevel = Number(event.target.value);
  emits('update:abilityHoneLevel', abilityName, newHoneLevel);
}

function performAbilityRoll(ability, modifierOptions = {}) {
  createAbilityCheck(ability, modifierOptions);
}

function onAbilityRollModify(event, attribute) {
  openRollContextMenu(event, (finalSelectedModifiers) => {
    performAbilityRoll(attribute, finalSelectedModifiers)
  })
}
</script>

<template>
  <div
    v-for="(abilities, category, index) in abilityList"
    :key="`abilities_${category}`"
    class="abilities list-group"
    :class="{ 'mb-3': index < Object.keys(abilityList).length - 1 }"
  >
    <h3 class="h4 abilities__category list-group-item list-group-item-primary">
      {{ t(`abilities.${category}`) }}
    </h3>
    <div
      v-for="(ability, index) in abilities"
      :key="`ability_${category}_${index}`"
      class="abilities__ability list-group-item list-group-item-action"
      @click.prevent="performAbilityRoll(ability)"
      @contextmenu="onAbilityRollModify($event, ability)"
    >
      <div class="d-flex flex-row align-items-center gap-2">
        <div
          class="d-flex flex-column flex-grow-1 justify-content-between gap-1"
        >
          <div class="d-flex justify-content-between align-items-center">
            <b>{{ t(`abilities.${ability.name}`) }}</b>
            <div class="col-auto">
              <select
                class="form-select form-select-sm"
                :id="`ability_${category}_${index}_honeLevel`"
                @click.stop
                @change="updateHoneLevel(ability.name, $event)"
                :value="ability.honeLevel"
              >
                <option
                  v-for="level in honeLevelOptions"
                  :key="`ability_${category}_${index}_honeLevel_${level.id}`"
                  :value="level.id"
                >
                  {{ t(level.i18nKey) }}
                </option>
              </select>
            </div>
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
              <span class="ms-2">
                ({{ t('valueDisplay', { value: ability.value }) }})
              </span>
            </span>
            <span>{{ ability.notation }}</span>
          </div>
        </div>
        <div class="flex-grow-0">
          <font-awesome-icon :icon="['fas', 'fa-dice']" fixed-width class="text-primary"/>
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
