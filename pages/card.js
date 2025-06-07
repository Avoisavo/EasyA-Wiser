import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import Card3D from '../components/Card3D';
import { useRouter } from 'next/router';

// Floating text component
const FloatingText = ({ text, style, delay = 0 }) => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        // Fade in
        setOpacity(1);
        setTimeout(() => {
          // Fade out after 2 seconds
          setOpacity(0);
        }, 2000);
      }, 4000); // Repeat every 4 seconds (2s visible + 2s hidden)

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      style={{
        position: 'absolute',
        opacity,
        transition: 'opacity 1.5s ease-in-out',
        color: '#1e293b',
        fontFamily: 'sans-serif',
        fontWeight: 600,
        fontSize: '14px',
        pointerEvents: 'none',
        zIndex: 10,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

export default function CardPage() {
  const router = useRouter();
  const [cardData, setCardData] = useState(null);

  useEffect(() => {
    // This code runs only on the client-side
    const storedData = localStorage.getItem('newCardDetails');
    if (storedData) {
      setCardData(JSON.parse(storedData));
      // Optional: remove the data from session storage after reading it
      // sessionStorage.removeItem('newCardDetails'); 
    } else {
      // If there are no card details, maybe redirect back to create page
      router.push('/create');
    }
  }, [router]);

  // Floating text data with positions
  const floatingTexts = [
    { text: 'USD/EUR 1.0875', style: { top: '20%', left: '15%' }, delay: 0 },
    { text: 'Currency Rate ↗', style: { top: '25%', right: '20%' }, delay: 500 },
    { text: 'BTC $67,450', style: { bottom: '30%', left: '10%' }, delay: 1000 },
    { text: 'Market Cap $2.3T', style: { bottom: '35%', right: '15%' }, delay: 1500 },
    { text: 'Trading Volume +15%', style: { top: '40%', left: '5%' }, delay: 2000 },
    { text: 'Portfolio Balance', style: { top: '45%', right: '10%' }, delay: 2500 },
    { text: 'APY 12.5%', style: { bottom: '20%', left: '20%' }, delay: 3000 },
    { text: 'Risk: Moderate', style: { bottom: '25%', right: '25%' }, delay: 3500 },
  ];

  return (
    <>
      <Header />
      <div style={{
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 60% 30%, #f0f9ff 0%, #e0e7ef 80%, #dbeafe 100%)',
      }}>
        {/* Grid overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          backgroundImage: `linear-gradient(to right, rgba(37,99,235,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(37,99,235,0.04) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
        }} />
        {/* Vignette overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'radial-gradient(circle at 60% 30%, rgba(96,165,250,0.10) 0%, rgba(255,255,255,0.7) 80%)',
          pointerEvents: 'none',
        }} />

        {/* Floating text elements */}
        {floatingTexts.map((item, index) => (
          <FloatingText
            key={index}
            text={item.text}
            style={item.style}
            delay={item.delay}
          />
        ))}

        {cardData ? (
          <Card3D cardDetails={cardData.card} cardholder={cardData.cardholder} />
        ) : (
          <p style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#1e293b',
            fontFamily: 'sans-serif',
          }}>
            Loading card details...
          </p>
        )}
      </div>
    </>
  );
}