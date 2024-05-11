export type Gapword = {
  key: number;
  sublist: Set<string>;
  headwords: string[];
  related_word_forms: string[];
};

export type Model = {
  text: string;
  map: Map<number, Gapword>;
  selected: number[];
};
