import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Button, CircularProgress } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';

interface Plan {
  planID: string;
  planName: string;
  planTitle: string;
  planDescription: string;
  planImage: string;
  maturityTerm: number;
  maturityTermType: string;
  interestRateApy: number;
  minInvestment: number;
}

const API_BASE_URL = 'http://192.168.1.107:8081';

const Plans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/Amgplan/getactiveplans');
        const data = response.data;
        console.log('Fetched plans:', data);
        setPlans(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error('Error fetching plans:', err);
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const pioneerHuntPlan: Plan = {
    planID: 'pioneer-hunt',
    planName: 'Pioneer Hunt Plan',
    planTitle: 'Pioneer Hunt Plan',
    planDescription:
      'Pioneer Hunt Projects are investment instruments that allocate capital to specific ventures, development projects, or targeted opportunities. These products are often structured to capture higher returns, but they also come with elevated levels of risk.',
    maturityTerm: 1,
    maturityTermType: 'Y',
    interestRateApy: 10,
    minInvestment: 1000,
    planImage: '/assets/plans/pioneerhunt.jpg',
  };
const getPlanImageUrl = (planImage: string) => {
  if (planImage.startsWith('http')) return planImage; // Full URL
  if (planImage.startsWith('/assets/')) return planImage; // Public folder
  return `${API_BASE_URL}/${planImage}`; // API URL
};
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const renderPlanCard = (plan: Plan, index: number) => (
    <Box
      key={plan.planID || `${plan.planName}-${index}`}
      sx={{
        display: 'flex',
        justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
        minHeight: '350px',
        color: '#fff',
        backgroundImage: `url(${
          getPlanImageUrl(plan.planImage)
        })`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        paddingY: 6,
        px: { xs: 2, md: 8},
       
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(0,0,0,0.6)',
          padding: 3,
          borderRadius: 2,
          width: { xs: '100%', md: '40%' },
        }}
      >
        <Typography variant="h4" gutterBottom>
          {plan.planName}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {plan.planDescription}
        </Typography>
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Grid item xs={4}>
            <Typography variant="subtitle2">Maturity Term</Typography>
            <Typography variant="h6">
              {plan.maturityTerm} {plan.maturityTermType}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle2">APY%</Typography>
            <Typography variant="h6">{plan.interestRateApy}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle2">Min. Investment</Typography>
            <Typography variant="h6">{plan.minInvestment}</Typography>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{
              backgroundColor: 'rgb(227, 199, 139)',
              color: 'rgb(0,0,0)',
              '&:hover': { backgroundColor: 'rgb(200, 175, 120)' },
            }}
            onClick={() =>
  navigate('/Plandetail', { state: { planID: plan.planID } })
}
          >
            View Plan Details
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box>
      {/* Render dynamic plans */}
      {plans.map((plan, index) => renderPlanCard(plan, index))}

      {/* Render hardcoded Pioneer Hunt Plan */}
      {renderPlanCard(pioneerHuntPlan, plans.length)}
    </Box>
  );
};

export default Plans;
