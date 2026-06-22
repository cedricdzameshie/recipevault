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

function parseQuantity(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const normalized = String(value).trim();

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

function formatDecimal(value) {
  if (Number.isInteger(value)) {
    return String(value);
  }

  return String(Number(value.toFixed(2)));
}

export function scaleIngredientQuantity(quantity, scale = 1) {
  const numericQuantity = parseQuantity(quantity);

  if (numericQuantity === null) {
    return quantity || "";
  }

  const numericScale = Number(scale);

  if (!Number.isFinite(numericScale) || numericScale <= 0) {
    return quantity || "";
  }

  return formatDecimal(numericQuantity * numericScale);
}
