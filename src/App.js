import React from 'react'
import { useState, useEffect } from 'react'
import { ethers }  from "ethers"
import './App.css'
import veQIErc20ABI from './veQIErc20ABI.json'
import gaugeControllerErc20ABI from './gaugeControllerErc20ABI.json'
import CryptoCard from './components/CryptoCard'
import UserVeQIData from './components/UserVeQIData'


 const App = () => {

  const veQiProxyContract = "0x7Ee65Fdc1C534A6b4f9ea2Cc3ca9aC8d6c602aBd"
  // const addressOfMainContract = "0xeb4eE988D975A91f02884076717D5EeACb41976f"

  const gaugeControllerProxyContract ="0x14593cb3Ffe270a72862Eb08CeB57Bc3D4DdC16C"


 
  const [wallet, setWallet] = useState('')
  const [veQiBalance, setVeQiBalance] = useState(null)
  const [veQiVotes, setVeQiVotes] = useState(null)
  const [nodesList, setNodesList] = useState([])
  const [nodes, setNodes] = useState([])


  


  useEffect(() => {

    const provider = new ethers.providers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc")
    const veQicontract = new ethers.Contract(veQiProxyContract, veQIErc20ABI, provider) 
    const gaugeControllerContract = new ethers.Contract(gaugeControllerProxyContract, gaugeControllerErc20ABI, provider)

    /**
     * Get list of all nodes and set it to nodes state
     */
    const fetchListOfNodes = async () => {    
      const nodeCount = await gaugeControllerContract.getNodesLength()
      console.log(nodeCount.toString())
      const nodeIds = await gaugeControllerContract.getNodesRange(0, (nodeCount - 1).toString())

      setNodes(nodeIds)
      console.log("Nodes list: ", nodes)
  

     }


     /**
      * Get votes for one node
      */
     const fetchVotesForNode = async () => {

      const votesForNode = await gaugeControllerContract.getVotesForNode(nodes[0])
    
      // const nod = nodes.map(async (nodeId) => {
      //   const votesForNode = await gaugeControllerContract.getVotesForNode(nodeId)
      //   nodeObjects.push({
      //     nodeName: nodeId,
      //     votes: votesForNode.toString()

      //   })
      // })

      
      console.log("Votes for node: ", votesForNode.toString())
     }

     const getRelativeWeightOfNode = async () => {
    
      // const relativeWeight = await gaugeControllerContract.getRelativeWeightOfNode(nodes[0])
      // const voteCounts = nodesList.map(async (node)  => {
      //    await gaugeControllerContract.getVotesForNode(node)
      // })
  
      // console.log("Relative weight of node:", relativeWeight )
    }
    
    fetchListOfNodes()
    fetchVotesForNode()
    // getRelativeWeightOfNode()

    const fetchUsersData = async () => {

      // Users veQI balance
      const userVeQiBalance = await veQicontract.balanceOf(wallet)
      setVeQiBalance(userVeQiBalance.toString())

      //TODO: Users votes getUserVotesLength
      console.log("gaugecontroller contract", gaugeControllerContract)
      
      const userVeQiVotes = await gaugeControllerContract.getUserVotesLength()

      setVeQiVotes(userVeQiVotes.toString())
    
  }
  
  if(wallet) {
    fetchUsersData()
  }
},[wallet, nodesList])





       //TODO: relative weight for each validaer




  
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
    h-screen text-gray-100 font-serif w-auto h-auto">

      <div className="flex flex-col justify-center items-center py-3 px-8 w-30 h-10 mb-20 ">
        <img className="object-cover h-48 w-96 mt-20" alt="logo" src="./BenqiWordmarkWhite.png" />
        </div>

  
      <div className="flex flex-col justify-center items-center py-20 bg-gradient-to-b from-gray-900 to-blue-900"> 

        {!wallet && <button className=" text-gray-100 bg-gradient-to-r from-cyan-500 to-blue-500 border-transparent rounded  shadow-md border-2 border-gray-100 py-2 px-2 my-2" onClick={requestAccount}>Connect to wallet</button> }

          {wallet &&
          <> 
            <CryptoCard walletAddress={wallet} />
            <UserVeQIData veQiBalance={veQiBalance} veQiVotes={veQiVotes} />
          </> }
        </div>

        <div className="nodes bg-gradient-to-b from-gray-900 to-blue-900">
          {nodes.map(node => (
            <p key={node}>{node}</p>
          ))}
        </div>
    </div>
  );
}

export default App; 
