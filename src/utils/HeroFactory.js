import { Hero } from '@/models/Hero.js'

export const heroAttributes = {
  strength: 10,
  dexterity: 10,
  endurance: 10,
  concentration: 10,
  intuition: 10,
  experience: 10,
}

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
    name: 'jumping/climbing',
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
    name: 'remembering/reflection/research',
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
]

export function createHero(name) {
  return new Hero(name, heroAttributes, heroAbilities);
}
