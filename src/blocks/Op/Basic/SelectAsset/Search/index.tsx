import { Horizon } from 'stellar-sdk';
import React, { useState } from 'react';

import Image from 'components/common/Image';
import { AssetImage } from 'reducers/assetImages';
import formatBalance from 'utils/formatBalance';
import handleAssetAlt from 'utils/handleAssetAlt';
import ScrollBar from 'components/common/ScrollBar';
import handleAssetsKeys from 'utils/handleAssetKeys';
import handleAssetImage from 'utils/handleAssetImage';
import getAssetName from 'utils/getAssetName';
import useTypedSelector from 'hooks/useTypedSelector';
import questionLogo from 'public/images/question-circle.png';

import * as S from './styles';

type AppProps = {
  assets: Horizon.BalanceLine[];
  close: () => void;
  onChange: (value: Horizon.BalanceLine) => void;
  valueName?: string;
  maxHeight: number;
  customAssetImages?: AssetImage[];
  showDomain?: boolean;
  showBalance?: boolean;
};

const SearchAsset = ({
  assets,
  close,
  onChange,
  valueName,
  maxHeight,
  customAssetImages,
  showDomain,
  showBalance,
}: AppProps) => {
  const assetImages = customAssetImages || useTypedSelector((store) => store.assetImages);
  console.log('SearchAsset - # asset images: ' + assetImages.length);
  console.log('SearchAsset - showDomain: ' + showDomain);
  console.log('SearchAsset - showBalance: ' + showBalance);

  const handleClick = (asset: Horizon.BalanceLine) => {
    onChange(asset);

    close();
  };

  const handleShowDomain = (asset: Horizon.BalanceLine) => {
    const foundAssetImage = assetImages.find(
      (assetImage) =>
        assetImage.asset_code === asset.asset_code &&
        assetImage.asset_issuer === asset.asset_issuer,
    );

    if (foundAssetImage && foundAssetImage.domain) {
      return foundAssetImage.domain;
    }

    if (asset.domain) {
      return asset.domain;
    }

    return '';
  };

  return (
    <>
      {assets.map((asset) => (
        <S.ListItem
          key={`${valueName}-${handleAssetsKeys(asset)}`}
          onClick={() => {
            handleClick(asset);
          }}
        >
          <S.Asset>
            <Image
              fallBack={questionLogo}
              alt={handleAssetAlt(asset)}
              src={handleAssetImage(asset, assetImages)}
            />

            <div>
              <S.AssetName>{getAssetName(asset, assetImages) || 'Fake XLM'}</S.AssetName>

              {showBalance ? <S.AssetInfo>{handleShowDomain(asset)}</S.AssetInfo> : null}
            </div>
          </S.Asset>
          {showBalance ? <S.AssetPrice>{formatBalance(asset.balance)}</S.AssetPrice> : null}
        </S.ListItem>
      ))}

      {!assets.length ? (
        <div className="flex items-center justify-center h-[44vh] text-primary-darker">
          Asset not found
        </div>
      ) : null}
    </>
  );
};

SearchAsset.defaultProps = {
  valueName: '',
};

export default SearchAsset;
