<script setup>
import { useI18n } from "vue-i18n";
import { useRollContextMenu } from "@/composables/useRollContextMenu";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const {
  isContextMenuOpen,
  contextMenuConfig,
  contextMenuPosition,
  selectedModifiers,
  selectOption,
  triggerRoll,
  getRollTypeOptions,
  getModifierValueOptions, // Jetzt wird dieses Computed Property ein leeres Array zurückgeben, wenn RollType normal ist
  getAttackRollOptions,
} = useRollContextMenu();

const { t } = useI18n();

// Basic styling for the menu (you'll want to style this properly with CSS)
const menuStyle = (position) => ({
  left: `${position.x}px`,
  top: `${position.y}px`,
  position: "fixed",
  backgroundColor: "#333",
  border: "1px solid #555",
  borderRadius: "4px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
  zIndex: 1000,
  padding: "5px 0",
  minWidth: "150px",
  listStyle: "none",
  margin: 0,
});

const menuItemStyle = {
  padding: "8px 15px",
  cursor: "pointer",
  color: "#eee",
  backgroundColor: "transparent",
};

const menuItemHoverStyle = {
  backgroundColor: "#555",
};

const dividerStyle = {
  borderTop: "1px solid #555",
  margin: "5px 0",
};

const boldDividerStyle = {
  borderTop: "3px double #555", // Dickere Linie
  margin: "5px 0",
};

const isOptionSelected = (key, value) => {
  return selectedModifiers.value[key] === value;
};
</script>

<template>
  <ul
    v-if="isContextMenuOpen"
    :style="menuStyle(contextMenuPosition)"
    id="context-menu-container"
  >
    <li
      v-for="(option, index) in getRollTypeOptions()"
      :key="`roll-type-${index}`"
      :style="menuItemStyle"
      @click="selectOption(option.key, option.value)"
      @mouseover="
        $event.currentTarget.style.backgroundColor =
          menuItemHoverStyle.backgroundColor
      "
      @mouseleave="
        $event.currentTarget.style.backgroundColor =
          menuItemStyle.backgroundColor
      "
    >
      {{ option.label }}
      <span v-if="isOptionSelected(option.key, option.value)" class="ms-2">
        <font-awesome-icon :icon="['fas', 'fa-check']" />
      </span>
    </li>

    <template v-if="getModifierValueOptions.length > 0">
      <li :style="dividerStyle"></li>

      <li
        v-for="(option, index) in getModifierValueOptions"
        :key="`mod-value-${index}`"
        :style="menuItemStyle"
        @click="selectOption(option.key, option.value)"
        @mouseover="
          $event.currentTarget.style.backgroundColor =
            menuItemHoverStyle.backgroundColor
        "
        @mouseleave="
          $event.currentTarget.style.backgroundColor =
            menuItemStyle.backgroundColor
        "
      >
        {{ option.label }}
        <span v-if="isOptionSelected(option.key, option.value)" class="ms-2">
          <font-awesome-icon :icon="['fas', 'fa-check']" />
        </span>
      </li>
    </template>

    <template v-if="contextMenuConfig.includeFollowUpOption">
      <li :style="dividerStyle"></li>

      <li
        v-for="(option, index) in getAttackRollOptions()"
        :key="`attack-roll-${index}`"
        :style="menuItemStyle"
        @click="selectOption(option.key, option.value)"
        @mouseover="
          $event.currentTarget.style.backgroundColor =
            menuItemHoverStyle.backgroundColor
        "
        @mouseleave="
          $event.currentTarget.style.backgroundColor =
            menuItemStyle.backgroundColor
        "
      >
        {{ option.label }}
        <span v-if="isOptionSelected(option.key, option.value)" class="ms-2">
          <font-awesome-icon :icon="['fas', 'fa-check']" />
        </span>
      </li>
    </template>

    <li :style="boldDividerStyle"></li>

    <li
      :style="{ ...menuItemStyle, textAlign: 'center', fontWeight: 'bold' }"
      @click="triggerRoll"
      @mouseover="
        $event.currentTarget.style.backgroundColor =
          menuItemHoverStyle.backgroundColor
      "
      @mouseleave="
        $event.currentTarget.style.backgroundColor =
          menuItemStyle.backgroundColor
      "
    >
      {{ t("contextMenu.rollButton") }}
      <font-awesome-icon :icon="['fas', 'fa-dice']" />
    </li>
  </ul>
</template>

<style scoped lang="scss">
/* Add your custom CSS for the context menu here
   For example, using Bootstrap classes or your own SASS variables. */

ul {
  padding: 0;
  margin: 0;
  list-style: none;
}

li {
  white-space: nowrap; /* Prevent text wrapping */
  display: flex; /* Für Checkmark */
  justify-content: space-between; /* Für Checkmark */
  align-items: center; /* Für Checkmark */
}

/* Example with Bootstrap-like classes for better integration */
.context-menu {
  background-color: var(--bs-dark);
  border: 1px solid var(--bs-gray-700);
  border-radius: var(--bs-border-radius);
  box-shadow: var(--bs-box-shadow);
  z-index: 1050; /* Above modals */
  position: fixed;
  padding: 0.5rem 0;
  min-width: 10rem;
}

.context-menu-item {
  padding: 0.5rem 1rem;
  color: var(--bs-light);
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;

  &:hover {
    background-color: var(--bs-primary);
    color: var(--bs-white);
  }
}

.context-menu-divider {
  border-top: 1px solid var(--bs-gray-600);
  margin: 0.25rem 0;
}
</style>
