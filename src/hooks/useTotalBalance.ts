import { useState, useEffect } from 'react';

import BN from 'helpers/BN';
import { IAccount } from 'reducers/accounts2';
import loadAssetBalance from 'features/loadAssetBalance';
import config from 'config';

import useActiveAccount from './useActiveAccount';
import useTypedSelector from './useTypedSelector';
import useActiveCurrency from './useActiveCurrency';

const useTotalBalance = (acc?: IAccount) => {
  const activeAccount = useActiveAccount();
  const [options, bids, currencies] = useTypedSelector((store) => [
    store.options,
    store.bids,
    store.currencies,
  ]);
  const [totalBalance, setTotalBalance] = useState('0');
  const activeCurrency = useActiveCurrency();
  const currencyPrice = new BN(1.0);

  const account = acc || activeAccount;

  useEffect(() => {
    const assets = (account.assets || []).filter((asset) =>
      // Fake USA
      (asset.asset_code == 'FakeUSA' && asset.asset_issuer == config.FAKE_USA_ISSUER)
      ||
      // Fake USA Rival Coins
      (asset.asset_issuer == config.FAKE_USA_WRAPPER_ISSUER));

    let totalBalanceTemp = new BN(0);

    for (let i = 0; i < assets.length; i += 1) {
      const assetPrice = loadAssetBalance({
        asset: assets[i],
        currencyPrice,
        bids,
      });

      totalBalanceTemp = totalBalanceTemp.plus(assetPrice);
    }

    setTotalBalance(totalBalanceTemp.toString());
  }, [
    account,
    options,
    JSON.stringify(bids),
    activeCurrency,
    currencies,
  ]);

  return totalBalance;
};

export default useTotalBalance;
