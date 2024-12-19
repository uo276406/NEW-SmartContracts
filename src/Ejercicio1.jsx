import { Contract } from "@ethersproject/contracts";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import React, { useEffect, useRef, useState } from "react";
import myContractManifest from "./contracts/MyContract.json";

export function Ejercicio1() {
  const myContract = useRef(null);
  const [tikets, setTikets] = useState([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    initContracts();
  }, []);

  let initContracts = async () => {
    await configureBlockchain();
    await getWalletBalance();
    let tiketsFromBlockchain = await myContract.current?.getTikets();
    if (tiketsFromBlockchain != null) setTikets(tiketsFromBlockchain);
  };

  let configureBlockchain = async () => {
    try {
      let provider = await detectEthereumProvider();
      if (provider) {
        await provider.request({ method: "eth_requestAccounts" });
        provider = new ethers.providers.Web3Provider(provider);
        const signer = provider.getSigner();
        myContract.current = new Contract(
          "0x8e48003b03A883B8817B5ac85835474be8793CE1",
          myContractManifest.abi,
          signer
        );
      }
    } catch (error) {}
  };

  let getWalletBalance = async (provider) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      setBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Error getting wallet balance:", error);
    }
  };

  let clickBuyTiket = async (i) => {
    const balanceInEth = parseFloat(balance).toFixed(18);
    if (parseFloat(balanceInEth) < 0.02) {
      alert("No tienes suficiente balance para comprar un tiket.");
      return;
    }

    const tx = await myContract.current.buyTiket(i, {
      value: ethers.utils.parseEther("0.02"),
      gasLimit: 6721975,
      gasPrice: 20000000000,
    });
    await tx.wait();

    const tiketsUpdated = await myContract.current.getTikets();
    setTikets(tiketsUpdated);
  };

  let withdrawBalance = async () => {
    const tx = await myContract.current.transferBalanceToAdmin();
  };

  let changeAdmin = async (e) => {
    e.preventDefault();
    const newAddress = e.target.elements[0].value;

    const tx = await myContract.current.changeAdmin(newAddress, {
      value: ethers.utils.parseEther("0.0001"),
      gasLimit: 6721975,
      gasPrice: 20000000000,
    });
    await tx.wait();
  };

  return (
    <div>
      <h1>Tikets store</h1>
      <h2>Balance: {balance}</h2>
      <button onClick={() => withdrawBalance()}>Withdraw Balance</button>
      <ul>
        {tikets.map((address, i) => (
          <li>
            Tiket {i} comprado por {address}
            {address == ethers.constants.AddressZero && (
              <a href="#" onClick={() => clickBuyTiket(i)}>
                {" "}
                buy
              </a>
            )}
          </li>
        ))}
      </ul>
      <form onSubmit={(e) => changeAdmin(e)}>
        <input type="text" />
        <button type="submit"> Change Admin </button>
      </form>
    </div>
  );
}
