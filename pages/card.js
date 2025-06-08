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
    const storedData = localStorage.getItem('newCardDetails');
    if (storedData) {
      setCardData(JSON.parse(storedData));
    } else {
      router.push('/create');
    }
  }, [router]);

  const ActionButton = ({ children }) => (
    <button
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
        border: 'none',
        borderRadius: '30px',
        padding: '15px 40px',
        color: 'white',
        fontSize: '18px',
        fontWeight: '500',
        cursor: 'pointer',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
      }}
    >
      {children}
    </button>
  );

  const CardInfoPanel = ({ type, status, limit }) => (
    <div style={{
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '30px',
      color: 'white',
      width: '300px',
    }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '5px' }}>Card Type:</div>
        <div style={{ fontSize: '18px', fontWeight: '500' }}>{type}</div>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '5px' }}>Status:</div>
        <div style={{ fontSize: '18px', fontWeight: '500' }}>{status}</div>
      </div>
      <div>
        <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '5px' }}>Spending Limit:</div>
        <div style={{ fontSize: '18px', fontWeight: '500' }}>${limit.toLocaleString()}</div>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <div style={{
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #3b82f6 100%)',
      }}>
        {/* Stars/sparkles background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 60% 30%, rgba(255,255,255,0.2) 0%, rgba(30,58,138,0.1) 100%)',
          opacity: 0.9,
          zIndex: 0,
        }} />

        {cardData ? (
          <div style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '50px',
            gap: '40px',
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
            {/* Main content container */}
            <div style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 40px',
              position: 'relative',
            }}>
              {/* Left side - Card display */}
              <div style={{ 
                flex: '0 0 auto', 
                marginRight: '60px',
                marginTop: '100px',
                marginLeft: '400px', // Changed from -40px to 40px to move card right
                transform: 'scale(0.95)',
              }}>
                <Card3D cardDetails={cardData.card} cardholder={cardData.cardholder} />
              </div>
              
              {/* Right side - Card info */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '40px',
                color: '#000000',
                width: '400px',
                marginRight: '20px',
                marginTop: '100px',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              }}>
                <div style={{ marginBottom: '25px' }}>
                  <div style={{ 
                    opacity: 0.6, 
                    marginBottom: '8px',
                    fontSize: '18px',
                    letterSpacing: '0.5px',
                    color: '#000000',
                    fontWeight: '400',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span role="img" aria-label="credit card" style={{ fontSize: '20px' }}>💳</span>
                    Card Type:
                  </div>
                  <div style={{ 
                    fontWeight: '600',
                    fontSize: '26px',
                    color: '#000000',
                    letterSpacing: '-0.5px',
                  }}>Virtual Visa</div>
                </div>
                <div style={{ marginBottom: '25px' }}>
                  <div style={{ 
                    opacity: 0.6, 
                    marginBottom: '8px',
                    fontSize: '18px',
                    letterSpacing: '0.5px',
                    color: '#000000',
                    fontWeight: '400',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span role="img" aria-label="check mark" style={{ fontSize: '20px' }}>✅</span>
                    Status:
                  </div>
                  <div style={{ 
                    fontWeight: '600',
                    fontSize: '26px',
                    color: '#000000',
                    letterSpacing: '-0.5px',
                  }}>Active</div>
                </div>
                <div>
                  <div style={{ 
                    opacity: 0.6, 
                    marginBottom: '8px',
                    fontSize: '18px',
                    letterSpacing: '0.5px',
                    color: '#000000',
                    fontWeight: '400',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span role="img" aria-label="money bag" style={{ fontSize: '20px' }}>💰</span>
                    Spending Limit:
                  </div>
                  <div style={{ 
                    fontWeight: '600',
                    fontSize: '26px',
                    color: '#000000',
                    letterSpacing: '-0.5px',
                  }}>${(5000).toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{
              display: 'flex',
              gap: '30px',
              marginTop: '30px',
              width: '100%',
              justifyContent: 'center',
            }}>
              <button style={{
                background: 'rgba(255, 255, 255, 0.4)',
                border: 'none',
                borderRadius: '30px',
                padding: '20px 35px',
                color: '#1a1a1a',
                cursor: 'pointer',
                backdropFilter: 'blur(20px)',
                transition: 'all 0.3s ease',
                width: '220px',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
                fontFamily: 'SF Pro Display, Inter, system-ui, -apple-system, sans-serif',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}>
                <span role="img" aria-label="send money" style={{ fontSize: '24px' }}>💸</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', opacity: 0.6, fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase' }}>Send</span>
                  <span style={{ fontSize: '18px', fontWeight: '600', letterSpacing: '-0.5px' }}>Money</span>
                </div>
              </button>
              <button style={{
                background: 'rgba(255, 255, 255, 0.4)',
                border: 'none',
                borderRadius: '30px',
                padding: '20px 35px',
                color: '#1a1a1a',
                cursor: 'pointer',
                backdropFilter: 'blur(20px)',
                transition: 'all 0.3s ease',
                width: '220px',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
                fontFamily: 'SF Pro Display, Inter, system-ui, -apple-system, sans-serif',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}>
                <span role="img" aria-label="add funds" style={{ fontSize: '24px' }}>💰</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', opacity: 0.6, fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase' }}>Add</span>
                  <span style={{ fontSize: '18px', fontWeight: '600', letterSpacing: '-0.5px' }}>Funds</span>
                </div>
              </button>
              <button style={{
                background: 'rgba(255, 255, 255, 0.4)',
                border: 'none',
                borderRadius: '30px',
                padding: '20px 35px',
                color: '#1a1a1a',
                cursor: 'pointer',
                backdropFilter: 'blur(20px)',
                transition: 'all 0.3s ease',
                width: '220px',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
                fontFamily: 'SF Pro Display, Inter, system-ui, -apple-system, sans-serif',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}>
                <span role="img" aria-label="settings" style={{ fontSize: '24px' }}>⚙️</span>
                <span style={{ fontSize: '18px', fontWeight: '600', letterSpacing: '-0.5px' }}>Settings</span>
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontFamily: 'sans-serif',
          }}>
            Loading card details...
          </div>
        )}
      </div>
    </>
  );
}