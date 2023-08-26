import React from 'react';
import { useRouter } from 'next/router';
import { Asset, Horizon } from 'stellar-sdk';

import shorter from 'helpers/shorter';
import showName from 'helpers/showName';
import RouteName from 'staticRes/routes';
import Card from 'components/common/Card';
import handleAssetAlt from 'utils/handleAssetAlt';
import CopyText from 'components/common/CopyText';
import humanizeAmount from 'helpers/humanizeNumber';
import useTypedSelector from 'hooks/useTypedSelector';
import useActiveAccount from 'hooks/useActiveAccount';
import handleAssetImage from 'utils/handleAssetImage';
import Layout from 'components/common/Layouts/BaseLayout';
import basicSendAction from 'actions/operations/basicSend';
import { StrictSendInfo } from 'actions/operations/strictSend';
import strictSend from 'actions/operations/strictSend';
import getAccount from 'api/getAccount';
import getAssetImages from 'api/getAssetImages';
import config from 'config';

import * as S from './styles';
import ConfirmLayout from './Layout';
import { pathPaymentStrictSend } from 'staticRes/operations';

const BasicConfirmSend = () => {
  const router = useRouter();
  const currentAccount = useActiveAccount();
  const [accounts, contacts, assetImages] = useTypedSelector(
    (store) => [store.accounts, store.contacts, store.assetImages],
  );

  const values = { 
    op: { },
    memo: "",
  } as StrictSendInfo;

  if (router.query.memo) {
    values.memo = router.query.memo;
  }

  if (router.query.amount) {
    values.op.sendAmount = router.query.amount;
    console.log("send amount passed: " + router.query.amount);
    console.log("send amount set: " + values.op.sendAmount);
    values.op.destMin = router.query.amount;
  }
  else {
    console.log("send amount NOT passed!");
  }

  if (router.query.destination) {
    values.op.destination = router.query.destination;
  }

  if (router.query.assetCode && router.query.assetType && router.query.assetIssuer) {
    values.op.sendAsset = new Asset(router.query.assetCode, router.query.assetIssuer);
  }

  if (router.query.destinationAssetCode && router.query.destinationAssetIssuer) {
    values.op.destAsset = new Asset(router.query.destinationAssetCode, router.query.destinationAssetIssuer);
  }

  if(values.op.sendAsset.code == "FakeUSA") {
    values.op.path = new Array<Asset>();
  } else {
    values.op.path = Array(1).fill(new Asset("FakeUSA", config.FAKE_USA_ISSUER))
  }

  // console.log("BasicConfirmSend - getting account");
  // const destinationAccount = currentAccount; // await getAccount(values.op.destination);
  // console.log("BasicConfirmSend - retrieved account");
  // const accountAssets = destinationAccount?.assets || [];

  // let selectedAsset = accountAssets.find(
  //   (x) => x.asset_type === 'native',
  // );

  const selectedAsset = { asset_code: values.op.destAsset.code, asset_issuer: values.op.destAsset.issuer } as Horizon.BalanceLineAsset<"credit_alphanum12">;
  const selectedAssetImage = { name: router.query.destinationAssetName, logo: router.query.destinationAssetLogo };

  const showDestination = () => {
    const userAccount = accounts.find(
      (act) => act.publicKey === values.op.destination,
    );

    const contactAccount = contacts.find(
      (cnt) => cnt.publicKey === values.op.destination,
    );

    if (contactAccount) {
      return showName(contactAccount.name);
    }

    if (userAccount) {
      return showName(userAccount.name);
    }

    return shorter(values.op.destination, 4);
  };

  const onSubmit = async () => {
    router.push(RouteName.LoadingNetwork);

    console.log('Send - destination asset');

    console.log('Send - before swap');

    const [isDone, message] =
      values.op.sendAsset.code == values.op.destAsset.code && values.op.sendAsset.issuer == values.op.destAsset.issuer 
      ? await basicSendAction({
          asset: values.op.sendAsset,
          destination: values.op.destination,
          amount: values.op.sendAmount,
          isAccountNew: false,
          memo: values.memo,
        })
        :  
        await strictSend(values);

    console.log('Send - after swap');

    router.push({
      pathname: isDone ? RouteName.Success : RouteName.Error,
      query: {
        message,
      },
    });
  };

  return (
    <Layout className="pt-6">
      <ConfirmLayout handleClick={onSubmit}>
        <Card type="secondary" className="px-[10px] py-6">
          <S.Label>Amount</S.Label>
          <S.Value>
            {selectedAsset ? (
              <>
                {humanizeAmount(values.op.sendAmount)}

                <S.Image
                  alt={handleAssetAlt(selectedAsset)}
                  src={selectedAssetImage.logo as string}
                />
                <span className="text-lg font-normal">
                  {selectedAssetImage.name}
                </span>
              </>
            ) : (
              ''
            )}
          </S.Value>

          <S.Hr />

          <S.Label>To</S.Label>
          <CopyText
            text={values.op.destination}
            custom={
              <span className="text-lg font-medium">
                {showDestination()}
              </span>
            }
          />

          {values.memo ? (
            <>
              <S.Hr />
              <S.Label>Memo</S.Label>
              <S.Value>{values.memo}</S.Value>
            </>
          ) : (
            ''
          )}
        </Card>
      </ConfirmLayout>
    </Layout>
  );
};

export default BasicConfirmSend;
