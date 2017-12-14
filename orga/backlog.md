
## epic 'team'

process (not to be implemented at this point): 
* anyone can create a new team
* a team comprise the team URI and list of URIs of team members 
* any existing team member can invite new members to the team
* the invitation comprises an invitation URI, team URI and inviting member URI
* anyone who has received an invitation will generate a key pair and submit a 'join team' request
* a 'join team' request comprises the invitation URI, the joiner's public key, display name and member URI (signed by joiner)
* any existing member of the team can approve the joiner by signing that the display name represents the joiner for a given invitation URI
* team of less than 4 existing members: joiner becomes member once all existing members approve
* team of 4 or more existing members: joiner becomes member once majority of existing members approve  

TODO rework

### close voting #media night
* additional function which closes by majority vote


## epic 'media night'
* create business presentation
* create techie presentation
* build monitoring dashboard
* organize private network (via router) and test the use case with multiple devices


## epic 'team'

### create team
* UI to select a name, the creator`s name, (an avatar)
* save these values within the contract

### create invite
* generate a qr code out of the token and contract address
* UI to select a name, the members`s name, (an avatar)
* save invitation id (token) in contract

### accept invite
* scan QR code
* submit 'join team' request to team contract
* the joiner becomes an unapproved team member
* trigger event to notify the approved members

### approve invite
* UI displays the name and the invitation id (token)
* anyone can approve a 'join team' request
* the approved joiner becomes team member

### Others
* Possibility to chooce one of the test account addresses.

## epic 'vote'

### user interface
* usable interface to spread the 100 points
* user can vote to any location of the location contract
#