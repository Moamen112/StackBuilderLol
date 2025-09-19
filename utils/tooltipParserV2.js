/**
 * Removes HTML-like tags from a string.
 * @param {string} text The text to strip tags from.
 * @returns {string} The cleaned text.
 */
const stripHtmlTags = (text) => {
  if (!text) return "";
  return text.replace(/<[^>]*>/g, "");
};

/**
 * Parses a League of Legends ability tooltip, handling complex cases.
 * This version strips HTML, processes standard placeholders (e.g., e1, a1)
 * from ability data, and handles non-standard placeholders (e.g., maxgrit)
 * from a 'vars' array.
 *
 * @param {string} tooltip The tooltip template string.
 * @param {object} ability The ability object containing damageComponents.
 * @param {Array} vars The array of variables for non-standard placeholders.
 * @param {number} level The current level of the ability (1-5).
 * @param {object} stats Champion's stats (e.g., { ap: 0, ad: 0, bonusAd: 0, health: 0 }).
 * @returns {string} The fully parsed and cleaned tooltip.
 */
export const parseTooltipV2 = (
  tooltip,
  ability,
  vars = [],
  level = 1,
  stats = { ap: 0, ad: 0, bonusAd: 0, health: 0 }
) => {
  if (!tooltip) return "";

  let parsedTooltip = stripHtmlTags(tooltip);

  // Regex to find all placeholders, including those with simple math.
  const placeholderRegex = /\{\{\s*([a-zA-Z0-9]+)(?:\s*\*(\d+))?\s*\}\}/g;

  parsedTooltip = parsedTooltip.replace(placeholderRegex, (match, key, multiplier) => {
    const multi = multiplier ? parseInt(multiplier, 10) : 1;

    // --- Handler for Standard Placeholders (e1, a1, etc.) ---
    const standardKeyRegex = /^[a-z](\d)$/;
    if (standardKeyRegex.test(key)) {
      const keyPrefix = key.charAt(0);
      const keyIndex = key.slice(1);

      const component = ability?.damageComponents?.find(
        (c) => c.componentKey === `e${keyIndex}`
      );

      if (!component) return match;

      const safeLevel = Math.max(1, Math.min(level, component.baseValues.length));
      const levelIndex = safeLevel - 1;

      if (keyPrefix === "e") {
        const baseValue = component.baseValues[levelIndex] || 0;
        const apValue = (component.apScaling[levelIndex] || 0) * (stats.ap || 0);
        const adValue = (component.adScaling[levelIndex] || 0) * (stats.ad || 0);
        const bonusAdValue = (component.bonusAdScaling[levelIndex] || 0) * (stats.bonusAd || 0);
        const healthValue = (component.healthScaling[levelIndex] || 0) * (stats.health || 0);
        const totalValue = baseValue + apValue + adValue + bonusAdValue + healthValue;
        return Math.round(totalValue * multi).toString();
      }

      let scaledValue = 0;
      switch (keyPrefix) {
        case "a": case "f":
          scaledValue = (component.apScaling[levelIndex] || 0) * (stats.ap || 0);
          break;
        case "b":
          scaledValue = (component.bonusAdScaling[levelIndex] || 0) * (stats.bonusAd || 0);
          break;
        case "d":
          scaledValue = (component.adScaling[levelIndex] || 0) * (stats.ad || 0);
          break;
        case "h":
          scaledValue = (component.healthScaling[levelIndex] || 0) * (stats.health || 0);
          break;
        default:
          return match;
      }

      if (scaledValue > 0) {
        return `(+${Math.round(scaledValue * multi)})`;
      }
      return "";
    }

    // --- Handler for Non-Standard Placeholders (from vars array) ---
    const varData = vars.find((v) => v.key === key);
    if (varData && varData.coeff) {
      // Use the coefficient for the current level, or the first one if it doesn't scale.
      const coeff = varData.coeff[level - 1] ?? varData.coeff[0];
      if (coeff !== undefined) {
        return Math.round(coeff * multi).toString();
      }
    }

    // Fallback for placeholders we can't resolve (like 'damagecalc')
    return match;
  });

  return parsedTooltip;
};
