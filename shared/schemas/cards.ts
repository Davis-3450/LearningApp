export interface Flashcard {
  cardType: 'flashcard';
  data: {
    front: string;
    back: string;
  };
}
