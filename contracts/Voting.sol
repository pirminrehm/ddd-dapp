pragma solidity 0.4.18;


contract Voting {

  bytes32 public name;
  
  address[] private users;
  mapping (address => uint) private userPoints;

  bytes32[] private locations;
  mapping (bytes32 => uint) private locationPoints;

  // function Voting (bytes32 _name) public {
  //   name = _name;
  // }
  function Voting() public {
    //constructor
  }

  //missing: check for allowed users
  function addVote (bytes32 locationURI, uint points) 
  public willNotExceed100Points(points) returns(bool success) {

    //init user, if first invocation
    if (userPoints[msg.sender] == 0) {
      users.push(msg.sender);
    }

    userPoints[msg.sender] += points;
    locationPoints[locationURI] += points;

    return true;
  }

  modifier willNotExceed100Points(uint points) { // Modifier
    require(points > 0);
    require((userPoints[msg.sender]+points) <= 100);
    _;
  }
}
