pragma solidity 0.4.18;


contract Team {

 struct MemberStruct {
    address account;
    bytes32 name;
  }

  //*************** Public Vars ***************//
  //-------------------------------------------//
  bytes32 public name;

  //************** Private Vars ***************//
  //-------------------------------------------//  
  address[] private memberAddresses;
  mapping (address => MemberStruct) private members;

  address[] private pendingMemberAddresses;
  mapping (address => MemberStruct) private pendingMembers;

  //************** Constructor ****************//
  //-------------------------------------------//
  function Team (bytes32 _name) public {
    name = _name;
  }

  //************** Transactions ***************//
  //-------------------------------------------//
  function sendJoinTeamRequest(bytes32 name) public 
    isNotAMember(msg.sender)
    isNotAPendingMember(msg.sender) 
    {

    pendingMembers[msg.sender].account = msg.sender;
    pendingMembers[msg.sender].name = name;
    pendingMemberAddresses.push(msg.sender) - 1;
  }

  //********* Getter ***********//
  //-------------------------------------------//
  function getMembersCount() public constant returns (uint memberCount) {
    return memberAddresses.length;
  }  
  
  function getPendingMembersCount() public constant returns (uint pendingMembersCount) {
    return pendingMemberAddresses.length;
  }


  //***************** Modifier ****************//
  //-------------------------------------------//
  modifier isNotAPendingMember(address account) {
    require(pendingMembers[account].account != account);
    _;
  }

  modifier isNotAMember(address account) {
    require(members[account].account != account);
    _;
  }
}
