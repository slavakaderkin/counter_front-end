import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useMainContract } from "./hooks/useMainContract";
import { useTonConnect } from "./hooks/useTonConnect";

function App() {
  const contract = useMainContract();

  const {
    contract_address,
    counter_value,
    balance,
  } = contract;

  const { sendIncrement, sendDeposit, sendWithdrawalRequest } = useMainContract();
  const { connected } = useTonConnect();

  return (
    <div>
      <div>
        <TonConnectButton />
      </div>
      <div>
        <div className='Card'>
          <b>Our contract Address</b>
          <div className='Hint'>{contract_address?.slice(0, 30) + "..."}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{counter_value ?? "Loading..."}</div>
        </div>
        <div className='Card'>
          <b>Balance</b>
          <div>{balance}</div>
        </div>

        {connected && (
          <a
            onClick={() => {
              sendIncrement();
            }}
          >
            Increment
          </a>
        )}

        {connected && (
          <a
            onClick={() => {
              sendDeposit();
            }}
          >
            Deposit 2 TON
          </a>
        )}

        {connected && (
          <a
            onClick={() => {
              sendWithdrawalRequest();
            }}
          >
            Withdraw 0.02 TON
          </a>
        )}
      </div>
    </div>
  );
}

export default App;