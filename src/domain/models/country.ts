declare global {
  export type State = {
    id: string; // abbreviation in API
    name?: string;
  };

  export type Country = {
    id: string; // abbreviation in API
    name?: string;
  };

  export type CountryWithStates = Country & {
    states: State[];
  };
}
