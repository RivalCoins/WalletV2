import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

const config = {
  DB_VERSION: 8,
  BASE_FEE: '50000',
  VERSION: '0.1.0',
  MIN_RECEIVED: 99.7,
  SLIDESHOW_TRANSITION: 200,
  INTERVAL_TIME_SECONDS: 13,
  OFFLINE_MODE_TIMEOUT_SECONDS: 4,
  ASSET_SERVER: publicRuntimeConfig.ASSET_SERVER_URL,
  DAPP_URL: publicRuntimeConfig.DAPP_URL,
  FAKE_USA_ISSUER: publicRuntimeConfig.FAKE_USA_ISSUER as string,
  FAKE_USA_WRAPPER_ISSUER: publicRuntimeConfig.FAKE_USA_WRAPPER_ISSUER as string,
  HORIZON: {
    mainnet: 'https://horizon.stellar.org',
    testnet: publicRuntimeConfig.HORIZON_URL,
  },
  STEEXP: {
    mainnet: 'https://steexp.com',
    testnet: 'https://testnet.steexp.com',
  },
  STELLAR_EXPERT: {
    mainnet: 'https://stellar.expert/explorer/public',
    testnet: 'https://stellar.expert/explorer/testnet',
  },
  LUMENSCAN: {
    mainnet: 'https://lumenscan.io',
    testnet: 'https://testnet.lumenscan.io',
  },
  WINDOW_WIDTH: 380,
  WINDOW_HEIGHT: 640,
  WINDOW_TIMEOUT_SECONDS: 30,
};

export default config;
