import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Container,
  CircularProgress,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { CheckCircle, Close } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSDK } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { AMGTContractAddress, SimpleStakeContractAddress } from '../../setting';
import { stakeWithPermit } from '../../contract/SimpleStaking';

interface LocationState {
  investmentAmount: string;
  planID: string;
  planDetailTitle: string;
}

const InvestmentConfirm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sdk = useSDK();
  const { investmentAmount, planID, planDetailTitle } = (location.state as LocationState) || {};

  const [stakingLoading, setStakingLoading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorToast, setErrorToast] = useState({ open: false, message: '' });

  const handleConfirmInvest = async () => {
    if (!sdk || !investmentAmount) {
      setErrorToast({ open: true, message: 'Invalid investment data' });
      return;
    }

    setStakingLoading(true);
    try {
      const signer = await sdk.getSigner();
      if (!signer) throw new Error('No signer available');
      const amountWei = ethers.utils.parseEther(investmentAmount);

      // Use permit for single signature approval + stake
      await stakeWithPermit(SimpleStakeContractAddress, AMGTContractAddress, amountWei, signer);

      setSuccessModalOpen(true);
    } catch (error) {
      console.error('Investment error:', error);
      setErrorToast({
        open: true,
        message: 'Investment failed: ' + (error as Error).message
      });
    } finally {
      setStakingLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessModalOpen(false);
    navigate('/Plandetail', { state: { planID } });
  };

  if (!investmentAmount || !planID) {
    return (
      <Box sx={{ bgcolor: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ color: '#e3c78b' }}>Invalid investment data</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#000', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="md">
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            mb: 4,
            fontWeight: 700,
            color: '#e3c78b',
          }}
        >
          Confirm Investment
        </Typography>

        {/* Investment Summary */}
        <Card sx={{ bgcolor: '#1a1a1a', p: 4, mb: 4, border: '1px solid #e3c78b' }}>
          <Typography variant="h6" sx={{ mb: 3, color: '#e3c78b', fontWeight: 600 }}>
            Investment Amount
          </Typography>
          <Box sx={{ bgcolor: '#000', p: 3, borderRadius: 2, border: '1px solid #444', mb: 2 }}>
            <Typography variant="h3" sx={{ color: '#e3c78b', fontWeight: 700, mb: 1 }}>
              {investmentAmount} AMGT
            </Typography>
            <Typography sx={{ color: '#999' }}>
              ≈ ${investmentAmount} USD
            </Typography>
          </Box>
          {planDetailTitle && (
            <Typography sx={{ color: '#ccc', mt: 2 }}>
              Investment Plan: {planDetailTitle}
            </Typography>
          )}
        </Card>

        <Divider sx={{ bgcolor: '#444', my: 4 }} />

        {/* Subscription Agreement */}
        <Card sx={{ bgcolor: '#1a1a1a', p: 4, mb: 3, border: '1px solid #333' }}>
          <Typography variant="h6" sx={{ mb: 3, color: '#e3c78b', fontWeight: 600 }}>
            Subscription Agreement
          </Typography>
          <Box
            sx={{
              bgcolor: '#000',
              p: 3,
              borderRadius: 2,
              border: '1px solid #444',
              maxHeight: 300,
              overflowY: 'auto',
            }}
          >
            <Typography sx={{ color: '#ccc', fontSize: '0.95rem', lineHeight: 1.8, mb: 2 }}>
              <strong>Article 1: Agreement Purpose</strong>
              <br />
              This Subscription Agreement aims to clarify the rights and obligations between investors and the platform, ensuring transparency and legality of the investment process.
            </Typography>
            <Typography sx={{ color: '#ccc', fontSize: '0.95rem', lineHeight: 1.8, mb: 2 }}>
              <strong>Article 2: Investment Terms</strong>
              <br />
              1. The investor agrees to stake the specified amount of AMGT tokens into the smart contract.
              <br />
              2. Investment period and withdrawal conditions are subject to the plan specifications.
              <br />
              3. Investment returns are not guaranteed and depend on market conditions and plan performance.
            </Typography>
            <Typography sx={{ color: '#ccc', fontSize: '0.95rem', lineHeight: 1.8, mb: 2 }}>
              <strong>Article 3: Risk Disclosure</strong>
              <br />
              1. Cryptocurrency investments carry market risks and may result in loss of principal.
              <br />
              2. Smart contract risks: Although audited, there may still be unknown vulnerabilities.
              <br />
              3. Liquidity risk: Funds cannot be withdrawn immediately during the staking period.
            </Typography>
            <Typography sx={{ color: '#ccc', fontSize: '0.95rem', lineHeight: 1.8 }}>
              <strong>Article 4: Limitation of Liability</strong>
              <br />
              The platform is not liable for losses caused by force majeure factors such as market volatility, technical failures, or policy changes.
            </Typography>
          </Box>
        </Card>

        {/* Investor Declaration */}
        <Card sx={{ bgcolor: '#1a1a1a', p: 4, mb: 4, border: '1px solid #333' }}>
          <Typography variant="h6" sx={{ mb: 3, color: '#e3c78b', fontWeight: 600 }}>
            Investor Declaration
          </Typography>
          <Box
            sx={{
              bgcolor: '#000',
              p: 3,
              borderRadius: 2,
              border: '1px solid #444',
            }}
          >
            <Typography sx={{ color: '#ccc', fontSize: '0.95rem', lineHeight: 1.8 }}>
              I hereby declare:
              <br /><br />
              1. I have fully understood all terms and related risks of this investment plan.
              <br />
              2. I have the appropriate risk tolerance and am willing to bear potential losses from the investment.
              <br />
              3. All information I provide is true and valid, and I take full responsibility for my investment decisions.
              <br />
              4. I agree to comply with all rules and regulations of the platform.
              <br />
              5. I confirm that the source of my investment funds is legal and does not involve money laundering or other illegal activities.
            </Typography>
          </Box>
        </Card>

        {/* Agreement Notice */}
        <Box
          sx={{
            bgcolor: '#2a2a2a',
            p: 3,
            borderRadius: 2,
            border: '1px solid #e3c78b',
            mb: 4,
            textAlign: 'center',
          }}
        >
          <Typography sx={{ color: '#e3c78b', fontWeight: 600, fontSize: '1.1rem' }}>
            By clicking "Confirm Investment" you agree to subscribe
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate(-1)}
            disabled={stakingLoading}
            sx={{
              borderColor: '#e3c78b',
              color: '#e3c78b',
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': { borderColor: '#d4b86b', bgcolor: 'rgba(227, 199, 139, 0.1)' },
            }}
          >
            Back
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={handleConfirmInvest}
            disabled={stakingLoading}
            sx={{
              bgcolor: '#e3c78b',
              color: '#000',
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 700,
              '&:hover': { bgcolor: '#d4b86b' },
              '&:disabled': { bgcolor: '#555', color: '#999' },
            }}
          >
            {stakingLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} sx={{ color: '#000' }} />
                Processing...
              </Box>
            ) : 'Confirm Investment'}
          </Button>
        </Box>
      </Container>

      {/* Success Modal */}
      <Dialog
        open={successModalOpen}
        onClose={handleSuccessClose}
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            color: '#fff',
            borderRadius: 3,
            border: '1px solid #e3c78b',
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <IconButton
            onClick={handleSuccessClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: '#999' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <CheckCircle sx={{ fontSize: 80, color: '#e3c78b', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#e3c78b' }}>
            Investment Successful!
          </Typography>
          <Typography sx={{ color: '#ccc', mb: 1 }}>
            Your investment has been successfully staked
          </Typography>
          <Typography sx={{ color: '#999', fontSize: '0.9rem' }}>
            You can view your staked balance in your wallet
          </Typography>
        </DialogContent>
      </Dialog>

      {/* Error Toast */}
      <Snackbar
        open={errorToast.open}
        autoHideDuration={6000}
        onClose={() => setErrorToast({ ...errorToast, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setErrorToast({ ...errorToast, open: false })}
          severity="error"
          sx={{
            bgcolor: '#d32f2f',
            color: '#fff',
            '& .MuiAlert-icon': { color: '#fff' },
          }}
        >
          {errorToast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InvestmentConfirm;
