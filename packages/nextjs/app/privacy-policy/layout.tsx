import { Metadata } from "next";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : `http://localhost:${process.env.PORT || 3000}`;

export const metadata: Metadata = {
  title: "Privacy Policy | Brolli",
  description: "Brolli Privacy Policy - Learn how we protect your privacy in our Web3 NFT licensing platform",
  openGraph: {
    title: "Privacy Policy | Brolli",
    description: "Brolli Privacy Policy - Learn how we protect your privacy in our Web3 NFT licensing platform",
  },
  twitter: {
    title: "Privacy Policy | Brolli",
    description: "Brolli Privacy Policy - Learn how we protect your privacy in our Web3 NFT licensing platform",
  },
};

const PrivacyPolicyLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default PrivacyPolicyLayout;
