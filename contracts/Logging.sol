pragma solidity 0.4.18;


contract Logging {
    
  //************** Private Vars ***************//
  //-------------------------------------------//

  address[] private teamList;

  //************** Constructor ****************//
  //-------------------------------------------//
  function Logging() public { }

  //************** Transactions ***************//
  //-------------------------------------------//
  function addTeam(address teamAddress) public
  {
    teamList.push(teamAddress);
  }

  //**************** Getter *******************//
  //-------------------------------------------//
  function getTeamAddressByIndex(uint index) public constant returns (address teamAddress) {
    return (teamList[index]);
  }

  function getTeamAddressCount() public constant returns (uint locationCount) {
    return teamList.length;
  }

}
