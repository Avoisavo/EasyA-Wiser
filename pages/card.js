import React, { useRef, useState } from 'react';
import Header from '../components/header';

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

function CreditCard3D() {
  const [rotation, setRotation] = useState(0);
  const dragging = useRef(false);
  const lastX = useRef(0);

  const handleMouseDown = (e) => {
    dragging.current = true;
    lastX.current = e.clientX;
    document.body.style.cursor = 'grabbing';
  };

  const handleMouseUp = () => {
    dragging.current = false;
    document.body.style.cursor = 'default';
  };

  const handleMouseMove = (e) => {
    if (!dragging.current) return;
    const deltaX = e.clientX - lastX.current;
    setRotation((r) => r + deltaX * 0.8);
    lastX.current = e.clientX;
  };

  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  });

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
        <div
          style={{
            ...cardStyle,
            transform: `translate(-50%, -50%) rotateY(${rotation}deg)`,
            transition: dragging.current ? 'none' : 'box-shadow 0.3s',
            zIndex: 2,
          }}
          onMouseDown={handleMouseDown}
        >
          <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
          }}>
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
                {/* Chip */}
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
                1234  5678  9012  3455
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#1e293b', opacity: 0.8 }}>VALID THRU</div>
                  <div style={{ fontSize: 12, color: '#1e293b', fontWeight: 700 }}>09/27</div>
                  <div style={{ fontSize: 12, color: '#1e293b', fontWeight: 700 }}>CARDHOLDER</div>
                </div>
                {/* Blue Mastercard logo */}
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
              padding: '24px',
              zIndex: 1,
              fontSize: '13px',
              boxSizing: 'border-box',
              boxShadow: '0 0 32px 0 #60a5fa55',
              color: '#1e293b',
              textShadow: '0 0 8px #60a5fa, 0 0 2px #fff',
            }}>
              {/* Customer service info */}
              <div style={{
                width: '100%',
                color: '#1e293b',
                fontSize: 12,
                marginBottom: 8,
                fontWeight: 500,
                textShadow: '0 1px 2px #60a5fa',
              }}>
                For customer service, call <span style={{color:'#2563eb'}}>+123-456-789</span> or <span style={{color:'#2563eb'}}>+0-000-123-456</span>
              </div>
              {/* Black magnetic stripe */}
              <div style={{
                width: '100%',
                height: 28,
                background: 'linear-gradient(120deg, #cbd5e1 80%, #e0e7ef 100%)',
                borderRadius: 6,
                marginBottom: 18,
                boxShadow: '0 2px 8px #2563eb22',
              }} />
              {/* Signature and CVV row */}
              <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                margin: '12px 0 0 0',
              }}>
                {/* Signature box with blue lines */}
                <div style={{
                  flex: 1,
                  height: 22,
                  background: '#fff',
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 8,
                  color: '#2563eb',
                  fontSize: 11,
                  fontFamily: 'monospace',
                  boxShadow: '0 1px 2px #60a5fa33',
                  border: '1px solid #e0e7ef',
                  letterSpacing: 2,
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Blue signature lines */}
                  <div style={{position:'absolute',top:4,left:8,right:8,height:2,background:'#60a5fa'}}></div>
                  <div style={{position:'absolute',top:10,left:8,right:8,height:2,background:'#60a5fa'}}></div>
                  <div style={{position:'absolute',top:16,left:8,right:8,height:2,background:'#60a5fa'}}></div>
                </div>
                {/* CVV */}
                <div style={{
                  width: 40,
                  height: 22,
                  background: '#fff',
                  borderRadius: 3,
                  marginLeft: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563eb',
                  fontWeight: 700,
                  fontSize: 13,
                  fontFamily: 'monospace',
                  boxShadow: '0 1px 2px #60a5fa33',
                  border: '1px solid #e0e7ef',
                }}>
                  123
                </div>
              </div>
              {/* Placeholder text */}
              <div style={{
                marginTop: 18,
                color: '#1e293b',
                fontSize: 11,
                opacity: 0.9,
                lineHeight: 1.4,
                textShadow: '0 1px 2px #60a5fa',
              }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat<br />
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
              </div>
              <div style={shineStyle}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreditCard3D;