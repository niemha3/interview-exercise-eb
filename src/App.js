import React from 'react'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import './App.css'
import veQIErc20ABI from './veQIErc20ABI.json'
import gaugeControllerErc20ABI from './gaugeControllerErc20ABI.json'
import CryptoCard from './components/CryptoCard'
import UserVeQIData from './components/UserVeQIData'
import NodeDataTable from './components/NodeDataTable'

const App = () => {
  const veQiProxyContract = '0x7Ee65Fdc1C534A6b4f9ea2Cc3ca9aC8d6c602aBd'
  const gaugeControllerProxyContract =
    '0x14593cb3Ffe270a72862Eb08CeB57Bc3D4DdC16C'

  const provider = new ethers.providers.JsonRpcProvider(
    'https://api.avax.network/ext/bc/C/rpc'
  )
  const veQicontract = new ethers.Contract(
    veQiProxyContract,
    veQIErc20ABI,
    provider
  )
  const gaugeControllerContract = new ethers.Contract(
    gaugeControllerProxyContract,
    gaugeControllerErc20ABI,
    provider
  )

  const [walletAddress, setWalletAddress] = useState('')
  const [veQiBalance, setVeQiBalance] = useState(null)
  const [veQiVotes, setVeQiVotes] = useState(null)
  const [nodeDataList, setNodeDataList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    /**
     * Get list of nodes with votes and weight data
     */
    const fetchListOfNodes = async () => {
      try {
        const nodesLength = await gaugeControllerContract.getNodesLength()

        const nodes = await gaugeControllerContract.getNodesRange(
          0,
          (nodesLength - 1).toString()
        )

        const nodesData = await Promise.all(
          nodes.map(async (nodeId) => {
            try {
              const node = nodeId
              const votesForNode =
                await gaugeControllerContract.getVotesForNode(nodeId)
              const totalVotes =
                await gaugeControllerContract.getUserVotesLength()
              const nodeWeight =
                totalVotes > 0 ? (votesForNode / totalVotes) * 100 : 0

              return {
                node,
                votes: votesForNode.toString(),
                weight: nodeWeight.toFixed(2),
              }
            } catch (error) {
              console.error(
                `Error while fetching data for node ${nodeId}: ${error}`
              )
              return null
            }
          })
        )
        setLoading(true)
        setNodeDataList(nodesData)
      } catch (error) {
        console.error(`Error while fetching data for nodes: ${error}`)
      }
    }

    fetchListOfNodes()

    /**
     * Get users veQI balance and votes
     */
    const fetchUsersData = async () => {
      try {
        const userVeQiBalance = await veQicontract.balanceOf(walletAddress)
        setVeQiBalance(userVeQiBalance.toString())

        const userVeQiVotes = await gaugeControllerContract.getUserVotesLength()
        setVeQiVotes(userVeQiVotes.toString())
      } catch (error) {
        console.error(`Error while fetching user data: ${error}`)
      }
    }

    if (walletAddress) {
      fetchUsersData()
    }
  }, [walletAddress])

  /**
   * Connect user to metamask
   */
  const requestAccount = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        setWalletAddress(accounts[0])
      } catch (error) {
        console.error(`Failed to connect account: ${error}`)
      }
    } else {
      alert('Please install Meta Mask extension')
    }
  }

  return (
    <div
      className='app bg-gradient-to-b from-gray-900 to-blue-900
        text-gray-100 font-serif w-full min-h-screen'
    >
      <div className='flex flex-col justify-center items-center py-3 px-8 w-30 h-10 mb-20 '>
        <img
          className='object-cover h-48 w-96 mt-20'
          alt='logo'
          src='./BenqiWordmarkWhite.png'
        />
      </div>

      <div className='flex flex-col justify-center items-center py-20 overflow-y-auto'>
        {!walletAddress && (
          <button
            className=' text-gray-100 bg-gradient-to-r from-cyan-500 to-blue-500 border-transparent rounded  shadow-md border-2 border-gray-100 py-2 px-2 my-2'
            onClick={requestAccount}
          >
            Connect to wallet
          </button>
        )}
    
        {walletAddress && (
          <>
            <CryptoCard walletAddress={walletAddress} />
            <UserVeQIData veQiBalance={veQiBalance} veQiVotes={veQiVotes} />
          </>
        )}

        {loading ?  <NodeDataTable nodeDataList={nodeDataList} /> : <button className="text-white"> Loading nodes...</button> }
      </div>
    </div>
  )
}

export default App
