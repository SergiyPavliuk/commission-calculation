const fs = require('fs');
const path = require('path');
const { calculateCommission } = require('./commissionCalculator/commissionCalculator');

const inputFilePath = process.argv[2];

if (!inputFilePath) {
  console.error('Please provide the input file path as an argument.');
  process.exit(1);
}

const inputFile = path.resolve(__dirname, '..', inputFilePath);
const inputData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

calculateCommission(inputData).then((commissions) => {
  commissions.forEach((commission) => {
    console.log(`Date: ${commission.date}, User ID: ${commission.user_id}, User Type: ${commission.user_type}, Type: ${commission.type}, Amount: ${commission.operation.amount} EUR, Commission: ${commission.commission} EUR`);
  });
});
