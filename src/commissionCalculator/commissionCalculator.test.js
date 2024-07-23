const axios = require('axios');
const { calculateCommission } = require('./commissionCalculator');
require('dotenv').config();
jest.mock('axios');

const API_HOST = process.env.API_HOST;

describe('Commission Calculator', () => {
    beforeEach(() => {
        axios.get.mockImplementation((url) => {
            switch (url) {
                case `${API_HOST}/tasks/api/cash-in`:
                    return Promise.resolve({ data: { percents: 0.03, max: { amount: 5, currency: 'EUR' } } });
                case `${API_HOST}/tasks/api/cash-out-natural`:
                    return Promise.resolve({ data: { percents: 0.3, week_limit: { amount: 1000, currency: 'EUR' } } });
                case `${API_HOST}/tasks/api/cash-out-juridical`:
                    return Promise.resolve({ data: { percents: 0.3, min: { amount: 0.5, currency: 'EUR' } } });
                default:
                    return Promise.reject(new Error('Unknown URL'));
            }
        });
        jest.spyOn(console, 'log').mockImplementation(() => {}); // Mock console.log
    });

    afterEach(() => {
        console.log.mockRestore(); // Restore console.log after each test
    });

    test('calculate commission fees correctly and output to console', async () => {
        const transactions = [
            { "date": "2016-01-05", "user_id": 1, "user_type": "natural", "type": "cash_in", "operation": { "amount": 200.00, "currency": "EUR" } },
            { "date": "2016-01-06", "user_id": 2, "user_type": "juridical", "type": "cash_out", "operation": { "amount": 300.00, "currency": "EUR" } }
        ];

        const expectedLogs = [
            'Date: 2016-01-05, User ID: 1, User Type: natural, Type: cash_in, Amount: 200 EUR, Commission: 0.06 EUR',
            'Date: 2016-01-06, User ID: 2, User Type: juridical, Type: cash_out, Amount: 300 EUR, Commission: 0.90 EUR'
        ];

        await calculateCommission(transactions);

        expectedLogs.forEach((expectedLog) => {
            expect(console.log).toHaveBeenCalledWith(expectedLog);
        });
    });
});
