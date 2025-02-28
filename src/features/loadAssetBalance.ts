import BigNumber from 'bignumber.js';
import { Horizon } from 'stellar-sdk';

import BN from 'helpers/BN';
import { Bid } from 'reducers/bids';
import config from 'config';

type LoadAssetbalanceType = {
  asset: Horizon.BalanceLine;
  currencyPrice: BigNumber;
  bids: Bid[];
};

const loadAssetBalance = ({
  asset,
  currencyPrice,
  bids,
}: LoadAssetbalanceType) => {
  if (asset.asset_type === 'liquidity_pool_shares') {
    return '0';
  }

  if (asset.asset_type === 'native' 
    // Fake USA
    || (asset.asset_code == 'FakeUSA' && asset.asset_issuer == config.FAKE_USA_ISSUER)
    // Fake USA Rival Coins
    || asset.asset_issuer == config.FAKE_USA_WRAPPER_ISSUER) {
    const price = new BN(asset.balance).times(currencyPrice);

    return price;
  }

  const foundBid = bids.find(
    (bid) =>
      bid.counter.asset_code === asset.asset_code &&
      bid.counter.asset_issuer === asset.asset_issuer,
  );

  if (!foundBid || foundBid.price === '0') {
    return '0';
  }

  const price = new BN(1)
    .div(foundBid?.price || '0')
    .times(currencyPrice)
    .times(new BN(asset.balance));

  return price;
};

export default loadAssetBalance;
