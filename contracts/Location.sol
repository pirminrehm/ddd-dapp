pragma solidity 0.4.18;


contract Location {
  
  struct LocationStruct {
    bytes32 name;
    bytes32 uri;
  }

  bytes32[] private uriList;
  mapping(bytes32 => LocationStruct) private locationStructs;

  function Location() public {
    // constructor
  }

  function getLocatonAtIndex(uint index) public constant returns (bytes32 uri, bytes32 name) {
    var targetUri = uriList[index];
    return (targetUri, locationStructs[targetUri].name);
  }

  // Not used for now, maybe change to getLocationNameByUri and use it in @getLocationAtIndex.
  function getLocationByURI(bytes32 uri) public constant returns (bytes32, bytes32 name) {
    return (uri, locationStructs[uri].name);
  }

  function getLocationCount() public constant returns(uint locationCount) {
    return uriList.length;
  }

  function addLocation(bytes32 uri, bytes32 name) public returns(uint index) {
    locationStructs[uri].uri = uri;
    locationStructs[uri].name = name;
    return uriList.push(uri) - 1;
  }
}
