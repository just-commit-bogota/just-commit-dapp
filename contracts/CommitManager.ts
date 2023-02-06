export const CONTRACT_ADDRESS = "0xb235Cf57d17aCeb97CF4DA5474A7023e3d3a390E" // BETA
//export const CONTRACT_ADDRESS = "0x0507b4704f882240E11a3B41dAC88F1573a20c0E" // DEV

export const CONTRACT_OWNER = "0xb44691c50339de6d882e1d6db4ebe5e3d670baad"

export const ABI =
  [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_message",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "commitTo",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "validThrough",
          "type": "uint256"
        }
      ],
      "name": "createCommit",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllCommits",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "commitFrom",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "commitTo",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "createdAt",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "validThrough",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "judgeDeadline",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "stakeAmount",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "message",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "ipfsHash",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "filename",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "commitProved",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "commitJudged",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isApproved",
              "type": "bool"
            }
          ],
          "internalType": "struct CommitManagerContract.Commit[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalCommits",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "commitId",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_isApproved",
          "type": "bool"
        }
      ],
      "name": "judgeTheCommit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "commitId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_ipfsHash",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_filename",
          "type": "string"
        }
      ],
      "name": "proveCommit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ] as const
