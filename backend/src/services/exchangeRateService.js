import ExchangeRate from '../models/ExchangeRate.js';

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function fetchUsdInrRateFromAPI() {
  const response = await fetch(
    'https://api.exchangerate.host/latest?base=USD&symbols=INR'
  );

  if (!response.ok) {
    throw new Error(`API responded with status: ${response.status}`);
  }

  const data = await response.json();

  if (!data.rates?.INR) {
    throw new Error('Invalid API response format');
  }

  return data.rates.INR;
}

async function getMostRecentRate() {
  const mostRecent = await ExchangeRate.findOne()
    .sort({ date: -1 })
    .limit(1);

  return mostRecent ? mostRecent.USD_INR : null;
}

export async function getTodayUsdInrRate() {
  const todayDate = getTodayDateString();

  try {
    const existingRate = await ExchangeRate.findOne({ date: todayDate });

    if (existingRate) {
      return existingRate.USD_INR;
    }

    const rate = await fetchUsdInrRateFromAPI();

    const newRate = await ExchangeRate.create({
      date: todayDate,
      USD_INR: rate
    });

    return newRate.USD_INR;

  } catch (error) {
    const fallbackRate = await getMostRecentRate();
    return fallbackRate || 83.0;
  }
}

export async function getHistoricalRate(dateString) {
  try {
    const rate = await ExchangeRate.findOne({ date: dateString });
    if (rate) return rate.USD_INR;

    const fallbackRate = await getMostRecentRate();
    return fallbackRate || 83.0;

  } catch {
    return 83.0;
  }
}
