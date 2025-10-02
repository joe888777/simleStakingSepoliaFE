import { useState, useEffect, CSSProperties } from 'react';
import { ThirdwebProvider, ConnectWallet, useAddress, useSDK } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { AMGTContractAddress, USDCTContractAddress, SimpleStakeContractAddress } from './setting';
import { deposit, withdraw, getStakedBalance, getDepositedBalance, getTotalStaked, getTotalDeposited, stakeWithPermit, swapWithPermit } from './contract/SimpleStaking';
import { approve } from './contract/erc20';

import AmgPage from './AmgPage';

// Your smart contract configuration
const CONTRACT_ADDRESS = '0x...'; // Replace with your contract address
const CONTRACT_ABI = [
  // Replace with your contract ABI
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

function WalletInteraction() {
  const address = useAddress();
  const sdk = useSDK();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Staking states
  const [stakeAmount, setStakeAmount] = useState<string>('');
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [swapAmount, setSwapAmount] = useState<string>('');
  const [stakedBalance, setStakedBalance] = useState<string>('0');
  const [depositedBalance, setDepositedBalance] = useState<string>('0');
  const [totalStaked, setTotalStaked] = useState<string>('0');
  const [totalDeposited, setTotalDeposited] = useState<string>('0');
  const [stakingLoading, setStakingLoading] = useState<boolean>(false);

  // Initialize contract with ethers.js
  useEffect(() => {
    if (sdk && address) {
      const initContract = async () => {
        try {
          const signer = await sdk.getSigner();
          const ethersContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            signer
          );
          setContract(ethersContract);
        } catch (error) {
          console.error('Error initializing contract:', error);
        }
      };
      initContract();
    }
  }, [sdk, address]);

  // Fetch balance
  const fetchBalance = async () => {
    if (contract && address) {
      try {
        const bal = await contract.balanceOf(address);
        setBalance(ethers.utils.formatEther(bal));
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [contract, address]);

  // Fetch staking data
  const fetchStakingData = async () => {
    if (sdk && address) {
      try {
        const provider = await sdk.getProvider();
        const stakedBal = await getStakedBalance(SimpleStakeContractAddress, address, provider);
        const depositedBal = await getDepositedBalance(SimpleStakeContractAddress, address, provider);
        const total_staked = await getTotalStaked(SimpleStakeContractAddress, provider);
        const total_deposited = await getTotalDeposited(SimpleStakeContractAddress, provider);

        setStakedBalance(ethers.utils.formatEther(stakedBal));
        setDepositedBalance(ethers.utils.formatEther(depositedBal));
        setTotalStaked(ethers.utils.formatEther(total_staked));
        setTotalDeposited(ethers.utils.formatEther(total_deposited));
      } catch (error) {
        console.error('Error fetching staking data:', error);
      }
    }
  };

  useEffect(() => {
    fetchStakingData();
  }, [sdk, address]);

  // Transfer tokens
  const handleTransfer = async () => {
    if (!contract || !recipient || !amount) return;

    setLoading(true);
    try {
      const tx = await contract.transfer(
        recipient,
        ethers.utils.parseEther(amount)
      );
      await tx.wait();
      alert('Transfer successful!');
      fetchBalance();
      setRecipient('');
      setAmount('');
    } catch (error) {
      console.error('Transfer error:', error);
      alert('Transfer failed: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Staking handlers
  const handleStake = async () => {
    if (!sdk || !stakeAmount) return;

    setStakingLoading(true);
    try {
      const signer = await sdk.getSigner();
      if (!signer) throw new Error('No signer available');
      const amountWei = ethers.utils.parseEther(stakeAmount);

      // Use permit for single signature approval + stake
      await stakeWithPermit(SimpleStakeContractAddress, AMGTContractAddress, amountWei, signer);

      alert('Stake successful!');
      setStakeAmount('');
      fetchStakingData();
    } catch (error) {
      console.error('Stake error:', error);
      alert('Stake failed: ' + (error as Error).message);
    } finally {
      setStakingLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!sdk || !depositAmount) return;

    setStakingLoading(true);
    try {
      const signer = await sdk.getSigner();
      if (!signer) throw new Error('No signer available');
      const amountWei = ethers.utils.parseEther(depositAmount);

      // Deposit uses approve method (no depositWithPermit in contract)
      await approve(AMGTContractAddress, SimpleStakeContractAddress, amountWei, signer);
      await deposit(SimpleStakeContractAddress, amountWei, signer);

      alert('Deposit successful!');
      setDepositAmount('');
      fetchStakingData();
    } catch (error) {
      console.error('Deposit error:', error);
      alert('Deposit failed: ' + (error as Error).message);
    } finally {
      setStakingLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!sdk || !withdrawAmount) return;

    setStakingLoading(true);
    try {
      const signer = await sdk.getSigner();
      if (!signer) throw new Error('No signer available');
      const amountWei = ethers.utils.parseEther(withdrawAmount);

      await withdraw(SimpleStakeContractAddress, amountWei, signer);

      alert('Withdraw successful!');
      setWithdrawAmount('');
      fetchStakingData();
    } catch (error) {
      console.error('Withdraw error:', error);
      alert('Withdraw failed: ' + (error as Error).message);
    } finally {
      setStakingLoading(false);
    }
  };

  const handleSwap = async () => {
    if (!sdk || !swapAmount) return;

    setStakingLoading(true);
    try {
      const signer = await sdk.getSigner();
      if (!signer) throw new Error('No signer available');
      const amountWei = ethers.utils.parseEther(swapAmount);

      // Use permit for single signature approval + swap
      await swapWithPermit(SimpleStakeContractAddress, USDCTContractAddress, amountWei, signer);

      alert('Swap successful!');
      setSwapAmount('');
      fetchStakingData();
    } catch (error) {
      console.error('Swap error:', error);
      alert('Swap failed: ' + (error as Error).message);
    } finally {
      setStakingLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Web3 Wallet & Contract Interaction</h1>

      <div style={styles.walletSection}>
        <ConnectWallet />
      </div>

      {address && (
        <div style={styles.infoSection}>
          <h2>Wallet Connected</h2>
          <p><strong>Address:</strong> {address}</p>
          <p><strong>Balance:</strong> {balance} tokens</p>
          <button onClick={fetchBalance} style={styles.button}>
            Refresh Balance
          </button>
        </div>
      )}

      {contract && (
        <div style={styles.interactionSection}>
          <h2>Contract Interaction</h2>
          <div style={styles.form}>
            <input
              type="text"
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={styles.input}
            />
            <button
              onClick={handleTransfer}
              disabled={loading}
              style={styles.button}
            >
              {loading ? 'Processing...' : 'Transfer Tokens'}
            </button>
          </div>
        </div>
      )}

      {address && (
        <div style={styles.stakingSection}>
          <h2>Staking</h2>

          <div style={styles.balanceGrid}>
            <div style={styles.balanceCard}>
              <h3>Your Staked Balance</h3>
              <p style={styles.balanceValue}>{stakedBalance} tokens</p>
            </div>
            <div style={styles.balanceCard}>
              <h3>Your Deposited Balance</h3>
              <p style={styles.balanceValue}>{depositedBalance} tokens</p>
            </div>
            <div style={styles.balanceCard}>
              <h3>Total Staked</h3>
              <p style={styles.balanceValue}>{totalStaked} tokens</p>
            </div>
            <div style={styles.balanceCard}>
              <h3>Total Deposited</h3>
              <p style={styles.balanceValue}>{totalDeposited} tokens</p>
            </div>
          </div>

          <div style={styles.actionGrid}>
            {/* Stake Section */}
            <div style={styles.actionCard}>
              <h3>Stake Tokens</h3>
              <input
                type="text"
                placeholder="Amount to stake"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                style={styles.input}
              />
              <button
                onClick={handleStake}
                disabled={stakingLoading}
                style={styles.button}
              >
                {stakingLoading ? 'Processing...' : 'Stake'}
              </button>
            </div>

            {/* Deposit Section */}
            <div style={styles.actionCard}>
              <h3>Deposit for Liquidity</h3>
              <input
                type="text"
                placeholder="Amount to deposit"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                style={styles.input}
              />
              <button
                onClick={handleDeposit}
                disabled={stakingLoading}
                style={styles.button}
              >
                {stakingLoading ? 'Processing...' : 'Deposit'}
              </button>
            </div>

            {/* Withdraw Section */}
            <div style={styles.actionCard}>
              <h3>Withdraw Staked</h3>
              <input
                type="text"
                placeholder="Amount to withdraw"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                style={styles.input}
              />
              <button
                onClick={handleWithdraw}
                disabled={stakingLoading}
                style={styles.button}
              >
                {stakingLoading ? 'Processing...' : 'Withdraw'}
              </button>
            </div>

            {/* Swap Section */}
            <div style={styles.actionCard}>
              <h3>Swap TokenA → TokenB</h3>
              <input
                type="text"
                placeholder="Amount to swap"
                value={swapAmount}
                onChange={(e) => setSwapAmount(e.target.value)}
                style={styles.input}
              />
              <button
                onClick={handleSwap}
                disabled={stakingLoading}
                style={styles.button}
              >
                {stakingLoading ? 'Processing...' : 'Swap'}
              </button>
            </div>
          </div>

          <button
            onClick={fetchStakingData}
            style={{...styles.button, marginTop: '20px'}}
          >
            Refresh Staking Data
          </button>
        </div>
      )}
    </div>
  );
}

function WalletPage() {
  return (
    <ThirdwebProvider
      activeChain="sepolia"
      clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID}
    >
      {/* <WalletInteraction /> */}
      <AmgPage/>
      {/* {`${process.env.VITE_APP_API_URL_LOCAL}`} */}
    </ThirdwebProvider>
  );
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif',
  },
  walletSection: {
    marginBottom: '30px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
  },
  infoSection: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
  },
  interactionSection: {
    marginBottom: '30px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
  },
  stakingSection: {
    padding: '20px',
    border: '2px solid #007bff',
    borderRadius: '8px',
    backgroundColor: '#f0f8ff',
  },
  balanceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '30px',
  },
  balanceCard: {
    padding: '15px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    textAlign: 'center',
  },
  balanceValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#28a745',
    margin: '10px 0 0 0',
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  },
  actionCard: {
    padding: '20px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '10px',
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default WalletPage;
