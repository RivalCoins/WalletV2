import React, { useState } from 'react';
import { Horizon } from 'stellar-sdk';

import BN from 'helpers/BN';
import shorter from 'utils/shorter';
import ShareArrow from 'svgs/ShareArrow';
import Card from 'components/common/Card';
import Button from 'components/common/Button';
import formatBalance from 'utils/formatBalance';
import xlmLogo from 'public/images/xlm-logo.svg';
import CopyText from 'components/common/CopyText';
import accountLink from 'utils/horizon/accountLink';
import addAssetAction from 'actions/operations/addAsset';
import ButtonContainer from 'components/common/ButtonContainer';
import DeleteModal from 'components/DeleteModal';
import BottomSheet from 'components/common/BottomSheet';
import useAssetInfo from './useAssetInfo';

import * as S from './styles';

type AssetType = {
  isNative?: boolean;
  onDelete: (result: [boolean, string]) => void;
  children?: React.ReactNode;
  asset?: Horizon.BalanceLine;
  onBeforeDelete: () => void;
};

const AssetInfo = ({
  isNative,
  asset,
  onDelete,
  children,
  onBeforeDelete,
}: AssetType) => {
  const { loading, error, assetData } = useAssetInfo(asset);
  const [open, setOpen] = useState(false);

  const onOpen = () => setOpen(true);

  const handleDelete = () => {
    if (
      asset?.asset_type === 'credit_alphanum4' ||
      asset?.asset_type === 'credit_alphanum12'
    ) {
      onBeforeDelete();

      addAssetAction(asset.asset_code, asset.asset_issuer, '0').then(
        (result) => {
          onDelete(result);
        },
      );

      setOpen(false);
    }
  };

  const HandleDomain = () => {
    if (loading) {
      return <S.Info>Loading</S.Info>;
    }

    if (error) {
      return <S.Info>Error</S.Info>;
    }

    if (!assetData?.home_domain) {
      return <S.Info>No home domain</S.Info>;
    }

    return (
      <a
        href={`https://${assetData?.home_domain}`}
        target="_blank"
        rel="noreferrer"
        style={{ color: 'black' }}
      >
        {assetData?.home_domain}
      </a>
    );
  };

  const HandleIssuer = () => {
    if (loading) {
      return <S.Info>Loading</S.Info>;
    }

    return (
      <div className="inline-flex">
        <CopyText
          text={assetData?.asset_issuer || ''}
          custom={
            <S.Value>{shorter(assetData?.asset_issuer, 6)}</S.Value>
          }
        />

        <a
          href={accountLink(assetData?.asset_issuer)}
          target="_blank"
          rel="noreferrer"
          className="cursor-pointer"
        >
          <ShareArrow />
        </a>
      </div>
    );
  };

  const assetBalance = [
    {
      title: 'Balance',
      value: formatBalance(assetData?.balance) || 'LOADING',
    },
    {
      title: 'Selling liabilities',
      value: formatBalance(assetData?.selling_liabilities),
    },
    {
      title: 'Buying liabilities',
      value:
        formatBalance(assetData?.buying_liabilities) || 'LOADING',
    },
  ];

  const assetInfo = [
    {
      title: 'Assets code',
      value: assetData?.asset_code || 'LOADING',
    },
    {
      title: 'Issuer',
      value: <HandleIssuer />,
    },
    {
      title: 'Website',
      value: <HandleDomain />,
    },
  ];

  const nBalance = new BN(asset.balance);

  let nSL; // BigNumber for asset's selling liabilities
  let nBL; // BigNumber for assets's buying liabilities

  if (asset.asset_type === 'liquidity_pool_shares') {
    nSL = new BN('');
    nBL = new BN('');
  } else {
    nSL = new BN(asset.selling_liabilities);
    nBL = new BN(asset.buying_liabilities);
  }

  let isDeletable = false;
  let notDeletableReason = '';

  if (!nBalance.isEqualTo('0') || !nSL.plus(nBL).isEqualTo('0')) {
    isDeletable = true;
    notDeletableReason =
      'You cannot remove this asset unless the balance and liabilities are zero.';
  }

  if (isNative) {
    return (
      <div className="flex flex-col h-screen">
        {children}
        <S.Container>
          <S.Circle>
            <S.ImgContainer>
              <img src={xlmLogo.src} alt="xlm logo" />
            </S.ImgContainer>
          </S.Circle>
          <p className="text-base">
            <strong className="text-lg">Fake XLM</strong> is used to 
            simulate "payment" for transactions.  It has no market
            value, nor will it ever.
          </p>
        </S.Container>
      </div>
    );
  }
  return (
    <>
      {children}
      <S.Page>
        <div>
          <S.Label>Your balance</S.Label>
          <Card type="secondary" className="px-[10px]">
            {assetBalance.map((item) => (
              <S.InfoContainer key={item.title}>
                <S.Title>{item.title}</S.Title>
                <S.Value>{item.value}</S.Value>
              </S.InfoContainer>
            ))}
          </Card>
        </div>

        <div>
          <S.Label>Asset info</S.Label>
          <Card type="secondary" className="px-[10px]">
            {assetInfo.map((item) => (
              <S.InfoContainer key={item.title}>
                <S.Title>{item.title}</S.Title>
                <S.Value>{item.value}</S.Value>
              </S.InfoContainer>
            ))}
          </Card>
        </div>

        {isDeletable ? (
          <S.ErrorBox className="text-error">
            {notDeletableReason}
          </S.ErrorBox>
        ) : (
          ''
        )}
      </S.Page>
      <S.Container>
        <ButtonContainer fixedBottom mb={39} fixedUntil={610}>
          <Button
            type="button"
            variant="danger-fill"
            size="medium"
            content="Delete"
            disabled={isDeletable}
            onClick={onOpen}
          />
        </ButtonContainer>

        <BottomSheet isOpen={open} setOpen={setOpen} height={250}>
          <DeleteModal
            onConfirm={handleDelete}
            variant="medium"
            title="Delete Asset"
            message="Please note that by clicking on the Delete, your Asset is deleted."
          />
        </BottomSheet>
      </S.Container>
    </>
  );
};

AssetInfo.defaultProps = {
  children: '',
  isNative: false,
  asset: {
    asset_code: 'ABCD',
    asset_issuer: 'ABCDEFG',
    asset_type: 'credit_alphanum4',
    balance: '0.11234',
  },
};

export default AssetInfo;
