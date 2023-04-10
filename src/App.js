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

  const provider = new ethers.providers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc")
  const veQicontract = new ethers.Contract(veQiProxyContract, veQIErc20ABI, provider) 
  const gaugeControllerContract = new ethers.Contract(gaugeControllerProxyContract, gaugeControllerErc20ABI, provider)


 
  const [wallet, setWallet] = useState('')
  const [veQiBalance, setVeQiBalance] = useState(null)
  const [veQiVotes, setVeQiVotes] = useState(null)
  const [nodesList, setNodesList] = useState([])
  const [nodeDataList, setNodeDataList] = useState([])




  


  useEffect(() => {



    /**
     * Get list of all nodes and set it to nodes state
     */
    const fetchListOfNodes = async () => {    
      const nodesLength = await gaugeControllerContract.getNodesLength()
  
      const nodes = await gaugeControllerContract.getNodesRange(0, (nodesLength - 1).toString())



       const newNodeObjects = await Promise.all(
        nodes.map(async (nodeId) => {
          const votesForNode = await gaugeControllerContract.getVotesForNode(nodeId)

         return {
          votes: votesForNode.toString(),
          node: nodeId
         }
        
         
        })
         )

         const nodesData = await Promise.all(
          nodes.map(async (nodeId) => {
            const node = nodeId
            const votesForNode = await gaugeControllerContract.getVotesForNode(nodeId)
            const totalVotes = await gaugeControllerContract.getUserVotesLength()
            const nodeWeight = totalVotes > 0 ? (votesForNode / totalVotes) * 100 : 0

            return {
              node,
              votes: votesForNode.toString(),
              weight: nodeWeight.toFixed(2)
            }
          })
         )

       

         

        //  const nodesWithAllData = []
        //  for(let i = 0; i < newNodeObjects.length; i++) {
        //   const nodeId = newNodeObjects[i].node
        //   const nodeVotes = newNodeObjects[i].votes
        //   const totalVotes = await gaugeControllerContract.getUserVotesLength()
        //   const nodeWeight = totalVotes > 0 ? (nodeVotes / totalVotes) * 100 : 0
          
        //   nodesWithAllData[nodeId] = nodeWeight.toString()
        //  }

        //  console.log(nodesWithAllData)

          setNodeDataList(nodesData)
        
     }

     console.log(nodeDataList)

     /**
      * Get votes for one node
      */
     const fetchDataForNodes = async () => {

     

   
      
      // const nod = nodes.map(async (nodeId) => {
      //   const votesForNode = await gaugeControllerContract.getVotesForNode(nodeId)
      //   nodeObjects.push({
      //     nodeName: nodeId,
      //     votes: votesForNode.toString()

      //   })
      // })

    
    
     }

     const getRelativeWeightOfNode = async () => {
    
      // const relativeWeight = await gaugeControllerContract.getRelativeWeightOfNode(nodes[0])
      // const voteCounts = nodesList.map(async (node)  => {
      //    await gaugeControllerContract.getVotesForNode(node)
      // })
  
      // console.log("Relative weight of node:", relativeWeight )
    }
    
    fetchListOfNodes()
    // fetchDataForNodes()
    // fetchVotesForNode()
    // getRelativeWeightOfNode()

    const fetchUsersData = async () => {

      // Users veQI balance
      const userVeQiBalance = await veQicontract.balanceOf(wallet)
      setVeQiBalance(userVeQiBalance.toString())

      //TODO: Users votes getUserVotesLength
      // console.log("gaugecontroller contract", gaugeControllerContract)
      
      const userVeQiVotes = await gaugeControllerContract.getUserVotesLength()

      setVeQiVotes(userVeQiVotes.toString())
    
  }
  
  if(wallet) {
    fetchUsersData()
  }
},[wallet])
  
  const requestAccount = async () => {
    if(window.ethereum) {
      
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts"})

        // console.log("accounts:", accounts)
       
        setWallet(accounts[0])

      } catch (error) {
        // console.log('Failed to connect')
      }
    }
    else {
      alert('Please install Meta Mask extension')
    }
  }

  console.log("nodes data: ", nodeDataList)
 
  // console.log("Wallet address", wallet)
  // console.log('Users votes: ', veQiVotes)
  // console.log("Users balance: ", veQiBalance)


  return (
    <div className="App bg-gradient-to-b from-gray-900 to-blue-900
    h-screen text-gray-100 font-serif w-full h-fit">

      <div className="flex flex-col justify-center items-center py-3 px-8 w-30 h-10 mb-20 ">
        <img className="object-cover h-48 w-96 mt-20" alt="logo" src="./BenqiWordmarkWhite.png" />
        </div>

  
      <div className="flex flex-col justify-center items-center py-20 "> 

        {!wallet && <button className=" text-gray-100 bg-gradient-to-r from-cyan-500 to-blue-500 border-transparent rounded  shadow-md border-2 border-gray-100 py-2 px-2 my-2" onClick={requestAccount}>Connect to wallet</button> }

          {wallet &&
          <> 
            <CryptoCard walletAddress={wallet} />
            <UserVeQIData veQiBalance={veQiBalance} veQiVotes={veQiVotes} />
          </> }
        </div>

       
          <table className="table-auto  w-40vw mt-8"> 
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NodeId</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Votes </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">veQI Weight</th>
              </tr>
            </thead> 
            <tbody>
          
              {nodeDataList.map((node, index) => (
                <tr key={index}> 
                <td key={node.node} className="border px-4 py-2 text-sm font-medium">{node.node}</td>
                <td key={node.votes} className="border px-4 py-2 text-sm font-medium">{node.votes}</td>
                <td key={index} className="border px-4 py-2 text-sm font-medium">2000</td> 
                </tr>
              ))}

            </tbody>
          </table>
        

    </div>
  );
}

export default App; 
