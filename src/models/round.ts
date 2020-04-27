import { Deck } from "./index";

export class Round {





  public start() {
    const deck = new Deck();
    deck.shuffle();


    // shuffle(), deal()
    // prompt user_one to draw and discard
   
  }



  public end() {
    // if(turn), user can go_out() (includes discard action)
    // validate user's hand - if invalid, round continues
    // if valid, update user's score & clear user's hand
    // set end_of_round = true: all other users get only one more turn
       // after each discard(), evaluate each of their hands and calculate score
  // after last user has discarded, start next round 
   }

   private deal() {

  }

}