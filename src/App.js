import React from 'react'
import { useState, useEffect } from 'react'
import { ethers }  from "ethers"
import './App.css'
import veQIErc20ABI from './veQIErc20ABI.json'
import gaugeControllerErc20ABI from './gaugeControllerErc20ABI.json'
import CryptoCard from './components/CryptoCard'
import UserVeQIData from './components/UserVeQIData'
import BigNumber from 'bignumber.js'

 const App = () => {

  const veQiProxyContract = "0x7Ee65Fdc1C534A6b4f9ea2Cc3ca9aC8d6c602aBd"
  const addressOfMainContract = "0xeb4eE988D975A91f02884076717D5EeACb41976f"

  const gaugeControllerProxyContract ="0x14593cb3Ffe270a72862Eb08CeB57Bc3D4DdC16C"


 
  const [wallet, setWallet] = useState('')
  const [veQiBalance, setVeQiBalance] = useState(null)
  const [veQiVotes, setVeQiVotes] = useState(null)
  

 

  useEffect(() => {
    
    const fetchData = async () => {
    
      const provider = new ethers.providers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc")
      const veQicontract = new ethers.Contract(veQiProxyContract, veQIErc20ABI, provider) 
      const gaugeControllerContract = new ethers.Contract(gaugeControllerProxyContract, gaugeControllerErc20ABI, provider)
    
    
      // Name of the token
      const tokenName = await veQicontract.name()

      // Users veQI balance
      const userVeQiBalance = await veQicontract.balanceOf(wallet)
      setVeQiBalance(userVeQiBalance.toString())

      //TODO: Users votes getUserVotesLength
      console.log("gaugecontroller contract", gaugeControllerContract)
      
      const userVeQiVotes = await gaugeControllerContract.getUserVotesLength()

      setVeQiVotes(userVeQiVotes.toString())

      //TODO: Total vote count for each validator

      //TODO: relative weight for each validaer

    console.log("veQIContract ", veQicontract)
    console.log("Your veQI balance ", userVeQiBalance)
    
    console.log("Token name", tokenName)
    
  }
  
  if(wallet) {
    fetchData()
  }
},[wallet])


  
  const requestAccount = async () => {
    if(window.ethereum) {
      
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts"})

        console.log("accounts:", accounts)
       
        setWallet(accounts[0])

      } catch (error) {
        console.log('Failed to connect')
      }
    }
    else {
      alert('Please install Meta Mask extension')
    }
  }
  
  console.log("Wallet address", wallet)
  console.log('Users votes: ', veQiVotes)
  console.log("Users balance: ", veQiBalance)


  return (
    <div className="App bg-gradient-to-b from-gray-900 to-blue-900
    h-screen text-gray-100 font-serif w-auto h-screen ">

      <div className="flex flex-col justify-center items-center py-3 px-8 w-30 h-10 mb-20 ">
        <img className="object-cover h-48 w-96 mt-20" alt="logo" src="./BenqiWordmarkWhite.png" />
        </div>

  
      <div className="flex flex-col justify-center items-center py-20"> 

        {!wallet && <button className=" text-gray-100 bg-gradient-to-r from-cyan-500 to-blue-500 border-transparent rounded  shadow-md border-2 border-gray-100 py-2 px-2 my-2" onClick={requestAccount}>Connect to wallet</button> }

          {wallet &&
          <> 
            <CryptoCard walletAddress={wallet} />
            <UserVeQIData veQiBalance={veQiBalance} veQiVotes={veQiVotes} />
          </> }
        </div>
    </div>
  );
}

export default App; 
