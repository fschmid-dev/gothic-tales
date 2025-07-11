import i18n from "@/plugins/i18n.js";
import {
  ABILITY_HONE_LEVELS_MAP,
  ABILITY_HONE_LEVEL_IDS,
} from "@/utils/abilityHoneLevels.js";

const { t } = i18n.global;

// --- Constants ---
// Definition of possible dice sides in order of improvement
const DICE_IMPROVEMENT_ORDER = [2, 4, 6, 8, 10, 12];

// --- Helper Functions ---

/**
 * Calculates the dice (e.g., { '6': 2, '10': 1 }) based on an attribute value
 * following the specific improvement logic.
 * @param {number} value The attribute value.
 * @returns {object} An object indicating the count of dice per side.
 */
export function calculateDice(value) {
  // Stores dice counts: { 'sides': count }
  const currentDice = { 2: 1 }; // Start with one D2
  let remaining = value;

  while (remaining >= 10) {
    let improved = false; // Flag to check if any die was improved in this step

    // --- Step 1: Try to improve a non-D12 die to the next size ---
    // Iterate through dice sizes from largest to smallest (excluding D12)
    for (let i = DICE_IMPROVEMENT_ORDER.length - 2; i >= 0; i--) {
      // Start from D10 down to D2
      const currentSize = DICE_IMPROVEMENT_ORDER[i];
      if (currentDice[currentSize] && currentDice[currentSize] > 0) {
        // Found a die that can be improved (not a D12)
        currentDice[currentSize]--;
        if (currentDice[currentSize] === 0) {
          delete currentDice[currentSize];
        }
        const nextSize = DICE_IMPROVEMENT_ORDER[i + 1];
        currentDice[nextSize] = (currentDice[nextSize] || 0) + 1;
        improved = true;
        break; // One die improved, move to next 10 points
      }
    }

    // --- Step 2: If no non-D12 die was improved, check for D12 split ---
    if (!improved) {
      if (currentDice[12] && currentDice[12] > 0) {
        // If there are D12s, split one into two D6s
        currentDice[12]--;
        if (currentDice[12] === 0) {
          delete currentDice[12];
        }
        currentDice[6] = (currentDice[6] || 0) + 2;
        improved = true;
      }
    }

    // --- Fallback: If no improvement/split happened ---
    if (!improved) {
      // If no existing die could be improved, add another base die (D2).
      currentDice[2] = (currentDice[2] || 0) + 1;
    }

    remaining -= 10;
  }

  // The `currentDice` object itself might not be sorted.
  // The sorting for `finalDice` will ensure consistent output order,
  // but for the `notationParts` loop later, we'll sort the keys directly.
  return currentDice; // Return the raw object, sorting will happen when building notation
}

/**
 * Calculates the numerical bonus based on an attribute value.
 * @param {number} value The attribute value.
 * @returns {number} The calculated bonus.
 */
export function calculateBonus(value) {
  // Starting at 15, the bonus increases by one every time a single 5-digit is reached
  // (e.g., 15 => +1, 25 => +2, 35 => +3, etc.).
  return Math.max(Math.floor((value - 5) / 10), 0);
}

/**
 * Applies the effects of the Ability Hone Level to the dice pool and notation.
 * @param {Array<object>} pool The array representing the dice pool.
 * @param {Array<string>} notationParts The array storing the individual parts of the notation.
 * @param {number} abilityHoneLevelId The ID of the current Ability Hone Level.
 */
function applyAbilityHone(pool, notationParts, abilityHoneLevelId) {
  const levelDetails = ABILITY_HONE_LEVELS_MAP.get(abilityHoneLevelId);

  if (levelDetails && levelDetails.poolAdditions.length > 0) {
    // Add all predefined pool additions
    levelDetails.poolAdditions.forEach((item) => {
      pool.push(item);
    });

    // Add the predefined notation and replace placeholders if any
    let levelNotation = levelDetails.notation;
    // Replace 'D' with the translated 'diceShort' value (e.g., 'W' for German)
    levelNotation = levelNotation.replace(/D/g, t("diceShort"));

    notationParts.push(levelNotation);
  }
}

// --- Main Function ---

/**
 * Calculates the full dice notation and pool based on a value
 * and an optional Ability Hone Level.
 * @param {number} value The base value (e.g., attribute value).
 * @param {number} [abilityHoneLevelId=ABILITY_HONE_LEVEL_IDS.NONE] The ID of the Ability Hone Level.
 * @returns {object} An object with the calculated dice, bonus, pool, and notation.
 */
export function calculateDiceAndBonus(
  value,
  abilityHoneLevelId = ABILITY_HONE_LEVEL_IDS.NONE,
) {
  const calculatedDice = calculateDice(value);
  const calculatedBonus = calculateBonus(value);

  const pool = [];
  const notationParts = []; // Collects the individual parts of the notation string

  // Get keys from calculatedDice, convert to numbers, sort in descending order, then iterate.
  // This ensures dice in the notation are always ordered from largest to smallest side.
  Object.keys(calculatedDice)
    .map(Number) // Convert string keys to numbers for correct sorting
    .sort((a, b) => b - a) // Sort numerically in descending order (largest side first)
    .forEach((diceSidesNum) => {
      const diceSidesStr = String(diceSidesNum); // Convert back to string for object access
      const count = calculatedDice[diceSidesStr];
      pool.push({
        type: "dice",
        sides: diceSidesNum,
        count: count,
      });
      notationParts.push(`${count}${t("diceShort")}${diceSidesStr}`);
    });

  // Add the calculated bonus to the pool and notation
  if (calculatedBonus > 0) {
    pool.push({
      type: "bonus",
      bonus: calculatedBonus,
    });
    notationParts.push(`${calculatedBonus}`);
  }

  // Apply the effects of the Ability Hone Level
  applyAbilityHone(pool, notationParts, abilityHoneLevelId);

  // Join the notation parts with '+'
  const notation = notationParts.filter((part) => part).join("+");

  return {
    dice: calculatedDice, // This will be the raw object from calculateDice
    bonus: calculatedBonus,
    pool: pool,
    notation: notation,
  };
}
