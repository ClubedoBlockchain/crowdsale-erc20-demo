import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import toast from "react-hot-toast";

function BLKTokenSale() {
    const notifySuccess = (message) => toast(message, {
        style: {
            border: '2px solid white',
            color: "white",
            background: "green"
        },
    });

    const notifyError = (message) => toast(message, {
        style: {
            border: '2px solid white',
            color: "white",
            background: "red"
        },
    });
    const { state: { contractInstances, accounts, web3 } } = useEth();
    const [balanceValue, setBalanceValue] = useState("0");
    const [toAddressValue, setToAddressValue] = useState("");
    const [toAmountValue, setToAmountValue] = useState("");

    const BLKToken = contractInstances.BLKToken;
    const BLKTokenSale = contractInstances.BLKTokenSale;

    const [tokenSaleAddress,] = useState(BLKTokenSale.contract._address);

    const [quantityValue, setQuantityValue] = useState(0.1);

    const handleInputCostChange = e => {
        setQuantityValue(e.target.value);
    };

    const handleInputToAmountChange = e => {
        setToAmountValue(e.target.value);
    };

    const handleInputToAddressChange = e => {
        setToAddressValue(e.target.value);
    };

    const clearForm = () => {
        setQuantityValue("")
        setToAddressValue("")
        setToAmountValue("")
    }

    const listenToTokenTransferEvents = () => {
        try {
            BLKToken.contract.events.Transfer({ to: accounts[0] }).once("data", async (event) => {
                getBalance();
            })
        } catch (e) {
            notifyError("Contract is not connected to the right network. Try change to Goerli")
        }
        
    }

    const getBalance = async () => {
        try {
            const balance = await BLKToken.contract.methods.balanceOf(accounts[0]).call();
            setBalanceValue(balance);
        } catch (e) {
            notifyError("Contract is not connected to the right network. Try change to Goerli")
        }
    }


    const transfer = async e => {
        if (e.target.tagName === "INPUT") {
            return;
        }

        if (toAddressValue === "") {
            notifyError("Please enter a string to address.")
            return;
        }
        if (toAmountValue === "") {
            notifyError("Please enter a valid amount.")
            return;
        }
        try {
            notifySuccess("Sending transaction..")
            await BLKToken.contract.methods.transfer(toAddressValue, toAmountValue).send({ from: accounts[0] });
            notifySuccess("Transaction Sent.")
        } catch (error) {
            notifyError(error.message)
        } finally {
            clearForm();
        }

    };

    listenToTokenTransferEvents();
    getBalance();

    const BuyTokens = async e => {
        if (e.target.tagName === "INPUT") {
            return;
        }
        if (quantityValue === "") {
            notifyError("Please enter a value (ether)");
            return;
        }

        const newValue = parseFloat(quantityValue);

        await BLKTokenSale.contract.methods.buyTokens(accounts[0]).send({ from: accounts[0], value: web3.utils.toWei(newValue.toString(), "ether") });

        clearForm();
    };

    return (
        <div
            style={{ marginTop: "16px", width: "90%", border: "1px solid black", borderRadius: "2px", padding: "10px", marginRight: "auto", marginLeft: "auto" }}>
            <div style={{ textAlign: "center" }} >
                <h3 style={{ display: "block", textAlign: "center", margin: "10px" }}> BLKT </h3>
                <div
                    style={{ display: "block", textAlign: "center", margin: "10px" }}>
                    To buy tokens send ETH to
                    <br />
                    <div style={{ overflowWrap: "anywhere"}}> {tokenSaleAddress}</div>
                    <br />
                    <strong>1000 BLKT / 1 ETH</strong>
                    <br />
                </div>


                <div className="btbkyc" style={{ display: "inline" }}>
                    <input
                        style={{ padding: "5px", width: "60%", marginInline: "5px" }}
                        type="number"
                        placeholder="ether"
                        step="0.01"
                        value={quantityValue}
                        onChange={handleInputCostChange}
                    />
                    <button
                        onClick={BuyTokens} style={{ display: "inline-block", padding: "6px", width: "33%", backgroundColor: "green", color: "white", marginInline: "5px", cursor: "pointer", border: "1px solid black", borderRadius: "3px" }}>
                        Buy
                    </button>
                </div>


                <div className="balance" style={{ padding: "5px", marginTop: "10px" }}>
                    <strong>  Balance: {balanceValue} BLKT </strong>
                </div>

                <hr />
                <h3 style={{ marginTop: "16px", marginBottom: "16px" }}> Send Tokens</h3>
                <div className="btbkyc" style={{ display: "inline" }}>
                    <input
                        style={{ padding: "5px", width: "35%", marginInline: "5px" }}
                        type="string"
                        placeholder="address 0x00"
                        value={toAddressValue}
                        onChange={handleInputToAddressChange}
                    />
                    <input
                        style={{ padding: "5px", width: "20%", marginInline: "5px" }}
                        type="number"
                        placeholder="BLKT"
                        step="1"
                        value={toAmountValue}
                        onChange={handleInputToAmountChange}
                    />

                    <button
                        onClick={transfer} style={{ display: "inline-block", padding: "6px", width: "33%", backgroundColor: "green", color: "white", marginInline: "5px", cursor: "pointer", border: "1px solid black", borderRadius: "3px" }}>
                        Send
                    </button>
                </div>
            </div>

        </div>
    );
}

export default BLKTokenSale;
