import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

const getArtifacts = () => {
  const artifacts = []

  artifacts.push(require("../../contracts/BLKToken.json"));
  artifacts.push(require("../../contracts/BLKTokenKYC.json"));
  artifacts.push(require("../../contracts/BLKTokenSale.json"));

  return artifacts;
}

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    async artifacts => {
      if (artifacts) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();
        const contractInstances = {};
        const initArtifacts = (artifacts) => {
          for (const artifact of artifacts) {
            
            const { abi, contractName } = artifact;
            let address, contract;

            try {
              address = artifact.networks[networkID] && artifact.networks[networkID].address;
              contract = new web3.eth.Contract(abi, address);
            } catch (err) {
              console.error(err);
            }
            
            contractInstances[contractName] = {
              contract,
              artifact
            };

            dispatch({
              type: actions.init,
              data: { contractInstances, web3, accounts, networkID }
            });
          }
          
        }

        initArtifacts(artifacts);
      }
    }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        init(getArtifacts());
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(getArtifacts());
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init]);

  return (
    <EthContext.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
