## Vampire Game backend for Angie

This backend manages data about a Vampire game. 

Here's overview of the 3 API enpoints present:

`GET api/players/generate?n=5&v=2`

Generates unique IDs to use with QR codes.

`n` - number of players

`v` - _(optional)_ number of vampires

`GET api/players/:id`

Gets information about a players. If a players if a vampire, gets information about fellow vampires.

`PATCH api/players/:id`

Updates players name.

Body format: `{ name: "new name"}`
