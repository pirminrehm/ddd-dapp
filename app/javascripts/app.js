'use strict'
// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import location_artifacts from '../../build/contracts/Location.json'
import voting_artifacts from '../../build/contracts/Voting.json'

// Location is our usable abstraction, which we'll use through the code below.
var Location = contract(location_artifacts);
var Voting = contract(voting_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  count : 0,

  start: function() {
    var self = this;

    // Bootstrap the Location abstraction for Use.
    Location.setProvider(web3.currentProvider);
    Voting.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      self.refreshLocations();
      self.refreshAccounts();
    });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  refreshLocations: function() {
    var self = this;
    
    // Reset the selectbox for 
    var locations_element = document.getElementById("locations");
    locations_element.innerHTML = '';

    var meta;
    Location.deployed().then((instance) => {
      meta = instance;
      App.globalMeta = instance;
      //return App.count;
      return meta.getLocationCount.call();
    }).then((data) => {
      
      var count = Number(data.toString(10));
      console.log(count);

      var i = 0;
      while (i < count) {
        meta.getLocationAtIndex.call(i).then(v => {
          const uri = web3.toAscii(v[0]);
          const name = web3.toAscii(v[1]);
          locations_element.innerHTML += `<option value="${uri}">${uri}: ${name}</option>`;
        }).catch(v => console.log(v));
        i++;
      }

      return count;
    }).catch((e) => {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },

  refreshAccounts: function() {
    var locations_element = document.getElementById("accounts");
    locations_element.innerHTML = '';
    for (let i=0; i < accounts.length; i++) {
        const address = accounts[i]
        const name = 'Account '+ i
        locations_element.innerHTML += `<option value="${address}">${name}: ${address}</option>`;
    }
  },

  addLocation: function() {
    var self = this;

    var uri = document.getElementById("uri").value;
    var name = document.getElementById("name").value;

    this.setStatus("Initiating transaction... (please wait)");

    var meta;
    Location.deployed().then((instance) => {
      meta = instance;
      return meta.addLocation(uri, name, {from: account, gas: 3000000}); // TODO: Check gas.
    }).then(() => {
      self.setStatus("Transaction complete!");
      self.refreshLocations();
    }).catch((e) => {
      console.log(e);
      self.setStatus("Error adding location; see log.");
    });
  },

  createVoting: function() {
    var self = this;

    var uri = document.getElementById("locations").value;
    var address = document.getElementById("accounts").value;
    var points = document.getElementById("points").value;

    this.setStatus("Initiating transaction... (please wait)");

    var meta;
    Voting.deployed().then((instance) => {
      meta = instance;
      return meta.addVote(uri, points, {from: address, gas: 3000000}); // TODO: Check gas.
    }).then(() => {
      self.setStatus("Transaction complete!");
      //todo show voting
    }).catch((e) => {
      console.log(e);
      self.setStatus("Error adding location; see log.");
    });
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have no coins, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  }

  App.start();
});
