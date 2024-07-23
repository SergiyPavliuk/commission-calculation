const {
  getCashInConfig,
  getCashOutNaturalConfig,
  getCashOutJuridicalConfig,
} = require('../api/api');

const calculateCashInCommission = (amount, config) => {
  const commission = amount * (config.percents / 100);
  return Math.min(commission, config.max.amount).toFixed(2);
};

const calculateCashOutCommissionNatural = (amount, weeklyTotal, config) => {
  if (weeklyTotal <= config.week_limit.amount) {
      const commission = (Math.max(0, amount - (config.week_limit.amount - weeklyTotal)) * (config.percents / 100)).toFixed(2);
      return commission;
  }
  return (amount * (config.percents / 100)).toFixed(2);
};

const calculateCashOutCommissionJuridical = (amount, config) => {
  const commission = amount * (config.percents / 100);
  return Math.max(commission, config.min.amount).toFixed(2);
};

const calculateCommission = async (transactions) => {
  const cashInConfig = await getCashInConfig();
  const cashOutNaturalConfig = await getCashOutNaturalConfig();
  const cashOutJuridicalConfig = await getCashOutJuridicalConfig();

  const weeklyTotals = {};

  const results = transactions.map((transaction) => {
      const { date, user_id, user_type, type, operation } = transaction;
      const { amount } = operation;
      let commission = 0;

      const transactionDate = new Date(date);
      const weekNumber = getWeekNumber(transactionDate);

      if (!weeklyTotals[user_id]) {
          weeklyTotals[user_id] = {};
      }

      if (!weeklyTotals[user_id][weekNumber]) {
          weeklyTotals[user_id][weekNumber] = 0;
      }

      if (type === 'cash_in') {
          commission = calculateCashInCommission(amount, cashInConfig);
      } else if (type === 'cash_out') {
          if (user_type === 'natural') {
              commission = calculateCashOutCommissionNatural(amount, weeklyTotals[user_id][weekNumber], cashOutNaturalConfig);
          } else if (user_type === 'juridical') {
              commission = calculateCashOutCommissionJuridical(amount, cashOutJuridicalConfig);
          }
      }

      weeklyTotals[user_id][weekNumber] += amount;
      
      const result = {
          ...transaction,
          commission
      };
      console.log(`Date: ${result.date}, User ID: ${result.user_id}, User Type: ${result.user_type}, Type: ${result.type}, Amount: ${result.operation.amount} EUR, Commission: ${result.commission} EUR`);
      
      return result;
  });

  return results;
};

// Helper function to get the week number
function getWeekNumber(d) {
  const oneJan = new Date(d.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((d - oneJan) / (24 * 60 * 60 * 1000));
  return Math.ceil((d.getDay() + 1 + numberOfDays) / 7);
}

module.exports = { calculateCommission };
