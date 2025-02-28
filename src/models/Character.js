export class Character {
  id
  name
  attributes = {
    strength: 1,
    dexterity: 1,
    endurance: 1,
    concentration: 1,
    intuition: 1,
    experience: 1,
  }
  abilities = []

  constructor(name, attributes = null, abilities = null) {
    this.id = Math.random().toString(36).substring(2, 15)
    this.name = name

    if (attributes) {
      this.attributes = attributes
    }
    if (abilities) {
      this.abilities = abilities
    }
  }
}
