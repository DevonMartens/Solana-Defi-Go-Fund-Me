import './App.css';
import React, { useEffect, useState } from 'react';
import idl from './idl.json';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider, web3, utils, BN } from '@project-serum/anchor';
import { Buffer } from 'buffer';
window.Buffer = Buffer;
//variables to make connections to the contract

//give app program id
const programId = new PublicKey(idl.metadata.address);
//specify network
const network = clusterApiUrl("devnet");
//how to identify a complete txn
const opts = {
  preflightCommitment: "processed",
  //this is how you choose "when" to recieve a confirmation that a transaction has succeeded
}
//
const { SystemProgram } = web3;

//app code
const App = () => {
const [walletAdd, setWalletAddress ] = useState(null);
//function to get provider - connect to solana
const getProvider = () => {
  const connection = new Connection(network, opts.preflightCommitment);
  const provider = new AnchorProvider(connection, window.solana, opts.preflightCommitment);
  return provider;
}
const CheckConnection = async() => {
  //stateful variable to hold wallet as a constant
  try {
    //solana object automatically injected via phantom
    const { solana } = window;
    //check if object is there
    if (solana) {
    if (solana.isPhantom) {
      console.log("The phantom is present");
      //need to check if we have creditials to access user who is on the websites creditials 
      //check if user = logged in this line tells phantom wallet we can access
      //only if trusted aviods second pop up
      const response = await solana.connect({onlyIfTrusted: true});
      console.log(
        "logged in with wallet public key",
        response.publicKey.toString()
      );
      setWalletAddress(response.publicKey.toString());
    }
   } else {
      alert("download wallet here: https://phantom.app/download");
    }
  } catch(error) {
    console.error(error);
  }
  };
  //function to connect wallet with button
  const connectWallet = async() => {
    const { solana } = window;
    //check if object is there
    if (solana) {
      const response = solana.connect()
      console.log(
        "connected with public key",
        response.publicKey.toString()
      )
      //set address to public key
      setWalletAddress(response.publicKey)
    }
  };
//function to create campaign
const createCampaign = async () => {
  try{
    //get provider + program
    const provider = getProvider()
    const program = new Program(idl, programId, provider)
    //get address created with capaign acct
    const [campaign] = await PublicKey.findProgramAddress([
      utils.bytes.utf8.encode("Campaign_demo"),
      provider.wallet.publicKey.toBuffer(),
    ],
      programId
    );
    //address calc now time to create account
    //need to make txt box for name and descr
    await program.rpc.create("campaign name", "campaign descr", {
      accounts: {
        campaign,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
    },
  });
  console.log("new camapign = success at address:", campaign.toString)
  } catch(error){
    console.log("Error: Campaign create failed:", error);
  }
}





  //component to connect wallet if wallet is not present
  const ConnectedWallet = () => (
    //render button
    <button onClick={connectWallet}>Connect to this dApp</button>
  );
  //component to create camapgin if wallet is not present
  const createButton = () => (
      //render button
      <button onClick={createCampaign}>Create Campaign</button>
    );
  //call to check the if wallet is connected function
  //use effect hook gets called on componenet mounts
  //second argument i.e. this array is empty.
  // that code will be called when the page floats.
  useEffect(() => {
    //check if we have connection
    const onLoad = async() => {
     await CheckConnection();
    };
    //the add onload as an event listener to the window
    window.addEventListener("load", onLoad);
    //return a remove event listener when window closed
    return() => window.removeEventListener("load", onLoad);
    //arg 2 an array - "this array"
  }, []);

  //render container if not walletAddress not connected
  return (
  <div className='App'>
    {!walletAdd && ConnectedWallet()}
    {walletAdd && createButton()}
    </div>
  );
};

export default App;
