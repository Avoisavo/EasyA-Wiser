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

function NoCardSquare() {
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
        {/* Centered square with corners and text */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 320,
          height: 240,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Four corners */}
          {/* Top-left */}
          <div style={{position:'absolute',top:0,left:0,width:40,height:40}}>
            <div style={{position:'absolute',top:0,left:0,width:30,height:2,background:'#222'}}></div>
            <div style={{position:'absolute',top:0,left:0,width:2,height:30,background:'#222'}}></div>
          </div>
          {/* Top-right */}
          <div style={{position:'absolute',top:0,right:0,width:40,height:40}}>
            <div style={{position:'absolute',top:0,right:0,width:30,height:2,background:'#222'}}></div>
            <div style={{position:'absolute',top:0,right:0,width:2,height:30,background:'#222'}}></div>
          </div>
          {/* Bottom-left */}
          <div style={{position:'absolute',bottom:0,left:0,width:40,height:40}}>
            <div style={{position:'absolute',bottom:0,left:0,width:30,height:2,background:'#222'}}></div>
            <div style={{position:'absolute',bottom:0,left:0,width:2,height:30,background:'#222'}}></div>
          </div>
          {/* Bottom-right */}
          <div style={{position:'absolute',bottom:0,right:0,width:40,height:40}}>
            <div style={{position:'absolute',bottom:0,right:0,width:30,height:2,background:'#222'}}></div>
            <div style={{position:'absolute',bottom:0,right:0,width:2,height:30,background:'#222'}}></div>
          </div>
          {/* Center text */}
          <span style={{
            fontSize: '2.2rem',
            fontWeight: 700,
            fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
            background: 'linear-gradient(90deg, #2563eb 10%, #60a5fa 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: 2,
            textShadow: '0 2px 12px #60a5fa44, 0 1px 2px #2563eb22',
            textAlign: 'center',
            userSelect: 'none',
          }}>
            No card available
          </span>
        </div>
      </div>
    </>
  );
}

export default NoCardSquare;