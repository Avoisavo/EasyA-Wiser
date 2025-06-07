"use client"

import { useState } from "react"
import { useWallet } from '../contexts/WalletContext';
import { useRouter } from 'next/router';

export default function CreatePage() {
  const { isConnected, walletAddress } = useWallet();
  const router = useRouter();
  const [error, setError] = useState("");

  // State for the form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  
  const handleCreateCard = async (e) => {
    e.preventDefault();
    setError("");
    setIsCreating(true);

    try {
      const response = await fetch('/api/createCard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          firstName, 
          lastName, 
          email,
          password,
          walletAddress
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create card.");
      }
      
      // On success, save card details to local storage and redirect
      localStorage.setItem('newCardDetails', JSON.stringify(data));
      router.push('/card');

    } catch (err) {
      console.error("Card creation error:", err);
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
      <h1>Create Your Virtual Card</h1>
      
      {!isConnected ? (
        <div>
          <h2>Step 1: Connect Wallet</h2>
          <p>Please connect your wallet using the button in the header to get started.</p>
        </div>
      ) : (
        <div>
          <h2>Wallet Connected!</h2>
          <p style={{ fontWeight: 'bold', wordBreak: 'break-all' }}>{walletAddress}</p>
          <hr style={{ margin: '2rem 0' }} />

          <div>
            <h2>Step 2: Enter Your Details</h2>
            <form onSubmit={handleCreateCard} style={{ display: 'grid', gap: '1rem' }}>
              <input 
                type="text" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                placeholder="First Name" 
                required 
                style={{ padding: '10px' }}
              />
              <input 
                type= "text" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                placeholder="Last Name" 
                required 
                style={{ padding: '10px' }}
              />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email Address" 
                required 
                style={{ padding: '10px' }}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6-Digit Card PIN"
                required
                maxLength={6}
                pattern="\d{6}"
                title="PIN must be 6 digits."
                style={{ padding: '10px' }}
              />
              <button 
                type="submit" 
                disabled={isCreating}
                style={{ padding: '10px 20px', fontSize: '1rem', cursor: 'pointer' }}
              >
                {isCreating ? "Creating..." : "Create Virtual Card"}
              </button>
            </form>
          </div>
        </div>
      )}

      {error && (
        <p style={{ color: 'red', marginTop: '1rem' }}>
          Error: {error}
        </p>
      )}
    </div>
  );
}
