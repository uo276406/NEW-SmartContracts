import { Contract } from "@ethersproject/contracts";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import React, { useEffect, useRef, useState } from "react";
import bankManifest from "./contracts/Bank.json";

export function Ejercicio2() {
  const [balance, setBalance] = useState("0");
  const [interest, setInterest] = useState("0");
  const [doubleInterest, setDoubleInterest] = useState("0");
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
        "0x067BE68122865F4a7bb687dA8D6EDa44BCEa597b",
        bankManifest.abi,
        signer
      );
    }
    return null;
  };

  let onSubmitDeposit = async (e, double) => {
    e.preventDefault();

    const BNBamount = parseFloat(e.target.elements[0].value);

    // Wei to BNB se pasa con ethers.utils recibe un String!!!
    if (double) {
      const tx = await bank.current.depositDouble({
        value: ethers.utils.parseEther(String(BNBamount)),
        gasLimit: 6721975,
        gasPrice: 20000000000,
      });
      await tx.wait();
    } else {
      const tx = await bank.current.deposit({
        value: ethers.utils.parseEther(String(BNBamount)),
        gasLimit: 6721975,
        gasPrice: 20000000000,
      });
      await tx.wait();
    }

    await getBalance();
    await getInterest();
  };

  let clickWithdraw = async (e, double) => {
    if (double) {
      await bank.current.withdrawDouble({
        value: ethers.utils.parseEther(String(0.05)),
        gasLimit: 6721975,
        gasPrice: 20000000000,
      });
    } else {
      await bank.current.withdraw({
        value: ethers.utils.parseEther(String(0.05)),
        gasLimit: 6721975,
        gasPrice: 20000000000,
      });
    }
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
      const interest = await bank.current.getGeneratedInterest(false);
      setInterest(ethers.utils.formatEther(interest));
      const doubleInterest = await bank.current.getGeneratedInterest(true);
      setDoubleInterest(ethers.utils.formatEther(doubleInterest));
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

  const onSubmitBuy = async (e) => {
    e.preventDefault();
    const BMIWamount = parseFloat(e.target.elements[0].value);

    const tx = await bank.current.buyBMIW(BMIWamount, {
      value: ethers.utils.parseEther(String(BMIWamount * 0.001)),
      gasLimit: 6721975,
      gasPrice: 20000000000,
    });
    await tx.wait();
  };

  return (
    <div>
      <h1>Bank</h1>
      <h2>Deposit (Basic)</h2>
      <form onSubmit={(e) => onSubmitDeposit(e, false)}>
        <input type="number" step="0.01" />
        <button type="submit">Deposit</button>
      </form>
      <button onClick={(e) => clickWithdraw(e, false)}> Withdraw </button>
      <h2>Deposit (Double): It will be blocked during 10 minutes</h2>
      <form onSubmit={(e) => onSubmitDeposit(e, true)}>
        <input type="number" step="0.01" />
        <button type="submit">Deposit</button>
      </form>
      <button onClick={(e) => clickWithdraw(e, true)}>
        {" "}
        Withdraw (Double){" "}
      </button>
      <br />
      <h2>Balance: {balance} BNB</h2>
      <h2>Interest: {interest} BMIW</h2>
      <h2>Interest (Double): {doubleInterest} BMIW</h2>
      <button onClick={() => update()}>Update balance and interes</button>
      <h2>Compra de tokens BMIW</h2>
      <form onSubmit={(e) => onSubmitBuy(e)}>
        <label for="bmiwBuy">
          Indique cuantos tokens BMIW (1 BMIW = 0.001 BNB):
        </label>
        <input id="bmiwBuy" type="number" step="0.01" />
        <button type="submit">Buy</button>
      </form>
    </div>
  );
}
