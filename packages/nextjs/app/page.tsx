import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5">
        <h1 className="text-center mb-8">
          <span className="block text-2xl mb-2">Brolli</span>
          <span className="block text-4xl font-bold">Patent License NFT System</span>
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-start max-w-7xl mx-auto">
          {/* Left Container - Existing Minter */}
          <div className="flex-1 bg-base-200 p-6 rounded-xl border-2 border-primary">
            <h2 className="text-2xl font-bold text-center mb-4">Patent License Minter</h2>
            <div className="flex flex-col items-center space-y-4">
              <Image
                src="/patent-name.png"
                width="300"
                height="300"
                alt="Patent Name"
                className="rounded-lg border-2 border-base-300"
              />
              <Image
                src="/patent-abstract.png"
                width="300"
                height="200"
                alt="Patent Abstract"
                className="rounded-lg border-2 border-base-300"
              />
              <p className="text-center text-sm text-base-content/70">
                Legal Cover for BUIDLers of Decentralized Systems
              </p>
            </div>
          </div>

          {/* Right Container - PatentLicenseNFT Display */}
          <div className="flex-1 bg-base-200 p-6 rounded-xl border-2 border-primary">
            <h2 className="text-2xl font-bold text-center mb-4">Patent License Details</h2>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-64 h-64 bg-base-300 rounded-lg border-2 border-base-400 flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="text-6xl mb-2">📄</div>
                  <div className="text-sm text-base-content/70">Patent License NFT</div>
                  <div className="text-xs text-base-content/50 mt-2">
                    Connect wallet to view details
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-base-content/70">
                View detailed patent license information and terms
              </p>
            </div>
          </div>
        </div>

        

        
      </div>
    </div>
  );
};

export default Home;
