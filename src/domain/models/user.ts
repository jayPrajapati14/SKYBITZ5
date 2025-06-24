declare global {
  interface User {
    id: number;
    username: string;
    email: string;
    type: string;
    customerId: number;
    firstName: string;
    lastName: string;
    timezone: string;
  }
}
