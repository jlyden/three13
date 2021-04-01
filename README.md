# Three 13 Card Game

## Getting Started

### Prereqs

### Dev Setup
1. `git clone` 
2. `cd three13`
3. `npm install`

### Phase Two
* Multiple decks depending on round & # of players

## Expected Routes
* GET /games -> [get all user's games, indicate round - flag ones where it's user's turn]
* GET games/:id -> [get current cards for current round - userHand + visibleCard]
* POST /games/:id -> startRound()
* PUT /games/:id -> takeVisibleCard(), drawFromDeck(), discardAfterTurn(), endRound()

* GET/POST login/ -> display login page/login user
* GET/POST register/ -> display register page/register user (google auth only)


## References
https://auth0.com/blog/create-a-simple-and-stylish-node-express-app/
https://itnext.io/step-by-step-building-and-publishing-an-npm-typescript-package-44fe7164964c

https://dev.to/_gdelgado/type-safe-error-handling-in-typescript-1p4n

https://bezkoder.com/react-node-express-mysql/
https://bezkoder.com/node-js-rest-api-express-mysql/
https://reactjs.org/docs/thinking-in-react.html

https://tutorialedge.net/typescript/creating-rest-api-express-typescript/
https://tutorialedge.net/typescript/creating-rest-api-express-typescript/

https://www.serverless.com/blog/serverless-express-rest-api