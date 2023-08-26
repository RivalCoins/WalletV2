import React from 'react';
import Link from 'next/link';

import shorter from 'utils/shorter';
import FilledCopy from 'svgs/FilledCopy';
import RouteName from 'staticRes/routes';
import LoadingOne from 'pages/loading-one';
import AssetList from 'components/AssetList';
import formatBalance from 'utils/formatBalance';
import CopyText from 'components/common/CopyText';
import useTotalBalance from 'hooks/useTotalBalance';
import ExpandHorizontal from 'svgs/ExpandHorizontal';
import useActiveAccount from 'hooks/useActiveAccount';
import useTypedSelector from 'hooks/useTypedSelector';
import handleAssetSymbol from 'utils/handleAssetSymbol';
import Layout from 'components/common/Layouts/BaseLayout';

import Links from './links';
import * as S from './styles';
import AccountModal from './AccountModal';

type HomeProps = {
  loading: boolean;
};
const Home = ({ loading }: HomeProps) => {
  const account = useActiveAccount();
  const totalBalance = useTotalBalance();

  const [currencies, options] = useTypedSelector((store) => [
    store.currencies,
    store.options,
  ]);

  const assets = account.assets || [];

  if (loading) {
    return <LoadingOne />;
  }

  return (
    <>
      <Layout>
        <S.Head>
          <S.Account>
            <AccountModal />
          </S.Account>

          <div>
            <S.NameValue>{account.name}</S.NameValue>
            <CopyText
              text={account.publicKey}
              custom={
                <span className="text-xs text-primary-dark inline-flex items-center gap-[4px] ml-[2px]">
                  {shorter(account.publicKey, 6)}
                  <FilledCopy />
                </span>
              }
            />
          </div>

          <Link href={RouteName.WalletOption}>
            <S.ExpandLink>
              <ExpandHorizontal />
            </S.ExpandLink>
          </Link>
        </S.Head>
        <S.Asset>
          {formatBalance(totalBalance)}
          {" \"Fake USA\""}
        </S.Asset>

        <S.LinkContainer>
          <Links />
        </S.LinkContainer>
      </Layout>

      <S.Devider />

      <AssetList assets={assets} />
    </>
  );
};
export default Home;
