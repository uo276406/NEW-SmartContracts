import { Contract } from "@ethersproject/contracts";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import React, { useEffect, useRef, useState } from "react";
import bankManifest from "./contracts/Bank.json";

export function Ejercicio2() {
  const [balance, setBalance] = useState("0");
  const [interest, setInterest] = useState("0");
  const bank = useRef(null);

  useEffect(() => {
    initContracts();
  }, []);

  let initContracts = async () => {
    await getBlockchain();
    await getBalance();
    await getInterest();
  };

  let getBlockchain = async () => {
    let provider = await detectEthereumProvider();
    if (provider) {
      await provider.request({ method: "eth_requestAccounts" });
      const networkId = await provider.request({ method: "net_version" });

      provider = new ethers.providers.Web3Provider(provider);
      const signer = provider.getSigner();

      bank.current = new Contract(
        "0xae4D79cD17294d8e180bE5325a58c64E40a2EF7E",
        bankManifest.abi,
        signer
      );
    }
    return null;
  };

  let onSubmitDeposit = async (e) => {
    e.preventDefault();

    const BNBamount = parseFloat(e.target.elements[0].value);

    // Wei to BNB se pasa con ethers.utils recibe un String!!!
    const tx = await bank.current.deposit({
      value: ethers.utils.parseEther(String(BNBamount)),
      gasLimit: 6721975,
      gasPrice: 20000000000,
    });

    await tx.wait();
    await getBalance();
    await getInterest();
  };

  let clickWithdraw = async (e) => {
    await await bank.current.withdraw({
      value: ethers.utils.parseEther(String(0.05)),
      gasLimit: 6721975,
      gasPrice: 20000000000,
    });
  };

  const getBalance = async () => {
    try {
      const balance = await bank.current.getBalance();
      setBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Error getting balance:", error);
    }
  };

  const getInterest = async () => {
    try {
      const interest = await bank.current.getGeneratedInterest();
      setInterest(ethers.utils.formatEther(interest));
    } catch (error) {
      console.error("Error getting interest:", error);
    }
  };

  const update = async () => {
    try {
      await getBalance();
      await getInterest();
    } catch (error) {
      console.error("Error updating balance and interest:", error);
    }
  };

  return (
    <div>
      <h1>Bank</h1>
      <h2>Deposit</h2>
      <form onSubmit={(e) => onSubmitDeposit(e)}>
        <input type="number" step="0.01" />
        <button type="submit">Deposit</button>
      </form>
      <button onClick={() => clickWithdraw()}> Withdraw </button>
      <h2>Balance: {balance} BNB</h2>
      <h2>Interest: {interest} BMIW</h2>
      <button onClick={() => update()}>Update balance and interes</button>
    </div>
  );
}
