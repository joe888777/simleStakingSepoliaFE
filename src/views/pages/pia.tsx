import React, { useState } from 'react';
import { Box, Typography, Button, RadioGroup, FormControlLabel, Radio, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Question {
  question: string;
  options: { label: string; points: number }[];
}

const questions: Question[] = [
  {
    question: '1. What do you think is the greatest advantage of sustainable investing?',
    options: [
      { label: 'Environmental friendliness', points: 3 },
      { label: 'Long-term stable returns', points: 3 },
      { label: 'Social responsibility', points: 3 },
    ],
  },
  {
    question: '2. Which type of thematic investing are you most inclined towards?',
    options: [
      { label: 'Investing in the technology sector', points: 5 },
      { label: 'Investing in emerging markets', points: 5 },
      { label: 'Investing in energy transition', points: 5 },
    ],
  },
  {
    question: '3. Which of the following investments is considered sustainable investing?',
    options: [
      { label: 'Investing in cutting-edge technology companies', points: 1 },
      { label: 'Investing in renewable energy companies', points: 3 },
      { label: 'Investing in oil and gas companies', points: 1 },
    ],
  },
  {
    question: '4. Is sustainable investing important? Why?',
    options: [
      { label: 'Very important, as it reduces environmental impact', points: 3 },
      { label: 'Moderately important, as it is just one type of investment', points: 1 },
      { label: 'Not important, as long as it provides high returns', points: 1 },
    ],
  },
  {
    question: '5. Which investment approach would you choose?',
    options: [
      { label: 'Investing in sustainable industries', points: 3 },
      { label: 'Investing in emerging markets', points: 5 },
      { label: 'Investing in high-tech stocks', points: 1 },
    ],
  },
  {
    question: '6. Do you think thematic investing is meaningful?',
    options: [
      { label: 'Yes, because it helps drive the development of specific themes', points: 5 },
      { label: 'Not necessarily, as it may limit investment diversity', points: 1 },
      { label: 'No, because such investments are too risky', points: 1 },
    ],
  },
  {
    question: '7. Do you think thematic investing has the potential for high returns?',
    options: [
      { label: 'Likely, because it focuses on future growth industries', points: 5 },
      { label: 'Not necessarily, due to high market volatility risks', points: 1 },
      { label: 'No, because thematic investing is typically low-risk, low-return', points: 1 },
    ],
  },
  {
    question: '8. Equity investing is a high-risk investment approach. Do you plan to invest in such products?',
    options: [
      { label: 'Yes, because I want to pursue high returns', points: 1 },
      { label: 'Not sure, I need to assess risks and returns first', points: 1 },
      { label: 'No, because I am afraid of high-risk investments', points: 1 },
    ],
  },
  {
    question: '9. What is your view on the risks of equity investing?',
    options: [
      { label: 'Equity investing is too risky, and I am unwilling to take the risk', points: 1 },
      { label: 'Risks in equity investing are inevitable and need to be managed appropriately', points: 1 },
      { label: 'Risks in equity investing can be managed by choosing the right companies', points: 1 },
    ],
  },
  {
    question: '10. In equity investing, which risk concerns you the most?',
    options: [
      { label: 'Misconduct by company management', points: 1 },
      { label: 'Changes in the industry environment', points: 1 },
      { label: 'Global economic instability', points: 1 },
    ],
  },
];

const InvestmentQuestionnaire: React.FC = () => {
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (qIndex: number, optionIndex: number) => {
    const updated = [...answers];
    updated[qIndex] = optionIndex;
    setAnswers(updated);
    setError(false);
  };

  const handleSubmit = () => {
    if (answers.includes(-1)) {
      setError(true);
      return;
    }
    setShowResult(true);
  };

  const calculateResult = () => {
    const total = answers.reduce(
      (sum, answerIndex, qIndex) =>
        sum + (answerIndex !== -1 ? questions[qIndex].options[answerIndex].points : 0),
      0
    );

    let recommendation = '';
    if (total >= 10 && total <= 20) recommendation = 'Equity Investing recommended';
    else if (total >= 21 && total <= 35) recommendation = 'Fixed Interest recommended';
    else if (total >= 36 && total <= 50) recommendation = 'Floating Interest recommended';

    return { total, recommendation };
  };

  const { total, recommendation } = calculateResult();

  return (
    <Box sx={{ bgcolor: '#121212', minHeight: '100vh', py: 5 }}>
      <Container maxWidth={false} sx={{ px: 5 }}>
        <Typography
          variant="h3"
          sx={{ fontWeight: 700, color: '#e3c78b', mb: 3, textAlign: 'center' }}
        >
         Portfolio Advising Index
        </Typography>

        <Paper sx={{ bgcolor: '#ffffff', p: 4, mb: 4, borderRadius: 3, border: '2px solid #e3c78b' }}>
          <Typography variant="body1" sx={{ mb: 2, color: '#000000' }}>
            This questionnaire consists of 10 questions designed to assess your knowledge and perspectives on sustainability, finance, and investment. Each question provides at least three options, oriented towards sustainable investing, thematic investing, or equity investing.
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, fontWeight: 700, color: '#e3c78b' }}>Scoring System:</Typography>
          <Typography variant="body2" sx={{ color: '#000000' }}>• Equity Investing: 1 point per selection</Typography>
          <Typography variant="body2" sx={{ color: '#000000' }}>• Sustainable Investing: 3 points per selection</Typography>
          <Typography variant="body2" sx={{ mb: 1, color: '#000000' }}>• Thematic Investing: 5 points per selection</Typography>
          <Typography variant="body1" sx={{ fontWeight: 700, color: '#e3c78b' }}>Final Score Recommendations:</Typography>
          <Typography variant="body2" sx={{ color: '#000000' }}>• 10–20 points: Equity Investing recommended</Typography>
          <Typography variant="body2" sx={{ color: '#000000' }}>• 21–35 points: Fixed Interest recommended</Typography>
          <Typography variant="body2" sx={{ color: '#000000' }}>• 36–50 points: Floating Interest recommended</Typography>
        </Paper>

        {!showResult ? (
          <Box component="form">
            {questions.map((q, qIndex) => (
              <Paper
                key={qIndex}
                sx={{
                  bgcolor: '#ffffff',
                  p: 3,
                  mb: 3,
                  borderRadius: 3,
                  boxShadow: 2,
                  border: error && answers[qIndex] === -1 ? '2px solid #ff5252' : '1px solid #e3c78b',
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, color: '#000000' }}>
                  {q.question}
                </Typography>
                <RadioGroup
                  value={answers[qIndex]}
                  onChange={(e) => handleChange(qIndex, Number(e.target.value))}
                >
                  {q.options.map((opt, optIndex) => (
                    <FormControlLabel
                      key={optIndex}
                      value={optIndex}
                      control={
                        <Radio
                          sx={{
                            color: '#e3c78b',
                            '&.Mui-checked': { color: '#e3c78b' },
                          }}
                        />
                      }
                      label={<Typography sx={{ color: '#000000' }}>{opt.label}</Typography>}
                    />
                  ))}
                </RadioGroup>
              </Paper>
            ))}

            {error && (
              <Typography sx={{ color: '#ff5252', textAlign: 'center', mb: 2 }}>
                Please answer all questions before submitting.
              </Typography>
            )}

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                variant="contained"
                sx={{ bgcolor: '#e3c78b', color: '#000', px: 5, py: 1.5, fontWeight: 700 }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Typography variant="h4" sx={{ mb: 3, color: '#e3c78b' }}>
              Your Total Score: {total}
            </Typography>
            <Typography variant="h5" sx={{ color: '#e3c78b', fontWeight: 700 }}>
              Recommendation: {recommendation}
            </Typography>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 3 }}>
              <Button
                variant="outlined"
                sx={{ color: '#e3c78b', borderColor: '#e3c78b', px: 4, py: 1.5, fontWeight: 700 }}
                onClick={() => {
                  setShowResult(false);
                  setAnswers(Array(questions.length).fill(-1));
                  setError(false);
                }}
              >
                Retake Questionnaire
              </Button>
              <Button
                variant="contained"
                sx={{ bgcolor: '#e3c78b', color: '#000', px: 4, py: 1.5, fontWeight: 700 }}
                onClick={() => navigate('/')}
              >
               Explore AMG Experience
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default InvestmentQuestionnaire;
