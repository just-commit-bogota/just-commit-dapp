//export const CONTRACT_ADDRESS = "0x41d6dd7f19E33a375Dd6752faF67E6865963F608" // APP
//export const CONTRACT_ADDRESS = "0x896A90d26A1aB04dE23f4F96250aa30e319680a8" // BETA
export const CONTRACT_ADDRESS = "0x422D02cFDAb42fb387CaB5d4c0C4C6ac5A62f1B7" // DEV

export const CONTRACT_OWNER = "0xb44691c50339de6d882e1d6db4ebe5e3d670baad"

export const ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "commitFrom",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "commitTo",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "commitJudge",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "createdAt",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "endsAt",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "judgeDeadline",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "phonePickups",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "stakeAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "filename",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isCommitProved",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isCommitJudged",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isApproved",
        "type": "bool"
      }
    ],
    "name": "NewCommit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "commitId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isApproved",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "judgedAt",
        "type": "uint256"
      }
    ],
    "name": "NewJudge",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "commitId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "filename",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "provedAt",
        "type": "uint256"
      }
    ],
    "name": "NewProve",
    "type": "event"
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
        "internalType": "address",
        "name": "commitTo",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "commitJudge",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "phonePickups",
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
            "internalType": "address",
            "name": "commitJudge",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "createdAt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "endsAt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "judgeDeadline",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "phonePickups",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "stakeAmount",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "filename",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "isCommitProved",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isCommitJudged",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isApproved",
            "type": "bool"
          }
        ],
        "internalType": "struct CommitPortal.Commit[]",
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
    "name": "judgeCommit",
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
