import './App.css';
import {useEffect} from 'react';

const App =() => {
const CheckConnection = async() => {
  try {
    //solana object automatically injected via phantom
    const { solana } = window;
    //check if object is there
    if (solana) {
    if (solana.isPhantom) {
      console.log("The phantom is present");
    }
   } else {
      alert("download wallet here: https://phantom.app/download");
    }
  } catch(error) {
    console.error(error);
  }
  };
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
};

export default App;
