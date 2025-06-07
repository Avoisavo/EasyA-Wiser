import React, { useRef, useState } from 'react';

const cardWidth = 400;
const cardHeight = 250;

const cardStyle = {
  width: `${cardWidth}px`,
  height: `${cardHeight}px`,
  borderRadius: '20px',
  boxShadow: '0 8px 40px 10px gold, 0 2px 8px rgba(0,0,0,0.2)',
  background: 'linear-gradient(135deg, #bfa14a 0%, #fffbe6 100%)',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  perspective: '1200px',
  cursor: 'grab',
};

const shineStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(120deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.1) 60%, rgba(255,255,255,0.0) 100%)',
  borderRadius: '20px',
  pointerEvents: 'none',
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
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'radial-gradient(circle at 60% 30%, #fffbe6 0%, #bfa14a 60%, #2d2300 100%)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div
        style={{
          ...cardStyle,
          transform: `translate(-50%, -50%) rotateY(${rotation}deg)`,
          transition: dragging.current ? 'none' : 'box-shadow 0.3s',
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
            color: '#fff',
            fontFamily: 'sans-serif',
            fontWeight: 600,
            letterSpacing: '1.2px',
            zIndex: 2,
            fontSize: '13px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Chip */}
              <div style={{
                width: 32,
                height: 24,
                borderRadius: 6,
                background: 'linear-gradient(135deg, #ffe066 0%, #bfa14a 100%)',
                boxShadow: '0 1px 4px #bfa14a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  width: 20,
                  height: 14,
                  borderRadius: 3,
                  background: 'linear-gradient(90deg, #fffbe6 0%, #bfa14a 100%)',
                  opacity: 0.7,
                }} />
              </div>
              <span style={{ fontSize: 16, color: '#fff', fontWeight: 700 }}>CREDIT CARD</span>
            </div>
            <div style={{ fontSize: 18, letterSpacing: '2.5px', margin: '18px 0 0 0', color: '#fff' }}>
              1234  5678  9012  3455
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <div>
                <div style={{ fontSize: 10, color: '#fff', opacity: 0.8 }}>VALID THRU</div>
                <div style={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>09/27</div>
                <div style={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>CARDHOLDER</div>
              </div>
              {/* Mastercard logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: -8 }}>
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#ffe066',
                  opacity: 0.9,
                  position: 'relative',
                  left: 5,
                }} />
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#bfa14a',
                  opacity: 0.9,
                  position: 'relative',
                  right: 5,
                  marginLeft: -10,
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
            background: 'linear-gradient(135deg, #ff4b2b 0%, #ff416c 100%)',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '24px',
            zIndex: 1,
            fontSize: '13px',
            boxSizing: 'border-box',
            boxShadow: '0 0 32px 0 #2193b055',
          }}>
            {/* Customer service info */}
            <div style={{
              width: '100%',
              color: '#fff',
              fontSize: 12,
              marginBottom: 8,
              fontWeight: 500,
              textShadow: '0 1px 2px #2193b0',
            }}>
              For customer service, call <span style={{color:'#e6e6e6'}}>+123-456-789</span> or <span style={{color:'#e6e6e6'}}>+0-000-123-456</span>
            </div>
            {/* Black magnetic stripe */}
            <div style={{
              width: '100%',
              height: 28,
              background: 'linear-gradient(120deg, #222 80%, #444 100%)',
              borderRadius: 6,
              marginBottom: 18,
              boxShadow: '0 2px 8px #0002',
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
                color: '#333',
                fontSize: 11,
                fontFamily: 'monospace',
                boxShadow: '0 1px 2px #2193b033',
                border: '1px solid #e6e6e6',
                letterSpacing: 2,
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Blue signature lines */}
                <div style={{position:'absolute',top:4,left:8,right:8,height:2,background:'#b3e0f7'}}></div>
                <div style={{position:'absolute',top:10,left:8,right:8,height:2,background:'#b3e0f7'}}></div>
                <div style={{position:'absolute',top:16,left:8,right:8,height:2,background:'#b3e0f7'}}></div>
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
                color: '#222',
                fontWeight: 700,
                fontSize: 13,
                fontFamily: 'monospace',
                boxShadow: '0 1px 2px #2193b033',
                border: '1px solid #e6e6e6',
              }}>
                123
              </div>
            </div>
            {/* Placeholder text */}
            <div style={{
              marginTop: 18,
              color: '#fff',
              fontSize: 11,
              opacity: 0.9,
              lineHeight: 1.4,
              textShadow: '0 1px 2px #2193b0',
            }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat<br />
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
            </div>
            <div style={shineStyle}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreditCard3D;