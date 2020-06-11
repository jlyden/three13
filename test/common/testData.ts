import { Card, User, Suit } from '../../src/models';

// Users
export const userOne = new User(1, 'Alice');
export const userTwo = new User(2, 'Bert');
export const userThree = new User(3, 'Calvin');
export const userFour = new User(4, 'Dahlia');
export const userFive = new User(5, 'Edith');
export const userSix = new User(6, 'Fred');

// Cards
export const cardJ = new Card(Suit.Joker, 3);
export const cardC3 = new Card(Suit.Clubs, 3);
export const cardD3 = new Card(Suit.Diamonds, 3);
export const cardD4 = new Card(Suit.Diamonds, 4);
export const cardD5 = new Card(Suit.Diamonds, 5);
export const cardD6 = new Card(Suit.Diamonds, 6);
export const cardD13 = new Card(Suit.Diamonds, 13);
export const cardH3 = new Card(Suit.Hearts, 3);
export const cardH5 = new Card(Suit.Hearts, 5);
export const cardH10 = new Card(Suit.Hearts, 10);
export const cardH13 = new Card(Suit.Hearts, 13);
export const cardS3 = new Card(Suit.Spades, 3);
export const cardS4 = new Card(Suit.Spades, 4);
export const cardS5 = new Card(Suit.Spades, 5);
export const cardS6 = new Card(Suit.Spades, 6);
export const cardS8 = new Card(Suit.Spades, 8);
export const cardS9 = new Card(Suit.Spades, 9);
export const cardS10 = new Card(Suit.Spades, 10);
