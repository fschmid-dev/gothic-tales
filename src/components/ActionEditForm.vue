<script setup>
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { heroAttributes } from '@/models/Hero.js';

const props = defineProps({
  // The initial action object to be edited
  initialAction: {
    type: Object,
    required: true,
  },
});

const { t } = useI18n();

// Local reactive state for the form
const formData = ref({
  id: props.initialAction.id,
  name: props.initialAction.name,
  tags: props.initialAction.tags.join(', '), // Tags as a string for the input field
  attribute: props.initialAction.attribute,
  includeAttributeDiceToRoll:
    props.initialAction.includeAttributeDiceToRoll,
  notation: props.initialAction.notation,
  roll: props.initialAction.roll,
});

// Computed property for attribute options in the select field
const attributeOptions = computed(() => {
  return Object.keys(heroAttributes).map((key) => ({
    value: key,
    text: t(`attribute.${key}`),
  }));
});

// Watch for changes to initialAction, in case the object changes from outside
// (e.g., editing an action after it was just created)
watch(
  () => props.initialAction,
  (newAction) => {
    formData.value = {
      id: newAction.id,
      name: newAction.name,
      tags: newAction.tags.join(', '),
      attribute: newAction.attribute,
      includeAttributeDiceToRoll: newAction.includeAttributeDiceToRoll,
      notation: newAction.notation,
      roll: newAction.roll,
    };
  },
  { deep: true }
);

// Expose the formData for external access if needed (for debugging or more complex interaction)
// In our current SweetAlert2 setup, this isn't directly used for data retrieval in preConfirm,
// but it illustrates the Vue form structure.
defineExpose({
  formData,
});
</script>

<template>
  <div>
    <div class="form-floating mb-3">
      <input
        type="text"
        class="form-control"
        id="action-name"
        :placeholder="t('actionModal.namePlaceholder')"
        v-model="formData.name"
        :value="formData.name"
      />
      <label for="action-name">{{ t('actionModal.nameLabel') }}</label>
    </div>
    <div class="form-floating mb-3">
      <input
        type="text"
        class="form-control"
        id="action-tags"
        :placeholder="t('actionModal.tagsPlaceholder')"
        v-model="formData.tags"
        :value="formData.tags"
      />
      <label for="action-tags">{{ t('actionModal.tagsLabel') }}</label>
    </div>
    <div class="form-floating mb-3">
      <select
        id="action-attribute"
        class="form-select"
        v-model="formData.attribute"
      >
        <option
          v-for="option in attributeOptions"
          :key="option.value"
          :value="option.value"
          :selected="formData.attribute === option.value"
        >
          {{ option.text }}
        </option>
      </select>
      <label for="action-attribute">{{
        t('actionModal.attributeLabel')
      }}</label>
    </div>
    <div class="form-floating mb-3">
      <input
        type="text"
        class="form-control"
        id="action-roll"
        :placeholder="t('actionModal.rollPlaceholder')"
        v-model="formData.notation"
        :value="formData.notation"
      />
      <label for="action-roll">{{ t('actionModal.rollLabel') }}</label>
    </div>
    <div class="text-start">
      <div class="form-check form-switch">
        <input
            class="form-check-input"
            type="checkbox"
            value=""
            id="action-includeAttributeDiceToRoll"
            :checked="formData.includeAttributeDiceToRoll"
        />
        <label
            class="form-check-label"
            for="action-includeAttributeDiceToRoll"
        >
          {{ $t('actionModal.includeAttributeDiceToRollLabel') }}
        </label>
      </div>
      <label
          id="checkIncludeAttributeDiceToRollHelp"
          for="action-includeAttributeDiceToRoll"
          class="form-text"
          v-html="$t('actionModal.includeAttributeDiceToRollHelp')"
      ></label>
    </div>
  </div>
</template>
