const axios = require('axios');

const getCashInConfig = async () => {
  const response = await axios.get('https://developers.paysera.com/tasks/api/cash-in');
  return response.data;
};

const getCashOutNaturalConfig = async () => {
  const response = await axios.get('https://developers.paysera.com/tasks/api/cash-out-natural');
  return response.data;
};

const getCashOutJuridicalConfig = async () => {
  const response = await axios.get('https://developers.paysera.com/tasks/api/cash-out-juridical');
  return response.data;
};

module.exports = {
  getCashInConfig,
  getCashOutNaturalConfig,
  getCashOutJuridicalConfig,
};
