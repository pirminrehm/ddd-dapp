pragma solidity 0.4.18;


contract Voting {

  //*************** Public Vars ***************//
  //-------------------------------------------//
  bytes32 public name;
  bool public votingIsClosed = false;
  bytes32 public winningLocation;

  //**************/*** Events *****************//
  //-------------------------------------------//

  event VotingClosed(bytes32 winningLocation, uint random, uint sumOfAllPoints);

  //************** Private Vars ***************//
  //-------------------------------------------//  
  address[] private votingUsers;
  mapping (address => uint) private userPoints;

  bytes32[] private votedLocations;
  mapping (bytes32 => uint) private locationPoints;

  //************** Constructor ****************//
  //-------------------------------------------//
  function Voting (bytes32 _name) public {
    name = _name;
  }

  //************** Transactions ***************//
  //-------------------------------------------//
  function addVote (bytes32 locationURI, uint points) public 
    //missing: check for allowed votingUsers
    //missing: check if location is valide
    votingIsNotClosed()
    hasValidePoints(points)
    willNotExceed100Points(points) {

    //init user, if first vote of user
    if (userPoints[msg.sender] == 0) {
      votingUsers.push(msg.sender);
      userPoints[msg.sender] = 0;
    }
    userPoints[msg.sender] += points;

    //init location, if first vote for location
    if (locationPoints[locationURI] == 0) {
      votedLocations.push(locationURI);
      locationPoints[locationURI] = 0;
    }
    locationPoints[locationURI] += points;
  }

  function closeVotingStochastic () public 
    //missing: check for allowed votingUsers
    votingIsNotClosed() {
    votingIsClosed = true;

    uint sumOfAllPoints = 0;
    for (uint i = 0; i < votedLocations.length; i++) {
      sumOfAllPoints += locationPoints[votedLocations[i]];
    }

    uint random = uint(block.blockhash(block.number-1))%sumOfAllPoints + 1;

    uint sumOfPointsUntilWinner = 0;
    for (uint j = 0; j < votedLocations.length; j++) {
      sumOfPointsUntilWinner += locationPoints[votedLocations[j]];
      if (sumOfPointsUntilWinner >= random) {
        winningLocation = votedLocations[j];
        VotingClosed(winningLocation, random, sumOfAllPoints);
        break;
      }
    }
  }

  //********* LocationPoints Getter ***********//
  //-------------------------------------------//
  function getLocationPointsByIndex(uint index) public constant returns (bytes32 uri, uint points) {
    return (votedLocations[index], locationPoints[votedLocations[index]]);
  }

  function getLocationPointsByURI(bytes32 _uri) public constant returns (bytes32 uri, uint points) {
    return (_uri, locationPoints[_uri]);
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

  //************* Other Getter **************//
  //-------------------------------------------//
  function getVotingName() public constant returns (bytes32 votingName) {
    return name;
  }

  function getWinningLocation() public constant returns (bytes32 winningLocationUri) {
    return winningLocation;
  }

  //***************** Modifier ****************//
  //-------------------------------------------//
  modifier hasValidePoints(uint points) {
    //if points == 0 -> check for fist invocation not possible + stupid call
    //if points are too big overlaod is possible -> negative even if uint
    require(points > 0 && points <= 100);
    _;
  }

  modifier willNotExceed100Points(uint points) {
    require((userPoints[msg.sender]+points) <= 100);
    _;
  }

  modifier votingIsNotClosed() {
    require(!votingIsClosed);
    _;
  }
}