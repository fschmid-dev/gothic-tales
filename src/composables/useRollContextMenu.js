import { ref, markRaw, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

// Reactive state to control context menu visibility and position
const isContextMenuOpen = ref(false);
const contextMenuConfig = ref({});
const contextMenuPosition = ref({ x: 0, y: 0 });
const contextMenuCallback = ref(null); // Callback function to execute when a menu option is selected or roll is triggered

// Reactive state to store the currently selected modifiers
const selectedModifiers = ref({
  rollType: 'normal', // 'normal', 'advantage', 'disadvantage'
  modifierValue: 0,   // e.g., 0, 2, 5, 8, -2, -5, -8
  attackRollType: null // e.g., null, 'followUp' (for follow-up attack)
});

// References for event listeners to allow proper cleanup later
let clickOutsideListener = null;
let contextMenuOutsideListener = null;
let escapeKeyListener = null;

export function useRollContextMenu() {
  const { t } = useI18n();

  // Resets selected modifiers to their default state
  const resetModifiers = () => {
    selectedModifiers.value = {
      rollType: 'normal',
      modifierValue: 0,
      attackRollType: null
    };
  };

  // Returns options for the roll type (Normal, Advantage, Disadvantage)
  const getRollTypeOptions = () => [
    { label: t('contextMenu.normalRoll'), key: 'rollType', value: 'normal' },
    { label: t('contextMenu.advantageRoll'), key: 'rollType', value: 'advantage' },
    { label: t('contextMenu.disadvantageRoll'), key: 'rollType', value: 'disadvantage' },
  ];

  // Returns options for numerical modifiers (+/-2, +/-5, +/-8)
  // This computed property returns an empty array if 'normal' roll type is selected,
  // effectively hiding these options from the menu.
  const getModifierValueOptions = computed(() => {
    if (selectedModifiers.value.rollType === 'normal') {
      return []; // Return empty array if "Normal Roll" is selected
    }

    const type = selectedModifiers.value.rollType;
    let sign = 1; // Default to positive (for Advantage)
    if (type === 'disadvantage') {
      sign = -1; // Negative for Disadvantage
    }

    return [
      { label: t('contextMenu.modifierSmall', { value: 2 * sign }), key: 'modifierValue', value: 2 * sign },
      { label: t('contextMenu.modifierMedium', { value: 5 * sign }), key: 'modifierValue', value: 5 * sign },
      { label: t('contextMenu.modifierLarge', { value: 8 * sign }), key: 'modifierValue', value: 8 * sign },
    ];
  });

  // Returns specific options for attack rolls (e.g., follow-up attack)
  const getAttackRollOptions = () => [
    { label: t('contextMenu.followUpAttack'), key: 'attackRollType', value: 'followUp' },
  ];

  // Helper function to recalculate and adjust the menu position to stay within the viewport
  const adjustContextMenuPosition = () => {
    // Only adjust if the menu is currently open
    if (!isContextMenuOpen.value) {
      return;
    }

    // Get the context menu's DOM element by its ID
    const menuElement = document.getElementById('context-menu-container');
    if (!menuElement) {
      // The element might not be rendered yet or already removed; exit function.
      return;
    }

    const menuWidth = menuElement.offsetWidth;
    const menuHeight = menuElement.offsetHeight;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Use the initial click position as a base for adjustment
    let newX = contextMenuPosition.value.x;
    let newY = contextMenuPosition.value.y;

    // Correct X-coordinate: Prevent menu from going off the right edge
    if (newX + menuWidth > viewportWidth) {
      newX = viewportWidth - menuWidth - 10; // 10px padding from the right edge
    }
    // Correct X-coordinate: Prevent menu from going off the left edge
    if (newX < 0) {
      newX = 10; // 10px padding from the left edge
    }

    // Correct Y-coordinate: Prevent menu from going off the bottom edge
    if (newY + menuHeight > viewportHeight) {
      newY = viewportHeight - menuHeight - 10; // 10px padding from the bottom edge
    }
    // Correct Y-coordinate: Prevent menu from going off the top edge
    if (newY < 0) {
      newY = 10; // 10px padding from the top edge
    }

    // Update the reactive context menu position
    contextMenuPosition.value = { x: newX, y: newY };
  };

  // Opens the context menu at the given event's coordinates
  const openRollContextMenu = (event, callback = null, config = {}, initialModifiers = {}) => {
    event.preventDefault(); // Prevent the native browser context menu

    resetModifiers(); // Reset modifiers to default values
    Object.assign(selectedModifiers.value, initialModifiers); // Apply any initial modifiers

    Object.assign(contextMenuConfig.value, config);
    isContextMenuOpen.value = true;
    contextMenuCallback.value = callback ? markRaw(callback) : null;

    // Set initial position to allow Vue to render the menu in the DOM,
    // which is necessary before we can measure its dimensions.
    contextMenuPosition.value = { x: event.clientX, y: event.clientY };

    // Small delay to allow the DOM to render the menu,
    // before we measure its size and adjust its position.
    setTimeout(() => {
      adjustContextMenuPosition(); // Perform initial position adjustment

      // Add event listeners
      clickOutsideListener = (e) => {
        const menuElement = document.getElementById('context-menu-container');
        if (menuElement && !menuElement.contains(e.target)) {
          closeContextMenu();
        }
      };
      contextMenuOutsideListener = (e) => {
        const menuElement = document.getElementById('context-menu-container');
        if (menuElement && !menuElement.contains(e.target)) {
          closeContextMenu();
        }
      };
      escapeKeyListener = (e) => {
        if (e.key === 'Escape') { // Check if the pressed key is 'Escape'
          closeContextMenu();
        }
      };

      // Add listeners to the document
      document.addEventListener('click', clickOutsideListener, true); // Use capture phase for reliability
      document.addEventListener('contextmenu', contextMenuOutsideListener, true); // Use capture phase
      document.addEventListener('keydown', escapeKeyListener); // Listener for the Escape key
    }, 50); // 50ms delay for DOM render
  };

  // Closes the context menu
  const closeContextMenu = () => {
    isContextMenuOpen.value = false;
    contextMenuConfig.value = {};
    contextMenuPosition.value = { x: 0, y: 0 };
    contextMenuCallback.value = null;
    resetModifiers(); // Reset state

    // Remove all added event listeners to prevent memory leaks
    if (clickOutsideListener) {
      document.removeEventListener('click', clickOutsideListener, true);
      clickOutsideListener = null;
    }
    if (contextMenuOutsideListener) {
      document.removeEventListener('contextmenu', contextMenuOutsideListener, true);
      contextMenuOutsideListener = null;
    }
    if (escapeKeyListener) {
      document.removeEventListener('keydown', escapeKeyListener);
      escapeKeyListener = null;
    }
  };

  // Selects an option in the context menu and updates the state
  const selectOption = (key, value) => {
    const oldRollType = selectedModifiers.value.rollType; // Store old rollType for comparison

    // Logic for roll type selection
    if (key === 'rollType' && value === 'normal') {
      selectedModifiers.value.modifierValue = 0; // Reset modifier to 0 if "Normal Roll"
    } else if (key === 'rollType' && value !== 'normal' && selectedModifiers.value.modifierValue === 0) {
      // If switching from "normal" to advantage/disadvantage and modifier is still 0, set a default
      selectedModifiers.value.modifierValue = (value === 'advantage' ? 2 : -2);
    }

    // Logic for attack roll options (checkbox-like behavior)
    if (key === 'attackRollType') {
      if (selectedModifiers.value.attackRollType === value) {
        selectedModifiers.value.attackRollType = null; // Deselect option if already selected
      } else {
        selectedModifiers.value.attackRollType = value; // Select option
      }
    } else {
      // General logic for other options (radio-button-like behavior)
      selectedModifiers.value[key] = value;
    }

    // If the roll type has changed, adjust the menu position
    // This is crucial because modifier options might appear/disappear, changing menu height.
    if (key === 'rollType' && selectedModifiers.value.rollType !== oldRollType) {
      // A tiny delay ensures Vue has completed its DOM updates
      // before we measure the menu's new size for re-positioning.
      setTimeout(adjustContextMenuPosition, 0);
    }
  };

  // Triggers the dice roll and passes the selected modifiers to the callback
  const triggerRoll = () => {
    if (contextMenuCallback.value) {
      contextMenuCallback.value({ ...selectedModifiers.value });
    }
    closeContextMenu(); // Close the menu after rolling
  };

  // Watcher to add/remove a resize listener based on context menu visibility.
  // This ensures the menu stays on screen if the window is resized while it's open.
  watch(isContextMenuOpen, (isOpen) => {
    if (isOpen) {
      window.addEventListener('resize', adjustContextMenuPosition);
    } else {
      window.removeEventListener('resize', adjustContextMenuPosition);
    }
  });

  return {
    // Exported reactive state and functions for use in components
    isContextMenuOpen,
    contextMenuConfig,
    contextMenuCallback,
    contextMenuPosition,
    selectedModifiers,
    openRollContextMenu,
    closeContextMenu,
    selectOption,
    triggerRoll,
    getRollTypeOptions,
    getModifierValueOptions,
    getAttackRollOptions
  };
}