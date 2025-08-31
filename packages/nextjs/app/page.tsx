"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldContract, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface LicenseFormState {
  name: string;
  imageUri: string;
  provenanceCid: string;
}

// IPFS hash for license details (same as in LicenseViewer)
const IPFS_HASH = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";

const initialState: LicenseFormState = {
  name: "",
  imageUri: "https://tan-everyday-mite-419.mypinata.cloud/ipfs/bafkreialme2ca3b36nzq5rqqdqaw3k2le4uvgrdxtdj33t2j4sn44amisi",
  provenanceCid: IPFS_HASH,
};

const BrolliLicensePage: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<LicenseFormState>(initialState);

  const [yourLicenses, setYourLicenses] = useState<any[]>();
  const [loading, setLoading] = useState(true);

  const { data: balance } = useScaffoldReadContract({
    contractName: "Brolli",
    functionName: "balanceOf",
    args: connectedAddress ? [connectedAddress] : undefined,
    enabled: Boolean(connectedAddress),
  } as any);

  const { data: hasExistingLicense } = useScaffoldReadContract({
    contractName: "Brolli",
    functionName: "hasLicense",
    args: connectedAddress ? [connectedAddress] : undefined,
    enabled: Boolean(connectedAddress),
  } as any);

  const { data: contract } = useScaffoldContract({ contractName: "Brolli" });
  const { writeContractAsync } = useScaffoldWriteContract("Brolli");

  function update<K extends keyof LicenseFormState>(key: K, value: LicenseFormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (contract && balance && connectedAddress) {
        const total = (balance as unknown as bigint) ?? 0n;
        const items = [] as any[];
        for (let tokenIndex = 0n; tokenIndex < total; tokenIndex++) {
          try {
            const tokenId = await contract.read.tokenOfOwnerByIndex([connectedAddress, tokenIndex]);
            const tokenURI = await contract.read.tokenURI([tokenId]);
            const jsonManifestString = atob(tokenURI.substring(29));
            try {
              const jsonManifest = JSON.parse(jsonManifestString);
              items.push({ id: tokenId, uri: tokenURI, ...jsonManifest });
            } catch (e) {
              console.log(e);
            }
          } catch (e) {
            console.log(e);
          }
        }
        setYourLicenses(items);
      } else {
        setYourLicenses([]);
      }
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance, connectedAddress, Boolean(contract)]);

  async function handleMint() {
    if (!contract || !connectedAddress) return;
    setIsSubmitting(true);
    try {
      await writeContractAsync({
        functionName: "mint",
        args: [form.name, form.imageUri, form.provenanceCid],
      });
      setForm(initialState);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderImage(src: string, alt: string) {
    const isExternal = src.startsWith("http");
    if (isExternal) return <img src={src} alt={alt} width={300} height={300} />;
    return <Image src={src} alt={alt} width={300} height={300} />;
  }

  return (
    <>
    {/* Hero Section with Video Background and Logo Overlay */}
    <div className="relative h-[110vh] w-full overflow-hidden">
      {/* Background Video */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover object-top"
      >
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Dark Overlay for better text readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40" />
      
      {/* Logo Overlay */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <div className="text-center z-10">
                      <Image
              src="/hero.png"
              alt="Brolli for BUIDLers"
              width={1200}
              height={1200}
              className="mx-auto -mb-2 drop-shadow-2xl"
            />

            {/* CTA Button */}
            <button
              onClick={handleMint}
              className="btn px-8 py-3 text-lg font-semibold"
              style={{
                backgroundColor: '#6A5ACD',
                borderColor: '#6A5ACD',
                color: 'white'
              }}
              disabled={!connectedAddress || isSubmitting || Boolean(hasExistingLicense)}
            >
              {isSubmitting
                ? "Minting..."
                : Boolean(hasExistingLicense)
                  ? "You already own Brolli"
                  : "FREE MINT"
              }
            </button>
        </div>
      </div>
    </div>

    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5">
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-start max-w-7xl mx-auto">
          {/* Left Container - Existing Minter */}
          <div className="flex-1 bg-base-200 p-6 rounded-xl border-2 border-primary">
            <h2 className="text-2xl font-bold text-center mb-4">Brolli NFT Minter</h2>
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
                IP Cover for BUIDLers of Decentralized Systems
              </p>
            </div>
          </div>

          {/* Right Container - NFT Actions */}
          <div className="flex-1 bg-base-100 p-6 rounded-xl border-2 border-primary flex flex-col items-center justify-center gap-4">
            <Link href="/details" className="btn btn-primary btn-lg">
              View NFT Details
            </Link>
            
            <button 
              onClick={handleMint} 
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3 px-6 rounded-lg text-lg shadow-md transform hover:scale-105 transition-all duration-200"
              disabled={!connectedAddress || isSubmitting || Boolean(hasExistingLicense)}
            >
              {isSubmitting 
                ? "Minting..." 
                : Boolean(hasExistingLicense)
                  ? "NFT Already Owned"
                  : "Mint NFT"
              }
            </button>
            {Boolean(hasExistingLicense) && (
              <p className="text-sm text-warning text-center">
                You already own a Brolli NFT!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Enhanced Content Section After Minter */}
    <div className="flex items-center flex-col flex-grow pt-16">
      <div className="px-6 max-w-6xl mx-auto">
        {/* Main Value Proposition */}
        <div className="text-center mb-12">
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Why Brolli for BUIDLers?
          </h2>
        </div>

        {/* Key Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-base-100 p-6 rounded-2xl shadow-lg border border-base-300 text-center">
            <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
            <div className="text-sm text-base-content/70 uppercase tracking-wide">Blockchain Patents</div>
            <div className="text-xs text-base-content/50 mt-1">Issued in the U.S.</div>
          </div>
          <div className="bg-base-100 p-6 rounded-2xl shadow-lg border border-base-300 text-center">
            <div className="text-4xl font-bold text-secondary mb-2">85%</div>
            <div className="text-sm text-base-content/70 uppercase tracking-wide">Held by Enterprises</div>
            <div className="text-xs text-base-content/50 mt-1">Banks & Tech Giants</div>
          </div>
          <div className="bg-base-100 p-6 rounded-2xl shadow-lg border border-base-300 text-center">
            <div className="text-4xl font-bold text-accent mb-2">⚠️ </div>
            <div className="text-sm text-base-content/70 uppercase tracking-wide">Waiting to Strike</div>
            <div className="text-xs text-base-content/50 mt-1">Patent Trolls Target Success</div>
          </div>
        </div>

        {/* The Problem */}
        <div className="bg-gradient-to-br from-base-100 to-base-200 p-8 rounded-3xl shadow-xl border border-base-300 mb-12">
          

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="text-red-500 text-xl mt-1 font-bold">•</div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Patent Trolls Wait</h4>
                  <p className="text-base-content/70">They monitor successful projects and strike when you're most vulnerable.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-orange-500 text-xl mt-1 font-bold">•</div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Enterprise Dominance</h4>
                  <p className="text-base-content/70">Banks, consultancies, and tech giants hold most blockchain patents.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-blue-500 text-xl mt-1 font-bold">•</div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Targets: BUILDers</h4>
                  <p className="text-base-content/70">Startups, DAOs, and open-science projects are prime targets.</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Image
                src="/Brolli.png"
                width="180"
                height="180"
                alt="Brolli Logo"
                className="mx-auto mb-6 rounded-lg shadow-lg"
              />
              <div className="text-3xl font-bold mb-4 text-primary">PROTECTION</div>
              <p className="text-lg font-semibold">Brolli Provides Cover</p>
              <p className="text-sm text-base-content/60">Collective protection for the ecosystem</p>
            </div>
          </div>
        </div>

        {/* The Solution */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-8 rounded-3xl border border-primary/20 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">code+law</h3>
            <p className="text-lg text-base-content/80 max-w-2xl mx-auto">
              NFT license framework anchored on-chain, providing broad protection for real-world asset web3 systems.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-black p-6 rounded-2xl text-center shadow-lg border border-neutral">
              <div className="flex flex-col items-center mb-4">
                <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <div className="text-3xl font-bold text-secondary">PROVENANCE</div>
              </div>

              <p className="text-sm text-base-content">Legal affidavit notarized and stored on-chain for maximum credibility.</p>
            </div>
            <div className="bg-black p-6 rounded-2xl text-center shadow-lg border border-neutral">
              <div className="flex flex-col items-center mb-4">
                <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div className="text-3xl font-bold text-secondary">PROOF</div>
              </div>

              <p className="text-sm text-base-content">Portable proof of coverage that travels with your project.</p>
            </div>
            <div className="bg-black p-6 rounded-2xl text-center shadow-lg border border-neutral">
              <div className="flex flex-col items-center mb-4">
                <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                <div className="text-3xl font-bold text-secondary">VALIDATION</div>
              </div>

              <p className="text-sm text-base-content">Complete evidence bundle ready for verification and disputes.</p>
            </div>
          </div>
        </div>

        {/* Brolli Hero Logo - Centered between container rows */}
        <div className="text-center my-12">
          <Image
            src="/hero.png"
            width="250"
            height="250"
            alt="Brolli Logo"
            className="mx-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Value Proposition */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-black p-6 rounded-2xl text-center border border-neutral">
            <div className="flex flex-col items-center mb-4">
              <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div className="text-3xl mb-3 font-bold text-secondary">BUILDers</div>
            </div>

            <p className="text-sm text-secondary">Focus on innovation, not IP trolls.</p>
          </div>
                    <div className="bg-black p-6 rounded-2xl text-center border border-neutral">
            <div className="flex flex-col items-center mb-4">
              <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <div className="text-3xl mb-3 font-bold text-secondary">ENTERPRISE</div>
            </div>

            <p className="text-sm text-secondary">Clear licensing path for web3 adoption and ecosystem growth.</p>
          </div>
          <div className="bg-black p-6 rounded-2xl text-center border border-neutral">
            <div className="flex flex-col items-center mb-4">
              <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-3xl mb-3 font-bold text-secondary">ECOSYSTEM</div>
            </div>

            <p className="text-sm text-secondary">Expand regulated use cases. Collective protection benefits all.</p>
          </div>
        </div>

        {/* Duplicated FREE MINT Button */}
        <div className="text-center my-8">
          <button
            onClick={handleMint}
            className="btn px-8 py-3 text-lg font-semibold"
            style={{
              backgroundColor: '#6A5ACD',
              borderColor: '#6A5ACD',
              color: 'white'
            }}
            disabled={!connectedAddress || isSubmitting || Boolean(hasExistingLicense)}
          >
            {isSubmitting
              ? "Minting..."
              : Boolean(hasExistingLicense)
                ? "You already own Brolli"
                : "FREE MINT"
            }
          </button>
        </div>

        {/* Call to Action */}
        


      </div>
    </div>
      <div className="flex items-center justify-center min-h-screen w-full py-10">
        <div className="w-full max-w-7xl px-5">
          <div className="bg-base-300 w-full p-8 rounded-3xl">
            <div className="text-center">
            {loading ? (
              <p className="my-2 font-medium">Loading...</p>
            ) : !yourLicenses?.length ? (
                <p className="my-2 font-medium">Mint Your Brolli NFT</p>
            ) : (
              <div>
                  <h3 className="text-2xl font-bold mb-6 text-secondary">My Brolli</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 place-items-center">
                  {yourLicenses.map(license => {
                    return (
                        <div key={license.id} className="flex flex-col bg-base-100 p-5 text-center items-center max-w-xs rounded-3xl shadow-lg border border-neutral">
                        <h2 className="text-xl font-bold">{license.name}</h2>
                        {license.image && renderImage(license.image, license.name)}
                        <p className="mt-2 text-sm">{license.description}</p>

                        {/* Block Explorer Links */}
                        <div className="mt-4 w-full">
                          <a
                            href={`/blockexplorer/address/${contract?.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-xs btn-outline btn-primary"
                          >
                            View Contract
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrolliLicensePage; 