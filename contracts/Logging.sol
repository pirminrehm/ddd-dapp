pragma solidity 0.4.18;


contract Logging {
    
  //************** Private Vars ***************//
  //-------------------------------------------//

  struct TeamStruct {
    address team;
    bytes32 name;
  }

  address[] private teamAddresses;
  mapping(address => TeamStruct) private teamStructs;

  //************** Constructor ****************//
  //-------------------------------------------//
  function Logging() public { }

  //************** Transactions ***************//
  //-------------------------------------------//
  function addTeam(address teamAddress, bytes32 teamName) public
  {
    teamStructs[teamAddress].team = teamAddress;
    teamStructs[teamAddress].name = teamName;
    teamAddresses.push(teamAddress);
  }

  //**************** Getter *******************//
  //-------------------------------------------//
  function getTeamAddressByIndex(uint index) public constant
  returns (address teamAddress, bytes32 teamName) {
    TeamStruct storage t = teamStructs[teamAddresses[index]];
    return (t.team, t.name);
  }

  function getTeamAddressCount() public constant returns (uint locationCount) {
    return teamAddresses.length;
  }

}
