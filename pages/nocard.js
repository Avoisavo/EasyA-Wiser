import React, { useRef, useState, useEffect } from 'react';
import Header from '../components/header';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/router';

function NoCardSquare() {
  const router = useRouter();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Transform scroll progress for "No card available" - shows first, then fades out
  const noCardOpacity = useTransform(scrollYProgress, [0, 0.15, 0.3], [1, 1, 0]);
  const noCardScale = useTransform(scrollYProgress, [0, 0.15, 0.3], [1, 1, 0.9]);

  // Transform scroll progress for main heading - appears after no card fades
  const headingOpacity = useTransform(scrollYProgress, [0.2, 0.35, 0.5], [0, 1, 1]);
  const headingY = useTransform(scrollYProgress, [0.2, 0.35], [-30, 0]);

  // Transform scroll progress to reveal the glass container - appears with heading
  const glassOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.8], [0, 0.8, 1]);
  const glassScale = useTransform(scrollYProgress, [0.3, 0.5, 0.8], [0.8, 0.95, 1]);
  const glassY = useTransform(scrollYProgress, [0.3, 0.5, 0.8], [100, 20, 0]);

  const languages = [
    { text: "οπουδήποτε", lang: "Greek" },
    { text: "overal", lang: "Dutch" },  
    { text: "nágonstans", lang: "Swedish" },
    { text: "Anywhere", lang: "English", isMain: true },
    { text: "في أي مكان", lang: "Arabic" },
    { text: "en cualquier lugar", lang: "Spanish" },
    { text: "어디가에", lang: "Korean" }
  ];

  return (
    <>
      <Header />
      <motion.div 
        ref={containerRef}
        style={{
          minHeight: '250vh', // Increased height for better scroll control
          width: '100vw',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)',
        }}
      >
        {/* No card available - shows first, then fades out */}
        <motion.div 
          style={{
            position: 'fixed',
            top: '30%',
            left: '38%',
            transform: 'translate(-50%, -50%)',
            width: 320,
            height: 240,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 15,
            opacity: noCardOpacity,
            scale: noCardScale,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: [1, 1.02, 1],
            y: [0, -5, 0]
          }}
          transition={{ 
            opacity: { duration: 1, delay: 0.5 },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {/* Four animated corners */}
          {/* Top-left */}
          <motion.div 
            style={{position:'absolute',top:0,left:0,width:40,height:40}}
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div 
              style={{position:'absolute',top:0,left:0,width:30,height:2,background:'#495057'}}
              animate={{ scaleX: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              style={{position:'absolute',top:0,left:0,width:2,height:30,background:'#495057'}}
              animate={{ scaleY: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </motion.div>
          
          {/* Top-right */}
          <motion.div 
            style={{position:'absolute',top:0,right:0,width:40,height:40}}
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <motion.div 
              style={{position:'absolute',top:0,right:0,width:30,height:2,background:'#495057'}}
              animate={{ scaleX: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            <motion.div 
              style={{position:'absolute',top:0,right:0,width:2,height:30,background:'#495057'}}
              animate={{ scaleY: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </motion.div>
          
          {/* Bottom-left */}
          <motion.div 
            style={{position:'absolute',bottom:0,left:0,width:40,height:40}}
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <motion.div 
              style={{position:'absolute',bottom:0,left:0,width:30,height:2,background:'#495057'}}
              animate={{ scaleX: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div 
              style={{position:'absolute',bottom:0,left:0,width:2,height:30,background:'#495057'}}
              animate={{ scaleY: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            />
          </motion.div>
          
          {/* Bottom-right */}
          <motion.div 
            style={{position:'absolute',bottom:0,right:0,width:40,height:40}}
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          >
            <motion.div 
              style={{position:'absolute',bottom:0,right:0,width:30,height:2,background:'#495057'}}
              animate={{ scaleX: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            />
            <motion.div 
              style={{position:'absolute',bottom:0,right:0,width:2,height:30,background:'#495057'}}
              animate={{ scaleY: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          </motion.div>
          
          {/* Animated Center text */}
          <motion.span 
            style={{
              fontSize: '2.2rem',
              fontWeight: 500,
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif',
              color: '#212529',
              letterSpacing: '0.5px',
              textAlign: 'center',
              userSelect: 'none',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: [0.7, 1, 0.7],
              y: 0,
            }}
            transition={{ 
              opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 1, delay: 0.8 },
            }}
          >
            No card available
          </motion.span>
        </motion.div>

        {/* Generate Card Button - positioned below the box */}
        <motion.div
          style={{
            position: 'fixed',
            top: '82%',
            left: '40%',
            transform: 'translateX(-50%)',
            zIndex: 15,
            opacity: noCardOpacity,
            scale: noCardScale,
          }}
        >
          <motion.button
            style={{
              background: 'linear-gradient(135deg, #0066cc 0%, #004499 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 28px',
              fontSize: '1.1rem',
              fontWeight: 600,
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0, 102, 204, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1)',
              letterSpacing: '0.3px',
              textTransform: 'uppercase',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 1.5, 
              duration: 0.8,
              ease: "easeOut"
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 6px 20px rgba(0, 102, 204, 0.4), 0 4px 8px rgba(0, 0, 0, 0.15)',
            }}
            whileTap={{
              scale: 0.98,
            }}
            onClick={() => {
              router.push('/create');
            }}
          >
            {/* Button shine effect */}
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                pointerEvents: 'none',
              }}
              animate={{
                left: ['100%', '-100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut"
              }}
            />
            
            {/* Card icon */}
            <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>💳</span>
            Generate me a card
          </motion.button>
        </motion.div>

        {/* Main heading - appears after no card fades */}
        <motion.div
          style={{
            position: 'fixed',
            top: '20%',
            left: '16%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            textAlign: 'left',
            opacity: headingOpacity,
            y: headingY,
            width: '100%',
            maxWidth: '1200px',
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 6vw, 6rem)',
              fontWeight: 300,
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif',
              color: '#212529',
              margin: 0,
              marginLeft: '13rem',

              lineHeight: 1,
              letterSpacing: '-0.02em',
              textAlign: 'left',
            }}>
              Pay. Receive.
            </h1>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 6vw, 6rem)',
              fontWeight: 300,
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif',
              color: '#212529',
              margin: 0,
              marginLeft: '10rem',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              textAlign: 'left',
            }}>
              Send. Exchange.
            </h1>
          </div>
        </motion.div>

        {/* Glass morphism container with multilingual text - appears with heading */}
        <motion.div
          style={{
            position: 'fixed',
            top: '50%',
            left: '33%',
            transform: 'translateX(-50%)',
            zIndex: 5,
            opacity: glassOpacity,
            scale: glassScale,
            y: glassY,
          }}
        >
          <div style={{
            width: '450px',
            height: '600px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Subtle gradient overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.05) 100%)',
              borderRadius: '24px',
              pointerEvents: 'none',
            }} />
            
            {/* Language texts */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              position: 'relative',
              zIndex: 1,
            }}>
              {languages.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.8 + (index * 0.1),
                    duration: 0.6,
                    ease: "easeOut"
                  }}
                  style={{ textAlign: 'center' }}
                >
                  <span style={{
                    fontSize: item.isMain ? '2.5rem' : '1.8rem',
                    fontWeight: item.isMain ? 500 : 300,
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif',
                    color: item.isMain ? '#000000' : '#495057',
                    display: 'block',
                    marginBottom: item.isMain ? '8px' : '4px',
                    letterSpacing: item.isMain ? '-0.01em' : '0em',
                    textShadow: item.isMain ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                  }}>
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Subtle animated elements */}
            <motion.div
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '60px',
                height: '60px',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '50%',
              }}
              animate={{
                rotate: [0, 360],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            />

            <motion.div
              style={{
                position: 'absolute',
                bottom: '30px',
                left: '30px',
                width: '40px',
                height: '40px',
                border: '1px solid rgba(0,0,0,0.2)',
                transform: 'rotate(45deg)',
              }}
              animate={{
                rotate: [45, 405],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            />
          </div>
        </motion.div>

        {/* Background geometric elements */}
        <motion.div
          style={{
            position: 'absolute',
            top: '15%',
            left: '10%',
            width: '100px',
            height: '100px',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '50%',
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '15%',
            width: '80px',
            height: '80px',
            border: '1px solid rgba(0,0,0,0.15)',
            transform: 'rotate(45deg)',
          }}
          animate={{
            rotate: [45, 405],
            x: [0, 20, 0],
            y: [0, -20, 0],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '3px',
              height: '3px',
              backgroundColor: '#6c757d',
              borderRadius: '50%',
              opacity: 0.3,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 200, 0],
              y: [0, (Math.random() - 0.5) * 150, 0],
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
          />
        ))}

        {/* Grid overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
          opacity: 0.3,
        }} />
      </motion.div>
    </>
  );
}

export default NoCardSquare;