// Retrieve accounts from the local node
const accounts = await ethers.provider.listAccounts();
console.log(accounts);

// scripts/index.js
async function main () {
    // Our code will go here
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });