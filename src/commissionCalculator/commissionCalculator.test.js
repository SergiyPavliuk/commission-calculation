const fs = require('fs');
const path = require('path');
const { outputResults } = require('../index');
const axios = require('axios');
jest.mock('axios');

describe('Commission Calculator', () => {
  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      switch (url) {
        case 'https://developers.paysera.com/tasks/api/cash-in':
          return Promise.resolve({ data: { percents: 0.03, max: { amount: 5, currency: 'EUR' } } });
        case 'https://developers.paysera.com/tasks/api/cash-out-natural':
          return Promise.resolve({ data: { percents: 0.3, week_limit: { amount: 1000, currency: 'EUR' } } });
        case 'https://developers.paysera.com/tasks/api/cash-out-juridical':
          return Promise.resolve({ data: { percents: 0.3, min: { amount: 0.5, currency: 'EUR' } } });
        default:
          return Promise.reject(new Error('Unknown URL'));
      }
    });
  });

  test('calculate commission fees correctly and write to output.json', async () => {
    const transactions = [
      { "date": "2016-01-05", "user_id": 1, "user_type": "natural", "type": "cash_in", "operation": { "amount": 200.00, "currency": "EUR" } },
      { "date": "2016-01-06", "user_id": 2, "user_type": "juridical", "type": "cash_out", "operation": { "amount": 300.00, "currency": "EUR" } },
      { "date": "2016-01-06", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 30000.00, "currency": "EUR" } },
      { "date": "2016-01-07", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 1000.00, "currency": "EUR" } },
      { "date": "2016-01-07", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 100.00, "currency": "EUR" } },
      { "date": "2016-01-10", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 100.00, "currency": "EUR" } },
      { "date": "2016-01-10", "user_id": 2, "user_type": "juridical", "type": "cash_in", "operation": { "amount": 1000000.00, "currency": "EUR" } },
      { "date": "2016-01-10", "user_id": 3, "user_type": "natural", "type": "cash_out", "operation": { "amount": 1000.00, "currency": "EUR" } },
      { "date": "2016-02-15", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 300.00, "currency": "EUR" } },
    ];

    const expectedResults = [
      { "date": "2016-01-05", "user_id": 1, "user_type": "natural", "type": "cash_in", "operation": { "amount": 200.00, "currency": "EUR" }, "commission": "0.06" },
      { "date": "2016-01-06", "user_id": 2, "user_type": "juridical", "type": "cash_out", "operation": { "amount": 300.00, "currency": "EUR" }, "commission": "0.90" },
      { "date": "2016-01-06", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 30000.00, "currency": "EUR" }, "commission": "87.00" },
      { "date": "2016-01-07", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 1000.00, "currency": "EUR" }, "commission": "3.00" },
      { "date": "2016-01-07", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 100.00, "currency": "EUR" }, "commission": "0.30" },
      { "date": "2016-01-10", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 100.00, "currency": "EUR" }, "commission": "0.30" },
      { "date": "2016-01-10", "user_id": 2, "user_type": "juridical", "type": "cash_in", "operation": { "amount": 1000000.00, "currency": "EUR" }, "commission": "5.00" },
      { "date": "2016-01-10", "user_id": 3, "user_type": "natural", "type": "cash_out", "operation": { "amount": 1000.00, "currency": "EUR" }, "commission": "0.00" },
      { "date": "2016-02-15", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 300.00, "currency": "EUR" }, "commission": "0.00" }
    ];

    const outputFilePath = path.resolve(__dirname, '..', 'output.json');

    // Calculate commissions and write to output.json
    await outputResults(transactions, outputFilePath);
    const result = JSON.parse(fs.readFileSync(outputFilePath, 'utf8'));

    expect(result).toEqual(expectedResults);
  });
});
