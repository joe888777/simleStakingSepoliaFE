import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';

const Projects: React.FC = () => {
  const projects = [
    { name: 'Solar Energy Initiative', description: 'Investing in renewable energy' },
    { name: 'AI Research Fund', description: 'Funding next-gen AI startups' },
    { name: 'Sustainable Agriculture', description: 'Supporting eco-friendly farms' },
  ];

  return (
    <Box sx={{ padding: 4, minHeight: '80vh', backgroundColor: '#000', color: '#FFD700' }}>
      <Typography variant="h3" align="center" gutterBottom>
        Investment Projects
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.name}>
            <Card sx={{ backgroundColor: '#1a1a1a', color: '#FFD700', padding: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {project.name}
                </Typography>
                <Typography variant="body1">{project.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Projects;
