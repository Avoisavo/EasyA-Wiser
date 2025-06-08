import React, { useRef, useState } from 'react';

const cardWidth = 400;
const cardHeight = 250;

const cardStyle = {
  width: `${cardWidth}px`,
  height: `${cardHeight}px`,
  borderRadius: '20px',
  boxShadow: '0 8px 40px 10px #2563eb, 0 2px 8px rgba(0,0,0,0.08)',
  background: 'linear-gradient(135deg, #e0f2fe 0%, #60a5fa 60%, #2563eb 100%)',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  perspective: '1200px',
  cursor: 'grab',
  color: '#1e293b',
  border: '1.5px solid rgba(37,99,235,0.12)',
  overflow: 'hidden',
};

const shineStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(96,165,250,0.04) 60%, rgba(255,255,255,0.0) 100%)',
  borderRadius: '20px',
  pointerEvents: 'none',
  zIndex: 10,
};

// Function to format card number with spaces
const formatCardNumber = (pan) => {
  if (!pan) return '**** **** **** ****';
  return pan.replace(/(\d{4})/g, '$1  ').trim();
};

export default function Card3D({ cardDetails, cardholder }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      style={{ ...cardStyle, perspective: '1200px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front Side */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px',
          color: '#1e293b',
          fontFamily: 'sans-serif',
          fontWeight: 600,
          letterSpacing: '1.2px',
          zIndex: 2,
          fontSize: '13px',
          textShadow: '0 0 8px #60a5fa, 0 0 2px #fff',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32,
              height: 24,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
              boxShadow: '0 1px 4px #60a5fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: 20,
                height: 14,
                borderRadius: 3,
                background: 'linear-gradient(90deg, #fff 0%, #60a5fa 100%)',
                opacity: 0.7,
              }} />
            </div>
            <span style={{ fontSize: 16, color: '#1e293b', fontWeight: 700, textShadow: '0 0 8px #60a5fa' }}>CREDIT CARD</span>
          </div>
          <div style={{ fontSize: 18, letterSpacing: '2.5px', margin: '18px 0 0 0', color: '#1e293b', textShadow: '0 0 8px #60a5fa' }}>
            {formatCardNumber(cardDetails?.pan)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <div>
              <div style={{ fontSize: 10, color: '#1e293b', opacity: 0.8 }}>VALID THRU</div>
              <div style={{ fontSize: 12, color: '#1e293b', fontWeight: 700 }}>{cardDetails?.expiration || 'MM/YY'}</div>
              <div style={{ fontSize: 12, color: '#1e293b', fontWeight: 700, textTransform: 'uppercase', marginTop: 4 }}>
                {cardholder?.firstName} {cardholder?.lastName}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: -8 }}>
              <div style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'radial-gradient(circle, #60a5fa 60%, #e0f2fe 100%)',
                opacity: 0.9,
                position: 'relative',
                left: 5,
                boxShadow: '0 0 12px #60a5fa',
              }} />
              <div style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'radial-gradient(circle, #2563eb 60%, #e0f2fe 100%)',
                opacity: 0.9,
                position: 'relative',
                right: 5,
                marginLeft: -10,
                boxShadow: '0 0 12px #2563eb',
              }} />
            </div>
          </div>
          <div style={shineStyle}></div>
        </div>
        {/* Back Side */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          background: 'linear-gradient(135deg, #e0f2fe 0%, #60a5fa 60%, #2563eb 100%)',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          zIndex: 1,
        }}>
          <div style={{
            width: '100%',
            height: 40,
            background: 'linear-gradient(90deg, #1e293b 80%, #334155 100%)',
            marginTop: 32,
          }} />
          <div style={{
            background: 'white',
            padding: '4px 8px',
            margin: '16px 24px',
            borderRadius: 4,
            fontSize: 12,
            color: 'black',
            fontWeight: 700,
            letterSpacing: '1.5px',
            alignSelf: 'flex-end'
          }}>
            {cardDetails?.cvv || '123'}
          </div>
        </div>
      </div>
    </div>
  );
} 