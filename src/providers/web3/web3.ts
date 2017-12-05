import { Injectable } from '@angular/core';
const Web3 = require('web3');

const contract = require('truffle-contract');

declare var window: any;

/*
  Generated class for the Web3Provider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class Web3Provider {

  private web3: any;
  private account: string;
  private accounts: string[];

  constructor() {}

  init() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      console.warn(
        'Using web3 detected from external source. If you find that your accounts don\'t appear or you have 0 MetaCoin, ensure you\'ve configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask'
      );
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.warn(
        'No web3 detected. Falling back to http://localhost:9545. You should remove this fallback when you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
      );
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(
        new Web3.providers.HttpProvider('http://localhost:9545')
      );
    }

    // Query and init accounts
    this.queryAccounts();
  }

  private queryAccounts() {
    this.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        alert('There was an error fetching your accounts.');
        return;
      }

      if (accs.length === 0) {
        alert('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
        return;
      }
      this.accounts = accs;
      this.account = this.accounts[0];
    });
  }


  // GETTER

  getAccount() {
    if(!this.account) {
      throw "Error fetching web3 accounts: Web3 not yet initialized";
    }
    return this.account;
  }

  getAccounts() {
    if(!this.account) {
      throw "Error fetching web3 accounts: Web3 not yet initialized";
    }
    return this.accounts;
  }


  // INTERACTORS

  toWeb3String(value: string) {
    return this.web3.fromUtf8(value);
  }

  fromWeb3String(value: any) {
    return this.web3.toUtf8(value);
  }

  toWeb3Number(value: number) {
    return this.web3.toBigNumber(value);
  }

  fromWeb3Number(value: any) {
    return Number(value.toString(10));
  }


  // HELPERS

  getDeployedContract(artifact: any) {
    const location = contract(artifact);
    location.setProvider(this.web3.currentProvider);
    return location.deployed();
  }
}
