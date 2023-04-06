import React from 'react'
import { useState, useEffect } from 'react'
import { ethers }  from "ethers"
import veQIErc20ABI from './veQIErc20ABI.json'
import gaugeControllerErc20ABI from './gaugeControllerErc20ABI.json'
import BigNumber from 'bignumber.js'

 const App = () => {

  const veQiProxyContract = "0x7Ee65Fdc1C534A6b4f9ea2Cc3ca9aC8d6c602aBd"
  const addressOfMainContract = "0xeb4eE988D975A91f02884076717D5EeACb41976f"

  const gaugeControllerProxyContract ="0x14593cb3Ffe270a72862Eb08CeB57Bc3D4DdC16C"


 
  const [wallet, setWallet] = useState('')
  const [veQiContractData, setVeQiContractData] = useState(null)
  

 

  useEffect(() => {
    
    const fetchData = async () => {
      requestAccount()
      const provider = new ethers.providers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc")
      const veQicontract = new ethers.Contract(veQiProxyContract, veQIErc20ABI, provider) 
      const gaugeControllerContract = new ethers.Contract(gaugeControllerProxyContract, gaugeControllerErc20ABI, provider)
    
    
      // Name of the token
      const tokenName = await veQicontract.name()

      // Balance of my veQI
      let myBalance = await veQicontract.balanceOf("0x5c65afe884c92a046d80284b642b44a67c49c664")

      //TODO: Users votes, 5.getUserVotesLength
      console.log("gaugecontroller contract", gaugeControllerContract)
      
      const myVotes = await gaugeControllerContract.getUserVotesLength()

      console.log(myVotes)

      //TODO: Total vote count for each validator

      //TODO: relative weight for each validaer

      
    //  const provider = new ethers.providers.Web3Provider(window.ethereum)
    //  const signer = provider.getSigner()
    //  const contract = new ethers.Contract(addressOfMainContract, erc20ABI, signer)
    console.log("veQIContract ", veQicontract)
    console.log("Your veQI balance ", myBalance.toString())

    console.log("Token name", tokenName)

    }

    fetchData()
  },[wallet])

 
  
  const requestAccount = async () => {
    if(window.ethereum) {
      
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts"})
       
        setWallet(accounts[0])

      } catch (error) {
        console.log('Failed to connect')
      }
    }
    else {
      alert('Please install Meta Mask extension')
    }
  }
  

  // const connectWallet = async () => {
  //   if(typeof window.ethereum !== 'undefined') {
  //     await requestAccount()

  //     const provider = new ethers.providers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc")

  //     const contract = new ethers.Contract(contractAddress, contractABI, provider)

  //     const signer = provider.getSigner()

  //     const balance = await contract.balanceOf(wallet);

  //     console.log(`AVAX balance: ${ethers.utils.formatEther(balance)} AVAX`);
    
  //   }
  // }
  

  
  


  return (
    <div className="App">
      <div>
        <h1> This is Avalanche</h1>
        <button onClick={requestAccount}>Connect to wallet</button>
        <h3>Connected to wallet: {wallet} </h3>

  
          {/* <div>
            {wallet ? (
              <p>Connected to wallet with address: {wallet.address}</p>
            )
              :( <button onClick={connectWallet}>Connect to your wallet</button>
            )}
          </div> */}
      </div>
    </div>
  );
}

export default App; 
