declare global {
  export type LocationEntity = {
    id: string;
    name: string;
    country: string;
    state?: string;
    zipCode: string;
    latitude: number;
    longitude: number;
    type: string;
  };
}
