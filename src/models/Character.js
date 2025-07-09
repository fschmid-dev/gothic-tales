import { generateId } from '@/utils/generateId.js';

export class Character {
  id;
  name;
  attributes = {
    strength: 1,
    dexterity: 1,
    endurance: 1,
    concentration: 1,
    intuition: 1,
    experience: 1,
  };
  abilities = [];
  maxHitPoints = 0;
  currentHitPoints = 0;

  constructor(name, attributes = null, abilities = null) {
    this.id = generateId();
    this.name = name;

    if (attributes) {
      this.attributes = attributes;
    }
    if (abilities) {
      this.abilities = abilities;
    }
  }
}
