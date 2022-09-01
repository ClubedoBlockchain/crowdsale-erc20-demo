import { useState } from "react";
import toast from "react-hot-toast";
import useEth from "../../contexts/EthContext/useEth";


function BLKTokenKYC({ setAddressesValue }) {
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

    const { state: { contractInstances, accounts } } = useEth();
    const BLKTokenKYC = contractInstances.BLKTokenKYC;
    const [addressValue, setAddressValue] = useState("");

    const handleInputAddressChange = e => {
        setAddressValue(e.target.value);
    };

    const clearForm = () => {
        setAddressValue("")
    }

    const allow = async e => {
        if (e.target.tagName === "INPUT") {
            return;
        }

        if (addressValue === "") {
            alert("Please enter a string to address.");
            return;
        }
        try {
            await BLKTokenKYC.contract.methods.completed(addressValue).send({ from: accounts[0] });
            getListOfTokens();
        } catch (error) {
            notifyError(error.message)
        } finally {
            clearForm();
        }

    };

    const revoke = async e => {
        if (e.target.tagName === "INPUT") {
            return;
        }

        if (addressValue === "") {
            alert("Please enter a string to address.");
            return;
        }

        try {
            await BLKTokenKYC.contract.methods.revoked(addressValue).send({ from: accounts[0] });
            getListOfTokens();
        } catch (error) {
            notifyError(error.message)
        } finally {
            clearForm();
        }
    };

    async function getListOfTokens() {
        const addresses = await BLKTokenKYC.contract.methods.getListOfAddress().call();
        notifySuccess("List of address updated");
        setAddressesValue(addresses);
    }

    return (
        <div
            style={{ width: "90%", border: "1px solid black", borderRadius: "2px", padding: "10px", marginRight: "auto", marginLeft: "auto", marginBottom: "16px" }}>
            <div
                style={{ width: "96%", borderRadius: "2px", padding: "10px", marginRight: "auto", marginLeft: "auto", marginBottom: "16px" }}>
                <button
                    onClick={getListOfTokens}
                    style={{ float: "right", padding: "6px", minWidth: "92px", backgroundColor: "blue", color: "white", cursor: "pointer", border: "1px solid black", borderRadius: "3px" }}>
                    Refresh List
                </button>
            </div>
            <div style={{ textAlign: "center" }} >
                <h3 style={{ textAlign: "center", margin: "10px", marginTop: "36px", marginBottom: "16px" }}>
                    BLKToken KYC MANAGEMENT
                </h3>

                <input
                    style={{ padding: "5px", width: "60%", marginInline: "5px" }}
                    type="text"
                    placeholder="address 0x00"
                    value={addressValue}
                    onChange={handleInputAddressChange}
                />

                <div className="btbkyc" style={{ display: "inline" }}>
                    <button
                        onClick={allow} style={{ display: "inline-block", padding: "6px", width: "15%", backgroundColor: "green", color: "white", marginInline: "5px", cursor: "pointer", border: "1px solid black", borderRadius: "3px" }}>
                        Allow
                    </button>
                    <button
                        onClick={revoke} style={{ display: "inline-block", padding: "6px", width: "15%", backgroundColor: "red", color: "white", marginInline: "5px", cursor: "pointer", border: "1px solid black", borderRadius: "3px" }}>
                        Revoke
                    </button>
                </div>

            </div>
        </div>
    );
}

export default BLKTokenKYC;
