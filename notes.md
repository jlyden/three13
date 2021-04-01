# 313 Card Game
* run as a sls rest api
* backed by an aws aurora mysql db

# TODO
* on Step 2 of https://www.serverless.com/blog/node-rest-api-with-serverless-lambda-and-dynamodb

# Functions
* Create User
* Create Game
  * with Users
  * set activeUser
  * Create Round
    * Create Deck
    * Deal (Create Hands)
    * Return roundView
      * with activeUser
      * Deck / visibleCard
      * thisUser Hand
      * otherUser Hands (count)
* Create Move
  * Update activeUser Hand
  * Update Deck / visibleCard
  * Return roundView
* Get Game (State)
  * Return roundView
* Get Games
  * Return list
* Get Users
  * Return list

# Endpoints
POST User
POST Game
POST Move
GET Game
GET Games
GET Users


# Resources
https://www.serverless.com/blog/node-rest-api-with-serverless-lambda-and-dynamodb
https://github.com/serverless/examples/tree/master/aws-node-rest-api-with-dynamodb
https://github.com/jlyden/three13/blob/develop/src/php/Notes-LAMP.txt