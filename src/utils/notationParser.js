import i18n from '@/plugins/i18n.js'; // Import your i18n instance to get 'diceShort'

/**
 * Checks if a given string is a valid damage notation.
 * @param {string} notation The notation string to validate (e.g., "1W6+2", "2W8").
 * @returns {boolean} True if valid, false otherwise.
 */
export function isDamageNotationValid(notation) {
  const shortDice = i18n.global.t('diceShort'); // Access global t() for translation
  const regex = new RegExp(
    `^([+-]?\\d*${shortDice}\\d+|[+-]?\\d+)([+-]?\\d*${shortDice}\\d+|[+-]?\\d+)*$`,
    'i'
  );
  return regex.test(notation);
}

/**
 * Parses a damage notation string into a pool of dice and bonus components.
 * @param {string} notation The notation string to parse.
 * @returns {Array<object>} An array of objects, each representing a dice roll or a bonus.
 */
export function parseDamageNotation(notation) {
  const shortDice = i18n.global.t('diceShort'); // Access global t() for translation
  const regex = new RegExp(`([+-]?\\d*${shortDice}\\d+|[+-]?\\d+)`, 'gi');
  const parts = notation.match(regex);

  if (!parts) return []; // Handle cases where no parts are matched

  const pool = parts.map((part) => {
    const diceRegex = new RegExp(`(\\d*)${shortDice}(\\d+)`, 'i');
    const diceMatch = part.match(diceRegex);

    if (diceMatch) {
      return {
        type: 'dice',
        count: diceMatch[1] ? parseInt(diceMatch[1], 10) : 1,
        sides: parseInt(diceMatch[2], 10),
      };
    } else {
      return {
        type: 'bonus',
        bonus: parseInt(part, 10),
      };
    }
  });

  return pool;
}
