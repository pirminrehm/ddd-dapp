# Developers Dining App

`Developers Dining Dilemma` is a voting app for developers that promises security through Blockchain technology and the Ethereum network.

## Getting started

1. Prerequisites: node 8.9.1. You can use nvm to support multiple node versions, run 
  ```shell
  $ nvm install 
  ```
within this directory to install the supported version.

2. Install global packages: 
  ```shell
  $ npm install -g truffle cordova ionic
  ```

3. Clone the `ws17-EthereumBlockchain` project.

4. Install the project's dependencies.

  ```shell
  $ npm install
  ```

5. Install Ganache: 
  Additionally on windows:
  ```shell
  $ npm install -g windows-build-tools
  ```
http://truffleframework.com/ganache/
## Workflow
### Ganache
  Open Ganache and make sure, it runs on Port `7545` and your local IP (e.g. `192.168.0.150`).
  Also it should have the network id `5777`.

  Set your local IP also in `truffle.js` for the key `host: 'localhost'`.

  Compile the contracts wiht:

  ```shell
  $ truffle compile
  ```
### Compile and Migrate
  Afterwards, migrate the contracts to the Ganache Network:

  ```shell 
  $ truffle migrate
  ``` 

  In Ganache you should see, that some contracts were deployed.
  
  > Hint: After pulling a new version, compile all contracts again, to avoide issues:
  > ```shell 
  > $ truffle compile --all
  > ``` 
  > Maybe you have to delete the `build` folder in addition

### Serve the App

 Update the const `TEST_RPC_IP` with your local IP address in `src/providers/web3/web3.js` for connecting Ganache

 Serve the ionic app in a second console tab / window:
  ```shell
  $ ionic serve
  ```
  Or with your android phone:
  ```shell
  $ ionic cordova run android --device
  ```

## Truffle Tests
  Truffle Tests are written in `Mocha` and stored within `./test`. 

  Run the tests inside the truffle develop shell:

  ```shell
  $ truffle develop
  $ truffle(develop)> migrate
  ```

## Dashbaord

TODO Link DDD Dashboarad Repo

## License

TODO
