import { useEffect, useState } from 'react';
import { abi, contractAddress } from '../constants';
import { useWeb3Contract, useMoralis } from 'react-moralis';
import { useNotification } from 'web3uikit';
import { ethers } from 'ethers';

export const LotteryEntrance = () => {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();

  const [entranceFee, setEntranceFee] = useState(null);
  const [numPlayers, setNumPlayers] = useState(0);
  const [recentWinner, setRecentWinner] = useState(null);

  const chainId = parseInt(chainIdHex);
  const raffleAddress = chainId in contractAddress ? contractAddress[chainId][0] : null;

  const dispatch = useNotification();
  const {runContractFunction: getEntranceFee} = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: 'getEntranceFee',
  });
  const {runContractFunction: enterRaffle, isLoading, isFetching} = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: 'enterRaffle',
    params: {},
    msgValue: entranceFee
  });
  const {runContractFunction: getNumberOfPlayers} = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: 'getNumberOfPlayers',
  });
  const {runContractFunction: getRecentWinner} = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: 'getRecentWinner',
  });

  useEffect(() => {
    const updateUI = async () => {
      const entranceFee = await getEntranceFee();
      const numPlayersFromCall = await getNumberOfPlayers();
      const recentWinnerFromCall = await getRecentWinner(); 
      setEntranceFee(entranceFee?.toString());
      setNumPlayers(numPlayersFromCall?.toString());
      setRecentWinner(recentWinnerFromCall);
    }
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled, getEntranceFee, getNumberOfPlayers, getRecentWinner])


  const handleEnterSuccess = async (tx) => {
    await tx.wait(1);
    handleNewNotification();
    const numPlayersFromCall = await getNumberOfPlayers();
    const recentWinnerFromCall = await getRecentWinner(); 
    setNumPlayers(numPlayersFromCall?.toString());
    setRecentWinner(recentWinnerFromCall);
  }

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "transaction complete",
      title: "Tx notification",
      position: "topR",
    });
  }

  return (
    raffleAddress ? 
    <div>
      <div>
        {/* onSuccess doesn't check block confirmations */}
        <button
          className='bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded'
          onClick={async () => {
            await enterRaffle({
              onSuccess: handleEnterSuccess,
              onError: (e) => console.log(e)
            });
          }}
          disabled={isLoading || isFetching}
        >
          {
            (isLoading || isFetching)
            ? <div className='animate-spin spinner-border h-6 w-6 border-b-2 rounded-full'></div>
            : <div>Enter Raffle</div>
          }
        </button>
      </div>
      <p>entrance fee: { entranceFee ? ethers.utils.formatUnits(entranceFee, 'ether') : 0 } ETH</p>
      <p>recnet winner: { recentWinner || 'no recent winner' }</p>
      <p>number of players: { numPlayers || 0 } </p>
    </div> : <span>no raffle address</span>
  )
}
