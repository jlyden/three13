import _ from 'lodash';
import { Card, CardGroup, Suit } from '../models';
import {
  reduceCardsByValue,
  removeValueFromArray,
  sortValuesIntoRuns as sortCardValuesIntoRuns,
  transformRunArrayIntoCardGroup
} from '../utils';

export class Hand extends CardGroup {
  // A run or set must have at least 3 cards in it
  static MINIMUM_SET = 3;

  // For evaluating the hand at end of game
  // TODO: private/rewire
  public processedCards: CardGroup[];
  public longRuns: CardGroup[];

  constructor(cardsToAdd?: Card[]) {
    super(cardsToAdd);
    this.processedCards = [];
    this.longRuns = [];
  }

  /**
   * Sort cards into runs and sets, then calculate penalty
   * @param round - current round of game, for determining wilds
   */
  public evaluateHand(round: number) {
    const wildCardGroup = this.findWildCards(round);
    // If hand is all wild cards, move to processed. Done.
    if(wildCardGroup.length() === round) {
      this.moveGroupToGroupArray(wildCardGroup, this.processedCards);
    } else {
      this.processRunsFromHand(round);
      this.processSetsFromHand(round);
    }
    // TODO: calculate penalty based on what remains in hand - add extra wilds to any run/set
  }

  /**
   * Move valid runs from each suit out of hand
   * Leave spare cards in hand for set processing
   * @param round - current round of game, for determining wilds
   * TODO: private/rewire
   */
  public processRunsFromHand(round: number) {
    for (const suit of Object.values(Suit)) {
      if (suit === Suit.Joker) {
        continue;
      }
      const cardsOfSuit = this.findFilteredCards(suit);

      if (cardsOfSuit.length() >= Hand.MINIMUM_SET) {
        const sortedRuns = sortCardValuesIntoRuns(cardsOfSuit);
        this.removeValidRunsFromHand(round, sortedRuns, suit);
      }
    }
  }

  /**
   * @param matcher 'suit' or 'value' to be filtered by
   * @return CardGroup matching param
   * Does not remove cards from hand
   * TODO: private/rewire
   */
  public findFilteredCards(matcher: string | number): CardGroup {
    const matchingGroup = new CardGroup();
    if (typeof matcher === 'string') {
      matchingGroup.addMany(_.filter(this.getCards(), { suit: matcher }));
    } else if (typeof matcher === 'number') {
      matchingGroup.addMany(_.filter(this.getCards(), { value: matcher }));
      const jokersCaughtInValueFilter = _.filter(matchingGroup.getCards(), { suit: 'Joker' });
      try {
        matchingGroup.removeMany(jokersCaughtInValueFilter);
      } catch (error) {
        // Error here means there was no joker after all, so just swallow it
      }
    }
    return matchingGroup;
  }

  /**
   * @param round - current round of game, for determining wilds
   * @return CardGroup of Wild Cards
   * Does not remove cards from hand
   * TODO: private/rewire
   */
  public findWildCards(round: number): CardGroup {
    const wildsArray = this.findFilteredCards(Suit.Joker);
    wildsArray.addMany(this.findFilteredCards(round).getCards());
    return wildsArray;
  }

  /**
   * For all runs in suit,
   *  - add valid 3 card runs to processed cards
   *  - add valid 4+ card runs to long runs
   *  - attempt to supplement 1 or 2 card runs with wilds (and add to processed)
   *  - leave whatever remains in hand for later set processing
   *
   * @param suit to which all cards in runs belong
   * @param sortedRuns array of consecutive runs of integers
   * @param round current game round
   * TODO: private/rewire
   */
  public removeValidRunsFromHand(round: number, sortedRuns: number[][], suit: Suit) {
    sortedRuns.forEach((run) => {
      const group = transformRunArrayIntoCardGroup(run, suit);
      if (group.length() === Hand.MINIMUM_SET) {
        // If 3 card run, move to processed
        this.moveGroupToGroupArray(group, this.processedCards);
      } else if (group.length() > Hand.MINIMUM_SET) {
        // If 4+ card run, move to longRuns to help with sets later
        this.moveGroupToGroupArray(group, this.longRuns);
      } else {
        // If less than 3 card run, try make up difference from from wilds
        this.completeGroupWithWilds(group, round);
      }
      // If we can't make it up with wilds, leave cards in hand
      }
    );
  }

  /**
   * For all number sets left in hand,
   *  - move sets of 3+ cards to processed cards
   *  - look in longRuns for help for 1 or 2 card sets
   *  - use wilds for help if still needed
   * TODO: do we need to worry about Jokers in round 3 or 4?
   * TODO: private/rewire
   */
  public processSetsFromHand(round: number) {
    // Get values present in hand (excluding wild), sorted desc
    const valuesDescWithoutWilds = removeValueFromArray(this.getValuesFromHand(), round);

    // Loop through values, attempting to make sets of at least three cards
    for (const value of valuesDescWithoutWilds) {
      const cardsOfValue = this.findFilteredCards(value);

      // If there are already 3+ cards in a set, move to processed
      if (cardsOfValue.length() >= Hand.MINIMUM_SET){
        this.moveGroupToGroupArray(cardsOfValue, this.processedCards);
      } else {
        // Try make up missing cards from the end of a longRun
        let finished = this.completeSetWithLongRunsHelp(cardsOfValue, -1);

        // If still < 3 cards, try make up from the front of a longRun
        if (!finished) {
          finished = this.completeSetWithLongRunsHelp(cardsOfValue, 0);
        }
        // If still < 3 cards, try make up with wild cards
        if (!finished) {
          this.completeGroupWithWilds(cardsOfValue, round);
        }
        // If we can't make it up with wilds, leave cards in hand
      }
    }
  }

  /**
   * @return array of numerical values of cards in hand, i.e. [4, 7, 12]
   * TODO: private/rewire
   */
  public getValuesFromHand(): number[] {
    const cardsReducedArray = reduceCardsByValue(this.getCards());
    // NOTE: I don't think this array will have 0s in it. check
    const valuesArray = Object.keys(cardsReducedArray).map((v) => Number(v));
    valuesArray.sort((a, b) => {
      return b - a;
    });
    return valuesArray;
  }

  /**
   * LongRuns could lose a card from the end and still be a valid group
   * This method plucks matching extra cards to try complete a set
   * @param cardsOfValue cards from hand sharing a value
   * @param index -1 or 0, the final or first card in a longRun
   * @return true if the set was completed; false if not
   */
  public completeSetWithLongRunsHelp(cardsOfValue: CardGroup, index: number): boolean {
    // Determine the value that is sought
    const value = cardsOfValue.getCardAt(0).value;
    const longRunsLength = this.longRuns.length;

    // Loop through all longRuns already plucked from hand
    for (let i = 0; i < longRunsLength; i++) {
      const potentialMatch: Card = this.longRuns[i].getCardAt(index);
      // If edge card from longRun matches, move to value set
      if (potentialMatch.value === value) {
        this.longRuns[i].move(potentialMatch, cardsOfValue);

        // If that match completes the set, move set and stop looping
        if (cardsOfValue.length() === Hand.MINIMUM_SET) {
          this.moveGroupToGroupArray(cardsOfValue, this.processedCards);

          // If longRun is no longer 'long', move to processed cards
          if (this.longRuns[i].length() === Hand.MINIMUM_SET) {
            this.processedCards.push(_.pullAt(this.longRuns, i)[0]);
          }
          return true;
        }
      }
    }
    // If we got here, longRuns at index did not finish our set
    return false;
  }

  /**
   * 
   * @param group potential run or set with length < Hand.MINIMUM_SET
   * @param round - current round of game, for determining wilds
   */
  public completeGroupWithWilds(group: CardGroup, round: number) {
    const missingCardCount = Hand.MINIMUM_SET - group.length();
    const wildCards = this.findWildCards(round);

    // If there are enough wilds to complete the group, add them
    if (wildCards.length() >= missingCardCount) {
      do {
        group.add(wildCards.pop());
      } while (group.length() < Hand.MINIMUM_SET);

      // Add group with wilds to processed
      this.moveGroupToGroupArray(group, this.processedCards);
    }
    // If not, leave cards (including wilds) in hand
  }
}
