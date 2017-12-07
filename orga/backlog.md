
## epic 'close voting'

### close voting #kiss (from sprint 02)
Acceptance criteria:
* anyone can trigger the smart contract to close the voting
* the smart contract determines the total preference points per location from all submitted votes
* locations are ordered in a defined way and ranges are computed
* a random number (1..sum(preference points)) is derived from the current ether block hash
* the winning location is determined (via random number and ranges) and stored in smart contract

note: all exising votes need to be discarded in the future

non-goals: tamper proof random number generation, multiples concurrent votings

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

### join team #poc
* review & refine process above
* poc to create key pair, sign some data on client and verify signature by smart contract 
