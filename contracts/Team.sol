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
  mapping (bytes32 => bool) private invitationTokens;

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
  function createInvitationToken() public 
    // isAMember(msg.sender) TODO: Uncomment this line as soon as we have the create team epic.
    returns (bytes32 token) 
  {
    token = generateToken(msg.sender);
    invitationTokens[token] = true;
    return token;
  }


  function sendJoinTeamRequest(bytes32 token, bytes32 name) public 
    isNotAMember(msg.sender)
    isNotAPendingMember(msg.sender)
    isValidInvitationToken(token)
  {

    invitationTokens[token] = false;

    pendingMembers[msg.sender].account = msg.sender;
    pendingMembers[msg.sender].name = name;
    pendingMemberAddresses.push(msg.sender) - 1;
  }

  //********* Getter ***********//
  //-------------------------------------------//
  function getInvitationToken() public constant
    // isAMember(msg.sender) TODO: Uncomment this line as soon as we have the create team epic.
    returns (bytes32 token) 
  {
    token = generateToken(msg.sender);
    require(invitationTokens[token] == true);
    
    return token;
  }

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

  modifier isAMember(address account) {
    require(members[account].account == account);
    _;
  }

  modifier isNotAMember(address account) {
    require(members[account].account != account);
    _;
  }

  modifier isValidInvitationToken(bytes32 token) {
    require(invitationTokens[token] == true);
    _;
  }


  //***************** INTERNAL ****************//
  //-------------------------------------------//

  function generateToken(address sender) private pure returns (bytes32 token) {
    return sha256(sender);
  }

}
