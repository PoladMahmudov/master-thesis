# Resource Assurer Smart Contracts

In EOS.IO, the smart contracts are comprised of actions, usually grouped by the functionality, and set of types that those actions depend on. Thus, the actions define the actual behavior of a smart contract.  
In the scope of this prototype, all research concepts are put into a single [assurer contract](contracts/resource.assurer). It includes all relevant *reliability*, *integrity* and *forum* actions.

## Getting Started

### Prerequisites

What things you need to install the software and how to install them

* [Docker](https://www.docker.com/get-started) - Used to setup a blockchain environment
* [EOS Studio](https://www.eosstudio.io/) - A convenient tool, used to start local test node, compile and deploy smart contracts

### Installing


A step by step series of examples that tell you how to get an EOS development environment running

1. Run *EOS Studio* and install all required software that involves EOSIO blockchain, eosio.cdt, nodeos, etc. 
1. (Optional) Checkout to the demo branch of current repository, running `git checkout demo`. This will set all time limits (referendum expiration, hold and freeze periods) for development mode specifically
1. Open an assurer project/contract in EOS Studio, navigating to the root directory of corresponding contract
1. Run a local blockchain node in EOS Studio, going to Network and initiating a new instance with EOSIO version **^v2.0.5**
1. Define a new account, named as **assurer**, going to Account and creating it. After the account is created, permission keys should be set to enable inline action within the *assurer* contract. It is possible by editing an account's active permission, adding **assurer@eosio.code** permission. Detailed instructions could be found [here](https://docs.google.com/document/d/1cnwhR5k8HbAlYcH51B185Dk22SY6i0iOvj_e9IkcTSY/edit?usp=sharing).

## Built With

1. (Optional) Compile an **assurer** contract, generating *assurer.abi* and *assurer.wasm* files
2. Configure the Project Settings under the assurer contract. Might be skipped, if it's possible to compile a contract immediately.

## Deployment

Deploy the contract, selecting **assurer** account  as contract's account.

Now EOS Blockchain platform is set on http://localhost:8888, and ready to be used by any client's application, implementing *eosjs* API.