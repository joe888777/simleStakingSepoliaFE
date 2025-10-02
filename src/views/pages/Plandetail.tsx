import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { CheckCircle, Close } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useSDK, useAddress } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { AMGTContractAddress, SimpleStakeContractAddress } from '../../setting';
import { stakeWithPermit, getTotalStaked } from '../../contract/SimpleStaking';

const API_BASE_URL = 'http://192.168.1.107:8081';

export interface PlanDetailSection {
  detailID: string;
  displayOrder: number;
  sectionID: string;
  sectionName: string;
  sectiontextdata: string;
}

export interface PlanDetail {
  planDetailTitle: string;
  planDetailDescription1: string;
  planDetailDescription2: string;
  planID: string;
  planDetailImage: string;
  minInvestment: number;
  AUM: number;
  plandetailinfosectiondata?: PlanDetailSection[];
}

const InvestmentDetailPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [planDetail, setPlanDetail] = useState<PlanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabsData, setTabsData] = useState<{ sectionId: string; sectionName: string }[]>([]);
  const [tabContents, setTabContents] = useState<{ [key: string]: string }>({});
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [stakingLoading, setStakingLoading] = useState(false);
  const [totalStaked, setTotalStaked] = useState<string>('0');
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const location = useLocation();
  const { planID } = location.state || {};
  const sdk = useSDK();
  const address = useAddress();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    const ref = tabRefs.current[newValue];
    if (ref) ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleInvest = async () => {
    if (!sdk || !investmentAmount) {
      alert('Please connect wallet and enter amount');
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
      setInvestmentAmount('');
    } catch (error) {
      console.error('Investment error:', error);
      alert('Investment failed: ' + (error as Error).message);
    } finally {
      setStakingLoading(false);
    }
  };

  const getPlanImageUrl = (planDetailImage: string) => {
    if (!planDetailImage) return '/assets/fallback.jpg';
    if (planDetailImage.startsWith('http')) return planDetailImage;
    if (planDetailImage.startsWith('/assets/')) return planDetailImage;
    return `${API_BASE_URL}/${planDetailImage}`;
  };

  useEffect(() => {
    const fetchPlanDetail = async () => {
      if (!planID) return;
      setLoading(true);

      try {
        const response = await api.get(`/Amgplan/getactiveplans/${planID}`);
        const data: PlanDetail = Array.isArray(response.data) ? response.data[0] : response.data;

        if (!data) {
          setPlanDetail(null);
          return;
        }

        setPlanDetail(data);

        // Sort sections by displayOrder
        const sections = (data.plandetailinfosectiondata || []).sort((a, b) => a.displayOrder - b.displayOrder);

        // Set tabs
        setTabsData(sections.map((sec) => ({ sectionId: sec.sectionID, sectionName: sec.sectionName })));

        // Set content for each tab
        const contents: { [key: string]: string } = {};
        sections.forEach((sec) => {
          contents[sec.sectionID] = sec.sectiontextdata || 'No content available';
        });
        setTabContents(contents);
      } catch (err) {
        console.error('Error fetching plan detail:', err);
        setPlanDetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanDetail();
  }, [planID]);

  useEffect(() => {
    const fetchTotalStaked = async () => {
      if (!sdk) return;
      try {
        const provider = await sdk.getProvider();
        const total = await getTotalStaked(SimpleStakeContractAddress, provider);
        setTotalStaked(ethers.utils.formatEther(total));
      } catch (err) {
        console.error('Error fetching total staked:', err);
      }
    };

    fetchTotalStaked();
  }, [sdk]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!planDetail) {
    return (
      <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>
        No plan details found.
      </Typography>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f0f0f0', minHeight: '100vh', pb: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: 400,
          backgroundImage: `url(${getPlanImageUrl(planDetail.planDetailImage)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          pt: 6,
          px: 2,
        }}
      >
        <Card
          sx={{
            backdropFilter: 'blur(6px)',
            background: 'rgba(0,0,0,0.65)',
            borderRadius: '16px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2rem',
            maxWidth: '1200px',
            width: '75%',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: '2rem',
            mt: 4,
            mb: 4,
          }}
        >
          {/* Left Info */}
          <Box sx={{ flex: '0 1 550px', maxWidth: '600px', minWidth: 300 }}>
            <Typography
              sx={{ color: '#eae0b8', mb: 2, fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.2 }}
            >
              {planDetail.planDetailTitle}
            </Typography>
            <Typography sx={{ mb: 3, color: '#ccc', fontSize: '0.95rem', lineHeight: 1.5 }}>
              {planDetail.planDetailDescription1}
            </Typography>

            <Card sx={{ bgcolor: '#111', color: '#e3c78b', p: 2, borderRadius: '12px', mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontWeight: 500, fontSize: '0.95rem' }}>Minimum Investment</Typography>
              <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>
                {planDetail.minInvestment != null ? `${planDetail.minInvestment} AMGF Tokens` : 'N/A'}
              </Typography>
            </Card>

            <Card sx={{ bgcolor: '#111', color: '#e3c78b', p: 2, borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontWeight: 500, fontSize: '0.95rem' }}>AUM</Typography>
              <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>
                {totalStaked ? `$${parseFloat(totalStaked).toLocaleString()} USD` : 'Loading...'}
              </Typography>
            </Card>
          </Box>

          {/* Right Investment Card */}
          <Box sx={{ flex: '0 0 360px', minWidth: 280, ml: -20, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <Card sx={{ backdropFilter: 'blur(6px)', background: 'rgba(0,0,0,0.7)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: 1, padding: '1.5rem', alignItems: 'center', height: '100%', minHeight: 250 }}>
              <Typography sx={{ color: '#ccc', fontWeight: 500, fontSize: '1rem' }}>Enter your investment</Typography>

              <Box sx={{ width: '100%', position: 'relative' }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="0.00"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  InputProps={{ sx: { bgcolor: '#fff', borderRadius: 1, pr: 6, fontSize: '0.95rem' } }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: '#e3c78b',
                    color: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                  }}
                >
                  AMGT
                </Box>
              </Box>

              <Typography sx={{ fontSize: '0.875rem', color: '#ccc', textAlign: 'justify', mt: 0.5, width: '100%', lineHeight: 1.5 }}>
                {planDetail.planDetailDescription2}
              </Typography>

              <Button
                fullWidth
                variant="contained"
                sx={{
                  bgcolor: '#e3c78b',
                  color: '#000',
                  mt: 1,
                  '&:hover': { bgcolor: '#d4b86b' },
                  '&:disabled': { bgcolor: '#555', color: '#999' },
                  fontSize: '1rem',
                  fontWeight: 600
                }}
                onClick={handleInvest}
                disabled={
                  stakingLoading ||
                  !address ||
                  !investmentAmount ||
                  (planDetail?.minInvestment && parseFloat(investmentAmount) < planDetail.minInvestment)
                }
              >
                {stakingLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={18} sx={{ color: '#000' }} />
                    Processing...
                  </Box>
                ) : !address ? 'Connect Wallet'
                  : !investmentAmount ? 'Invest'
                  : (planDetail?.minInvestment && parseFloat(investmentAmount) < planDetail.minInvestment)
                    ? `Min ${planDetail.minInvestment} AMGF`
                    : 'Invest'}
              </Button>
            </Card>
          </Box>
        </Card>
      </Box>

      {/* Dynamic Tabs Section */}
      <Box sx={{ maxWidth: 1200, mx: 'auto', mt:2}}>
        <Paper>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              bgcolor: '#000',
              '.MuiTab-root': { color: '#fff !important', fontWeight: 500 },
              '.Mui-selected': { color: '#fff !important', fontWeight: 700 },
              '.MuiTabs-indicator': { bgcolor: '#e3c78b' },
            }}
          >
            {tabsData.map((tab, idx) => (
              <Tab key={tab.sectionId} label={tab.sectionName} />
            ))}
          </Tabs>
        </Paper>

        <Box sx={{ bgcolor: '#f0f0f0', p: 4 }}>
          {tabsData.map((tab, idx) => (
            <Card
              key={tab.sectionId}
              ref={(el) => (tabRefs.current[idx] = el)}
              sx={{ bgcolor: '#fff', color: '#000', p: 3, mb: 4 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.25rem', mb: 1 }}>
                {tab.sectionName}
              </Typography>
              <Typography
                sx={{ fontSize: '0.95rem', lineHeight: 1.5 }}
                component="div"
                dangerouslySetInnerHTML={{ __html: tabContents[tab.sectionId] || 'Loading...' }}
              />
            </Card>
          ))}
        </Box>
      </Box>

      {/* Success Modal */}
      <Dialog
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
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
            onClick={() => setSuccessModalOpen(false)}
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
            Your investment has been successfully staked.
          </Typography>
          <Typography sx={{ color: '#999', fontSize: '0.9rem' }}>
            You can view your staked balance in your wallet.
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default InvestmentDetailPage;
