import { ContractDetails } from "./_components/ContractDetails";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Brolli NFT Details",
  description: "Legal Cover for BUIDLers",
});

const Details: NextPage = () => {
  return (
    <>
      <ContractDetails />
      <div className="text-center mt-8 bg-secondary p-10">
        <h1 className="text-4xl my-0">Brolli NFT Details</h1>
        
      </div>
    </>
  );
};

export default Details;
