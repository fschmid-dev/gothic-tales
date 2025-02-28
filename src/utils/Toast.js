import { rollCheck } from '@/utils/DiceRoller.js'
import { attributeColors } from '@/utils/attributeColors.js'
import { i18n } from '@/i18n.js'
import Toastify from 'toastify-js'

const { t } = i18n.global

export function createAttributeCheckToast(attribute) {
  const result = rollCheck(attribute.pool)

  const header = `<b style="color: ${attributeColors[attribute.name]}">${t('attribute.' + attribute.name)}</b>`
  const partsHtml = result.parts
    .map((part) => {
      let dice = ''
      let rolls = ''

      switch (part.item.type) {
        case 'dice':
          dice = `<i>${part.item.count > 1 ? part.item.count : ''}${t('diceShort')}${part.item.sides}</i>`
          rolls = part.rolls.map((roll) => `<span>${roll}</span>`).join('+')

          return `<div class="d-flex flex-column align-items-center"><span>${dice}</span><span>${rolls}</span></div>`
        case 'bonus':
          return `<div class="d-flex flex-column align-items-center"><i>${part.sum}</i><span>${part.sum}</span></div>`
      }
    })
    .join('<span>+</span>')
  const sum = `<b>${t('sum', { sum: result.sum })}</b>`

  const html = `
  <div class="d-flex flex-column">
    ${header}
    <div class="d-flex flex-row align-items-center gap-2">
      ${partsHtml}
    </div>
    ${sum}
  </div>`

  showToast(
    html,
    {},
    {
      borderColor: attributeColors[attribute.name],
    },
  )
}

export function createAbilityCheckToast(ability) {
  const result = rollCheck(ability.pool)

  let header = `<b>${t(`abilities.${ability.name}`)}</b>`
  if (ability.honeLevel) {
    header = `<span>${header} (${t('honeLevel.' + ability.honeLevel)})</span>`
  }
  const partsHtml = result.parts
    .map((part) => {
      let dice = ''
      let rolls = ''

      switch (part.item.type) {
        case 'dice':
          dice = `<i>${part.item.count > 1 ? part.item.count : ''}${t('diceShort')}${part.item.sides}</i>`
          rolls = part.rolls.map((roll) => `<span>${roll}</span>`).join('+')

          return `<div class="d-flex flex-column align-items-center"><span>${dice}</span><span>${rolls}</span></div>`
        case 'bonus':
          return `<div class="d-flex flex-column align-items-center"><i>${part.sum}</i><span>${part.sum}</span></div>`
      }
    })
    .join('<span>+</span>')
  const sum = `<b>${t('sum', { sum: result.sum })}</b>`

  const html = `
  <div class="d-flex flex-column">
    ${header}
    <div class="d-flex flex-row align-items-center gap-2">
      ${partsHtml}
    </div>
    ${sum}
  </div>`

  const colorA = attributeColors[ability.attributes[0]]
  const colorB = attributeColors[ability.attributes[1]]

  showToast(
    html,
    {},
    {
      borderTopColor: colorA,
      borderLeftColor: colorA,
      borderRightColor: colorB,
      borderBottomColor: colorB,
    },
  )
}

export function createActionToast(action) {
  console.warn(action)
}

export function showToast(html, options = {}, style = {}) {
  const defaultConfig = {
    text: html,
    close: true,
    html: true,
    escapeMarkup: false,
    className: 'rounded',
    duration: -1,
  }

  const defaultStyle = {
    background: 'var(--bs-body-bg)',
    color: 'var(--bs-body-color)',
    border: '2px solid var(--bs-body-color)',
  }

  const config = {
    ...defaultConfig,
    ...options,
    style: {
      ...defaultStyle,
      ...style,
    },
  }

  const toast = Toastify(config).showToast()

  const toastElement = toast.toastElement
  toastElement.addEventListener('click', () => {
    const toastClose = toastElement.querySelector('.toast-close')
    if (toastClose) {
      toastClose.click()
    }
  })
}
