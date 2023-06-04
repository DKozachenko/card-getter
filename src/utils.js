export function getRussianSuit(engSuit) {
  switch (engSuit) {
    case 'DIAMONDS':
      return 'БУБИ';
    case 'SPADES':
      return 'ПИКИ';
    case 'HEARTS':
      return 'ЧЕРВИ';
    case 'CLUBS':
      return 'КРЕСТИ';
    default: 
      return 'UNKNOWN';
  }
}

export function getRussianValue(engValue) {
  switch (engValue) {
    case 'ACE':
      return 'ТУЗ';
    case 'QUEEN':
      return 'КОРОЛЕВА';
    case 'KING':
      return 'КОРОЛЬ';
    case 'JACK':
      return 'ВАЛЕТ';
    default: 
      return engValue;
  }
}