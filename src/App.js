import React from 'react'
import { useState, useEffect } from 'react'
import { ethers }  from "ethers"
import erc20ABI from './erc20ABI.json'
import mainErc20ABI from './mainErc20ABI.json'

 const App = () => {

  const proxyContractAddress = "0x7Ee65Fdc1C534A6b4f9ea2Cc3ca9aC8d6c602aBd"
  const addressOfMainContract = "0xeb4eE988D975A91f02884076717D5EeACb41976f"

 
  const [wallet, setWallet] = useState('')
  const [veQiContractData, setVeQiContractData] = useState(null)
  

 

  useEffect(() => {
    const fetchData = async () => {
      requestAccount()
      const provider = new ethers.providers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc")
      const contract = new ethers.Contract(proxyContractAddress, mainErc20ABI, provider) 
    
      const tokenName = await contract.name()
      const myBalance = await contract.balanceOf(wallet.toString())
   
    //  const provider = new ethers.providers.Web3Provider(window.ethereum)
    //  const signer = provider.getSigner()
    //  const contract = new ethers.Contract(addressOfMainContract, erc20ABI, signer)
    console.log("Contract ", contract)
    console.log("My balance: ", myBalance)

    console.log("Token name", tokenName)

    //  const implementationAddress = await proxyContract.implementation()

  

    //  console.log(implementationAddress)

    }
    fetchData()
  },[wallet])

  console.log(veQiContractData)
  
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
