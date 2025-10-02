import React from 'react';
import { Box, Typography, TextField, Button, Grid, Container } from '@mui/material';
import { Link } from 'react-router-dom'; // ✅ React Router Link for internal navigation

const socialLinks = [
  { href: 'https://www.facebook.com', src: '/assets/socialmedia/facebook.svg', alt: 'Facebook' },
  { href: 'https://www.twitter.com', src: '/assets/socialmedia/twitter.svg', alt: 'Twitter' },
  { href: 'https://www.linkedin.com', src: '/assets/socialmedia/linkedin.svg', alt: 'LinkedIn' },
  { href: 'https://www.instagram.com', src: '/assets/socialmedia/instagram.svg', alt: 'Instagram' },
  { href: 'https://t.me/', src: '/assets/socialmedia/telegram.svg', alt: 'Telegram' },
  { href: 'https://www.youtube.com/', src: '/assets/socialmedia/youtube.svg', alt: 'YouTube' },
  { href: 'https://www.tiktok.com/', src: '/assets/socialmedia/tiktok.svg', alt: 'TikTok' },
  { href: 'https://discord.com/', src: '/assets/socialmedia/discord.svg', alt: 'Discord' },
  { href: 'https://coinmarketcap.com/', src: '/assets/socialmedia/coinmarketcap.svg', alt: 'CoinMarketCap' },
  { href: 'https://web.whatsapp.com/', src: '/assets/socialmedia/whatsapp.svg', alt: 'WhatsApp' },
  { href: 'https://line.me/', src: '/assets/socialmedia/lineapp.svg', alt: 'Line' },
];

const Footer: React.FC = () => {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Subscribed!');
  };

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        minHeight: 405,
        background: '#000000',
        color: '#e3c78b',
        py: 5,
      }}
    >
      <Container maxWidth="lg" sx={{ maxWidth: 1200 }}>
        <Box sx={{ borderTop: '1px solid #555', mb: 3 }} />
        <Grid container spacing={4}>
          {/* Column 1 */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Buy, Invest, and Build a Better Future
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <li>
                <Link to="/projects" style={{ color: '#e3c78b', textDecoration: 'none', fontWeight: 700 }}>
                  Project
                </Link>
              </li>
              <li>
                <Link to="/plans" style={{ color: '#e3c78b', textDecoration: 'none', fontWeight: 700 }}>
                  Plans
                </Link>
              </li>
              <li>
                <a
                  href="/assets/pdf/amgfpresentation.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#e3c78b', textDecoration: 'none', fontWeight: 700 }}
                >
                  Presentation
                </a>
              </li>
              <li>
                <Link to="/amginfo" style={{ color: '#e3c78b', textDecoration: 'none', fontWeight: 700 }}>
                  AMG Tokens Info
                </Link>
              </li>
            </Box>
          </Grid>

          {/* Column 2 */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Partnerships
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <li>
                <Link to="/join-amg" style={{ color: '#e3c78b', textDecoration: 'none', fontWeight: 700 }}>
                  Membership
                </Link>
              </li>
              <li>
                <Link to="/plans" style={{ color: '#e3c78b', textDecoration: 'none', fontWeight: 700 }}>
                  Get Your AMGF Tokens Today
                </Link>
              </li>
              <li>
                <Link to="/amgblog" style={{ color: '#e3c78b', textDecoration: 'none', fontWeight: 700 }}>
                  Blog
                </Link>
              </li>
            </Box>
          </Grid>

          {/* Column 3 */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {socialLinks.map((social, idx) => (
                <a key={idx} href={social.href} target="_blank" rel="noopener noreferrer">
                  <img src={social.src} alt={social.alt} style={{ width: 28, height: 28 }} />
                </a>
              ))}
            </Box>
          </Grid>

          {/* Column 4 */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Subscribe to Our Newsletter
            </Typography>
            <Box component="form" onSubmit={handleSubscribe} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <TextField
                placeholder="Enter your email"
                variant="filled"
                size="small"
                type="email"
                required
                sx={{
                  backgroundColor: '#111',
                  input: { color: '#e3c78b', fontWeight: 700 },
                  label: { color: '#e3c78b', fontWeight: 700 },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ backgroundColor: '#e3c78b', color: '#000', fontWeight: 700 }}
              >
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Disclaimer */}
        <Typography
          variant="body2"
          sx={{ mt: 4, color: '#a3a07a', textAlign: 'justify', fontSize: '1rem', lineHeight: 1.3 }}
        >
          <strong>Disclaimer:</strong> AMGF is a non-listed debt certificate and is not listed on any public
          exchange. Its exchange rate against USDT is fixed and may not reflect the market value of AMGF. This
          disclaimer is not a recommendation or endorsement of AMGF or any other financial product. It is
          important for you to carefully consider your investment objectives and risk tolerance before making any
          investment decisions. You should seek professional financial advice if you have any questions or
          concerns about investing in AMGF or any other financial product.
        </Typography>

        {/* Bottom Bar */}
        <Box sx={{ mt: 3, borderTop: '1px solid #555', pt: 3, textAlign: 'center' }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
            © {new Date().getFullYear()} AMPLE GROUP GLOBAL - All Rights Reserved
          </Typography>
          <Box
            sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap', fontSize: 13, mt: 0.5 }}
          >
            <Link to="/privacy-policy" style={{ color: '#e3c78b', textDecoration: 'none', fontWeight: 700 }}>
              Privacy Policy
            </Link>
            |
            <Link to="/terms-and-conditions" style={{ color: '#e3c78b', textDecoration: 'none', fontWeight: 700 }}>
              Terms and Conditions
            </Link>
            |
            <Link to="/cookies-policy" style={{ color: '#e3c78b', textDecoration: 'none', fontWeight: 700 }}>
              Cookies Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
