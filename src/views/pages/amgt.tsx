import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  Container,
} from '@mui/material';
import { useSDK, useAddress } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { SimpleStakeContractAddress, USDCTContractAddress } from '../../setting';
import { swapWithPermit } from '../../contract/SimpleStaking';

const AMGTPage: React.FC = () => {
  const [swapAmount, setSwapAmount] = useState('');
  const [swapLoading, setSwapLoading] = useState(false);
  const sdk = useSDK();
  const address = useAddress();

  const handleSwap = async () => {
    if (!sdk || !swapAmount) {
      alert('Please connect wallet and enter amount');
      return;
    }

    setSwapLoading(true);
    try {
      const signer = await sdk.getSigner();
      if (!signer) throw new Error('No signer available');
      const amountWei = ethers.utils.parseEther(swapAmount);

      // Use permit for single signature approval + swap
      await swapWithPermit(SimpleStakeContractAddress, USDCTContractAddress, amountWei, signer);

      alert('Swap successful! You received AMGT tokens.');
      setSwapAmount('');
    } catch (error) {
      console.error('Swap error:', error);
      alert('Swap failed: ' + (error as Error).message);
    } finally {
      setSwapLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#000', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="md">
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            mb: 2,
            fontWeight: 700,
            color: '#e3c78b',
          }}
        >
          Get Your AMGT Tokens
        </Typography>

        <Typography
          sx={{
            textAlign: 'center',
            mb: 6,
            color: '#ccc',
            fontSize: '1.1rem',
          }}
        >
          Swap your USDCT tokens for AMGT tokens
        </Typography>

        <Card
          sx={{
            p: 4,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            color: '#fff',
            border: '1px solid #333',
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ mb: 2, color: '#e3c78b', fontWeight: 500 }}>
              You Pay
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <TextField
                fullWidth
                placeholder="0.00"
                value={swapAmount}
                onChange={(e) => setSwapAmount(e.target.value)}
                type="number"
                InputProps={{
                  sx: {
                    bgcolor: '#000',
                    borderRadius: 2,
                    fontSize: '1.5rem',
                    color: '#fff',
                    border: '1px solid #444',
                    '& input': { textAlign: 'left', pl: 2, color: '#fff' },
                    '&:hover': { borderColor: '#e3c78b' },
                  },
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <img
                  src="https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png"
                  alt="USDCT"
                  style={{ width: 28, height: 28, borderRadius: '50%' }}
                />
                <Typography sx={{ fontWeight: 600, color: '#fff' }}>USDCT</Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              my: 3,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: '#e3c78b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                color: '#000',
                fontWeight: 'bold',
              }}
            >
              ↓
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography sx={{ mb: 2, color: '#e3c78b', fontWeight: 500 }}>
              You Receive
            </Typography>
            <Box
              sx={{
                bgcolor: '#000',
                borderRadius: 2,
                p: 2,
                border: '1px solid #444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography sx={{ fontSize: '1.5rem', color: '#e3c78b', fontWeight: 600 }}>
                {swapAmount || '0.00'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <img
                  src="https://happy-mushroom-05bf0a900.6.azurestaticapps.net/amgfaviconicon.c767ab92.webp"
                  alt="AMGT"
                  style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'contain' }}
                />
                <Typography sx={{ fontWeight: 600, color: '#fff' }}>AMGT</Typography>
              </Box>
            </Box>
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={handleSwap}
            disabled={swapLoading || !address || !swapAmount}
            sx={{
              bgcolor: '#e3c78b',
              color: '#000',
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 700,
              borderRadius: 2,
              '&:hover': { bgcolor: '#d4b86b', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(227, 199, 139, 0.4)' },
              '&:disabled': { bgcolor: '#555', color: '#999' },
              transition: 'all 0.3s ease',
            }}
          >
            {swapLoading ? 'Processing...' : address ? 'Swap Now' : 'Connect Wallet'}
          </Button>

          {!address && (
            <Typography
              sx={{
                mt: 2,
                textAlign: 'center',
                color: '#999',
                fontSize: '0.9rem',
              }}
            >
              Please connect your wallet to swap tokens
            </Typography>
          )}
        </Card>

        <Box sx={{ mt: 4, p: 3, bgcolor: '#1a1a1a', borderRadius: '12px', border: '1px solid #333' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#e3c78b' }}>
            How it works
          </Typography>
          <Typography sx={{ mb: 1, color: '#ccc' }}>
            1. Connect your wallet using the button in the navigation bar
          </Typography>
          <Typography sx={{ mb: 1, color: '#ccc' }}>
            2. Enter the amount of USDCT you want to swap
          </Typography>
          <Typography sx={{ mb: 1, color: '#ccc' }}>
            3. Click "Swap Now" and approve the transaction in your wallet
          </Typography>
          <Typography sx={{ color: '#ccc' }}>
            4. Receive AMGT tokens at a 1:1 ratio
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AMGTPage;
