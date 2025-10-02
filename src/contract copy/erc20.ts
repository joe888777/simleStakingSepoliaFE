// src/contract/erc20.ts
import { ethers, BigNumberish, Contract, Signer } from 'ethers';
import erc20ABI from './erc20_ABI.json';

// Type for permit signature
export interface PermitData {
  owner: string;
  spender: string;
  value: BigNumberish;
  deadline: number;
  v: number;
  r: string;
  s: string;
}

/**
 * Approve spender to spend tokens on behalf of the owner
 * @param tokenAddress - ERC20 token contract address
 * @param spenderAddress - Address to approve
 * @param amount - Amount to approve (in wei or token's smallest unit)
 * @param signer - Ethers signer instance
 * @returns Transaction receipt
 */
export async function approve(
  tokenAddress: string,
  spenderAddress: string,
  amount: BigNumberish,
  signer: Signer
): Promise<ethers.providers.TransactionReceipt> {
  const contract: Contract = new ethers.Contract(tokenAddress, erc20ABI, signer);
  const tx = await contract.approve(spenderAddress, amount);
  return await tx.wait();
}

/**
 * Approve via signature using EIP-2612 permit (gasless approval)
 * @param tokenAddress - ERC20 token contract address
 * @param spenderAddress - Address to approve
 * @param amount - Amount to approve (in wei)
 * @param signer - Ethers signer instance
 * @param deadline - Unix timestamp for permit expiration (optional, defaults to 1 hour)
 * @returns Permit signature data
 */
export async function getPermitSignature(
  tokenAddress: string,
  spenderAddress: string,
  amount: BigNumberish,
  signer: Signer,
  deadline?: number
): Promise<PermitData> {
  const contract: Contract = new ethers.Contract(tokenAddress, erc20ABI, signer);
  const owner: string = await signer.getAddress();

  // Get nonce for the owner
  const nonce: BigNumberish = await contract.nonces(owner);

  // Set deadline to 1 hour from now if not provided
  const permitDeadline: number = deadline || Math.floor(Date.now() / 1000) + 3600;

  // Get domain separator data
  const name: string = await contract.name();
  const chainId: number = await signer.getChainId();

  // EIP-712 domain
  const domain = {
    name,
    version: '1',
    chainId,
    verifyingContract: tokenAddress
  };

  // EIP-712 types
  const types = {
    Permit: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' }
    ]
  };

  // Message to sign
  const value = {
    owner,
    spender: spenderAddress,
    value: amount,
    nonce,
    deadline: permitDeadline
  };

  // Sign the permit
  // Use the public signTypedData method if available, otherwise cast to Wallet
  let signature: string;
  if ('signTypedData' in signer && typeof signer.signTypedData === 'function') {
    signature = await (signer as any).signTypedData(domain, types, value);
  } else if ('_signTypedData' in signer && typeof (signer as any)._signTypedData === 'function') {
    // fallback for Wallet type
    signature = await (signer as any)._signTypedData(domain, types, value);
  } else {
    throw new Error('Signer does not support signTypedData or _signTypedData');
  }
  const sig = ethers.utils.splitSignature(signature);

  return {
    owner,
    spender: spenderAddress,
    value: amount,
    deadline: permitDeadline,
    v: sig.v,
    r: sig.r,
    s: sig.s
  };
}

/**
 * Execute permit transaction (approves via signature)
 * @param tokenAddress - ERC20 token contract address
 * @param permitData - Permit signature data from getPermitSignature
 * @param signer - Ethers signer instance
 * @returns Transaction receipt
 */
export async function executePermit(
  tokenAddress: string,
  permitData: PermitData,
  signer: Signer
): Promise<ethers.providers.TransactionReceipt> {
  const contract: Contract = new ethers.Contract(tokenAddress, erc20ABI, signer);
  const tx = await contract.permit(
    permitData.owner,
    permitData.spender,
    permitData.value,
    permitData.deadline,
    permitData.v,
    permitData.r,
    permitData.s
  );
  return await tx.wait();
}
