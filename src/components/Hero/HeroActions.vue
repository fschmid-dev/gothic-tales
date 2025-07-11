<script setup>
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {useRollContextMenu} from '@/composables/useRollContextMenu';
import Swal from 'sweetalert2';

import {attributeColors} from '@/utils/attributeColors.js';
import {calculateDiceAndBonus} from '@/utils/diceCalculator.js';
import {generateId} from '@/utils/generateId.js';
import {heroAttributes} from '@/models/Hero.js'; // Import the Hero class
import {createAction} from '@/services/rollService.js';
import {renderVueComponentToHTML} from '@/utils/vueRender.js';
import ActionEditForm from '@/components/ActionEditForm.vue';
import {isRollNotationValid, parseRollNotation,} from '@/utils/notationParser.js';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

/**
 * @property {Hero} hero - The Hero object for this component.
 */
const props = defineProps({
  hero: {
    type: Object,
    required: true
  },
});

const emits = defineEmits(['add:action', 'update:action', 'delete:action']);

const {t} = useI18n();
const {openRollContextMenu} = useRollContextMenu();

const attributeNotations = computed(() => {
  const notations = {};
  for (const [key, value] of Object.entries(props.hero.attributes)) {
    const {notation} = calculateDiceAndBonus(value);
    notations[key] = notation;
  }
  return notations;
});

const performActionRoll = (action, modifierOptions = {}) => {
  createAction(action, props.hero.attributes[action.attribute], modifierOptions);
};

// --- Kontextmenü öffnen ---
const onActionModify = (event, action) => {
  const config = {includeFollowUpOption: true}

  openRollContextMenu(event, (finalSelectedModifiers) => {
    performActionRoll(action, finalSelectedModifiers);
  }, config);
};

function newAction() {
  const action = {
    id: generateId(),
    name: t('actionModal.defaultName'),
    tags: [],
    attribute: Object.keys(heroAttributes)[0],
    includeAttributeDiceToRoll: true,
    roll: [],
    notation: `1${t('diceShort')}4`,
  };

  openActionModal(action, true);
}

function openActionModal(action, newAction = false) {
  // Use a copy to avoid mutating the original action object while editing
  const currentAction = {...action};

  const modalTitle = newAction
      ? t('actionModal.newTitle')
      : t('actionModal.editTitle', {name: currentAction.name});

  const modalContentHtml = renderVueComponentToHTML(ActionEditForm, {
    initialAction: currentAction,
  });

  Swal.fire({
    title: modalTitle,
    html: modalContentHtml,
    confirmButtonColor: 'var(--bs-success)',
    confirmButtonText: t('save'),
    showCancelButton: true,
    cancelButtonColor: 'var(--bs-danger)',
    cancelButtonText: t('cancel'),
    preConfirm: () => {
      const name = document.getElementById('action-name').value;
      const tags = document
          .getElementById('action-tags')
          .value.split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag !== '');
      const attribute = document.getElementById('action-attribute').value;
      const includeAttributeDiceToRoll = document.getElementById(
          'action-includeAttributeDiceToRoll'
      ).checked;
      const notation = document.getElementById('action-roll').value;

      if (!isRollNotationValid(notation)) {
        Swal.showValidationMessage(t('actionModal.invalidRollNotation'));
        return false;
      }

      const rollPool = parseRollNotation(notation);

      return {
        name,
        tags,
        attribute,
        includeAttributeDiceToRoll,
        notation,
        roll: rollPool,
      };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const updatedAction = {...currentAction, ...result.value};

      if (props.hero.actions.some((item) => item.id === updatedAction.id)) {
        emits('update:action', updatedAction);
      } else {
        emits('add:action', updatedAction);
      }
    }
  });
}

function deleteAction(actionToDelete) {
  const index = props.hero.actions.findIndex(
      (item) => item.id === actionToDelete.id
  );
  if (index === -1) {
    return;
  }

  Swal.fire({
    title: t('deleteAction.title', {name: actionToDelete.name}),
    text: t('deleteAction.text'),
    icon: 'warning',
    confirmButtonText: t('delete'),
    confirmButtonColor: 'var(--bs-primary)',
    showCancelButton: true,
    cancelButtonColor: 'var(--bs-danger)',
    cancelButtonText: t('cancel'),
  }).then((result) => {
    if (result.isConfirmed) {
      emits('delete:action', actionToDelete.id);
      Swal.fire({
        title: t('deleteAction.deletedModal.title', {
          name: actionToDelete.name,
        }),
        html: t('deleteAction.deletedModal.text'),
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        confirmButtonText: t('close'),
        confirmButtonColor: 'var(--bs-primary)',
      });
    }
  });
}
</script>

<template>
  <div
      class="d-flex flex-row justify-content-center align-items-center gap-2 mb-3"
  >
    <h2>{{ t('hero.weapons&actions') }}</h2>
    <button class="btn btn-primary" @click.stop="newAction">
      <font-awesome-icon :icon="['fas', 'fa-plus']" fixed-width/>
    </button>
  </div>
  <div class="list-group">
    <div
        v-for="action in hero.actions"
        :key="`weapon_${action.id}`"
        class="action"
        @click="performActionRoll(action)"
        @contextmenu="onActionModify($event, action)"
    >
      <div class="action__name">
        <font-awesome-icon :icon="['fas', 'fa-dice']" fixed-width class="text-primary"/>
        <h3>{{ action.name }}</h3>
      </div>

      <div class="action__tags">
        <div
            v-if="action.tags && action.tags.length > 0"
            class="d-flex flex-wrap gap-2"
        >
          <span
              class="badge rounded-pill text-bg-dark"
              v-for="(tag, index) in action.tags"
              :key="`weapon_${action.id}_tag_${index}`"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <div class="action__attribute">
        <div class="d-flex flex-row align-items-center gap-2">
          <b :style="{ color: attributeColors[action.attribute] }">
            {{ t(`attribute.${action.attribute}Short`) }}
          </b>
          <span>{{ attributeNotations[action.attribute] }}</span>
        </div>
      </div>

      <div class="action__roll">
        <div class="d-flex flex-column">
          <div class="d-flex flex-row gap-2">
            <b>{{ t('roll') }}</b>
            <span>{{ action.notation }}</span>
          </div>
          <span v-if="action.includeAttributeDiceToRoll">
            {{ $t('action.includeAttributeDiceToRoll') }}
          </span>
        </div>
      </div>

      <div class="action__buttons">
        <button class="btn btn-dark" @click.stop="openActionModal(action)">
          <font-awesome-icon :icon="['fas', 'fa-edit']" fixed-width/>
        </button>
        <button class="btn btn-danger" @click.stop="deleteAction(action)">
          <font-awesome-icon :icon="['fas', 'fa-trash']" fixed-width/>
        </button>
      </div>
    </div>
  </div>
</template>
