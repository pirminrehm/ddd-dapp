pragma solidity 0.4.18;


contract Voting {

  bytes32 public name;
  
  address[] private votingUsers;
  mapping (address => uint) private userPoints;

  bytes32[] private votedLocations;
  mapping (bytes32 => uint) private locationPoints;

  // function Voting (bytes3232 _name) public {
  //   name = _name;
  // }
  function Voting() public {
    //constructor
  }

  //missing: check for allowed votingUsers
  function addVote (bytes32 locationURI, uint points) public willNotExceed100Points(points) {

    //init user, if first vote of user
    if (userPoints[msg.sender] == 0) {
      votingUsers.push(msg.sender);
      userPoints[msg.sender] = 0;
    }
    //userPoints[msg.sender] += points;
    userPoints[msg.sender] += 1;

    //init location, if first vote for location
    if (locationPoints[locationURI] == 0) {
      votedLocations.push(locationURI);
      locationPoints[locationURI] = 0;
    }
    //locationPoints[locationURI] += points;
    locationPoints[locationURI] += points;

  }

  //********* LocationPoints Getter ***********//
  //-------------------------------------------//
  function getLocationPointsByIndex(uint index) public constant returns (bytes32 uri, uint points) {
    return (votedLocations[index], locationPoints[votedLocations[index]]);
  }

  function getLocationPointsByURI(bytes32 _uri) public constant returns (bytes32 uri, uint points) {
    return ( _uri, locationPoints[_uri]);
  }

  function getVotedLocationsCount() public constant returns (uint votedLocationsCount) {
    return votedLocations.length;
  }

  //*********** UserPoints Getter *************//
  //-------------------------------------------//
  function getUserPointsByIndex(uint index) public constant returns (address adr, uint points) {
    return (votingUsers[index], userPoints[votingUsers[index]]);
  }

  function getUserPointsByAddress(address _adr) public constant returns (address adr, uint points) {
    return (_adr, userPoints[_adr]);
  }

  function getVotingUsersCount() public constant returns (uint votingUsersCount) {
    return votingUsers.length;
  }

  //***************** Modifier ****************//
  //-------------------------------------------//
  modifier willNotExceed100Points(uint points) { // Modifier
    //require(points > 0);
    //require((userPoints[msg.sender]+points) <= 100);
    _;
  }
}
