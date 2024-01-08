import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const contractAddress = '0x05AB3e537f7395F4419EDF8dB1AA6A8A59a5D41B'; // Replace with your contract's address
const contractABI = [
  {
    inputs: [
      { internalType: 'contract IERC20', name: '_token', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      { internalType: 'address', name: 'sender', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'address', name: 'owner', type: 'address' },
    ],
    name: 'ERC721IncorrectOwner',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'operator', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'ERC721InsufficientApproval',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'approver', type: 'address' }],
    name: 'ERC721InvalidApprover',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'operator', type: 'address' }],
    name: 'ERC721InvalidOperator',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'ERC721InvalidOwner',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'receiver', type: 'address' }],
    name: 'ERC721InvalidReceiver',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'sender', type: 'address' }],
    name: 'ERC721InvalidSender',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ERC721NonexistentToken',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      { indexed: false, internalType: 'bool', name: 'approved', type: 'bool' },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_fromTokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_toTokenId',
        type: 'uint256',
      },
    ],
    name: 'BatchMetadataUpdate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_buyAddress',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_sellAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_nftAmount',
        type: 'uint256',
      },
      { indexed: false, internalType: 'string', name: '_name', type: 'string' },
      {
        indexed: false,
        internalType: 'string',
        name: '_nftDescription',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_timestamp',
        type: 'uint256',
      },
    ],
    name: 'Buy',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_nftMintAddress',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_nftAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_quantity',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_amountProvider',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: '_baseTokenURI',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_timestamp',
        type: 'uint256',
      },
    ],
    name: 'CreateNFT',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
    ],
    name: 'MetadataUpdate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [],
    name: 'BuyNFTcount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: '_name', type: 'string' },
      { internalType: 'string', name: '_description', type: 'string' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
    ],
    name: 'buy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'buyNftDetails',
    outputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'address', name: 'buyAddress', type: 'address' },
      { internalType: 'address', name: 'sellAddress', type: 'address' },
      { internalType: 'uint256', name: 'nftAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'timestamp', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: '_name', type: 'string' },
      { internalType: 'string', name: '_description', type: 'string' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      { internalType: 'uint256', name: '_quantity', type: 'uint256' },
      { internalType: 'string', name: '_baseTokenURI', type: 'string' },
      { internalType: 'address', name: '_amountProvider', type: 'address' },
    ],
    name: 'createNft',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'operator', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxMintPerUser',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxMintSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mintPrice',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nextTokenId',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'nftDetails',
    outputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'address', name: 'nftMintAddress', type: 'address' },
      { internalType: 'uint256', name: 'nftAmount', type: 'uint256' },
      { internalType: 'address', name: 'amountProvider', type: 'address' },
      { internalType: 'string', name: 'nftName', type: 'string' },
      { internalType: 'string', name: 'nftDescription', type: 'string' },
      { internalType: 'uint256', name: 'buyCount', type: 'uint256' },
      { internalType: 'uint256', name: 'sellCount', type: 'uint256' },
      { internalType: 'uint256', name: 'timestamp', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'operator', type: 'address' },
      { internalType: 'bool', name: 'approved', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'token',
    outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]; // Replace with your contract's ABI

const App = () => {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [nftDetails, setNftDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  // const [contractData, setContractData] = useState('');

  useEffect(() => {
    async function init() {
      // Connect to the Ethereum provider (e.g., MetaMask)
      if (window.ethereum) {
        const ethereumProvider = new ethers.providers.Web3Provider(
          window.ethereum
        );
        const signer = ethereumProvider.getSigner();

        // Create a contract instance
        const nftContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        setProvider(ethereumProvider);
        setContract(nftContract);

        // Get the connected account
        const accounts = await ethereumProvider.listAccounts();
        setAccount(accounts[0]);
      } else {
        console.error('Please install MetaMask!');
      }
    }

    init();
  }, []);

  // const fetchDataFromContract = async () => {
  //   try {
  //     // Call a read-only function on the smart contract
  //     const data = await contract.getData();
  //     setContractData(data.toString());
  //   } catch (error) {
  //     console.error('Error fetching data from the contract:', error.message);
  //   }
  // };

  const fetchNftDetails = async () => {
    try {
      setLoading(true);

      // Call the nftDetails function on the smart contract
      const totalMinted = await contract.nextTokenId();
      const nftDetailsArray = [];

      for (let i = 0; i <= totalMinted; i++) {
        const nftDetail = await contract.nftDetails(i);
        nftDetailsArray.push(nftDetail);
      }

      setNftDetails(nftDetailsArray);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching NFT details:', error.message);
      setLoading(false);
    }
  };
  const createNFt = async () => {
    try {
      // Send a transaction to the smart contract
      const transaction = await contract.createNft(
        'asdfasdf',
        'asdfasdf',
        10000000,
        3,
        'sdfasdf',
        '0xb62962Bb2661BC5c5fFfa648A2C2B7A3e8CD4d4B'
      );
      await transaction.wait();
      console.log('Transaction successful!');
    } catch (error) {
      console.error('Error interacting with the contract:', error.message);
    }
  };

  return (
    <div>
      <p>Connected Account: {account}</p>
      {/* <p>Contract Data: {contractData}</p> */}
      {/* <button onClick={fetchDataFromContract}>Fetch Data</button> */}

      <button
        type="button"
        className="w-auto h-[25px] p-5 ml-4 bg-gradient-to-r from-amber-600 to-pink-600 rounded-[30px] justify-center items-center gap-2 inline-flex"
        onClick={createNFt}
      >
        <span className="text-white text-md font-medium  tracking-wide">
          CreateNft 🛠️
        </span>
      </button>
    </div>
  );
};

export default App;
