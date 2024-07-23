const axios = require('axios');
require('dotenv').config();

const API_HOST = process.env.API_HOST;

const getCashInConfig = async () => {
  const response = await axios.get(`${API_HOST}/tasks/api/cash-in`);
  return response.data;
};

const getCashOutNaturalConfig = async () => {
  const response = await axios.get(`${API_HOST}/tasks/api/cash-out-natural`);
  return response.data;
};

const getCashOutJuridicalConfig = async () => {
  const response = await axios.get(`${API_HOST}/tasks/api/cash-out-juridical`);
  return response.data;
};

module.exports = {
  getCashInConfig,
  getCashOutNaturalConfig,
  getCashOutJuridicalConfig,
};
