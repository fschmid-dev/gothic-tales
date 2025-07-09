import i18n from '@/plugins/i18n.js';

import Toastify from 'toastify-js';
import DiceRollToastContent from '@/components/DiceRollToastContent.vue';

// Import existing utilities
import {renderVueComponentToHTML} from '@/utils/vueRender.js';
import {rollCheck, rollDice, rollPool} from '@/utils/diceRoller.js';
import {attributeColors} from '@/utils/attributeColors.js';
import {calculateDiceAndBonus} from '@/utils/diceCalculator';
import {ABILITY_HONE_LEVELS_MAP} from '@/utils/abilityHoneLevels.js';

const {t} = i18n.global;

/**
 * Shows a Toastify notification with cutom HTML content.
 * This function is now internal and called by the public create...Toast functions.
 *
 * @param {string} html     The HTML stringcontent for the toast.
 * @param {object} options  Toastify configuration options.
 * @param {object} style    Custom CSS style for the toast element.
 */
function _showToast(html, options = {}, style = {}) {
    const defaultConfig = {
        text: html,
        close: true,
        html: true,
        escapeMarkup: false,
        className: 'rounded',
        duration: -1,
    };

    const defaultStyle = {
        background: 'var(--bs-body-bg)',
        color: 'var(--bs-body-color)',
        border: '2px solid var(--bs-body-color)',
    };

    const config = {
        ...defaultConfig,
        ...options,
        style: {
            ...defaultStyle,
            ...style,
        },
    };

    const toast = Toastify(config).showToast();

    const toastElement = toast.toastElement;
    toastElement.addEventListener('click', () => {
        const toastClose = toastElement.querySelector('.toast-close');
        if (toastClose) {
            toastClose.click();
        }
    });
}

/**
 * Creates and displays a toast for an Attribute Check.
 * @param {object} attribute The attribute object (must contain .pool, .name).
 * @param {object} modifierOptions
 */
export function createAttributeCheck(attribute, modifierOptions) {
    const result = rollCheck(attribute.pool, modifierOptions);

    const header = `<b>${t('attribute.' + attribute.name)}</b>`;
    const sections = [
        {
            parts: result.parts,
        },
    ];
    const attributeColor = attributeColors[attribute.name];

    const html = renderVueComponentToHTML(DiceRollToastContent, {
        header,
        headerColor: attributeColor,
        sections,
        sum: result.sum,
    });

    _showToast(html, {}, {borderColor: attributeColor});
}

/**
 * Creates and displays a toast for an Ability Check.
 * @param {object} ability The ability object (must contain .pool, .name, .honeLevel, .attributes).
 * @param {object} modifierOptions
 */
export function createAbilityCheck(ability, modifierOptions) {
    const result = rollCheck(ability.pool, modifierOptions);

    let headerContent = `<b>${t(`abilities.${ability.name}`)}</b>`;
    if (ability.honeLevel) {
        const honeLevelDetails = ABILITY_HONE_LEVELS_MAP.get(ability.honeLevel);
        if (honeLevelDetails) {
            headerContent = `<span>${headerContent} (${t(
                honeLevelDetails.i18nKey
            )})</span>`;
        }
    }

    const sections = [
        {
            parts: result.parts,
        },
    ];

    const html = renderVueComponentToHTML(DiceRollToastContent, {
        header: headerContent,
        sections,
        sum: result.sum,
    });

    const colorA = attributeColors[ability.attributes[0]];
    const colorB = attributeColors[ability.attributes[1]];

    _showToast(
        html,
        {},
        {
            borderTopColor: colorA,
            borderLeftColor: colorA,
            borderRightColor: colorB,
            borderBottomColor: colorB,
        }
    );
}

/**
 * Creates and displays a toast for an Action (e.g., Attack, Damage).
 * @param {object} action The action object (e.g., { name: '...', damage: [], attribute: '...' }).
 * @param {number} attributeValue
 * @param {object} modifierOptions
 */
export function createAction(action, attributeValue, modifierOptions) {
    const attributeDiceAndBonus = calculateDiceAndBonus(attributeValue);

    let d20Results = [];
    let d20Roll;
    let selectedD20Index = -1;

    if (modifierOptions.attackRollType === 'followUp') {
        d20Results = [rollDice(20), rollDice(20)];
        d20Roll = Math.min(...d20Results);
        selectedD20Index = d20Results.indexOf(d20Roll);
    } else {
        d20Results = [rollDice(20)];
        d20Roll = d20Results[0];
        selectedD20Index = 0;
    }

    // --- Attribute Check Roll (including numerical modifiers: small/medium/large advantage/disadvantage) ---
    let attributeDicePool = attributeDiceAndBonus.pool.slice();
    if (modifierOptions.rollType !== 'normal' && modifierOptions.modifierValue !== 0) {
        attributeDicePool.push({
            type: modifierOptions.rollType,
            value: modifierOptions.modifierValue
        })
    }

    const attributeCheckResult = rollPool(attributeDicePool);

    // --- Calculate To-Hit Sum ---
    const toHitSum = d20Roll + attributeCheckResult.sum;

    // --- Calculate Damage Sum ---
    const damageRollResult = rollPool(action.damage);

    let damageSum;
    if (action.includeAttributeDiceToDamage) {
        // Add attribute check's sum to damage roll (common for weapons)
        damageSum = attributeCheckResult.sum + damageRollResult.sum;
    } else {
        // Damage is calculated only by action.damage (e.g., crossbow, spells)
        damageSum = damageRollResult.sum;
    }

    const header = `<b>${action.name}</b>`;

    // --- To-Hit Section Parts for UI ---
    let toHitParts = [];
    if (d20Results.length > 1) {
        toHitParts.push({
            // Use a custom type for UI to render two d20s and highlight the selected one
            item: { type: 'd20special', rolls: d20Results, selected: selectedD20Index },
            label: 'attackType.followUp',
            rolls: d20Results, // Store all rolls
            sum: d20Roll // Store the selected sum
        });
    } else { // Single d20 roll
        toHitParts.push({
            item: { type: 'dice', count: 1, sides: 20 },
            rolls: [d20Roll],
            sum: d20Roll
        });
    }
    toHitParts.push(...attributeCheckResult.parts); // Add attribute check parts (including any numerical modifiers)

    const toHitSection = {
        title: t('attackRoll'),
        parts: toHitParts,
        sum: toHitSum,
    };


    // --- Damage Section Parts for UI ---
    let damageParts;
    if (action.includeAttributeDiceToDamage) {
        damageParts = [
            ...attributeCheckResult.parts, // Attribute parts are often reused for damage
            ...damageRollResult.parts,     // The action's damage dice/bonus
        ];
    } else {
        damageParts = [
            ...damageRollResult.parts, // Only the action's damage dice/bonus
        ];
    }

    const damageSection = {
        title: t('damageRoll'),
        parts: damageParts,
        sum: damageSum,
    };

    const sections = [toHitSection, damageSection];

    const html = renderVueComponentToHTML(DiceRollToastContent, {
        header,
        sections,
    });

    _showToast(
        html,
        {},
        {
            borderColor: attributeColors[action.attribute], // Assuming action.attribute links to a color
        }
    );
}
