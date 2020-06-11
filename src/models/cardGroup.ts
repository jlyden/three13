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

  /**
   * Returns card at index, but does not remove it from group
   * @param index position of card to return
   */
  public getCardAt(index: number): Card {
    return this.group[index];
  }

  /** 
   * Returns card group so we can work with it
   * Does not remove cards from group 
   */
  public getCards(): Card[] {
    return this.group;
  }

  public length(): number {
    return this.group.length;
  }

  /** 
   * Returns last card in group
   */
  public pop() {
    return this.group.pop();
  }

  /** 
   * Adds specified card to group
   */
  public add(card: Card) {
    this.group.push(card);
  }

  /** 
   * Adds array of Cards to group
   */
  public addMany(cards: Card[]) {
    cards.forEach((card) => {
      this.add(card);
    })
  }

  /**
   * Wrapper for lodash findIndex
   * @param card to find in group
   */
  private cardPositionInGroup(card: Card): number {
    return _.findIndex(this.group, {
      suit: card.suit,
      value: card.value,
    });
  }

  /**
   * Loop through array, and if one isn't in group, return false
   * @param cards array of Cards
   */
  private allCardsInGroup(cards: Card[]): boolean {
    let allInGroup = true;
    for (const card of cards) {
      if(this.cardPositionInGroup(card) === -1) {
        allInGroup = false;
        break;
      }
    }
    return allInGroup;
  }

  /** 
   * Removes specified card from group and returns it
   * @param Card to remove
   * @throws error if card is not in the group
   */
  public remove(card: Card) {
    const cardIndex = this.cardPositionInGroup(card);
    // If card is in hand, remove and return it
    if (cardIndex !== -1) {
      return _.pullAt(this.group, [cardIndex])[0];
    } else {
      throw new Error(`Remove Error: ${card.toString()} not in group.`);
    }
  }

  // TODO: Make sure all methods using methods below catch error
  /**
   * Removes array of cards from group
   * 
   * @param cards array of Cards to remove 
   * @throws error if card is not in the group
   */
  public removeMany(cards: Card[]) {
    // First confirm all cards are in group, then continue
    if(this.allCardsInGroup(cards)) {
      for (const card of cards) {
        this.remove(card);
      }
    } else {
      throw new Error('One card to remove is not in group')
    }
  }

  /**
   * Moves card from its current group to target cardGroup
   * @param card 
   * @param target 
   * @throws error if card is not in the soure group
   */
  public move(card: Card, target: CardGroup) {
    try {
      this.remove(card);
      target.add(card);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Moves all the cards (individually) from a group to a target group
   * @param group 
   * @param target 
   * @throws error if card is not in the source group
   */
  public moveGroup(group: CardGroup, target: CardGroup) {
    const cards = group.getCards();
    try {
      this.removeMany(cards);
      target.addMany(cards);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Moves a cardGroup (as group) to an array of cardGroups
   * @param group 
   * @param target 
   * @throws error if card is not in the source group
   */
  public moveGroupToGroupArray(group: CardGroup, target: CardGroup[]) {
    const cards = group.getCards();
    try {
      this.removeMany(cards);
      target.push(group);
    } catch (error) {
      throw error;
    }
  }
}