const fs = require('fs');
const path = require('path');
const { calculateCommission } = require('./commissionCalculator/commissionCalculator');

const outputResults = async (transactions, outputPath) => {
  const results = await calculateCommission(transactions);
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');
  console.log('Results:');
  results.forEach(result => {
    console.log(`Date: ${result.date}, User ID: ${result.user_id}, User Type: ${result.user_type}, Type: ${result.type}, Amount: ${result.operation.amount} EUR, Commission: ${result.commission} EUR`);
  });
  console.log(`Results written to ${outputPath}`);
};

module.exports = { outputResults };
