import { useState, useEffect } from "react";
import css from "../src/components/Form/Form.module.css";
import { ethers } from "ethers";
import Form from "./components/Form/Form";
import Logo from "../public/Wallet.svg";

export default function App() {
  const [userAccount, setUserAccount] = useState("");
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    isWalletConnected();
  });

  useEffect(() => {
    async function accountChanged() {
      window.ethereum.on("accountsChanged", async function () {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length) {
          setUserAccount(
            accounts[0].substring(0, 5) +
              "..." +
              accounts[0].substring(accounts[0].length - 4)
          );
        } else {
          window.location.reload();
        }
      });
    }
    accountChanged();
  }, []);

  async function onConnect() {
    if (!window.ethereum) return console.log("Install MetaMask");

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setUserAccount(
      accounts[0].substring(0, 5) +
        "..." +
        accounts[0].substring(accounts[0].length - 4)
    );
    window.location.reload();
  }

  async function isWalletConnected() {
    if (!window.ethereum) return;
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    if (accounts.length) {
      setUserAccount(
        accounts[0].substring(0, 5) +
          "..." +
          accounts[0].substring(accounts[0].length - 4)
      );
    } else {
      console.error("Error connection to user account");
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(accounts[0]);
    const result = await ethers.BigNumber.from(balance);

    setBalance(ethers.utils.formatEther(result).substring(0, 5));
  }

  return (
    <div>
      <header className={css.container}>
        <img src={Logo} alt="Logo app" width={120} height={120} />
        {userAccount ? (
          <div className={css.btn__connect}>
            <span>{balance}</span>
            <span>{userAccount}</span>
          </div>
        ) : (
          <button className={css.btn__connect} onClick={onConnect}>
            Connect wallet
          </button>
        )}
      </header>

      <Form userAccount={userAccount} />
    </div>
  );
}
