import { useState, useEffect } from 'react';
import Head from 'next/head';
import * as xrpl from 'xrpl';

export default function Account() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Head>
        <title>XRPL Account Manager</title>
        <meta name="description" content="Manage XRPL accounts and send XRP" />
      </Head>

      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">XRPL Account Manager</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">XRPL Account Manager - Coming Soon</p>
        </div>
      </div>
    </div>
  );
}
