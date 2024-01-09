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
  const [walletAddress, setWalletAddress] = useState('');
  const [nftName, setnftName] = useState('');
  const [nftDescription, setnftDescription] = useState('');
  const [nftAmount, setnftAmmount] = useState('');
  const [nftQuanitiy, setnftQuanitiy] = useState('');
  const [nftBaseTokenURI, setNftBaseTokenUri] = useState('');
  const [nftAmountProvider, setnftAmountProvider] = useState('');
  const [tokenId, setTokenid] = useState('');

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

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);

  const connectWallet = async () => {
    if (typeof window != 'undefined' && typeof window.ethereum != 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setWalletAddress(accounts[0]);
        // console.log(accounts[0]);
      } catch (error) {
        console.error(error.message);
      }
    } else {
      alert('Please Install Metamask!');
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window != 'undefined' && typeof window.ethereum != 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          // console.log(accounts[0]);
        } else {
          console.log('Connect to MetaMask using the Connect button');
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log('Please install MetaMask');
    }
  };
  const addWalletListener = async () => {
    if (typeof window != 'undefined' && typeof window.ethereum != 'undefined') {
      window.ethereum.on('accountsChanged', (accounts) => {
        setWalletAddress(accounts[0]);
        // console.log(accounts[0]);
      });
    } else {
      /* MetaMask is not installed */
      setWalletAddress('');
      console.log('Please install MetaMask');
    }
  };

  // const fetchDataFromContract = async () => {
  //   try {
  //     // Call a read-only function on the smart contract
  //     const data = await contract.getData();
  //     setContractData(data.toString());
  //   } catch (error) {
  //     console.error('Error fetching data from the contract:', error.message);
  //   }
  // };

  // const fetchNftDetails = async () => {
  //   try {
  //     setLoading(true);

  //     // Call the nftDetails function on the smart contract
  //     const totalMinted = await contract.nextTokenId();
  //     const nftDetailsArray = [];

  //     for (let i = 0; i <= totalMinted; i++) {
  //       const nftDetail = await contract.nftDetails(i);
  //       nftDetailsArray.push(nftDetail);
  //     }

  //     setNftDetails(nftDetailsArray);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error('Error fetching NFT details:', error.message);
  //     setLoading(false);
  //   }
  // };
  const createNFt = async () => {
    try {
      // Send a transaction to the smart contract
      const transaction = await contract.createNft(
        nftName,
        nftDescription,
        nftAmount,
        nftQuanitiy,
        nftBaseTokenURI,
        nftAmountProvider
      );
      await transaction.wait();
      console.log('Transaction successful!');
    } catch (error) {
      console.error('Error interacting with the contract:', error.message);
    }
  };
  const buyNft = async () => {
    try {
      const transactionbuy = await contract.buy(
        nftName,
        nftDescription,
        nftAmount,
        tokenId
      );
      await transactionbuy.wait();
      console.log('Buy nft successful!');
    } catch (error) {
      console.error('Error to buy a nft: ', error.message);
    }
  };
  return (
    <>
      <div className="bg-gradient-to-r from-violet-200 to-pink-200 h-dvh">
        <div className="flex justify-center items-center gap-3">
          <div className="mt-4">
            <p className="text-3xl  font-bold leading-normal tracking-normal ml-4 bg-gradient-to-r from-teal-400 to-yellow-200 bg-clip-text text-transparent">
              ANRYTON Nft Contract Deploy
            </p>

            <button
              className="w-auto h-[25px] p-5  bg-gradient-to-r from-amber-600 to-pink-600 rounded-[30px] justify-center items-center gap-2 inline-flex"
              onClick={connectWallet}
            >
              <span className="text-white text-md font-medium leading-normal tracking-wide">
                {walletAddress && walletAddress.length > 0
                  ? `🦊  ${walletAddress}`
                  : '🦊   Connect Wallet'}
              </span>
            </button>
          </div>
        </div>

        {/* <br /> */}
        <div className="flex mr-5 justify-center">
          <div className="ml-4">
            <form className="w-[30rem] mt-4 p-8 border border-gray-600 rounded-3xl">
              <span className="text-black mb-5 text-md font-extrabold tracking-wide">
                CreateNft 🛠️
              </span>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-bold  tracking-wide text-gray-600"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 p-2 border rounded-md bg-inherit shadow-lg border-gray-600 w-full"
                  placeholder="Enter the nft name"
                  onChange={(e) => setnftName(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-bold tracking-wide text-gray-600"
                >
                  Description
                </label>
                <textarea
                  type="text"
                  id="description"
                  className="mt-1 p-2 border rounded-md bg-inherit shadow-lg border-gray-600 w-full"
                  placeholder="Enter a decrption of NFT"
                  onChange={(e) => setnftDescription(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="amount"
                  className="block text-sm font-bold text-gray-600"
                >
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  className="mt-1 p-2 border rounded-md bg-inherit shadow-lg border-gray-600 w-full"
                  placeholder="Enter a Amount of NFT"
                  onChange={(e) => setnftAmmount(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-bold text-gray-600"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  className="mt-1 p-2 border rounded-md bg-inherit shadow-lg border-gray-600 w-full"
                  placeholder="Enter a Quantity"
                  min="0"
                  max="10"
                  onChange={(e) => setnftQuanitiy(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="baseTokenURI"
                  className="block text-sm font-bold text-gray-600"
                >
                  Base Token URI 🔗
                </label>
                <input
                  type="text"
                  id="baseTokenURI"
                  className="mt-1 p-2 border rounded-md bg-inherit shadow-lg border-gray-600 w-full"
                  placeholder="Enter a Base URI"
                  onChange={(e) => setNftBaseTokenUri(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="amountProvider"
                  className="block text-sm font-bold text-gray-600"
                >
                  Amount Provider
                </label>
                <input
                  type="text"
                  id="amountProvider"
                  className="mt-1 p-2 border rounded-md bg-inherit shadow-lg border-gray-600 w-full"
                  placeholder="Enter a address Amount Provider"
                  onChange={(e) => setnftAmountProvider(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="w-[26rem] h-[25px] p-5 bg-gradient-to-r from-amber-600 to-pink-600 rounded-[30px] justify-center items-center gap-2 inline-flex"
                onClick={createNFt}
              >
                <span className="text-white text-md font-bold  tracking-wide">
                  CreateNft 🛠️
                </span>
              </button>
            </form>
          </div>
          <div className="ml-4">
            <form className="w-[30rem] mt-4 p-8 border border-gray-600 rounded-3xl">
              <span className="text-black mb-5 text-md font-extrabold tracking-wide">
                Buy NFT
              </span>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-bold tracking-wide text-gray-600"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 p-2 border rounded-md bg-inherit shadow-lg border-gray-600 w-full"
                  placeholder="Enter the nft name"
                  onChange={(e) => setnftName(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-bold tracking-wide text-gray-600"
                >
                  Description
                </label>
                <textarea
                  type="text"
                  id="description"
                  className="mt-1 p-2 border rounded-md bg-inherit shadow-lg border-gray-600 w-full"
                  placeholder="Enter a decrption of NFT"
                  onChange={(e) => setnftDescription(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="amount"
                  className="block text-sm font-bold text-gray-600"
                >
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  className="mt-1 p-2 border rounded-md bg-inherit shadow-lg border-gray-600 w-full"
                  placeholder="Enter a Amount of NFT"
                  onChange={(e) => setnftAmmount(e.target.value)}
                />
              </div>

              <div className="mb-4  ">
                <label
                  htmlFor="tokenid"
                  className="block text-sm font-bold text-gray-600"
                >
                  Token ID
                </label>
                <input
                  type="number"
                  id="Tokenid"
                  className="mt-1 p-2 border rounded-md bg-inherit shadow-lg border-gray-600 w-full"
                  placeholder="Enter a Tokenid"
                  onChange={(e) => setTokenid(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="w-[26rem] h-[25px] p-5 bg-gradient-to-r from-amber-600 to-pink-600 rounded-[30px] justify-center items-center gap-2 inline-flex"
                onClick={buyNft}
              >
                <span className="text-white text-md font-bold  tracking-wide">
                  BUY
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
