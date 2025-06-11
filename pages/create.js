"use client"

import { useState } from "react"
import sdk from '@crossmarkio/sdk';

export default function CreatePage() {
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState("");

  // State for the form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  
  // New state to hold the created card's details
  const [cardDetails, setCardDetails] = useState(null);

  const handleConnectWallet = async () => {
    setError("");
    try {
      const { response } = await sdk.methods.signInAndWait();
      if (response.data.address) {
        setWalletAddress(response.data.address);
        console.log("Wallet connected:", response.data.address);
      } else {
        setError("Failed to get wallet address from Crossmark.");
      }
    } catch (err) {
      console.error("Wallet connection error:", err);
      setError("Could not connect to Crossmark wallet.");
    }
  };

  const handleCreateCard = async (e) => {
    e.preventDefault();
    setError("");
    setIsCreating(true);
    setCardDetails(null);

    try {
      const response = await fetch('/api/createCard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          firstName, 
          lastName, 
          email,
          walletAddress // Pass the wallet address to the API
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create card.");
      }
      
      // On success, store the returned card object
      setCardDetails(data.card);

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
      
      {!walletAddress ? (
        <div>
          <h2>Step 1: Connect Wallet</h2>
          <p>Connect your Crossmark wallet to get started.</p>
          <button 
            onClick={handleConnectWallet}
            style={{ padding: '10px 20px', fontSize: '1rem', cursor: 'pointer' }}
          >
            Connect Crossmark Wallet
          </button>
        </div>
      ) : (
        <div>
          <h2>Wallet Connected!</h2>
          <p style={{ fontWeight: 'bold', wordBreak: 'break-all' }}>{walletAddress}</p>
          <hr style={{ margin: '2rem 0' }} />

          {!cardDetails ? (
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
                <button 
                  type="submit" 
                  disabled={isCreating}
                  style={{ padding: '10px 20px', fontSize: '1rem', cursor: 'pointer' }}
                >
                  {isCreating ? "Creating..." : "Create Virtual Card"}
                </button>
              </form>
            </div>
          ) : (
            <div>
              <h2>Card Created Successfully!</h2>
              <div style={{ textAlign: 'left', background: '#f0f0f0', padding: '1rem', borderRadius: '8px' }}>
                <p><strong>Card Token:</strong> {cardDetails.token}</p>
                <p><strong>Card State:</strong> {cardDetails.state}</p>
                <p><strong>User Token:</strong> {cardDetails.user_token}</p>
              </div>
              <button onClick={() => setCardDetails(null)} style={{marginTop: '1rem'}}>
                  Create Another Card
              </button>
            </div>
          )}
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
