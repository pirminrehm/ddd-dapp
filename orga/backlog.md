
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
