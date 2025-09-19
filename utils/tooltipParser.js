/**
 * Parses a League of Legends ability tooltip template and replaces placeholders
 * with calculated values based on skill level and champion stats.
 *
 * @param {string} tooltip The tooltip template string (e.g., "Deals {{ e1 }} magic damage.").
 * @param {object} ability The ability object containing damage components and scaling info.
 * @param {number} level The current level of the ability (1-5).
 * @param {object} stats The champion's current stats (e.g., { ap: 0, ad: 0, bonusAd: 0, health: 0 }).
 * @returns {string} The parsed tooltip with calculated values.
 */
export const parseTooltip = (
  tooltip,
  ability,
  level = 1,
  stats = { ap: 0, ad: 0, bonusAd: 0, health: 0 }
) => {
  if (!tooltip || !ability || !ability.damageComponents) {
    return tooltip || "";
  }

  // Regex to find all placeholders like {{ e1 }}, {{ a1 }}, {{ f1 }}, etc.
  const placeholderRegex = /\{\{\s*([a-z]\d)\s*\}\}/g;

  return tooltip.replace(placeholderRegex, (match, key) => {
    const keyPrefix = key.charAt(0);
    const keyIndex = key.slice(1);

    // All scaling placeholders (a, b, d, f, h) refer to a main effect component (e).
    const component = ability.damageComponents.find(
      (c) => c.componentKey === `e${keyIndex}`
    );

    if (!component) {
      return match; // Return the original placeholder if no data is found
    }

    // Ensure level is within the bounds of the arrays
    const safeLevel = Math.max(1, Math.min(level, component.baseValues.length));
    const levelIndex = safeLevel - 1;

    // Handle 'e' placeholders (total calculated effect value)
    if (keyPrefix === "e") {
      const baseValue = component.baseValues[levelIndex] || 0;
      const apValue = (component.apScaling[levelIndex] || 0) * (stats.ap || 0);
      const adValue = (component.adScaling[levelIndex] || 0) * (stats.ad || 0);
      const bonusAdValue =
        (component.bonusAdScaling[levelIndex] || 0) * (stats.bonusAd || 0);
      const healthValue =
        (component.healthScaling[levelIndex] || 0) * (stats.health || 0);

      const totalValue =
        baseValue + apValue + adValue + bonusAdValue + healthValue;
      return Math.round(totalValue).toString();
    }

    let scaledValue = 0;

    // Handle scaling placeholders
    switch (keyPrefix) {
      case "a":
      case "f": // 'f' is often used for AP scaling as well
        scaledValue = (component.apScaling[levelIndex] || 0) * (stats.ap || 0);
        break;
      case "b":
        scaledValue =
          (component.bonusAdScaling[levelIndex] || 0) * (stats.bonusAd || 0);
        break;
      case "d":
        scaledValue = (component.adScaling[levelIndex] || 0) * (stats.ad || 0);
        break;
      case "h":
        scaledValue =
          (component.healthScaling[levelIndex] || 0) * (stats.health || 0);
        break;
      default:
        return match; // Unhandled placeholder type
    }

    // Format the scaled value part, e.g., "(+50)"
    if (scaledValue > 0) {
      return `(+${Math.round(scaledValue)})`;
    }

    // If there's no bonus damage from this stat, don't show anything.
    return "";
  });
};
