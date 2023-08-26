import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Horizon } from 'stellar-sdk';

import AngleDownBold from 'svgs/AngleDownBold';
import BottomSheet from 'components/common/BottomSheet';
import Image from 'components/common/Image';
import Layout from 'components/common/Layouts/BaseLayout';
import useTypedSelector from 'hooks/useTypedSelector';
import handleAssetAlt from 'utils/handleAssetAlt';
import handleAssetImage from 'utils/handleAssetImage';
import getAssetName from 'utils/getAssetName';
import questionLogo from 'public/images/question-circle.png';
import Search from './Search';
import { AssetImage } from 'reducers/assetImages';

import * as S from './Search/styles';

const Trigger = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${({ theme }) => theme.colors.primary.lighter};
  border-radius: 22px;
  min-width: 130px;
  height: 44px;
  padding: 6px 10px 6px 6px;

  img {
    height: 32px !important;
    width: 32px;
    height: auto;
    border-radius: 50%;
  }
`;

type AppProps = {
  asset: Horizon.BalanceLine;
  assets: Horizon.BalanceLine[];
  onChange: (value: any) => void;
  valueName?: string;
  defaultNull?: boolean;
  setValue?: null;
  customTrigger?: React.ReactNode;
  customAssetImages?: AssetImage[];
  showDomain?: boolean;
  showBalance?: boolean;
};

const SelectAsset = ({
  asset,
  onChange,
  assets,
  setValue,
  valueName,
  defaultNull,
  customTrigger,
  customAssetImages,
  showDomain = true,
  showBalance = true,
}: AppProps) => {
  const [currentAsset, setCurrentAsset] = useState(
    defaultNull ? null : assets[0],
  );
  const assetImages = customAssetImages || useTypedSelector((store) => store.assetImages);
  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);
  const onOpen = () => setOpen(true);
  console.log("SelectAsset - 1 - # asset images: " + assetImages.length);
  console.log("SelectAsset - 1 - # custom asset images: " + customAssetImages?.length);
  
  useEffect(() => {
    if (asset) {
      setCurrentAsset(asset);
    }
  }, [asset]);

  const handleAssetChange = (newAsset: Horizon.BalanceLine) => {
    setCurrentAsset(newAsset);

    onChange(newAsset);

    if (setValue) {
      setValue(valueName, newAsset);
    }
  };
  const assetsHeight = assets.length * 65;
  const modalHeight = assetsHeight > 600 ? 600 : assetsHeight + 70;
  return (
    <>
      {customTrigger ? (
        <div onClick={onOpen}>{customTrigger}</div>
      ) : (
        <Trigger onClick={onOpen}>
          {currentAsset ? (
            <div className="flex items-center">
              <img
                alt={handleAssetAlt(currentAsset)}
                src={handleAssetImage(currentAsset, assetImages)}
              />
              <span className="ml-1">
                {(currentAsset.asset_code == 'XLM' ? 'Fake XLM' : currentAsset.asset_code) || 'Fake XLM'}
              </span>
            </div>

            // <div>
            //   <S.Asset>
            //     <Image
            //       fallBack={questionLogo}
            //       alt={handleAssetAlt(currentAsset)}
            //       src={handleAssetImage(currentAsset, assetImages)}
            //     />

            //     <div>
            //       <S.AssetName>{getAssetName(currentAsset, assetImages) || 'Fake XLM'}</S.AssetName>
            //     </div>
            //   </S.Asset>
            // </div>
          ) : (
            <span>NONE</span>
          )}
          <AngleDownBold />
        </Trigger>
      )}

      <BottomSheet
        isOpen={open}
        setOpen={setOpen}
        height={modalHeight}
      >
        <Layout>
          <Search
            assets={assets}
            close={onClose}
            valueName={valueName}
            onChange={handleAssetChange}
            maxHeight={modalHeight}
            customAssetImages={assetImages}
            showDomain={showDomain}
            showBalance={showBalance}
          />
        </Layout>
      </BottomSheet>
    </>
  );
};

SelectAsset.defaultProps = {
  valueName: '',
  setValue: undefined,
  defaultNull: false,
};

export default SelectAsset;
