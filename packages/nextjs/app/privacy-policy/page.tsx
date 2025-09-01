import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-base-100 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">
          Brolli Privacy Policy
        </h1>

        <div className="mb-6 text-center text-sm text-base-content/70">
          Effective Date: September 1, 2025
        </div>

        <div className="space-y-6 text-base-content">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              1. Introduction
            </h2>
            <p>
              Brolli ("we," "our," or "the Service") values your privacy. This Privacy Policy explains how we collect, use, and protect information when you interact with our Web3 NFT licensing platform. By using Brolli, you consent to the practices described here.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              2. Information We Collect
            </h2>
            <p>
              We only collect your wallet address when you interact with our platform, including minting NFTs or claiming licenses. We do not collect personal identifiers such as name, email, phone number, or payment details unless you voluntarily provide them in optional communications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              3. How We Use Information
            </h2>
            <p>
              Your wallet address is used for issuing NFTs (soulbound or otherwise) for licenses or promotional purposes, tracking engagement with airdrops and token-gated communities, and verifying eligibility for discounts, giveaways, and license purchases. We do not sell, rent, or share your wallet address with third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              4. Smart Contracts & Blockchain Transparency
            </h2>
            <p>
              All NFTs and transactions are recorded on public blockchains (Solana, testnet/mainnet). Wallet addresses interacting with the smart contract are visible on-chain. By using the platform, you acknowledge this transparency.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              5. Third-Party Services
            </h2>
            <p>
              We may use third-party services for blockchain infrastructure, token-gating, or NFT minting. These third parties may have access to your wallet address only to the extent necessary to provide the service. We require these third parties to handle your information responsibly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              6. Data Security
            </h2>
            <p>
              We take reasonable measures to protect wallet addresses stored off-chain. You are responsible for securing your wallet private keys.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              7. Children's Privacy
            </h2>
            <p>
              Our Service is not directed to anyone under 18 years old. We do not knowingly collect information from children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              8. Changes to this Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              9. Contact Us
            </h2>
            <p>
              For questions about this Privacy Policy, contact us at: [Insert Contact Method]
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-base-300 text-center">
          <p className="text-sm text-base-content/60">
            This Privacy Policy is part of Brolli's commitment to transparency and user privacy in the Web3 ecosystem.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
