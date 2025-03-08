export function rollPool(pool) {
  if (!Array.isArray(pool) || pool.length === 0) {
    return
  }

  const result = {
    pool: pool,
    parts: [],
    sum: 0
  };

  for (let i = 0; i < pool.length; i++) {
    const item = pool[i]

    const part = {
      item: item,
    };
    switch (item.type) {
      case 'dice':
        let partSum = 0
        part.rolls = [];

        for (let j = 0; j < item.count; j++) {
          const roll = rollDice(item.sides)
          partSum += roll
          part.rolls.push(roll)
        }

        part.sum = partSum

        break;
      case 'bonus':
        part.sum = item.bonus;
        break;
    }

    result.sum += part.sum
    result.parts.push(part)
  }

  return result
}

export function rollCheck(pool) {
  const checkPool = pool.slice()
  checkPool.unshift({ type: 'dice', count: 1, sides: 20 })
  return rollPool(checkPool)
}

export function rollDice(sides) {
  return 1 + Math.floor(Math.random() * sides)
}
