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
      
    </>
  );
};

export default Details;
