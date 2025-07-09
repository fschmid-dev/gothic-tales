import { Character } from '@/models/Character.js';

/**
 * @typedef {object} HeroAttributes
 * @property {number} strength
 * @property {number} dexterity
 * @property {number} endurance
 * @property {number} concentration
 * @property {number} intuition
 * @property {number} experience
 */
export const heroAttributes = {
  strength: 10,
  dexterity: 10,
  endurance: 10,
  concentration: 10,
  intuition: 10,
  experience: 10,
};

/**
 * @typedef {object} HeroAbility
 * @property {string} name
 * @property {string[]} attributes
 * @property {number} honeLevel
 * @property {string} category
 */
export const heroAbilities = [
  // Body-Abilities
  {
    name: 'endure',
    attributes: ['concentration', 'endurance'],
    honeLevel: 0,
    category: 'body',
  },
  {
    name: 'moveObject',
    attributes: ['strength', 'endurance'],
    honeLevel: 0,
    category: 'body',
  },
  {
    name: 'jumpingClimbing',
    attributes: ['strength', 'dexterity'],
    honeLevel: 0,
    category: 'body',
  },
  {
    name: 'agility',
    attributes: ['dexterity', 'experience'],
    honeLevel: 0,
    category: 'body',
  },
  {
    name: 'stealth',
    attributes: ['dexterity', 'intuition'],
    honeLevel: 0,
    category: 'body',
  },
  // Social-Abilities
  {
    name: 'persuade',
    attributes: ['concentration', 'intuition'],
    honeLevel: 0,
    category: 'social',
  },
  {
    name: 'intimidate',
    attributes: ['concentration', 'strength'],
    honeLevel: 0,
    category: 'social',
  },
  {
    name: 'deceive',
    attributes: ['dexterity', 'intuition'],
    honeLevel: 0,
    category: 'social',
  },
  {
    name: 'insight',
    attributes: ['intuition', 'experience'],
    honeLevel: 0,
    category: 'social',
  },
  // Senses-Abilities
  {
    name: 'perceive',
    attributes: ['strength', 'endurance'],
    honeLevel: 0,
    category: 'senses',
  },
  {
    name: 'rememberingReflectionResearch',
    attributes: ['intuition', 'experience'],
    honeLevel: 0,
    category: 'senses',
  },
  {
    name: 'magicSense',
    attributes: ['concentration', 'experience'],
    honeLevel: 0,
    category: 'senses',
  },
];

/**
 * Represents a Hero character, extending base Character functionalities.
 * @augments Character
 */
export class Hero extends Character {
  /** @type {number} */
  level = 1;
  /** @type {number} */
  learningPoints = 10;
  /** @type {Array<object>} */
  actions = [];
  /** @type {number} */
  maxManaPoints = 0;
  /** @type {number} */
  currentManaPoints = 0;

  /**
   * Creates an instance of Hero.
   * @param {string} name - The name of the hero.
   * @param {HeroAttributes} [attributes=heroAttributes] - The hero's attribute scores.
   * @param {HeroAbility[]} [abilities=heroAbilities] - The hero's abilities.
   */
  constructor(name, attributes = heroAttributes, abilities = heroAbilities) {
    super(name, attributes, abilities);
  }
}
