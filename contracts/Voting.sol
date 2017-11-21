pragma solidity 0.4.18;


contract Voting {

  bytes32 public name;
  
  struct VotesByUser {
    bytes32[] voteList; // list of vote keys so we can look them up
    mapping(bytes32 => uint8) voteStructs; 

  }

  address private users[];
  mapping (address => VotesByUser) private userStructs;

  function Voting (bytes32 _name) public {
    name = _name
  }

  function addVote (bytes32 locationURI, uint8 points) public returns(bool success) {
    //missing: check for maximum 100 points
    //missing: check for allowed users
    if (!userStructs[msg.sender].isValue) {
      users.push(msg.sender)
    }
    voteLength = userStructs[msg.sender].voteStructs[locationURI] = points
  }


}
