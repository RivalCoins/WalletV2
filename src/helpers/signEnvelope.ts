import { xdr, Keypair, Networks, Transaction } from 'stellar-sdk';

export default (
  userXdr: string,
  network: string,
  privateKey: string,
) => {
  try {
    const key = Keypair.fromSecret(privateKey);
    const obj = xdr.TransactionEnvelope.fromXDR(userXdr, 'base64');

    let stellarNetwork;

    if (network.includes('main') || network === Networks.PUBLIC) {
      stellarNetwork = Networks.PUBLIC;
    } else {
      stellarNetwork = 'Rival Coins Fake Network ; August 2023';
    }

    const transaction = new Transaction(obj, stellarNetwork);

    transaction.sign(key);

    const newXdr = transaction.toEnvelope().toXDR('base64');

    return newXdr;
  } catch (e) {
    return null;
  }
};
