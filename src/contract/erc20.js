import { ethers } from 'ethers';
import erc20ABI from './erc20_ABI.json';

/**
 * Approve spender to spend tokens on behalf of the owner
 * @param {string} tokenAddress - ERC20 token contract address
 * @param {string} spenderAddress - Address to approve
 * @param {string} amount - Amount to approve (in wei or token's smallest unit)
 * @param {object} signer - Ethers signer instance
 * @returns {Promise<object>} Transaction receipt
 */
export async function approve(tokenAddress, spenderAddress, amount, signer) {
  const contract = new ethers.Contract(tokenAddress, erc20ABI, signer);
  const tx = await contract.approve(spenderAddress, amount);
  return await tx.wait();
}

/**
 * Approve via signature using EIP-2612 permit (gasless approval)
 * @param {string} tokenAddress - ERC20 token contract address
 * @param {string} spenderAddress - Address to approve
 * @param {string} amount - Amount to approve (in wei)
 * @param {object} signer - Ethers signer instance
 * @param {number} deadline - Unix timestamp for permit expiration (optional, defaults to 1 hour)
 * @returns {Promise<object>} Permit signature data
 */
export async function getPermitSignature(tokenAddress, spenderAddress, amount, signer, deadline) {
  const contract = new ethers.Contract(tokenAddress, erc20ABI, signer);
  const owner = await signer.getAddress();

  // Get nonce for the owner
  const nonces = await contract.nonces(owner);

  // Set deadline to 1 hour from now if not provided
  const permitDeadline = deadline || Math.floor(Date.now() / 1000) + 3600;

  // Get domain separator data
  const name = await contract.name();
  const chainId = await signer.getChainId();

  // EIP-712 domain
  const domain = {
    name: name,
    version: '1',
    chainId: chainId,
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
    owner: owner,
    spender: spenderAddress,
    value: amount,
    nonce: nonces,
    deadline: permitDeadline
  };

  // Sign the permit
  const signature = await signer._signTypedData(domain, types, value);
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
 * @param {string} tokenAddress - ERC20 token contract address
 * @param {object} permitData - Permit signature data from getPermitSignature
 * @param {object} signer - Ethers signer instance
 * @returns {Promise<object>} Transaction receipt
 */
export async function executePermit(tokenAddress, permitData, signer) {
  const contract = new ethers.Contract(tokenAddress, erc20ABI, signer);
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
