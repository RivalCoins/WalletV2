import { Horizon } from 'stellar-sdk';

import { AssetImage } from 'reducers/assetImages';
import defaultAssets from 'staticRes/defaultAssets';

const getAssetName = (
  asset: Horizon.BalanceLine,
  assetImages: AssetImage[],
) => {
  const assetImageFound = assetImages.find(
    (assetImage) =>
      assetImage.asset_code === asset.asset_code &&
      assetImage.asset_issuer === asset.asset_issuer,
  );

  const defaultAssetFound = defaultAssets.find(
    (ast) =>
      ast.asset_code === asset.asset_code &&
      ast.asset_issuer === asset.asset_issuer,
  );

  console.log("getAssetName - # asset images: " + assetImages.length);

  return assetImageFound?.name ?? asset.asset_code;
};

export default getAssetName;
