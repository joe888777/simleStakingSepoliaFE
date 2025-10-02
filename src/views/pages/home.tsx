import React from 'react';
import { Box, Typography, Button, Container, Card, CardContent, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const bannerImages = [
  'https://youtu.be/U5yPll9WCSc?si=RTSP-ez7KE9u-5uF',
  '/assets/home/image1.webp',
  '/assets/home/image2.webp',
  '/assets/home/image3.webp',
  '/assets/home/image4.webp',
  '/assets/home/image5.webp',
  '/assets/home/image6.webp',

];

const marketButtons = [
  { name: 'S&P 500', value: '6,045.26', change: '↑ 0.38%', positive: true },
  { name: 'Nasdaq', value: '15,236.98', change: '↑ 0.52%', positive: true },
  { name: 'Dow Jones', value: '34,567.89', change: '↓ 0.12%', positive: false },
  { name: 'FTSE 100', value: '7,456.10', change: '↑ 0.21%', positive: true },
];

const articles = [
  { title: 'The Future of AI in Blockchain', image: './assets/home/article/image1.jpg', link: '/ArtificialIntelligent.html' },
  { title: 'Sustainable Crypto Projects', image: '/assets/home/article/image2.jpg', link: '/Insights-sustainability.html' },
  { title: 'Next Generation Tokenomics', image: './assets/home/article/image3.jpg', link: '/Nextgeneration.html' },
];

const latestNews = [
  { title: 'Global Stock Markets Rally Amid Economic Optimism', image: '/assets/home/article/image4.jpg' },
  { title: 'Cryptocurrency Prices Surge After Regulatory Approval', image: '/assets/home/article/image5.jpg' },
  { title: 'World Leaders Meet to Discuss Climate Change', image: '/assets/home/article/image6.jpg' },
  { title: 'New Renewable Energy Investment Announced in Asia', image: '/assets/home/article/image7.jpg' },
  { title: 'Central Bank Reports Inflation Trends', image: '/assets/home/article/image8.jpg' },
  { title: 'Global Tech Summit Highlights AI Innovations', image: '/assets/home/article/image9.jpg' },
];

// Partner logos array
const partnerLogos = [
  '/assets/partners/blockchaincapital.png',
  '/assets/partners/bridgewater.png',
  '/assets/partners/capitalconnectjpmorgan.png',
  '/assets/partners/HeroCapital.png',
  '/assets/partners/northerntrust.png',
  '/assets/partners/OutlierVentures.png',
  '/assets/partners/Paradigm.png',
  '/assets/partners/PrimoVentures.png',
  '/assets/partners/robeco.png',
  '/assets/partners/Seraphim.png',
  '/assets/partners/SiliconValleyBank.png',
  '/assets/partners/SpaceFund.png',
  '/assets/partners/SpaceVentures.png',
  '/assets/partners/spaceventuresinvestors.png',
  '/assets/partners/subnationalclimatefinance.png',
];

// Case studies array
const caseStudies = [
  {
    title: 'Sustainable',
    subtitle: 'Key factors driving green technology forward',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam venenatis orci sit amet...',
    image: '/assets/casestudies/sustainable.jpg',
  },
  {
    title: 'Metaverse',
    subtitle: 'Key technologies driving and shaping the metaverse.',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam venenatis orci sit amet...',
    image: '/assets/casestudies/metaverse.jpg',
  },
  {
    title: 'Space',
    subtitle: '3D Printing human organs in space',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam venenatis orci sit amet...',
    image: '/assets/casestudies/space.jpg',
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  const bannerSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const partnerSliderSettings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 900, settings: { slidesToShow: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2 } },
      { breakpoint: 400, settings: { slidesToShow: 1 } },
    ],
  };

  const latestNewsDuplicated = [...latestNews, ...latestNews];

  const FullWidthSection = ({
    image,
    title,
    content,
    buttonText,
    buttonLink,
  }: {
    image: string;
    title: string;
    content: string;
    buttonText?: string;
    buttonLink?: string;
  }) => (
    <Box sx={{ width: '100%', height: '712px', position: 'relative' }}>
      <Box component="img" src={image} alt={title} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: '150px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            maxWidth: 600,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            textAlign: 'left',
            bgcolor: 'rgba(0,0,0,0.5)',
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: '#fff', textShadow: '2px 2px 8px rgba(0,0,0,0.6)' }}
          >
            {title}
          </Typography>
          <Typography variant="body1" sx={{ color: '#fff', lineHeight: 1.6 }}>
            {content}
          </Typography>
          {buttonText && buttonLink && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: 'rgb(227, 199, 139)',
                  color: 'rgb(0,0,0)',
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: '12px',
                  textTransform: 'none',
                }}
                onClick={() => navigate(buttonLink)}
              >
                {buttonText} →
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
 // Helper to detect YouTube URLs
  const isYouTubeVideo = (url: string) => url.includes('youtu');

const getCleanYouTubeEmbedUrl = (url: string) => {
  const videoId = url.includes('watch')
    ? url.split('v=')[1]?.split('&')[0]
    : url.split('be/')[1]?.split('?')[0];

  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&disablekb=1&iv_load_policy=3&cc_load_policy=0`;
};


  return (
    <Box sx={{bgcolor: '#0f1115', color: '#fff', minHeight: '100vh' }}>
      <Slider {...bannerSettings}>
  {bannerImages.map((item, idx) => (
    <Box key={idx} sx={{ width: '100%', height: { xs: 300, md: 711 }, overflow: 'hidden', position: 'relative' }}>
      {isYouTubeVideo(item) ? (
        <>
          <iframe
            src={getCleanYouTubeEmbedUrl(item)}
            title={`video-${idx}`}
            style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
            allow="autoplay"
          />
          {/* Overlay to block right-click */}
          <Box
            onContextMenu={(e) => e.preventDefault()}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 2,
            }}
          />
        </>
      ) : (
        <Box
          component="img"
          src={item}
          alt={`banner-${idx}`}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </Box>
  ))}
</Slider>



      {/* Market Indices */}
      <Box sx={{ py: 2, bgcolor: '#0f1115' }}>
        <Container maxWidth="lg">
          <Typography variant="h6" sx={{ mb: 1, color: '#e3c78b', fontWeight: 700 }}>
            Market Indices
          </Typography>
          <Box sx={{ overflow: 'hidden', width: '100%' }}>
            <Box sx={{ display: 'inline-flex', whiteSpace: 'nowrap', animation: 'scroll-market 30s linear infinite' }}>
              {marketButtons.map((btn, idx) => (
                <Button
                  key={idx}
                  variant="outlined"
                  sx={{
                    minWidth: 140,
                    color: btn.positive ? 'green' : 'red',
                    borderColor: btn.positive ? 'green' : 'red',
                    flexShrink: 0,
                    textTransform: 'none',
                    mr: 1,
                    borderRadius: 1,
                  }}
                >
                  <strong>{btn.name}</strong> {btn.value} <span>{btn.change}</span>
                </Button>
              ))}
            </Box>
          </Box>
        </Container>
        <style>
          {`
            @keyframes scroll-market {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}
        </style>
      </Box>

      {/* Articles and Latest News */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch' }}>
          <Card sx={{ bgcolor: '#161821', color: '#fff', borderRadius: 3, flex: '0 0 40%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia component="img" height={300} image={articles[0].image} alt={articles[0].title} sx={{ objectFit: 'cover' }} />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{articles[0].title}</Typography>
              <Button variant="contained" sx={{ bgcolor: '#e3c78b', color: '#000', '&:hover': { bgcolor: '#d4b86b' } }} onClick={() => navigate(articles[0].link)}>
                Read More
              </Button>
            </CardContent>
          </Card>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: '0 0 36%' }}>
            {articles.slice(1, 3).map((article, idx) => (
              <Card key={idx} sx={{ bgcolor: '#161821', color: '#fff', borderRadius: 3, height: 300, display: 'flex', flexDirection: 'column' }}>
                <CardMedia component="img" height={150} image={article.image} alt={article.title} sx={{ objectFit: 'cover' }} />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>{article.title}</Typography>
                  <Button variant="contained" sx={{ bgcolor: '#e3c78b', color: '#000', '&:hover': { bgcolor: '#d4b86b' } }} onClick={() => navigate(article.link)}>
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Box sx={{ flex: '0 0 24%', bgcolor: '#161821', borderRadius: 3, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', minHeight: 300, p: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#e3c78b' }}>Latest News</Typography>
            <Box sx={{ flexGrow: 1, overflow: 'hidden', width: '100%', position: 'relative' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', position: 'absolute', bottom: '-100%', animation: 'scroll-news 25s linear infinite', gap: 2, alignItems: 'flex-start', width: '100%' }}>
                {latestNewsDuplicated.map((news, idx) => (
                  <Box key={idx} sx={{ display: 'flex', gap: 1, alignItems: 'center', color: '#e3c78b' }}>
                    <Box component="img" src={news.image} alt={news.title} sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1 }} />
                    <Typography variant="body2">{news.title}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            <style>
              {`
                @keyframes scroll-news {
                  0% { transform: translateY(0); }
                  100% { transform: translateY(-50%); }
                }
              `}
            </style>
          </Box>
        </Box>
      </Container>

      {/* AMG Experience Sections */}
      <Box sx={{ bgcolor: '#0f1115', py: 0 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: 'center', mb: 4, color: '#e3c78b' }}>AMG Experience</Typography>
        </Container>

        <FullWidthSection
          image="/assets/home/amgexperience.jpg"
          title="AMG Investment Plans"
          content="Explore curated plans designed to grow and secure your financial future with AMG. Our investment solutions are tailored to meet your unique goals, balancing risk and reward to maximize returns. Benefit from expert guidance, diverse portfolios, and innovative strategies that adapt to market changes. Partner with AMG to build lasting wealth and achieve financial confidence for you and your family."
          buttonText="View AMG Plans"
          buttonLink="/amg-plans"
        />

        <FullWidthSection
          image="/assets/home/esgprojects.jpg"
          title="ESG Projects"
          content="Join AMG in driving sustainable, impactful Environmental, Social & Governance (ESG) initiatives. We believe true progress is rooted in responsible business practices that generate long-term value for our planet, communities, and stakeholders. Through innovation, transparency, and commitment, we aim to shape a future that prioritizes sustainability, equity, and resilience for generations to come."
          buttonText="View Projects"
          buttonLink="/esg-projects"
        />

        <FullWidthSection
          image="/assets/home/amgecosystem.jpg"
          title="AMG Ecosystem"
          content="Explore luxury lifestyle products with AMG’s trusted retailer partners and unlock exclusive deals tailored just for you. Discover rewarding benefits that elevate your shopping experience and deliver lasting value. From designer fashion and premium gadgets to sophisticated home essentials, our curated selection is crafted to meet your refined tastes and expectations. Indulge in elegance—only with AMG."
          buttonText="Explore AMG Ecosystem"
          buttonLink="/amg-ecosystem"
        />
      </Box>

      {/* Our Partners Section as Slider */}
      <Box sx={{ bgcolor: '#fff', color: '#000', py: 8 }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Our Partners</Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            We collaborate with leading brands and organizations to bring you the best products and experiences.
          </Typography>

          <Slider {...partnerSliderSettings}>
            {partnerLogos.map((logo, idx) => (
              <Box key={idx} sx={{ p: 2 }}>
                <Box
                  component="img"
                  src={logo}
                  alt={`Partner ${idx}`}
                  sx={{ height: 60, objectFit: 'contain', mx: 'auto' }}
                />
              </Box>
            ))}
          </Slider>
        </Container>
      </Box>
{/* AMG Token Trending View Section */}
<Box sx={{ py: 6, bgcolor: '#0f1115', color: '#fff' }}>
  <Container maxWidth="lg">
    {/* Section Title */}
    <Typography variant="h4" sx={{ fontWeight: 700, textAlign: 'center', mb: 4 }}>
      AMG Token Trending View
    </Typography>

    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
        alignItems: 'stretch',
      }}
    >
      {/* Left Column: Market Data Big Card */}
      <Box
        sx={{
          flex: { xs: '100%', md: '35%' },
          bgcolor: '#161821',
          borderRadius: 3,
          p: 3,
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, textAlign: 'center', mb: 3, color: '#e3c78b' }}
        >
          AMG Market Data
        </Typography>

        {/* Grid of Small Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 2,
            flexGrow: 1,
            justifyItems: 'center',
          }}
        >
          {[
            { label: 'Market Cap', value: '$198.87M', change: '-0.56%' },
            { label: 'Volume (24h)', value: '$15.07M', change: '+0.43%' },
            { label: 'FDV', value: '$500.00M' },
            { label: 'Vol / Mkt Cap', value: '7.58%' },
            { label: 'Total Supply', value: '1.00B AMG' },
            { label: 'Max Supply', value: '2.00B AMG' },
            { label: 'Circulating Supply', value: '800.00M AMG' },
          ].map((item, idx) => (
            <Box
              key={idx}
              sx={{
                width: 170,
                height: 90,
                bgcolor: '#f1f1f1',
                color: '#000',
                borderRadius: 2,
                p: 1.5,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: 1,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, textAlign: 'center' }}>
                {item.label}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, textAlign: 'center' }}>
                {item.value}
              </Typography>
              {item.change && (
                <Typography
                  variant="body2"
                  sx={{
                    color: item.change.startsWith('+') ? 'green' : 'red',
                    fontWeight: 500,
                  }}
                >
                  {item.change}
                </Typography>
              )}
            </Box>
          ))}
        </Box>

        {/* Action Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: 'rgb(227, 199, 139)',
              color: 'rgb(0,0,0)',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: '12px',
              textTransform: 'none',
            }}
          >
            Get your AMGF Tokens Today →
          </Button>
        </Box>
      </Box>

      {/* Right Column: TradingView Chart */}
      <Box
        sx={{
          flex: { xs: '100%', md: '65%' },
          display: 'flex',
          alignItems: 'stretch',
        }}
      >
        <iframe
          src="https://s.tradingview.com/widgetembed/?symbol=BTCUSD&interval=D&theme=light&hide_top_toolbar=1&hide_side_toolbar=1&save_image=0&locale=en"
          style={{ width: '100%', border: 'none', borderRadius: '12px', minHeight: '100%' }}
          height="100%"
          title="Trending Chart"
        />
      </Box>
    </Box>
  </Container>
</Box>




    {/* Case Studies Section */}
<Box sx={{ bgcolor: '#fff', color: '#000', py: 8 }}>
  <Container maxWidth="lg">
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>Exploring Investment Horizons</Typography>
      <Button
        variant="contained"
        sx={{
          bgcolor: 'rgb(227, 199, 139)',
          color: 'rgb(0,0,0)',
          fontWeight: 600,
          px: 3,
          py: 1,
          borderRadius: '12px',
          textTransform: 'none',
        }}
      >
        Explore More →
      </Button>
    </Box>

    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
      {caseStudies.map((study, idx) => (
        <Card
          key={idx}
          sx={{
            width: { xs: '100%', sm: 'calc(33% - 16px)' },
            borderRadius: 3,
            overflow: 'hidden',
            bgcolor: '#f2f2f2', // very light gray card background
          }}
        >
          <CardMedia
            component="img"
            height={260} // increased image height
            image={study.image}
            alt={study.title}
            sx={{ objectFit: 'cover' }}
          />
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{study.title}</Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1 }}>{study.subtitle}</Typography>
            <Typography variant="body2">{study.description}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  </Container>
</Box>

    </Box>
  );
};

export default Home;
