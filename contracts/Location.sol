pragma solidity 0.4.18;

import "./Team.sol";


contract Location {
    
  struct LocationStruct {
    bytes32 name;
    bytes32 uri;
  }

  //************** Private Vars ***************//
  //-------------------------------------------//
  address private teamAddress;
  Team private team;

  bytes32[] private uriList;
  mapping(bytes32 => LocationStruct) private locationStructs;

  //************** Constructor ****************//
  //-------------------------------------------//
  function Location(address teamAdr) public {
    teamAddress = teamAdr;
    team = Team(teamAddress);
  }

  //************** Transactions ***************//
  //-------------------------------------------//
  function addLocation(bytes32 uri, bytes32 name) public uniqueUri(uri) returns(uint index) {
    locationStructs[uri].uri = uri;
    locationStructs[uri].name = name;
    return uriList.push(uri) - 1;
  }

  //**************** Getter *******************//
  //-------------------------------------------//
  function getLocationByURI(bytes32 uri) public constant returns (bytes32, bytes32 name) {
    // Not used for now, maybe change to getLocationNameByUri and use it in @getLocationAtIndex.
    return (uri, locationStructs[uri].name);
  }

  function getLocationByIndex(uint index) public constant returns (bytes32 uri, bytes32 name) {
    return (uriList[index], locationStructs[uriList[index]].name);
  }

  function getLocationCount() public constant returns (uint locationCount) {
    return uriList.length;
  }

  //***************** Modifier ****************//
  //-------------------------------------------//
  modifier uniqueUri(bytes32 uri) { // Modifier
    require(locationStructs[uri].uri != uri);
    _;
  }
}
