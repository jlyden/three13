import _ from 'lodash';
import { Card } from '../models';

export function transformRunArrayIntoCardArray(runArray: number[], suit: string): Card[] {
  const cardArray: Card[] = [];
  runArray.forEach((value) => {
    cardArray.push(new Card(suit, value));
  });
  return cardArray;
}

/**
 *
 * @param singleSuitCards length >= 3 b/c a run must have at least 3 cards in it
 * @returns array of arrays of consecutive values, i.e. [[4,5], [7,8,9] [12]]
 * Ref: http://stackoverflow.com/questions/7352684/how-to-find-the-groups-of-consecutive-elements-from-an-array-in-numpy
 */
export function sortValuesIntoRuns(singleSuitCards: Card[]) {
  // Pull out values of this suit and sort them
  const valuesArray = singleSuitCards.map((a) => a.value);
  valuesArray.sort((a, b) => a - b);

  let run: number[] = [];
  const sortedRuns = [run];
  let expect = 0;

  valuesArray.forEach((value) => {
    if (value === expect || expect === 0) {
      run.push(value);
    } else {
      run = [value];
      sortedRuns.push(run);
    }
    expect = value + 1;
  });

  return sortedRuns;
}

export function reduceCardsByValue(cards: Card[]) {
  const reducedValues: { [key: string]: number } = cards.reduce((tally: { [key: string]: number }, card: Card) => {
    tally[card.value] = tally[card.value] + 1 || 1;
    return tally;
  }, {});

  return reducedValues;
}

export function removeValueFromArray(anArray: number[], value: number) {
  const removedValue = _.pull(anArray, value);
  return anArray;
}
