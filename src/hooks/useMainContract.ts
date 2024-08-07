import { useEffect, useState } from "react";
import { MainContract } from "../contracts/MainContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract } from "ton-core";
import { toNano } from "ton-core";
import { useTonConnect } from "./useTonConnect";

export function useMainContract() {
  const client = useTonClient();
  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
  }>();
  const [balance, setBalance] = useState<null | number>(null);

  const { sender } = useTonConnect();
    
  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new MainContract(
      Address.parse("kQCbyr7iG2s9aO6TFDrcMJi5YH0TBofRNS4i8RssV0D_euoj") // replace with your root contract address 
    );
    return client.open(contract) as OpenedContract<MainContract>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!mainContract) return;
      setContractData(null);
      const val = await mainContract.getData();
      const { number: balance } = await mainContract.getBalance();
      setContractData({
        counter_value: val.number,
        recent_sender: val.recent_sender,
        owner_address: val.owner_address,
      });
      setBalance(balance);
      await sleep(5000); // sleep 5 seconds and poll value again
      getValue();
    }
    getValue();
  }, [mainContract]);

  return {
    contract_address: mainContract?.address.toString(),
    ...contractData,
    balance,
    sendIncrement: () => {
      return mainContract?.sendIncrement(sender, toNano(0.05), 3);
    },
    sendDeposit: () => {
      return mainContract?.sendDeposit(sender, toNano(2));
    },
    sendWithdrawalRequest: () => {
      return mainContract?.sendWithdrawalRequest(sender, toNano(0.05), toNano(0.2));
    },
  };
}
