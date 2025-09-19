/**
 * Enhanced League of Legends Tooltip Parser
 *
 * This function parses champion ability tooltips and replaces placeholders with calculated values.
 * It's designed to be easily extensible for new champions.
 *
 * ADDING NEW CHAMPIONS:
 * 1. Add champion-specific placeholder handling in the "CHAMPION-SPECIFIC CASES" section
 * 2. Update the stripHtmlTags function if new HTML tags are introduced
 * 3. Add new vars to your database seed files
 * 4. Test with the champion's actual tooltip templates
 *
 * ADDING ICONS:
 * Icons are added in stripHtmlTags function by mapping HTML tags to emoji/Unicode symbols:
 * - <magicDamage> → ⚡ (magic damage icon)
 * - <shield> → 🛡️ (shield icon)
 * - <speed> → 💨 (movement speed icon)
 * - Add more mappings as needed for new damage/effect types
 */

/**
 * Removes HTML-like tags from a string and replaces them with visual icons
 *
 * HOW TO ADD NEW ICONS:
 * 1. Find the HTML tag in champion tooltips (e.g., <newDamageType>)
 * 2. Add a replace line: .replace(/<newDamageType>/g, '🔥') // Fire icon
 * 3. Add closing tag: .replace(/<\/newDamageType>/g, '🔥')
 * 4. Icons can be: Emoji, Unicode symbols, or text markers for later React Native processing
 *
 * ICON GUIDE:
 * ⚡ - Magic Damage (blue in UI)
 * 🛡️ - Shield (green in UI)
 * 💨 - Movement Speed (cyan in UI)
 * ⚔️ - Attack Speed (amber in UI)
 * 🔮 - AP Scaling (purple in UI)
 * 🌟 - Passive abilities (yellow in UI)
 * 📜 - Spell names (orange in UI)
 * 🔄 - Recast abilities (gray in UI)
 *
 * ADD MORE ICONS HERE:
 * 🔥 - Physical/True Damage
 * ❄️ - Slow effects
 * ⭐ - Critical strikes
 * 💀 - Execute damage
 * 🩸 - Health costs
 * ⚡ - Energy costs
 * 🔵 - Mana costs
 */
const stripHtmlTags = (text) => {
  if (!text) return "";

  // Step 1: Decode HTML entities (handles escaped characters from backend)
  let decoded = text
    .replace(/\\u003C/g, "<")
    .replace(/\\u003E/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Step 2: Replace HTML tags with visual icons (mapped to colors in React Native)
  decoded = decoded
    .replace(/<magicDamage>/g, "⚡") // Magic damage - Blue
    .replace(/<\/magicDamage>/g, "⚡")
    .replace(/<shield>/g, "🛡️") // Shield - Green
    .replace(/<\/shield>/g, "🛡️")
    .replace(/<speed>/g, "💨") // Movement speed - Cyan
    .replace(/<\/speed>/g, "💨")
    .replace(/<attackSpeed>/g, "⚔️") // Attack speed - Amber
    .replace(/<\/attackSpeed>/g, "⚔️")
    .replace(/<scaleAP>/g, "🔮") // AP scaling - Purple
    .replace(/<\/scaleAP>/g, "🔮")
    .replace(/<spellPassive>/g, "🌟") // Passive - Yellow
    .replace(/<\/spellPassive>/g, "🌟")
    .replace(/<spellName>/g, "📜") // Spell names - Orange
    .replace(/<\/spellName>/g, "📜")
    .replace(/<recast>/g, "🔄") // Recast - Gray
    .replace(/<\/recast>/g, "🔄")

    // ADD NEW ICON MAPPINGS HERE:
    // .replace(/<physicalDamage>/g, '🔥')     // Physical damage - Red
    // .replace(/<\/physicalDamage>/g, '🔥')
    // .replace(/<trueDamage>/g, '⚪')         // True damage - White
    // .replace(/<\/trueDamage>/g, '⚪')
    // .replace(/<heal>/g, '💚')               // Healing - Light green
    // .replace(/<\/heal>/g, '💚')
    // .replace(/<slow>/g, '❄️')               // Slow effects - Light blue
    // .replace(/<\/slow>/g, '❄️')

    // Step 3: Handle line breaks
    .replace(/<br \/>/g, "\n")
    .replace(/<br\/>/g, "\n")
    .replace(/<br>/g, "\n")

    // Step 4: Remove any remaining HTML tags
    .replace(/<[^>]*>/g, "");

  return decoded;
};

/**
 * Enhanced parseTooltip function with extensive champion support
 *
 * @param {string} tooltip The tooltip template string from database
 * @param {object} ability The ability object containing damageComponents
 * @param {Array} vars The array of variables for placeholders (from database)
 * @param {number} level The current level of the ability (1-5 for basic, 1-3 for ultimate)
 * @param {object} stats Champion's calculated stats { ap, ad, bonusAd, health, armor, mr, etc. }
 * @returns {string} The fully parsed and formatted tooltip
 *
 * USAGE EXAMPLE:
 * const parsedTooltip = parseTooltip(
 *   ability.tooltipTemplate,
 *   ability,
 *   ability.vars || [],
 *   skillLevel,
 *   {
 *     ap: calculateTotalAP(items, runes),
 *     ad: stats.attackdamage,
 *     bonusAd: stats.attackdamage - baseAttackDamage,
 *     health: stats.hp,
 *     armor: stats.armor,
 *     magicResist: stats.spellblock
 *   }
 * );
 */
export const parseTooltip = (
  tooltip,
  ability,
  vars = [],
  level = 1,
  stats = { ap: 0, ad: 0, bonusAd: 0, health: 0 }
) => {
  if (!tooltip) return "";

  let parsedTooltip = stripHtmlTags(tooltip);

  // Enhanced regex that handles mathematical operations and decimal numbers
  const placeholderRegex =
    /\{\{\s*([a-zA-Z0-9_]+)(?:\s*([\*\+\-\/])\s*(\d+(?:\.\d+)?))?\s*\}\}/g;

  parsedTooltip = parsedTooltip.replace(
    placeholderRegex,
    (match, key, operator, operand) => {
      // SYSTEM PLACEHOLDERS (remove these)
      if (key === "spellmodifierdescriptionappend") {
        return ""; // Always remove this Riot system placeholder
      }

      let baseValue = null;
      let foundValue = false;

      // =====================================
      // PRIORITY 1: VARS ARRAY (DATABASE)
      // =====================================
      // This should be your primary source of truth
      // Always check vars array first as it contains pre-calculated values
      const varData = vars.find((v) => v.key === key);
      if (varData && varData.coeff !== undefined) {
        const coeff = Array.isArray(varData.coeff)
          ? (varData.coeff[level - 1] ?? varData.coeff[0] ?? 0)
          : varData.coeff;
        baseValue = coeff;
        foundValue = true;
      }

      // =====================================
      // PRIORITY 2: DAMAGE COMPONENT CALCULATIONS
      // =====================================
      // For damage values that need real-time calculation with stats
      if (!foundValue) {
        // Common damage placeholders that calculate from components
        const damageKeys = [
          "totaldamage",
          "initialburstdamage",
          "tibbersdamage",
          "damage1",
          "damage2",
          "damage3", // Add more as needed
        ];

        if (damageKeys.includes(key)) {
          const component = ability?.damageComponents?.find(
            (c) => c.componentKey === "e1" // Most damage uses e1
          );

          if (component) {
            const levelIndex =
              Math.max(1, Math.min(level, component.baseValues.length)) - 1;
            const baseValue = component.baseValues[levelIndex] || 0;
            const apValue =
              (component.apScaling[levelIndex] || 0) * (stats.ap || 0);
            const adValue =
              (component.adScaling[levelIndex] || 0) * (stats.ad || 0);
            const bonusAdValue =
              (component.bonusAdScaling[levelIndex] || 0) *
              (stats.bonusAd || 0);
            const healthValue =
              (component.healthScaling[levelIndex] || 0) * (stats.health || 0);

            baseValue =
              baseValue + apValue + adValue + bonusAdValue + healthValue;
            foundValue = true;
          }
        }
      }

      // =====================================
      // PRIORITY 3: SHIELD CALCULATIONS
      // =====================================
      if (
        !foundValue &&
        (key === "shieldblocktotal" || key === "shieldvalue")
      ) {
        const component = ability?.damageComponents?.find(
          (c) => c.componentKey === "e1" && c.valueType === "Shield"
        );
        if (component) {
          const levelIndex =
            Math.max(1, Math.min(level, component.baseValues.length)) - 1;
          const baseShield = component.baseValues[levelIndex] || 0;
          const apBonus =
            (component.apScaling[levelIndex] || 0) * (stats.ap || 0);
          baseValue = baseShield + apBonus;
          foundValue = true;
        }
      }

      // =====================================
      // PRIORITY 4: SECONDARY DAMAGE (e2, e3, etc.)
      // =====================================
      if (
        !foundValue &&
        (key === "damagereturn" || key === "secondarydamage")
      ) {
        const component = ability?.damageComponents?.find(
          (c) => c.componentKey === "e2" && c.valueType === "Damage"
        );
        if (component) {
          const levelIndex =
            Math.max(1, Math.min(level, component.baseValues.length)) - 1;
          const baseDamage = component.baseValues[levelIndex] || 0;
          const apBonus =
            (component.apScaling[levelIndex] || 0) * (stats.ap || 0);
          baseValue = baseDamage + apBonus;
          foundValue = true;
        }
      }

      // =====================================
      // PRIORITY 5: STANDARD PLACEHOLDERS (e1, a1, f1, etc.)
      // =====================================
      const standardKeyRegex = /^[a-z](\d+)$/;
      if (!foundValue && standardKeyRegex.test(key)) {
        const keyPrefix = key.charAt(0);
        const keyIndex = key.slice(1);

        const component = ability?.damageComponents?.find(
          (c) => c.componentKey === `e${keyIndex}`
        );

        if (component) {
          const levelIndex =
            Math.max(1, Math.min(level, component.baseValues.length)) - 1;

          if (keyPrefix === "e") {
            // Total value calculation
            const base = component.baseValues[levelIndex] || 0;
            const ap = (component.apScaling[levelIndex] || 0) * (stats.ap || 0);
            const ad = (component.adScaling[levelIndex] || 0) * (stats.ad || 0);
            const bonusAd =
              (component.bonusAdScaling[levelIndex] || 0) *
              (stats.bonusAd || 0);
            const health =
              (component.healthScaling[levelIndex] || 0) * (stats.health || 0);
            baseValue = base + ap + ad + bonusAd + health;
            foundValue = true;
          } else {
            // Scaling-only calculations (for showing bonus values)
            let scalingValue = 0;
            switch (keyPrefix) {
              case "a":
              case "f": // AP scaling
                scalingValue =
                  (component.apScaling[levelIndex] || 0) * (stats.ap || 0);
                break;
              case "b": // Bonus AD scaling
                scalingValue =
                  (component.bonusAdScaling[levelIndex] || 0) *
                  (stats.bonusAd || 0);
                break;
              case "d": // Total AD scaling
                scalingValue =
                  (component.adScaling[levelIndex] || 0) * (stats.ad || 0);
                break;
              case "h": // Health scaling
                scalingValue =
                  (component.healthScaling[levelIndex] || 0) *
                  (stats.health || 0);
                break;
              // ADD MORE SCALING TYPES:
              // case "r": // Magic resist scaling
              //   scalingValue = (component.mrScaling[levelIndex] || 0) * (stats.magicResist || 0);
              //   break;
            }

            if (scalingValue > 0) {
              return `(+${Math.round(scalingValue)})`; // Show as bonus value
            }
            return ""; // Hide if no scaling
          }
        }
      }

      // =====================================
      // MATHEMATICAL OPERATIONS
      // =====================================
      // Handle operations like {{ rpercentpenbuff*100 }}
      if (foundValue && operator && operand) {
        const operandValue = parseFloat(operand);
        switch (operator) {
          case "*":
            baseValue *= operandValue;
            break;
          case "+":
            baseValue += operandValue;
            break;
          case "-":
            baseValue -= operandValue;
            break;
          case "/":
            baseValue /= operandValue;
            break;
        }
      }

      // =====================================
      // CHAMPION-SPECIFIC CASES
      // =====================================
      // Add special handling for unique champions here

      /*
      // EXAMPLE: YASUO WIND WALL
      if (!foundValue && key === "windwallwidth") {
        // Custom calculation for Yasuo's Wind Wall width
        baseValue = 300 + (level * 50); // Example: grows with level
        foundValue = true;
      }
      
      // EXAMPLE: AZIR SOLDIERS
      if (!foundValue && key === "soldierdamage") {
        // Calculate Azir soldier damage
        const soldierComponent = ability?.damageComponents?.find(c => c.componentKey === "soldier");
        if (soldierComponent) {
          const levelIndex = level - 1;
          baseValue = soldierComponent.baseValues[levelIndex] + 
                      (soldierComponent.apScaling[levelIndex] * stats.ap);
          foundValue = true;
        }
      }
      
      // EXAMPLE: CHAMPION WITH UNIQUE SCALING
      if (!foundValue && key === "uniquescaling") {
        // Some champions scale off unusual stats
        baseValue = (stats.armor || 0) * 0.1; // Example: scales with armor
        foundValue = true;
      }
      */

      // ADD YOUR CHAMPION-SPECIFIC CASES HERE:
      // Follow the pattern above for champions with unique mechanics

      // =====================================
      // RETURN FORMATTED VALUE
      // =====================================
      if (foundValue && baseValue !== null) {
        const formattedValue = Math.round(baseValue);

        // Special formatting based on key patterns
        if (key.includes("percent") || key.includes("Percent")) {
          return `${formattedValue}%`;
        }

        if (
          key.includes("duration") ||
          key.includes("lifetime") ||
          key.includes("time")
        ) {
          return `${formattedValue}s`;
        }

        if (
          key.includes("range") ||
          key.includes("distance") ||
          key.includes("radius")
        ) {
          return formattedValue.toString();
        }

        return formattedValue.toString();
      }

      // =====================================
      // FALLBACK
      // =====================================
      console.warn(`⚠️ Unhandled placeholder: ${match} (key: ${key})`);
      console.warn(
        `💡 Add to vars array in database or handle in champion-specific section`
      );
      return match; // Return original placeholder if not handled
    }
  );

  // Clean up the final string
  parsedTooltip = parsedTooltip
    .replace(/\n\s*\n/g, "\n\n") // Normalize double line breaks
    .replace(/\s+/g, " ") // Normalize spaces
    .replace(/\n /g, "\n") // Remove spaces after line breaks
    .trim();

  return parsedTooltip;
};

/*
DEBUGGING GUIDE:
1. Check console for "Unhandled placeholder" warnings
2. Add missing vars to database seed
3. For new champions, add special cases in CHAMPION-SPECIFIC section
4. Test with different stat values to ensure scaling works
5. Verify tooltip templates match expected placeholder names

PERFORMANCE NOTES:
- Vars array lookup is O(n) - consider Map for 100+ vars per ability
- Regex operations are cached by JavaScript engine
- Function handles malformed input gracefully
*/
