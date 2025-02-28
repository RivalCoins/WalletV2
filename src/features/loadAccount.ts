import store from 'store';
import config from 'config';
import getAccount from 'api/getAccount';
import {
  IAccount,
  addFlags,
  addAssets,
  setInactive,
  addSubentryCount,
} from 'reducers/accounts2';

const loadAccount = async (account: IAccount) => {
  const accountResult = await getAccount(account.publicKey);

  if (!accountResult) {
    store.dispatch(
      addAssets({
        publicKey: account.publicKey,
        assets: [
          {
            asset_code: 'XLM',
            asset_type: 'native',
            balance: '0',
            selling_liabilities: '0',
            buying_liabilities: '0',
          },
        ],
      }),
    );

    store.dispatch(
      setInactive({
        publicKey: account.publicKey,
        inactive: true,
      }),
    );

    return;
  }

  let assets = accountResult.balances;
  // Remove liquidity pool assets
  assets = assets.filter(
    (asset) => asset.asset_type !== 'liquidity_pool_shares',
  );

  // Move Fake USA to the second element
  const fakeUsa = assets.find(
    (asset) => asset.asset_code === 'FakeUSA' && asset.asset_issuer === config.FAKE_USA_ISSUER,
  );
  assets = assets.filter((asset) => asset != fakeUsa);

  if (fakeUsa) {
    assets.unshift({
      ...fakeUsa,
    });
  }

  // Move XLM to the first element
  const nativeAsset = assets.find(
    (asset) => asset.asset_type === 'native',
  );
  assets = assets.filter((asset) => asset.asset_type !== 'native');

  if (nativeAsset) {
    assets.unshift({
      ...nativeAsset,
      asset_code: 'XLM',
    });
  }

  store.dispatch(
    addSubentryCount({
      publicKey: account.publicKey,
      subentry_count:
        (accountResult.subentry_count + 2) * 0.5 + 0.005,
    }),
  );

  store.dispatch(
    addAssets({
      publicKey: account.publicKey,
      assets,
    }),
  );

  store.dispatch(
    addFlags({
      publicKey: account.publicKey,
      flags: accountResult.flags,
    }),
  );

  store.dispatch(
    setInactive({
      publicKey: account.publicKey,
      inactive: false,
    }),
  );
};

export default loadAccount;
