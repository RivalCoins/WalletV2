import StellarSdk from 'stellar-sdk';

import store from 'store';
import config from 'config';

export default () => {
  const { options } = store.getState();

  if (options.network === 'MAINNET') {
    return {
      url: config.HORIZON.mainnet,
      passphrase: StellarSdk.Networks.PUBLIC,
    };
  }

  if (options.network === 'TESTNET') {
    return {
      url: config.HORIZON.testnet,
      passphrase: 'Rival Coins Fake Network ; August 2023',
    };
  }

  return {
    url: config.HORIZON.mainnet,
    passphrase: StellarSdk.Networks.PUBLIC,
  };
};
