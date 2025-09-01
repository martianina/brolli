import React from "react";

const TermsOfService: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-base-100 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-4 text-primary">
          Brolli NFT Terms of Service
        </h1>

        <div className="mb-6 text-center text-base-content/70">
          <p className="text-lg font-medium">Brolli for Solana Seeker v.1.0</p>
          <p className="text-sm">Effective Date: September 1, 2025</p>
        </div>

        <div className="space-y-6 text-base-content">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              1. NFT Grant & Use
            </h2>
            <p>
              You receive a free Brolli NFT ("NFT") for participation. The NFT is solely a representation of IP licensing rights as described in its provenance package. You may hold, display, or transfer the NFT. Ownership does not create any other rights, implied or express, beyond those explicitly stated in the provenance package.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              2. No Warranties
            </h2>
            <p>
              The NFT is provided "as-is." We make no warranties regarding merchantability, fitness for a particular purpose, or non-infringement. We disclaim all liability except as explicitly represented in the provenance package.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              3. No Legal Advice
            </h2>
            <p>
              Interacting with the NFT does not constitute legal, financial, or tax advice. You are responsible for evaluating how the NFT fits your own compliance, business, or investment needs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              4. Risks
            </h2>
            <p>
              NFTs are digital assets stored on a blockchain, subject to network and market risks. Wallet addresses, token transfers, and blockchain activity are publicly visible. You assume all risk for private key management, wallet security, and interaction with the blockchain.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              5. Limitations of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, we are not liable for any loss, damages, or costs arising from your use or inability to use the NFT or the Service, including but not limited to technical failures, blockchain network errors, loss of value or opportunity, or indirect, incidental, or consequential damages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              6. Governing Law
            </h2>
            <p>
              These TOS are governed by the laws of [Insert State], without regard to conflict-of-law principles. Any disputes must be resolved in the courts of that jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              7. Miscellaneous
            </h2>
            <p>
              These TOS constitute the entire agreement regarding the NFT. If any provision is invalid, the remaining provisions remain in effect. By claiming the NFT, you acknowledge you understand these terms.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-base-300 text-center">
          <p className="text-sm text-base-content/60">
            Please read these terms carefully before interacting with Brolli NFTs. Your participation constitutes acceptance of these terms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
