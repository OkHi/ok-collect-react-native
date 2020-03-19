export interface User {
  firstName?: string;
  lastName?: string;
  phone: string;
}

export interface Store {
  user: User | null;
  addresses: [];
  setUser: (user: User) => Promise<any>;
  [key: string]: any;
}
