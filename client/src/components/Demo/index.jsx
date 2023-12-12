import useEth from "../../contexts/EthContext/useEth";

import BLKTokenSale from "./BLKTokenSale";
import BLKTokenKYC from "./BLKTokenKYC";
import Title from "./Title";
import { useState } from "react";
import AddressList from "./AddressList";

function Demo() {
  const { state } = useEth();
  const [addressesValue, setAddressesValue] = useState([]);

  const kyc =
    <>
      <div className="contract-container">
        <BLKTokenKYC setAddressesValue={setAddressesValue}/>
      </div>
    </>;
  
  const sale =
    <>
      <div className="contract-container">
        <BLKTokenSale/>
      </div>
    </>;
  
  const blkSaleIsLoaded = () => {
    return state.contractInstances?.BLKTokenSale?.artifact;
  }

  const blkSaleKYCLoaded = () => {
    return state.contractInstances?.BLKTokenKYC?.artifact;
  }

  const getAddresses = () => {
    return addressesValue.length > 0 ? addressesValue : []
  }

  return (
    <div className="demo">
      <Title />
      {
        !blkSaleKYCLoaded() ? "Rendering KYC..." : kyc
      }
      
      {
        !blkSaleIsLoaded() ? "Rendering Sale..." : sale
      }
      {
        getAddresses().length > 0 ? <AddressList addresses={getAddresses()} /> : <div style={{ textAlign: "center", marginTop: "16px"}}> List of allowed addresses </div>
      }
    </div>
  );
}

export default Demo;
