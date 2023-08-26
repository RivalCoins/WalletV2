import React, { useState } from 'react';

import Image from 'next/image';
import { Horizon } from 'stellar-sdk';
import styled from 'styled-components';

import AngleDownBold from 'svgs/AngleDownBold';
import humanizeNumber from 'helpers/humanizeNumber';
import questionLogo from 'public/images/question-circle.png';
import { AssetImage } from 'reducers/assetImages';
import handleAssetImage from 'utils/handleAssetImage';
import getAssetName from 'utils/getAssetName';
import handleAssetAlt from 'utils/handleAssetAlt';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${({ theme }) => theme.colors.primary.lighter};
  border-radius: 2px;
  padding: 8px 16px;
`;

const SvgContainer = styled.div`
  svg {
    width: 16px;
    height: auto;
  }
`;

type AssetTriggerType = {
  asset: Horizon.BalanceLine;
  assetImages: AssetImage[];
  showBalance?: boolean;
};

const AssetTrigger = ({ asset, assetImages, showBalance = true }: AssetTriggerType) => {
  // const [theAssetImages, setTheAssetImages] = useState(assetImages);

  console.log('AssetTrigger asset: ' + asset.asset_code + ":" + asset.asset_issuer);
  console.log('AssetTrigger # images: ' + assetImages.length);
  console.log('AssetTrigger 1st image: ' + assetImages[0].asset_code + ":" + assetImages[0].asset_issuer);
  
  return (
    <Container>
      <div className="flex items-center">
        <img
          width={32}
          height={32}
          className="rounded-full"
          alt={handleAssetAlt(asset)}
          src={handleAssetImage(asset, assetImages)}
        />

        <div className="ml-2">
          <span>{(getAssetName(asset, assetImages) || 'Fake XLM')}</span>

          <span className="text-primary-darker ml-[6px]">
            {showBalance ? humanizeNumber(asset.balance) : null}
          </span>
        </div>
      </div>

      <SvgContainer>
        <AngleDownBold />
      </SvgContainer>
    </Container>
  );
 }
export default AssetTrigger;
