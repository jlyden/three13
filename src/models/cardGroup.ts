import _ from 'lodash';

import { Card } from '../models';

export class CardGroup {
  protected group: Card[];

  constructor(cardsToAdd?: Card[]) {
    if (cardsToAdd) {
      this.group = cardsToAdd;
    } else {
      this.group = [];
    }
  }

  public toString() {
    let stringGroup = '[';
    if (this.length() > 0) {
      for (const card of this.group) {
        stringGroup += `${card.toString()}, `;
      }
      // Trim trailing comma after last card
      stringGroup = stringGroup.substring(0, stringGroup.length - 2);
    }
    stringGroup += ']';
    return stringGroup;
  }

  public getCardAt(index:number ): Card {
    return this.group[index];
  }
  
  public getCards(): Card[] {
    return this.group;
  }

  public length(): number {
    return this.group.length;
  }

  public pop() {
    return this.group.pop();
  }

  public add(card: Card) {
    this.group.push(card);
  }

  public addMany(cards: Card[]) {
    cards.forEach((card) => {
      this.add(card);
    })
  }

  public remove(card: Card) {
    const cardIndex = _.findIndex(this.group, {
      suit: card.suit,
      value: card.value,
    });

    // If card is in hand, remove and return it
    if (cardIndex !== -1) {
      return _.pullAt(this.group, [cardIndex])[0];
    } else {
      throw new Error(`Remove Error: ${card.toString()} not in group.`);
    }
  }

  public removeMany(cards: Card[]){
    for (const card of cards) {
      this.remove(card);
    }
  }

  public move(card: Card, target: CardGroup) {
    try {
      this.remove(card);
      target.add(card);
    } catch (error) {
      throw Error(error.message);
    }
  }

  public moveGroup(group: CardGroup, target: CardGroup) {
    const cards = group.getCards();
    try {
      this.removeMany(cards);
      target.addMany(cards);
    } catch (error) {
      throw Error(error.message);
    }
  }

  public moveGroupToGroupArray(group: CardGroup, target: CardGroup[]) {
    const cards = group.getCards();
    try {
      this.removeMany(cards);
      target.push(group);
    } catch (error) {
      throw Error(error.message);
    }
  }
}