"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldContract, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface LicenseFormState {
  patentName: string;
  imageUri: string;
  provenanceCid: string;
}

// Dummy IPFS hash for license details (same as in LicenseViewer)
const DUMMY_IPFS_HASH = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";

const initialState: LicenseFormState = {
  patentName: "Brolli Patent License for BUIDLers",
  imageUri: "https://tan-everyday-mite-419.mypinata.cloud/ipfs/bafkreiblkz5urallgl4ko6otrcgm2rrzf22n5coi5rqkmmokrhcilnadjy",
  provenanceCid: DUMMY_IPFS_HASH,
};

const BrolliLicensePage: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<LicenseFormState>(initialState);

  const [yourLicenses, setYourLicenses] = useState<any[]>();
  const [loading, setLoading] = useState(true);

  const { data: balance } = useScaffoldReadContract({
    contractName: "BrolliLicenseSimple",
    functionName: "balanceOf",
    args: connectedAddress ? [connectedAddress] : undefined,
    enabled: Boolean(connectedAddress),
  } as any);

  const { data: hasExistingLicense } = useScaffoldReadContract({
    contractName: "BrolliLicenseSimple",
    functionName: "hasLicense",
    args: connectedAddress ? [connectedAddress] : undefined,
    enabled: Boolean(connectedAddress),
  } as any);

  const { data: contract } = useScaffoldContract({ contractName: "BrolliLicenseSimple" });
  const { writeContractAsync } = useScaffoldWriteContract("BrolliLicenseSimple");

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
        args: [form.patentName, form.imageUri, form.provenanceCid],
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
                  ? "License Already Owned"
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
                Legal Cover for BUIDLers of Decentralized Systems
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
            The IP Minefield for BUIDLers
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
            <div className="text-4xl font-bold text-accent mb-2">⚠️ WARNING</div>
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
              <div className="text-3xl font-bold mb-4 text-secondary">PROVENANCE</div>

              <p className="text-sm text-base-content">Legal affidavit notarized and stored on-chain for maximum credibility.</p>
            </div>
            <div className="bg-black p-6 rounded-2xl text-center shadow-lg border border-neutral">
              <div className="text-3xl font-bold mb-4 text-secondary">PROOF</div>

              <p className="text-sm text-base-content">Portable proof of coverage that travels with your project.</p>
            </div>
            <div className="bg-black p-6 rounded-2xl text-center shadow-lg border border-neutral">
              <div className="text-3xl font-bold mb-4 text-secondary">VALIDATION</div>

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
            <div className="text-3xl mb-3 font-bold text-secondary">BUILD</div>
            <h4 className="font-bold text-lg mb-2 text-secondary">For Builders</h4>
            <p className="text-sm text-secondary">Freedom to innovate without patent fear. Focus on building, not litigation.</p>
          </div>
          <div className="bg-black p-6 rounded-2xl text-center border border-neutral">
            <div className="text-3xl mb-3 font-bold text-secondary">ENTERPRISE</div>
            <h4 className="font-bold text-lg mb-2 text-secondary">For Enterprises</h4>
            <p className="text-sm text-secondary">Clear licensing path for web3 adoption and ecosystem growth.</p>
          </div>
          <div className="bg-black p-6 rounded-2xl text-center border border-neutral">
            <div className="text-3xl mb-3 font-bold text-secondary">ECOSYSTEM</div>
            <h4 className="font-bold text-lg mb-2 text-secondary">For Ecosystem</h4>
            <p className="text-sm text-secondary">Growth without litigation drag. Collective protection benefits all.</p>
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
                ? "License Already Owned"
                : "FREE MINT"
            }
          </button>
        </div>

        {/* Call to Action */}
        


      </div>
    </div>
      <div className="flex items-center flex-col flex-grow pt-10">

        <div className="px-5">

        </div>

        <div className="flex-grow bg-base-300 w-full mt-4 p-8">
          <div className="flex justify-center items-center space-x-2">
            {loading ? (
              <p className="my-2 font-medium">Loading...</p>
            ) : !yourLicenses?.length ? (
              <p className="my-2 font-medium">Mint Your Brolli NFT</p>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center">
                  {yourLicenses.map(license => {
                    return (
                      <div key={license.id} className="flex flex-col bg-base-100 p-5 text-center items-center max-w-xs rounded-3xl">
                        <h2 className="text-xl font-bold">{license.name}</h2>
                        {license.image && renderImage(license.image, license.name)}
                        <p className="mt-2">{license.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BrolliLicensePage;