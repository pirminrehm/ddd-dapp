pragma solidity 0.4.18;

import "./Team.sol";


contract Location {
    
  struct LocationStruct {
    bytes32 name;
    bytes32 uri;
  }

  //************** Private Vars ***************//
  //-------------------------------------------//
  Team private team;

  bytes32[] private uriList;
  mapping(bytes32 => LocationStruct) private locationStructs;

  //************** Constructor ****************//
  //-------------------------------------------//
  function Location(address teamAdr) public {
    team = Team(teamAdr);
  }

  //************** Transactions ***************//
  //-------------------------------------------//
  function addLocation(bytes32 uri, bytes32 name) public
    isMember()
    uniqueUri(uri)
    returns(uint index)
  {
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

  function checkIfUriExists(bytes32 uri) public constant returns (bool exists) {
    return locationStructs[uri].uri == uri;
  }

  //***************** Modifier ****************//
  //-------------------------------------------//
  modifier uniqueUri(bytes32 uri) {
    require(locationStructs[uri].uri != uri);
    _;
  }

  modifier isMember() { 
    require(team.checkMemberByAddress(msg.sender));
    _;
  }
}
