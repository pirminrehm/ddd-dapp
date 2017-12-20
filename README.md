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

## Workflow

  Open the terminal and start the TestRPC and truffle development console:

  ```shell
  $ truffle develop 
  ```

  Afterwards, migrate the contracts inside the development console:

  ```shell 
  truffle(develop)> migrate
  ``` 
  
  > Hint: After pulling a new version, delete the ./build folder to avoid issues.
  
  If you want to get a better unstanding of the interaction with TestRPC, 
  open a new tab and run:
  ```shell 
  $ truffle develop --log
   ``` 


  Serve the ionic app in a second console tab / window:
  ```shell
  $ ionic serve
  ```

## Truffle Tests
  Truffle Tests are written in `Mocha` and stored within `./test`. 

  Run the tests with:

  ```shell
  $ truffle test
  ```

## License

TODO
