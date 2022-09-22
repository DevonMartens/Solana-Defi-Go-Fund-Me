import './App.css';
import React, { useEffect, useState } from 'react';


const App = () => {
const [walletAdd, setWalletAddress ] = useState(null);
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
  //component to connect wallet if wallet is not present
  const ConnectedWallet = () => (
    //render button
    <button onClick={connectWallet}>Connect to this dApp</button>
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
    </div>
  );
};

export default App;
