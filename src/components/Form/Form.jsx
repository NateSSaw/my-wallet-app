import { useState } from "react";
import { ethers } from "ethers";
import PropTypes from "prop-types";
import css from "./Form.module.css";
import Spinner from "../Spinner/Spinner";
import Notiflix from "notiflix";

export default function Form({ userAccount }) {
  const [isPreloader, setIsPreloader] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState(0);
  function validateAddress(inputValue) {
    const regex = /^0x[a-fA-F0-9]{40}$/;
    return regex.test(inputValue);
  }
  function validateTransferAmount(inputValue) {
    const regex = /^(?:0\.\d+|10(?:00000)?(?:\.0+)?|100000(?:\.0+)?)$/;
    return regex.test(inputValue);
  }
  function handleRecipientAddressChange(event) {
    const inputValue = event.target.value.trim();
    setRecipientAddress(inputValue);
  }

  function handleTransferAmountChange(event) {
    const inputValue = event.target.value.trim();
    setTransferAmount(inputValue);
  }

  async function handleTransfer(event) {
    event.preventDefault();
    setIsPreloader(true);
    const validateAdress = validateAddress(recipientAddress);
    const validateAmount = validateTransferAmount(transferAmount);
    if (validateAdress && validateAmount && userAccount) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const transaction = {
        to: recipientAddress,
        value: ethers.utils.parseEther(transferAmount),
      };

      try {
        const response = await signer.sendTransaction(transaction);
        console.log("Transaction sent:", response);
        setIsPreloader(false);
      } catch (error) {
        console.error("Error sending transaction:", error);
        setIsPreloader(false);
      }
    } else {
      return Notiflix.Notify.failure(
        "Please check  the correctness of the entered data and try again"
      );
    }
  }

  return (
    <form onSubmit={handleTransfer}>
      <input
        type="text"
        autoComplete="off"
        placeholder="Recipient Address"
        pattern="^0x[a-fA-F0-9]{40}$"
        className={css.input}
        value={recipientAddress}
        required
        onChange={handleRecipientAddressChange}
      />
      <input
        type="text"
        autoComplete="off"
        placeholder="Amount"
        pattern="^(?:0\.\d+|10(?:00000)?(?:\.0+)?|100000(?:\.0+)?)$"
        className={css.input}
        value={transferAmount}
        required
        onChange={handleTransferAmountChange}
      />
      <button type="submit" className={css.btn} disabled={isPreloader}>
        {isPreloader ? <Spinner /> : "Transfer"}
      </button>
    </form>
  );
}

Form.propTypes = {
  userAccount: PropTypes.string.isRequired,
};
