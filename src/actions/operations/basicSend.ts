import {
  Asset,
  Server,
  Keypair,
  Operation,
  TransactionBuilder,
  Memo,
} from 'stellar-sdk';

import { SendValues } from 'models';
import showError from 'staticRes/errorMessage';
import currentNetwork from 'utils/currentNetwork';
import currentActiveAccount from 'utils/activeAccount';

import config from 'config';

export default async (values: SendValues) => {
  const { activeAccount: account } = currentActiveAccount();
  const { url, passphrase } = currentNetwork();

  const server = new Server(url);
  const sourceKeys = Keypair.fromSecret(account.privateKey);

  let transaction;

  let op = Operation.createAccount({
    startingBalance: values.amount,
    destination: values.destination,
  });

  if (!values.isAccountNew) {
    op = Operation.payment({
      asset: values.asset,
      amount: values.amount,
      destination: values.destination,
    });
  }

  try {
    const transactionResult = await server
      .loadAccount(sourceKeys.publicKey())
      .then((sourceAccount) => {
        transaction = new TransactionBuilder(sourceAccount, {
          fee: config.BASE_FEE,
          networkPassphrase: passphrase,
        }).addOperation(op);

        if (values.memo) {
          transaction = transaction.addMemo(Memo.text(values.memo));
        }

        transaction = transaction.setTimeout(180).build();
        transaction.sign(sourceKeys);

        return server.submitTransaction(transaction);
      });

    return [true, transactionResult.hash];
  } catch (err: any) {
    if (err && err.response && err.response.data) {
      return [false, showError(err.response.data)];
    }

    return [false, 'Operation failed'];
  }
};
