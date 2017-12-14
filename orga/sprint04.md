
## epic 'close voting'

### close voting #kiss (from sprint 02)
Acceptance criteria:
* anyone can trigger the smart contract to close the voting
* the smart contract determines the total preference points per location from all submitted votes
* locations are ordered in a defined way and ranges are computed
* a random number (1..sum(preference points)) is derived from the current ether block hash
* the winning location is determined (via random number and ranges) and stored in smart contract
* trigger button in UI

non-goals: tamper proof random number generation

## epic 'team'

### create invite
* the invitation comprises an invitation URI, team URI
* UI displays invation

### accept invite
* can paste invitation into UI
* submit 'join team' request to team contract
* the joiner becomes an unapproved team member

### approve invite
* anyone can approve a 'join team' request
* the approved joiner becomes team member

### research task
* how to authenticate with ethereum account

### backlog grooming
* create blueprint for media night demo