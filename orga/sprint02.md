## epic 'location'

### add location #kiss
Acceptance criteria:
* anyone can add location to a smart contract
* a location comprises a URI and a display name

## epic 'vote'

### submit vote #kiss
Acceptance criteria:
* anyone can submit a voting to a smart contract
* a voting comprises a list of location preferences
* a location preference is at least: location URI and 1..100 preference points
* a voting is valid iff all location URIs can be resolved and the sum of all preference points equals 100
* if a voting is invalid it is rejected, otherwise it is stored with the smart contract

non-goals: user authentication, only one vote per user

## epic 'close voting'

### close voting #kiss
Acceptance criteria:
* anyone can trigger the smart contract to close the voting
* the smart contract determines the total preference points per location from all submitted votes
* locations are ordered in a defined way and ranges are computed
* a random number (1..sum(preference points)) is derived from the current ether block hash
* the winning location is determined (via random number and ranges) and stored in smart contract

note: all exising votes need to be discarded in the future

non-goals: tamper proof random number generation, multiples concurrent votings

## further reading:
in preparation of a discussion on secure random number generation in a smart contract:
https://ethereum.stackexchange.com/questions/191/how-can-i-securely-generate-a-random-number-in-my-smart-contract