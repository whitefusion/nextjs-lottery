import { useEffect } from 'react';
import { useMoralis } from 'react-moralis';

export const ManualHeader = () => {
  const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis();

  useEffect(() => {
    if (isWeb3Enabled) return;
    if (window && window.localStorage) {
      if (window.localStorage.getItem("connected")) {
        enableWeb3();
      }
    }
  }, [isWeb3Enabled, enableWeb3]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log(`account changed to ${account}`);
      if (!account) {
        window.localStorage.removeItem('connected');
        deactivateWeb3();
        console.log('null account found');
      }
    });
  }, [Moralis, deactivateWeb3]);

  const clickConnect = async () => {
    await enableWeb3();
    if (window && window.localStorage) {
      window.localStorage.setItem("connected", "injected");
    }
  }

  return (
    <>
      {
        account ? <span>connected to { account }</span>
        : <button onClick={clickConnect} disabled={isWeb3EnableLoading}>connect</button>
      }
    </>
  );
}
