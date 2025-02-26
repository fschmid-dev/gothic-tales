import { Hero } from '@/models/Hero.js'

export const heroAttributes = {
  strength: 10,
  dexterity: 20,
  endurance: 30,
  concentration: 40,
  intuition: 50,
  experience: 60,
}

export const heroAbilities = [
  // Body-Abilities
  {
    name: 'Durchhalten',
    attributes: ['strength', 'endurance'],
    honeLevel: 0,
    category: 'body',
  },
  {
    name: 'Springen/Klettern',
    attributes: ['strength', 'dexterity'],
    honeLevel: 0,
    category: 'body',
  },
  {
    name: 'Gewandtheit',
    attributes: ['dexterity', 'experience'],
    honeLevel: 0,
    category: 'body',
  },
  {
    name: 'Heimlichkeit',
    attributes: ['dexterity', 'intuition'],
    honeLevel: 0,
    category: 'body',
  },
  // Social-Abilities
  {
    name: 'Überreden',
    attributes: ['concentration', 'intuition'],
    honeLevel: 0,
    category: 'social',
  },
  {
    name: 'Einschüchtern',
    attributes: ['concentration', 'strength'],
    honeLevel: 0,
    category: 'social',
  },
  {
    name: 'Betrügen',
    attributes: ['dexterity', 'intuition'],
    honeLevel: 0,
    category: 'social',
  },
  {
    name: 'Menschenkenntnis',
    attributes: ['intuition', 'experience'],
    honeLevel: 0,
    category: 'social',
  },
  // Senses-Abilities
  {
    name: 'Wahrnehmen',
    attributes: ['strength', 'endurance'],
    honeLevel: 0,
    category: 'senses',
  },
  {
    name: 'Erinnern/Erwägen/Erforschen',
    attributes: ['intuition', 'experience'],
    honeLevel: 0,
    category: 'senses',
  },
  {
    name: 'Magiegespür',
    attributes: ['concentration', 'experience'],
    honeLevel: 0,
    category: 'senses',
  },
]

export function createHero(name) {
  return new Hero(name, heroAttributes, heroAbilities);
}
