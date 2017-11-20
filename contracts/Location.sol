pragma solidity ^0.4.4;

contract Location {
  
  struct LocationStruct {
    bytes32 name;
    bytes32 uri;
  }

  LocationStruct[] public locations;
  uint count = 0;

  function Location() public {}

  function getLocation(uint index) returns (bytes32, bytes32) {
    var location = locations[index];
    return (location.uri, location.name);
  }

  function getLocationCount() returns(uint) {
    return count;
  }

  function addLocation(bytes32 uri, bytes32 name) public {
    // if (containsLocation(uri)) { 
    //   revert(); 
    // }
    locations[count] = LocationStruct(name, uri);
    count++;
  }
}
