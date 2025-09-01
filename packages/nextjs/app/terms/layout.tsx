import { Metadata } from "next";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : `http://localhost:${process.env.PORT || 3000}`;

export const metadata: Metadata = {
  title: "Terms of Service | Brolli",
  description: "Brolli NFT Terms of Service - Read the terms and conditions for using Brolli NFTs",
  openGraph: {
    title: "Terms of Service | Brolli",
    description: "Brolli NFT Terms of Service - Read the terms and conditions for using Brolli NFTs",
  },
  twitter: {
    title: "Terms of Service | Brolli",
    description: "Brolli NFT Terms of Service - Read the terms and conditions for using Brolli NFTs",
  },
};

const TermsLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default TermsLayout;
