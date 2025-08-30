"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldContract, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { LicenseViewer } from "~~/components/LicenseViewer";

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

          {/* Right Container - License Details Viewer */}
          <LicenseViewer className="flex-1" />
        </div>



      </div>
    </div>
      <div className="flex items-center flex-col flex-grow pt-10">

        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">Brolli Licenses</span>
          </h1>
          <div className="flex flex-col justify-center items-center mt-4 space-x-2 w-full max-w-2xl">

            <button
              onClick={handleMint}
              className="btn btn-primary mt-3"
              disabled={!connectedAddress || isSubmitting || Boolean(hasExistingLicense)}
            >
              {isSubmitting
                ? "Minting..."
                : Boolean(hasExistingLicense)
                  ? "License Already Owned"
                  : "Mint License"
              }
            </button>
            {Boolean(hasExistingLicense) && (
              <p className="text-sm text-warning mt-2 text-center">
                You already own a Brolli license. Only one license per wallet is allowed.
              </p>
            )}
          </div>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-4 p-8">
          <div className="flex justify-center items-center space-x-2">
            {loading ? (
              <p className="my-2 font-medium">Loading...</p>
            ) : !yourLicenses?.length ? (
              <p className="my-2 font-medium">No licenses minted</p>
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