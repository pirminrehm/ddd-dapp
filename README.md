# Developers Dining App

`Developers Dining Dilemma` is a voting app for developers that promises security through Blockchain technology and the Ethereum network.

This project bases on the [webpack-box](https://github.com/truffle-box/webpack-box) of truffle.

## Getting started

1. Install truffle: 
  ```shell
  $ npm install -g truffle
  ```

2. Clone the `ws17-EthereumBlockchain` project:

  ```shell
  $ git clone https://gitlab.mi.hdm-stuttgart.de/ma/ws17-EthereumBlockchain/
  $ cd ws17-EthereumBlockchain
  ```

3. Install dependencies. We assume that you have already installed `npm` in your system.

  ```shell
  $ npm install
  ```

## Workflow

  Open the console and start the development server:

  ```shell
  $ truffle develop 
  ```

  Afterwards compile and migrate the contracts inside the development console:

  ```shell 
  truffle(develop)> compile && migrate
  ``` 


  Start the server in a second console tab / window:
  ```shell
  $ npm run dev
  ```

## Tests
  Tests are written in `Mocha` and stored within the test folder. 

  Run the tests with:

  ```shell
  $ truffle test
  ```

## License

TODO
