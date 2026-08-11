const test = require('node:test');
const assert = require('node:assert/strict');

const { normalizeLotteryPayload } = require('../src/modules/lottery/lottery.service');

test('normalizeLotteryPayload maps camelCase fields and converts dates', () => {
  const payload = normalizeLotteryPayload({
    name: 'Weekend Draw',
    description: 'A test draw',
    ticketPrice: '25',
    ticketMode: 'custom',
    startDate: '2025-01-01T10:00',
    endDate: '2025-01-02T10:00',
    spinAt: '2025-01-03T10:00',
  });

  assert.equal(payload.name, 'Weekend Draw');
  assert.equal(payload.description, 'A test draw');
  assert.equal(payload.ticket_price, 25);
  assert.equal(payload.ticket_mode, 'custom');
  assert.match(payload.start_date, /2025-01-01/);
  assert.match(payload.end_date, /2025-01-02/);
  assert.match(payload.spin_at, /2025-01-03/);
});
