import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import Card3D from '../components/Card3D';
import { useRouter } from 'next/router';

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