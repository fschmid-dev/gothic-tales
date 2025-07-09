// This array defines the structure and data for each Ability Hone Level.
// 'notation' is stored as a string here, as it's static and can be
// used directly for display. Placeholders like 'D' for dice will be
// replaced with the i18n 'diceShort' value when displayed.
export const ABILITY_HONE_LEVEL_DETAILS = [
  {
    id: 0,
    i18nKey: 'honeLevel.level0', // i18n key for translation
    notation: '', // No additional notation for Level 0
    poolAdditions: [], // No pool additions for Level 0
  },
  {
    id: 1,
    i18nKey: 'honeLevel.level1',
    notation: '2',
    poolAdditions: [{ type: 'bonus', bonus: 2 }],
  },
  {
    id: 2,
    i18nKey: 'honeLevel.level2',
    notation: 'D4+2', // 'D' will be replaced by 'W' or equivalent from i18n
    poolAdditions: [
      { type: 'dice', sides: 4, count: 1 },
      { type: 'bonus', bonus: 2 },
    ],
  },
  {
    id: 3,
    i18nKey: 'honeLevel.level3',
    notation: '2D6+3', // 'D' will be replaced by 'W' or equivalent from i18n
    poolAdditions: [
      { type: 'dice', sides: 6, count: 2 },
      { type: 'bonus', bonus: 3 },
    ],
  },
];

// For internal use in the calculateDiceAndBonus function,
// a Map provides efficient lookups by ID.
export const ABILITY_HONE_LEVELS_MAP = new Map(
  ABILITY_HONE_LEVEL_DETAILS.map((level) => [level.id, level])
);

// Constants for level IDs, for better readability and to avoid "magic numbers"
export const ABILITY_HONE_LEVEL_IDS = {
  NONE: 0,
  LEVEL_1: 1,
  LEVEL_2: 2,
  LEVEL_3: 3,
};
