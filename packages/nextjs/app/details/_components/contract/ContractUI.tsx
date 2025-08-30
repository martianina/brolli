"use client";

// @refresh reset
import { useReducer } from "react";
import { ContractVariables } from "./ContractVariables";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useNetworkColor } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { ContractName } from "~~/utils/scaffold-eth/contract";

type ContractUIProps = {
  contractName: ContractName;
  className?: string;
};

/**
 * UI component to interface with deployed contracts.
 **/
export const ContractUI = ({ contractName, className = "" }: ContractUIProps) => {
  const [refreshDisplayVariables, triggerRefreshDisplayVariables] = useReducer(value => !value, false);
  const { targetNetwork } = useTargetNetwork();
  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(contractName);
  const networkColor = useNetworkColor();

  if (deployedContractLoading) {
    return (
      <div className="mt-14">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!deployedContractData) {
    return (
      <p className="text-3xl mt-14">
        {`No contract found by the name of "${contractName}" on chain "${targetNetwork.name}"!`}
      </p>
    );
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-6 px-6 lg:px-10 lg:gap-12 w-full max-w-7xl my-0 ${className}`}>
      <div className="col-span-5 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        <div className="col-span-1 flex flex-col">
          <div className="bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl px-6 lg:px-8 mb-6 space-y-1 py-4">
            <div className="flex">
              <div className="flex flex-col gap-1">
                <span className="font-bold">{contractName}</span>
                <Address address={deployedContractData.address} />
                <div className="flex gap-1 items-center">
                  <span className="font-bold text-sm">Balance:</span>
                  <Balance address={deployedContractData.address} className="px-0 h-1.5 min-h-[0.375rem]" />
                </div>
              </div>
            </div>
            {targetNetwork && (
              <p className="my-0 text-sm">
                <span className="font-bold">Network</span>:{" "}
                <span style={{ color: networkColor }}>{targetNetwork.name}</span>
              </p>
            )}
          </div>
          <div className="bg-base-300 rounded-3xl px-6 lg:px-8 py-4 shadow-lg shadow-base-300">
            <ContractVariables
              refreshDisplayVariables={refreshDisplayVariables}
              deployedContractData={deployedContractData}
            />
          </div>
        </div>
        {/* Right Container - Patent License Details */}
        <div className="col-span-1 lg:col-span-2 flex flex-col">
          <div className="bg-base-200 p-6 rounded-xl border-2 border-primary">
            <h2 className="text-2xl font-bold text-center mb-4">Patent License Details</h2>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-64 h-64 bg-base-300 rounded-lg border-2 border-base-400 flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="text-6xl mb-2">📄</div>
                  <div className="text-sm text-base-content/70">Patent License NFT</div>
                  <div className="text-xs text-base-content/50 mt-2">
                    View contract details and terms
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
