## epic 'location'

### list locations #kiss
Acceptance criteria:
* anyone can list all previously added location

## epic 'vote'

### submit vote #kiss (from sprint 02)
Acceptance criteria:
* anyone can submit a voting to a smart contract
* a voting comprises a list of location preferences
* a location preference is at least: location URI and 1..100 preference points
* a voting is valid iff all location URIs can be resolved and the sum of all preference points equals 100
* if a voting is invalid it is rejected, otherwise it is stored with the smart contract

hint: a voting will be submitted only once, update likely not required in the future (bc. hidden votings with hash in future)

hint: no optimization for gas

non-goals: user authentication, only one vote per user

### submit vote #app

Acceptance criteria:
* ui to select an existing location and assign preference points
* ui to add a new location and assign preference points; instantly adds location to smart contract
* ui guides user into creating a valid voting
* ui offers to submit a valid voting (only) to smart contract
* ui made with love and optimized for display on small mobile devices

non-goals: only one vote per user