import {
  Asset,
  Server,
  Keypair,
  Operation,
  TransactionBuilder,
  Memo,
} from 'stellar-sdk';

import matchAsset from 'utils/matchAsset';
import showError from 'staticRes/errorMessage';
import currentNetwork from 'utils/currentNetwork';
import { FormValues } from 'blocks/Op/Basic/Swap';
import calculatePath from 'utils/swap/calculatePath';
import currentActiveAccount from 'utils/activeAccount';

import config from 'config';

export type StrictSendInfo = {
  op: Operation.PathPaymentStrictSend;
  memo: string;
};

const strictSend = async (values: StrictSendInfo) => {
  const { activeAccount } = currentActiveAccount();
  const { url, passphrase } = currentNetwork();

  console.log("strictSend - 1");
  const assets = activeAccount.assets || [];

  const server = new Server(url);
  
  const sourceKeys = Keypair.fromSecret(activeAccount.privateKey);

  let transaction;

  console.log("strictSend - 2");

  const foundAsset = assets.find((ast) =>
    ast.asset_code == values.op.sendAsset.code && ast.asset_issuer == values.op.sendAsset.issuer,
  );

  console.log("strictSend - passphrase - " + passphrase);

  try {
    const result = await server
      .loadAccount(sourceKeys.publicKey())
      .then((sourceAccount) => {
        transaction = new TransactionBuilder(sourceAccount, {
          fee: config.BASE_FEE,
          networkPassphrase: passphrase,
        });
        console.log("strictSend - 4");

        if (false && !foundAsset) {
          transaction = transaction.addOperation(
            Operation.changeTrust({
              limit: '999999',
              asset: values.op.destAsset,
            }),
          );
        }
        console.log("strictSend - 5");
        console.log("strictSend - 5 - " + values.op.destAsset.code);
        console.log("strictSend - 5 - " + values.op.destAsset.issuer);
        console.log("strictSend - 5 - " + values.op.destMin);
        console.log("strictSend - 5 - " + values.op.destination);
        console.log("strictSend - 5 - " + values.op.path.length);
        console.log("strictSend - 5 - " + values.op.sendAmount);
        console.log("strictSend - 5 - " + values.op.sendAsset.code);
        console.log("strictSend - 5 - " + values.op.sendAsset.issuer);
        console.log("strictSend - 5 - " + values.op.type);

        transaction = transaction.addOperation(
          Operation.pathPaymentStrictSend(values.op),
        )
        .addMemo(Memo.text(values.memo));
        console.log("strictSend - 6");

        transaction = transaction.setTimeout(180).build();

        transaction.sign(sourceKeys);

        console.log("strictSend - 7");

        return server.submitTransaction(transaction);
      });

    return [true, result.hash];
  } catch (err: any) {
    if (err && err.response && err.response.data) {
      return [false, showError(err.response.data)];
    }

    return [false, 'Operation failed.'];
  }
};

export default strictSend;
