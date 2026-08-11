function normalizeDateInput(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(trimmed)) {
      return trimmed.replace('T', ' ');
    }
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(trimmed)) {
      return trimmed.replace('T', ' ').slice(0, 19);
    }
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(trimmed)) {
      return trimmed;
    }
    return trimmed;
  }
  return null;
}

function parseEthiopianDate(value) {
  const normalized = normalizeDateInput(value);
  if (!normalized) return null;

  const text = String(normalized).replace('Z', '');
  const [datePart, timePart = '00:00:00'] = text.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour = 0, minute = 0, second = 0] = timePart.split(':').map(Number);

  return Date.UTC(year, month - 1, day, hour, minute, second) - 3 * 60 * 60 * 1000;
}

function toDbDateTime(value) {
  const parsed = normalizeDateInput(value);
  if (!parsed) return null;
  if (parsed instanceof Date) {
    return parsed.toISOString().slice(0, 19).replace('T', ' ');
  }
  const text = String(parsed).replace('Z', '');
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(text)) return text;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(text)) return text.replace('T', ' ') + ':00';
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(text)) return text.replace('T', ' ').slice(0, 19);
  return text;
}

function toIsoDateTime(value) {
  const timestamp = parseEthiopianDate(value);
  if (timestamp === null) return null;
  return new Date(timestamp).toISOString();
}

function formatEthiopianDateTime(value) {
  const timestamp = parseEthiopianDate(value);
  if (timestamp === null) return null;
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Addis_Ababa',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(timestamp));
}

function formatEthiopianDate(value) {
  const timestamp = parseEthiopianDate(value);
  if (timestamp === null) return null;
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Addis_Ababa',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(timestamp));
}

module.exports = {
  normalizeDateInput,
  parseEthiopianDate,
  toDbDateTime,
  toIsoDateTime,
  formatEthiopianDateTime,
  formatEthiopianDate,
};
