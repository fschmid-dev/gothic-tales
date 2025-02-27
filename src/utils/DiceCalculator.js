import { i18n } from '@/i18n.js'

const { t } = i18n.global

export function calculateDiceAndBonus(value) {
  const dice = calculateDice(value)
  const bonus = calculateBonus(value)

  const pool = []
  let notation = ''

  for (const diceSides of Object.keys(dice)) {
    const count = dice[diceSides]
    pool.push({
      type: 'dice',
      sides: diceSides,
      count: count,
    })

    if (notation) {
      notation += '+'
    }
    notation += `${count}${t('diceShort')}${diceSides}`
  }
  if (bonus > 0) {
    pool.push({
      type: 'bonus',
      bonus: bonus
    })

    if (notation) {
      notation += '+'
    }
    notation += `${bonus}`
  }

  return {
    dice: dice,
    bonus: bonus,
    pool: pool,
    notation: notation,
  }
}

export function calculateDice(value) {
  const dice = {}
  const pool = [2] // Create initial lowest dice pool, a single D2
  const buffer = [] // Helper variable to store pool
  let remaining = value // Helper variable to calculate remaining steps

  // Calculating the dices, increases for every step of 10
  //  As long as the helper variable is bigger than 10, a dice need to be improved
  while (remaining >= 10) {
    let biggest = 0
    pool.sort(function (a, b) {
      return a - b
    }) // Increase pool ascending
    while (pool.length > 0) {
      biggest = pool.pop() // get the last/biggest dice
      if (biggest < 12) {
        // If the dice can be improved (less than d12), break the loop
        break
      }
      // save other dice
      buffer.push(biggest)
    }

    // Improve the dice
    if (biggest < 12) {
      // If the biggest is less than d12, increase the dice
      pool.push(biggest + 2)
    } else {
      // If the biggest dice is already a d12
      //  remove it from the pool
      buffer.pop()
      //  and split it into two d6 dices
      pool.push(6, 6)
    }

    // Add saved dices back to pool
    while (buffer.length > 0) {
      pool.push(buffer.pop())
    }

    // Reduce remaining points by 10
    remaining -= 10
  }

  // Sort dices descending as it's nicer to read in sheet
  pool.sort(function (a, b) {
    return b - a
  })

  // merge dies with same side together
  pool.forEach((die) => {
    if (!dice[die]) {
      dice[die] = 0
    }
    dice[die]++
  })

  return dice
}

// Made by @Lester on Gothic-Tales Discord
//  https://discord.com/channels/825005406782881843/1065648562978955375/1296197209825480837
export function calculateBonus(value) {
  // Starting at 15, the bonus increases by one everytime a singles 5 digit is reached
  //  15 => +1, 25 => +2, 35 => +3, etc.
  return Math.max(Math.floor((value - 5) / 10), 0)
}
