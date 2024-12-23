import detectEthereumProvider from "@metamask/detect-provider";
import { Contract, ethers } from "ethers";
import React, { useEffect, useRef, useState } from "react";
import realStateContractManifest from "./contracts/RealStateContract.json";
import realStateContractCitiesManifest from "./contracts/RealStateContractCities.json";

export function Ejercicio3() {
  const realStateCities = useRef(null);
  const realState = useRef(null);
  const [realStateArray, setRealStateArray] = useState([]);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    initContracts();
  }, []);

  let initContracts = async () => {
    await getBlockchain();
  };

  let getBlockchain = async () => {
    let provider = await detectEthereumProvider();
    if (provider) {
      await provider.request({ method: "eth_requestAccounts" });
      const networkId = await provider.request({ method: "net_version" });

      provider = new ethers.providers.Web3Provider(provider);
      const signer = provider.getSigner();

      realState.current = new Contract(
        "0xb27f7DccD8D69a4fA0A29adb6DD4DFc867026Ad7",
        realStateContractManifest.abi,
        signer
      );

      realStateCities.current = new Contract(
        "0x30C638aeDB170a057095dCed4f84671D4a332647",
        realStateContractCitiesManifest.abi,
        signer
      );
    }
    return null;
  };

  let onSubmitAddRealState = async (e) => {
    e.preventDefault();

    const tx = await realStateCities.current.addRealState({
      city: e.target.elements[0].value,
      street: e.target.elements[1].value,
      number: parseInt(e.target.elements[2].value),
      meters: parseInt(e.target.elements[3].value),
      registration: parseInt(e.target.elements[4].value),
      owner: e.target.elements[5].value,
    });

    await tx.wait();
  };

  let onSubmitSearchRealState = async (e) => {
    e.preventDefault();

    let city = e.target.elements[0].value;

    let newProperties = await realStateCities.current.getRealStateByCity(city);
    setRealStateArray(newProperties);
  };

  let clickOnDeleteRealState = async (registration, city) => {
    const tx = await realStateCities.current.deleteRealStateByRegistration(
      registration,
      city
    );
    await tx.wait();
    setRealStateArray([]);
  };

  let anSubmitAddAdmin = async (e) => {
    e.preventDefault();

    const tx = await realStateCities.current.addAdmin(
      e.target.elements[0].value
    );
    await tx.wait();
  };

  let getAdmins = async () => {
    let admins = await realStateCities.current.getAdmins();
    setAdmins(admins);
  };

  return (
    <div>
      <h1>RealState</h1>
      <h2>Add RealState</h2>
      <form onSubmit={(e) => onSubmitAddRealState(e)}>
        <input type="text" placeholder="city" />
        <input type="text" placeholder="street" />
        <input type="number" placeholder="number" />
        <input type="number" placeholder="meters" />
        <input type="number" placeholder="registration" />
        <input type="text" placeholder="owner name" />
        <button type="submit">Add</button>
      </form>
      <h2>Search RealState</h2>
      <form onSubmit={(e) => onSubmitSearchRealState(e)}>
        <input type="text" placeholder="city" />
        <button type="submit">Search</button>
      </form>
      {realStateArray.map((r) => (
        <p>
          <button
            onClick={() => {
              clickOnDeleteRealState(r.registration, r.city);
            }}
          >
            Delete
          </button>
          {r.city} -{r.street} -{ethers.BigNumber.from(r.number).toNumber()} -
          {ethers.BigNumber.from(r.meters).toNumber()} -
          {ethers.BigNumber.from(r.registration).toNumber()} -{r.owner}
        </p>
      ))}
      <h2>Admins</h2>
      <form onSubmit={(e) => anSubmitAddAdmin(e)}>
        <input type="text" placeholder="admin address" />
        <button type="submit">Add</button>
      </form>
      <button onClick={() => getAdmins()}>Get Admins</button>
      {admins.map((a) => (
        <p>{a}</p>
      ))}
    </div>
  );
}
