const Team = artifacts.require("./Team.sol");
Web3 = require("web3");
const web3 = new Web3();
const expect = require('chai').expect;


const nr = num => Number(num.toString(10));
const f8 = str => web3.fromUtf8(str);
const t8 = str => web3.toUtf8(str);

module.exports.nr = nr;
module.exports.f8 = f8;
module.exports.t8 = t8;


module.exports.createTeamWithAllAccounts =  async accounts => {
  let contract = await Team.new(f8('init_test_team'), f8('user_0'), 0, {from: accounts[0]});
  let tokens = [];
  tokens[0] = '';
  // console.log('createInvitationToken');
  for (let i=1; i<accounts.length; i++) {
    //console.log(i);
    tokens[i] = await contract.createInvitationToken({from: accounts[0]});
  }
  // console.log('sendJoinTeamRequest');
  for (let i=1; i<accounts.length; i++) {
    //console.log(i);
    await contract.sendJoinTeamRequest( 
      tokens[i].logs[0].args.token,
      f8('user_'+i),
      0,
      {from: accounts[i]}
    );
  }
  // console.log('acceptPendingMember');
  for (let i=1; i<accounts.length; i++) {
    //console.log(i);
    await contract.acceptPendingMember(
      accounts[i],
      {from: accounts[0]}
    );
  }
  // console.log(nr(await contract.getMembersCount.call()));
  return (contract.address);
} 
