"use client";

import { useState } from "react";
import { useAccount } from "wagmi";

interface LicenseViewerProps {
  className?: string;
}

// Dummy IPFS hash for now
const DUMMY_IPFS_HASH = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";

const LICENSE_DETAILS = {
  title: "Brolli Patent License for BUIDLers",
  description: "Legal IP cover for developers of decentralized systems",
  coverage: [
    "Protection against patent trolls",
    "Defensive patent portfolio access",
    "Legal backing for decentralized protocols",
    "Community-driven IP protection"
  ],
  terms: {
    duration: "Perpetual",
    territory: "Worldwide",
    field: "Decentralized Systems & Blockchain Technology",
    transferable: false
  },
  ipfsHash: DUMMY_IPFS_HASH
};

export const LicenseViewer = ({ className = "" }: LicenseViewerProps) => {
  const { address: connectedAddress } = useAccount();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!connectedAddress) {
    return (
      <div className={`bg-base-200 p-6 rounded-xl border-2 border-primary ${className}`}>
        <h2 className="text-2xl font-bold text-center mb-4">Patent License Details</h2>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-64 h-64 bg-base-300 rounded-lg border-2 border-base-400 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="text-6xl mb-2">🔐</div>
              <div className="text-sm text-base-content/70">Connect Wallet</div>
              <div className="text-xs text-base-content/50 mt-2">
                Connect your wallet to view license details
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-base-content/70">
            Review the patent license terms before minting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-base-200 p-6 rounded-xl border-2 border-primary ${className}`}>
      <h2 className="text-2xl font-bold text-center mb-4">Patent License Details</h2>
      
      <div className="space-y-4">
        {/* License Preview Card */}
        <div className="bg-base-100 rounded-lg p-4 border border-base-300">
          <h3 className="text-lg font-semibold mb-2">{LICENSE_DETAILS.title}</h3>
          <p className="text-sm text-base-content/70 mb-3">{LICENSE_DETAILS.description}</p>
          
          {/* IPFS Hash Display */}
          <div className="bg-base-200 rounded p-3 mb-3">
            <div className="text-xs text-base-content/60 mb-1">IPFS Hash (Provenance)</div>
            <div className="font-mono text-sm break-all text-primary">
              {LICENSE_DETAILS.ipfsHash}
            </div>
          </div>

          {/* Expandable Details */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-sm btn-outline w-full"
          >
            {isExpanded ? "Hide Details" : "View Full License Terms"}
          </button>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="bg-base-100 rounded-lg p-4 border border-base-300 space-y-4">
            {/* Coverage */}
            <div>
              <h4 className="font-semibold mb-2">Coverage Includes:</h4>
              <ul className="space-y-1">
                {LICENSE_DETAILS.coverage.map((item, index) => (
                  <li key={index} className="text-sm flex items-start">
                    <span className="text-success mr-2">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Terms */}
            <div>
              <h4 className="font-semibold mb-2">License Terms:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium">Duration:</span> {LICENSE_DETAILS.terms.duration}
                </div>
                <div>
                  <span className="font-medium">Territory:</span> {LICENSE_DETAILS.terms.territory}
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium">Field of Use:</span> {LICENSE_DETAILS.terms.field}
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium">Transferable:</span> 
                  <span className={`ml-1 ${LICENSE_DETAILS.terms.transferable ? 'text-success' : 'text-warning'}`}>
                    {LICENSE_DETAILS.terms.transferable ? 'Yes' : 'No (Soulbound)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Legal Notice */}
            <div className="bg-warning/10 border border-warning/20 rounded p-3">
              <div className="text-xs text-warning-content/80">
                <strong>Legal Notice:</strong> This is a binding legal agreement. 
                By minting this NFT, you agree to the terms stored in the IPFS hash above.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
