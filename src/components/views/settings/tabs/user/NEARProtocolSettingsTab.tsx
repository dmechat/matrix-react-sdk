import React, { useEffect, useState } from "react";
import * as nearAPI from "near-api-js";

export default function NEARProtocolSettingsTab() {

    const { keyStores } = nearAPI;
    const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();
    const { connect } = nearAPI;

    const connectionConfig = {
        networkId: "testnet",
        keyStore: myKeyStore, // first create a key store 
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
    };

    const [nearConnection, setNearConnection] = useState<nearAPI.Near>();
    const [ walletConnection, setWalletConnection ] = useState<nearAPI.WalletConnection>();
    const [walletAccountId, setWalletAccountId] = useState<string>();
    useEffect(() => {
        connect(connectionConfig)
            .then(setNearConnection);
    }, []);

    useEffect(() => {
        if (nearConnection){
            setWalletConnection(new nearAPI.WalletConnection(nearConnection, ""));
        }
    }, [nearConnection]);

    useEffect(() => { 
        if(walletConnection){
            setWalletAccountId(walletConnection.getAccountId());
        }
    }, [walletConnection]);

    function logout(){
        walletConnection.signOut();
        setWalletAccountId(walletConnection.getAccountId());
    }

    function connectAccount(){
        walletConnection.requestSignIn({
            contractId: "example-contract.testnet", // contract requesting access
            failureUrl: `${window.location.origin}?failure`, // optional redirect URL on success
            successUrl: `${window.location.origin}?success` // optional redirect URL on failure
        });
    }

    return (<>
        <h3>NEAR Protocol</h3>
        {walletAccountId && <>
            <p>Wallet: {walletAccountId}</p>
            <a target="_blank" href="https://wallet.testnet.near.org/send-money">Send funds</a>
            <p></p>
            <p></p>
            <p></p>
            <button onClick={logout} >Logout</button>
        </>}
        {!walletAccountId && <button onClick={connectAccount}>Connect Account</button>}
    </>)
}