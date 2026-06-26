const UNICODE_FRACTIONS = {
  "⅛": "1/8",
  "¼": "1/4",
  "⅜": "3/8",
  "½": "1/2",
  "⅝": "5/8",
  "⅔": "2/3",
  "¾": "3/4",
  "⅞": "7/8",
  "⅓": "1/3",
};

const COMMON_FRACTIONS = [
  { value: 1 / 8, label: "1/8" },
  { value: 1 / 4, label: "1/4" },
  { value: 1 / 3, label: "1/3" },
  { value: 3 / 8, label: "3/8" },
  { value: 1 / 2, label: "1/2" },
  { value: 5 / 8, label: "5/8" },
  { value: 2 / 3, label: "2/3" },
  { value: 3 / 4, label: "3/4" },
  { value: 7 / 8, label: "7/8" },
];

function parseFraction(value) {
  const [numerator, denominator] = value.split("/").map(Number);

  if (
    !Number.isFinite(numerator) ||
    !Number.isFinite(denominator) ||
    denominator === 0
  ) {
    return null;
  }

  return numerator / denominator;
}

export function normalizeIngredientQuantity(value) {
  if (value === null || value === undefined) {
    return "";
  }

  let normalized = String(value).trim();

  if (!normalized) {
    return "";
  }

  normalized = normalized.replace(
    /(\d+)?([⅛¼⅜½⅝⅔¾⅞⅓])/g,
    (match, wholeNumber, fractionCharacter) => {
      const fraction = UNICODE_FRACTIONS[fractionCharacter];

      if (!fraction) {
        return match;
      }

      return wholeNumber ? `${wholeNumber} ${fraction}` : fraction;
    },
  );

  normalized = normalized
    .replace(/[–—−]/g, "-")
    .replace(/\s*-\s*/g, "-")
    .replace(/\s*\+\s*/g, " + ")
    .replace(/\s+/g, " ")
    .trim();

  return normalized;
}

function parseQuantity(value) {
  const normalized = normalizeIngredientQuantity(value);

  if (!normalized) {
    return null;
  }

  const mixedNumberMatch = normalized.match(/^(\d+)\s+(\d+)\/(\d+)$/);

  if (mixedNumberMatch) {
    const whole = Number(mixedNumberMatch[1]);
    const numerator = Number(mixedNumberMatch[2]);
    const denominator = Number(mixedNumberMatch[3]);

    if (denominator === 0) {
      return null;
    }

    return whole + numerator / denominator;
  }

  if (/^\d+\/\d+$/.test(normalized)) {
    return parseFraction(normalized);
  }

  const parsedNumber = Number(normalized);

  return Number.isFinite(parsedNumber) ? parsedNumber : null;
}

function findCommonFraction(decimalValue) {
  const tolerance = 0.015;

  return COMMON_FRACTIONS.find(
    (fraction) => Math.abs(decimalValue - fraction.value) < tolerance,
  );
}

function formatScaledNumber(value) {
  if (!Number.isFinite(value)) {
    return "";
  }

  const roundedValue = Number(value.toFixed(4));
  const wholeNumber = Math.floor(roundedValue);
  const decimalPart = roundedValue - wholeNumber;

  if (Math.abs(decimalPart) < 0.0001) {
    return String(wholeNumber);
  }

  const commonFraction = findCommonFraction(decimalPart);

  if (commonFraction) {
    return wholeNumber > 0
      ? `${wholeNumber} ${commonFraction.label}`
      : commonFraction.label;
  }

  return String(Number(roundedValue.toFixed(2)));
}

function scaleSingleQuantity(value, scale) {
  const numericQuantity = parseQuantity(value);

  if (numericQuantity === null) {
    return null;
  }

  return formatScaledNumber(numericQuantity * scale);
}

function scaleRange(quantity, scale) {
  const rangeMatch = quantity.match(
    /^(\d+(?:\.\d+)?|\d+\/\d+|\d+\s+\d+\/\d+)-(\d+(?:\.\d+)?|\d+\/\d+|\d+\s+\d+\/\d+)$/,
  );

  if (!rangeMatch) {
    return null;
  }

  const minimum = scaleSingleQuantity(rangeMatch[1], scale);
  const maximum = scaleSingleQuantity(rangeMatch[2], scale);

  if (minimum === null || maximum === null) {
    return null;
  }

  return `${minimum}-${maximum}`;
}

function scaleComplexQuantity(quantity, scale) {
  const numericTokenPattern = /\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?/g;

  let foundScalableValue = false;

  const scaledQuantity = quantity.replace(
    numericTokenPattern,
    (numericToken) => {
      const scaledValue = scaleSingleQuantity(numericToken, scale);

      if (scaledValue === null) {
        return numericToken;
      }

      foundScalableValue = true;
      return scaledValue;
    },
  );

  return foundScalableValue ? scaledQuantity : null;
}

export function isComplexIngredientQuantity(value) {
  const normalized = normalizeIngredientQuantity(value);

  if (!normalized) {
    return false;
  }

  return (
    normalized.includes(" + ") ||
    /\([^)]*\d[^)]*\)/.test(normalized) ||
    /^\d+(?:\.\d+)?-\d+(?:\.\d+)?$/.test(normalized)
  );
}

export function scaleIngredientQuantity(quantity, scale = 1) {
  const normalizedQuantity = normalizeIngredientQuantity(quantity);

  if (!normalizedQuantity) {
    return "";
  }

  const numericScale = Number(scale);

  if (!Number.isFinite(numericScale) || numericScale <= 0) {
    return normalizedQuantity;
  }

  const simpleQuantity = scaleSingleQuantity(normalizedQuantity, numericScale);

  if (simpleQuantity !== null) {
    return simpleQuantity;
  }

  const rangedQuantity = scaleRange(normalizedQuantity, numericScale);

  if (rangedQuantity !== null) {
    return rangedQuantity;
  }

  const complexQuantity = scaleComplexQuantity(
    normalizedQuantity,
    numericScale,
  );

  if (complexQuantity !== null) {
    return complexQuantity;
  }

  return normalizedQuantity;
}
