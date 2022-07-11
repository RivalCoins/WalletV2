import React, { useEffect } from 'react';
import useTypedSelector from 'hooks/useTypedSelector';
import Loading from 'components/Loading';
import { useRouter } from 'next/router';
import store from 'actions/accounts/store';

const RoutesManager = ({ pageProps }) => {
  const router = useRouter();
  const [user, accounts] = useTypedSelector((store) => [
    store.user,
    store.accounts,
  ]);

  useEffect(() => {
    console.log(pageProps);
    if (!user.registered) {
      router.push('/intro');
    } else if (!user.logged) {
      router.push('/login');
    } else if (!accounts) {
      router.push('/first');
    } else {
      if (pageProps.role === 'before-login') {
        router.push('/home');
      } else {
        router.push(router.pathname);
      }
    }
  }, []);

  return <Loading title="Redirecting" size={32} />;
};

export default RoutesManager;
