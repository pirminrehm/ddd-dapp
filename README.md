# Developers Dining App

`Developers Dining Dilemma` is a mobile application that uses the Ethereum network for decision-making in a team. The aim of the project is to evaluate the feasibility of applications in the blockchain and to use its decentralization to increase the forgery protection of applications.

Licensed under MIT, see [LICENSE.md](./LICENSE.md)

## Setup the project

### Prerequisites: 

1. **node v.8.9.4**:
  You can use nvm to support multiple node versions. Run the following command within the root directory to install the supported version:
    ```shell
    $ nvm install 
    ```

2. Globally: `Ionic (3.19.0)`, `Truffle (v4.0.1)`, `Cordova (8.0.0)`
    ```shell
    $ npm install -g truffle cordova ionic
    ```

### Getting started

1. Clone the `ws17-EthereumBlockchain` project.

2. Install the project's dependencies:
    ```shell
    $ npm install
    ```


## Local Ethereum client (Ganache)
Since the application is not yet deployed to the real ethereum network, we need a local client to run and develop it. Therefore, you can either use the *ganache-cli* or it's application with user-interface called [ganache](http://truffleframework.com/ganache/).

### ganache-cli

Install it with
```shell
$ npm install -g ganache-cli
```

and run it with the network configuration (see `truffle.js`):
```shell
$ ganache-cli -i 5777 -p 7545
```

### ganache (user-interface)
Follow the instructions on http://truffleframework.com/ganache/ and be sure that the settings match the configuration (see `truffle.js`).

On windows you may also install the build tools:
  ```shell
  $ npm install -g windows-build-tools
  ``` 


### **Important hint**
If you want to debug / deploy this application on a mobile device, there have to be adjustments made on both, the truffle network configuration and the ganache settings.

1. Open the `truffle.js` and set your local ip (e.g. `192.168.0.150`) as host.

2. Either add `-h <your-ip>` if you run with *ganache-cli* or set your ip in the settings of *ganache's* user-interface.



## Workflow
### Ganache
  Make sure that ganache always runs on the port and network id specified in `truffle.js`.

### Compile and deploy smart contracts
Compile the contracts with:
```shell
$ truffle compile
```

Afterwards, migrate the contracts to the Ganache Network:

```shell 
$ truffle migrate
```
> In the console you should see the address of the logging contract like this:<br>
> `***************** 0x345ca3e014aaf5dca488057592ee47305d9b3e10 *****************`
> If you want to use the dashboard, store it for later use. <br>
> If the migration was the first transaction in your local blockchain, the address of the logging contract should be the one shown above.

In Ganache you should see, that some contracts were deployed.
  
> Hint: After pulling a new version, compile all contracts again, to avoide issues:
> ```shell 
> $ truffle compile --all
> ``` 
> Maybe you have to delete the `./build` folder in addition.

### Serve the App
Serve the ionic app in a second console tab / window:
```shell
$ ionic serve
```
Or with your android phone:
```shell
$ ionic cordova run android --device
```

It's also possible to make an production build and run it on your phone:
```shell
$ ionic cordova run android --prod --release
```
> Note: The included keystore is only for testing purpose. Use your own for secure builds.

After entering the app check the settings tab to make sure an account and a logging address are selected.

## Testing of Smart Contracts
The tests for smart contracts are based on truffle's built-in features and written in `Mocha`. You can find them in `./test`. 

Use the `truffle console` to run them as follows:

```shell
$ truffle console
$ truffle(development)> test
```

## Dashbaord

TODO Link DDD Dashboarad Repo

## License

TODO
