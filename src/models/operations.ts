import { Asset } from 'stellar-sdk';

export type SendValues = {
  asset: Asset;
  isAccountNew: boolean;
  amount: string;
  destination: string;
  memo: string;
};
