import React from 'react';
import { Horizon } from 'stellar-sdk';

import BlackCheck from 'svgs/BlackCheck';
import formatBalance from 'utils/formatBalance';
import useAssetPrice from 'hooks/useAssetPrice';
import handleAssetAlt from 'utils/handleAssetAlt';
import useTypedSelector from 'hooks/useTypedSelector';
import handleAssetImage from 'utils/handleAssetImage';
import handleAssetSymbol from 'utils/handleAssetSymbol';
import questionIcon from 'public/images/question-circle.png';
import ImageOnErrorHandler from 'helpers/ImageOnErrorHandler';

import * as S from './styles';

type AssetType = {
  asset: Horizon.BalanceLine;
  index: number;
};

const Asset = ({ asset, index }: AssetType) => {
  const [assetImages, currencies, options] = useTypedSelector(
    (store) => [
      store.assetImages,
      store.currencies,
      store.options,
      store.bids,
    ],
  );
  const price = useAssetPrice(asset);

  // eslint-disable-next-line @typescript-eslint/naming-convention
  let asset_code: string;
  let assetName: string;
  let isVerified = false;

  if (
    asset.asset_type === 'credit_alphanum4' ||
    asset.asset_type === 'credit_alphanum12'
  ) {
    asset_code = asset.asset_code;
    const assetImageFound = assetImages.find(
      (assetImage) =>
        assetImage.asset_code === asset.asset_code &&
        assetImage.asset_issuer === asset.asset_issuer,
    );

    if (assetImageFound && assetImageFound.is_verified) {
      isVerified = true;
    }

    if(assetImageFound) {
      assetName = assetImageFound.name;
    } else {
      assetName = asset_code;
    }
  } else {
    isVerified = true;
    asset_code = 'XLM';
    assetName = 'Fake XLM';
  }

  return (
    <S.Container
      className={`${
        index === 0 ? '!pt-[25px]' : ''
      } flex items-center`}
    >
      <S.Image
        isDark={asset.asset_type === 'native'}
        src={handleAssetImage(asset, assetImages)}
        alt={handleAssetAlt(asset)}
        onError={(e) => ImageOnErrorHandler(e, questionIcon.src)}
      />
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col">
          <div className="inline-flex text-base">
            <span className="text-primary-dark font-normal ml-1">
                { assetName }
            </span>
          </div>
          <div className="inline-flex text-base">
            <span className=" font-medium">
              {formatBalance(asset.balance)}
            </span>
            {false && isVerified && (
              <div className="ml-1 mt-1">
                <BlackCheck width="16" height="16" />
              </div>
            )}
          </div>
          {false && (<div className="text-xs text-primary-dark mt-[2px]">
            {handleAssetSymbol(currencies, options)}
            {formatBalance(price)}
          </div>)}
        </div>
      </div>
    </S.Container>
  );
};

export default Asset;
