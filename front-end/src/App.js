import './App.css';
import React, { useEffect, useState } from 'react';
import idl from './idl.json';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider, web3, utils, BN } from '@project-serum/anchor';
import { Buffer } from 'buffer';
window.Buffer = Buffer;
//variables to make connections to the contract

//give app program id
const programID = new PublicKey(idl.metadata.address);
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
const [campaigns, setCampaigns ] = useState([]);
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
//function to see campaigns
const getCampaigns = async () => {
  const connection = new Connection(network, opts.preflightCommitment);
  const provider = getProvider();
  const program = new Program(idl, programID, provider);
  //wrapped in promise b/c each program derived act wrapped in a promise.
  //.map to map into a format that can be used 
  Promise.all(
    (await connection.getProgramAccounts(programID)).map(async (campaign) => ({
    //for each campaign object is mapped
    ...(await program.account.campaign.fetch(campaign.publicKey)),
    pubkey: campaign.publicKey,
    })
    )
  ).then(campaigns => setCampaigns(campaigns));
};
//function to create campaign
const createCampaign = async () => {
  try {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    const [campaign] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("CAMPAIGN_DEMO"),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );
    await program.rpc.create('campaign name', 'campaign description', {
      accounts:{
        campaign,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
    });
    console.log("Created a new campaign /w address", campaign.toString());
  } catch(err){
    console.error('Error creating campaign account: ', err);
  }
}

//here is the function to donate to a campaign
const donate = async (publicKey) =>  {
  try{
    const provider = getProvider(idl, programID, provider);
    const program = new Program();
    //this will call the donate function in the contract. 
    //the first argument you pass in, is the amount you want to donate.
    //new BN is wrapping this in an anchor big number
    //hard coded 0.2 sol value exists need a drop down in application
    //converted to lamports with web3...
    //the context passed in(publicKey aka campaign passed into this function
    // the users wallet)
    await program.rpc.donate(new BN(0.2 * web3.LAMPORTS_PER_SOL), {
      accounts: {
        campaign: publicKey,
        user: provider.wallet.publicKey,
        SystemProgram: SystemProgram.programId,
      },
    });
    console.log("Donated some SOL to:", publicKey.toString());
    getCampaigns();
  }catch(error){
    console.log("error found during:", error);
  }
};
//withdraw function
const withdraw = async (publicKey) =>  {
  try{
    const provider = getProvider(idl, programID, provider);
    const program = new Program();
    //this will call the donate function in the contract. 
    //the first argument you pass in, is the amount you want to withdraw.
    //new BN is wrapping this in an anchor big number
    //hard coded 0.2 sol value exists need a drop down in application
    //converted to lamports with web3...
    //the context passed in(publicKey aka campaign passed into this function
    // the users wallet)
    await program.rpc.withdraw(new BN(0.2 * web3.LAMPORTS_PER_SOL), {
      accounts: {
        campaign: publicKey,
        user: provider.wallet.publicKey,
        //no system program because the accts are managed
        //solana program takes care of the authorization
      },
    });
    console.log("Donated some SOL to:", publicKey.toString());
    getCampaigns();
  }catch(error){
    console.log("error withdraw during", error);
  }
};

  //component to connect wallet if wallet is not present
  const ConnectedWallet = () => (
    //render button
    <button onClick={connectWallet}>Connect to this dApp</button>
  );
  //component to create camapgin if wallet is not present
  const createButton = () => (
      //render button
     <>
     <button onClick={createCampaign}>Create Campaign</button>
     <button onClick={getCampaigns}>Get Campaigns</button>
     <br/>
     {campaigns.map(campaign => (<>
     <p>Campaign ID: {campaign.publicKey.toString()}</p>
     <p>Campaign Balance: {(campaign.amount_raised / web3.LAMPORTS_PER_SOL).toString()}</p>
     <p>Campaign Balance: {campaign.publicKey.toString()}</p>
     <p>{campaign.name}</p>
     <p>{campaign.description}</p>
     <button onClick={() => donate(campaign.pubkey)}>
       Click to donate
     </button>
     <button onClick={() => withdraw(campaign.pubkey)}>
       Click to withdraw
     </button>
     <br/>
     </>))}
     </>
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
