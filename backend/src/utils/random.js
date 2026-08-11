const crypto = require('crypto');

/** Cryptographically secure integer in [0, max) — never Math.random() for draws. */
function secureRandomInt(max) {
  if (max <= 0) throw new Error('max must be > 0');
  const bitsNeeded = Math.ceil(Math.log2(max));
  const bytesNeeded = Math.ceil(bitsNeeded / 8) || 1;
  const maxValue = Math.pow(256, bytesNeeded);
  const cutoff = maxValue - (maxValue % max);

  let value;
  do {
    const buf = crypto.randomBytes(bytesNeeded);
    value = buf.reduce((acc, b) => (acc << 8) + b, 0);
  } while (value >= cutoff);

  return value % max;
}

/** Fisher-Yates shuffle using the secure RNG above. Returns a NEW array. */
function secureShuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Auditable seed stored alongside each completed draw. */
function generateSeed() {
  return crypto.randomBytes(32).toString('hex');
}

function formatTicketNumber(id) {
  return `#${String(id).padStart(6, '0')}`;
}

module.exports = { secureRandomInt, secureShuffle, generateSeed, formatTicketNumber };
