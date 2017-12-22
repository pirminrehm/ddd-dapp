pragma solidity 0.4.18;

import "./Location.sol";
import "./Voting.sol";


contract Team {

  struct MemberStruct {
    address account;
    bytes32 name;
    uint avatarId;
    bytes32 invitationToken;
  }

  //*************** Public Vars ***************//
  //-------------------------------------------//
  bytes32 public teamName;

  //************** Private Vars ***************//
  //-------------------------------------------//
  address private locationAddress;
  address[] private votingAddresses;
 
  mapping (bytes32 => bool) private invitationTokens;

  address[] private memberAddresses;
  mapping (address => MemberStruct) private memberStructs;

  address[] private pendingMemberAddresses;
  mapping (address => MemberStruct) private pendingMemberStructs;

  //***************** Events ******************//
  //-------------------------------------------//

  event TokenCreated(bytes32 token);
  event NewJoinRequest(address user);
  event VotingCreated(address votingAddress);

  //************** Constructor ****************//
  //-------------------------------------------//
  function Team (bytes32 _name, bytes32 creatorName, uint creatorAvatarId) public {
    teamName = _name;
    memberStructs[msg.sender].account = msg.sender;
    memberStructs[msg.sender].name = creatorName;
    memberStructs[msg.sender].avatarId = creatorAvatarId;
    memberAddresses.push(msg.sender);
    locationAddress = new Location(address(this));
  }

  //************** Transactions ***************//
  //-------------------------------------------//
  function createInvitationToken() public 
    isAMember(msg.sender)
    returns (bytes32 token) 
  {
    token = generateToken();
    invitationTokens[token] = true;
    TokenCreated(token);
    return token;
  }

  function sendJoinTeamRequest(bytes32 token, bytes32 memberName, uint avatarId) public 
    isNotAMember(msg.sender)
    isNotAPendingMember(msg.sender)
    isValidInvitationToken(token)
  {

    invitationTokens[token] = false;

    pendingMemberStructs[msg.sender].account = msg.sender;
    pendingMemberStructs[msg.sender].name = memberName;
    pendingMemberStructs[msg.sender].invitationToken = token;
    pendingMemberStructs[msg.sender].avatarId = avatarId;
    pendingMemberAddresses.push(msg.sender);
    NewJoinRequest(msg.sender);
  }

  function acceptPendingMember(address pendingMemberAccount) public 
    isAMember(msg.sender)
    isNotAPendingMember(msg.sender)
    isAPendingMember(pendingMemberAccount)
    returns (bytes32 memberName) 
  {
    memberAddresses.push(pendingMemberAccount);
    memberStructs[pendingMemberAccount] = pendingMemberStructs[pendingMemberAccount];
    removePendingMember(pendingMemberAccount);
    return memberStructs[pendingMemberAccount].name;
  }

  function addVoting(bytes32 votingName) public 
    isAMember(msg.sender)
  {
    address votingAddress = new Voting(votingName);
    votingAddresses.push(votingAddress);
    VotingCreated(votingAddress);
  }

  function closeVotingStochastic(address votingAddress) public
    isAMember(msg.sender)
  {
    Voting voting = Voting(votingAddress);
    voting.closeVotingStochastic();
    removeVoting(votingAddress);
  }
  //**************** Getter *******************//
  //-------------------------------------------//
  function getTeamName() public constant returns (bytes32 votingName) {
    return teamName;
  }
  
  function getMembersCount() public constant returns (uint memberCount) {
    return memberAddresses.length;
  }  
  
  function getPendingMembersCount() public constant returns (uint pendingMembersCount) {
    return pendingMemberAddresses.length;
  }

  function getMemberByIndex(uint index) public constant
    returns (address account, bytes32 name, uint avatarId)
  {
    MemberStruct storage m = memberStructs[memberAddresses[index]];
    return (m.account, m.name, m.avatarId);
  }

  function getMemberByAddress(address adr) public constant
    returns (address account, bytes32 name, uint avatarId)
  {
    MemberStruct storage m = memberStructs[adr];
    return (m.account, m.name, m.avatarId);
  }

  function getPendingMemberByIndex(uint index) public constant
    returns (address account, bytes32 name, uint avatarId, bytes32 invitationToken)
  {
    MemberStruct storage m = pendingMemberStructs[pendingMemberAddresses[index]];
    return (m.account, m.name, m.avatarId, m.invitationToken);
  }

  function getPendingMemberByAddress(address adr) public constant
    returns (address account, bytes32 name, uint avatarId, bytes32 invitationToken)
  {
    MemberStruct storage m = pendingMemberStructs[adr];
    return (m.account, m.name, m.avatarId, m.invitationToken);
  }

  function checkMemberByAddress(address addr) public constant returns (bool isMember) {
    return memberStructs[addr].account == addr;
  }

  function getLocationAddress() public constant returns (address locationAddr) {
    return locationAddress;
  }

  function getVotingsCount() public constant returns (uint memberCount) {
    return votingAddresses.length;
  }  
  
  function getVotingByIndex(uint index) public constant returns (address votingAddress) {
    return votingAddresses[index];
  }

  //***************** Modifier ****************//
  //-------------------------------------------//
  modifier isAPendingMember(address account) {
    require(pendingMemberStructs[account].account == account);
    _;
  }

  modifier isNotAPendingMember(address account) {
    require(pendingMemberStructs[account].account != account);
    _;
  }

  modifier isAMember(address account) {
    require(memberStructs[account].account == account);
    _;
  }

  modifier isNotAMember(address account) {
    require(memberStructs[account].account != account);
    _;
  }

  modifier isValidInvitationToken(bytes32 token) {
    require(invitationTokens[token] == true);
    _;
  }

  //***************** INTERNAL ****************//
  //-------------------------------------------//
  function generateToken() private view returns (bytes32 token) {
    return keccak256(block.blockhash(block.number-1));
  }
  
  //TODO: Refactor and add check for success
  function removePendingMember(address addressToRemove) private {
    uint index = 0;
    bool success = false;

    for (uint j = index; j < pendingMemberAddresses.length-1; j++) {
      if (pendingMemberAddresses[j] == addressToRemove) {
        success = true;
        index = i;
      }
    }
    //move elements to the gap and delete the last (void) element
    for (uint i = index; i < pendingMemberAddresses.length-1; i++) {
      pendingMemberAddresses[i] = pendingMemberAddresses[i+1];
    }
    delete pendingMemberAddresses[pendingMemberAddresses.length-1];
    pendingMemberAddresses.length--;

    //delte struct
    delete pendingMemberStructs[addressToRemove];
  }

  function removeVoting(address addressToRemove) private {
    uint index = 0;
    bool success = false;

    for (uint j = index; j < votingAddresses.length-1; j++) {
      if (votingAddresses[j] == addressToRemove) {
        success = true;
        index = i;
      }
    }
    if (success) {
      //move elements to the gap and delete the last (void) element
      for (uint i = index; i < votingAddresses.length-1; i++) {
        votingAddresses[i] = votingAddresses[i+1];
      }
      delete votingAddresses[votingAddresses.length-1];
      votingAddresses.length--;
    }
  }
}