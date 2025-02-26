import { Character } from '@/models/Character.js'
import { heroAbilities, heroAttributes } from '@/utils/HeroFactory.js'

export class Hero extends Character {
  level = 1
  learningPoints = 10

  constructor(name, attributes = heroAttributes, abilities = heroAbilities) {
    super(name, attributes, abilities)
  }
}
