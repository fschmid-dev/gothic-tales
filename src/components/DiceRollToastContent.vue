<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  // Main header for the toast (e.g., Attribute Name, Ability Name, Action Name, ...)
  header: {
    type: String,
    required: false,
    default: '',
  },
  // Color for the header text (mostly the attribute color)
  headerColor: {
    type: String,
    required: false,
    default: 'inherit',
  },
  // Array of sections, each representing a distinct roll group
  sections: {
    type: Array,
    required: true,
    default: () => [],
    // Each section object should ideally have:
    // {
    //   title: String, // Optional title for the section (e.g., "Attack Roll")
    //   parts: Array,  // Array of roll parts (from DiceRoller.js result.parts)
    //   sum: Number,   // Total sum of this section
    // }
  },
  // The total sum for the check
  sum: {
    type: Number,
    required: false,
  },
  // Optional footer content for the toast
  footer: {
    type: String,
    required: false,
    default: '',
  },
});
</script>

<template>
  <div class="d-flex flex-column">
    <div
      v-if="header"
      :style="{ color: headerColor }"
      class="toast-header-text"
    >
      <span v-html="header"></span>
    </div>

    <template
      v-for="(section, sectionIndex) in sections"
      :key="'section_' + sectionIndex"
    >
      <hr v-if="sectionIndex > 0" class="toast-divider" />
      <b v-if="section.title" class="toast-section-title">
        {{ section.title }}
      </b>

      <div class="d-flex flex-row align-items-center toast-rolls-container">
        <template
          v-for="(part, partIndex) in section.parts"
          :key="'section_' + sectionIndex + '_part_' + partIndex"
        >
          <div class="d-flex flex-column align-items-center toast-roll-part">
            <template v-if="part.item.type === 'dice'">
              <span class="toast-dice-notation">
                {{ part.item.count > 1 ? part.item.count : ''
                }}{{ t('diceShort') }}{{ part.item.sides }}
              </span>
              <span class="toast-roll-values">{{ part.rolls.join('+') }}</span>
            </template>

            <template v-if="part.item.type === 'd20special'">
              <span class="toast-dice-notation">
                {{ t(part.label) }}
              </span>
              <span class="toast-roll-values">
                (<span :class="{'toast-roll-selected': part.item.selected === 0}">{{ part.item.rolls[0] }}</span>/<span :class="{'toast-roll-selected': part.item.selected === 1}">{{ part.item.rolls[1] }}</span>)
              </span>
            </template>

            <template v-else-if="part.item.type === 'bonus'">
              <span class="toast-bonus-notation">{{ part.sum }}</span>
              <span class="toast-bonus-value">{{ part.sum }}</span>
            </template>

            <template v-else-if="part.item.type === 'advantage' || part.item.type === 'disadvantage'">
              <span class="toast-modifier-notation">
                {{ t(`modifier.${part.item.type}`) }}
              </span>
              <span class="toast-modifier-value">{{ part.sum }}</span>
            </template>
          </div>
          <span
            v-if="partIndex < section.parts.length - 1"
            class="toast-plus-sign"
          >
            +
          </span>
        </template>
        <template v-if="section.sum">
          <b class="text-end toast-section-sum">
            {{ t('sum', { sum: section.sum }) }}
          </b>
        </template>
      </div>
    </template>

    <template v-if="sum">
      <hr class="toast-divider" />
      <b class="text-end toast-section-sum">{{ t('sum', { sum: sum }) }}</b>
    </template>

    <div v-if="footer" class="toast-footer-text">
      <span v-html="footer"></span>
    </div>
  </div>
</template>

<style scoped>
/* Basic styling for the toast content for better appearance */
.toast-header-text {
  margin-bottom: 0.5em;
  text-align: center;
}

.toast-section-title {
  text-align: center;
}

.toast-rolls-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: flex-start;
}

.toast-dice-notation,
.toast-bonus-notation,
.toast-modifier-notation{
  font-style: italic;
  font-weight: bold;
  color: var(--bs-primary);
}

.toast-roll-values,
.toast-bonus-value,
.toast-modifier-value{
  color: var(--bs-secondary);
}
.toast-roll-selected{
  font-weight: bold;
}

.toast-plus-sign {
  font-weight: bold;
  color: var(--bs-body-color);
}

.toast-section-sum {
  text-align: right;
  width: 100%;
}

.toast-divider {
  border: 0;
  height: 1px;
  background-color: var(--bs-body-color);
  margin: 0.5rem 0;
}

.toast-footer-text {
  margin-top: 0.5em;
  text-align: center;
  color: var(--bs-gray-600); /* Example subdued color */
}
</style>
