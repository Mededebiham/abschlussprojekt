// types.ts
export interface User {
  username: string;
  id: string;
  role: string;
  // Add more user-related fields as needed
}
export interface LoginState {
  isLoggedIn: boolean;
  user: User | null;
}
export interface RootState {
  isLoggedIn: boolean;
  user: User | null;
}
export interface UserTable {
  firstName: string;
  lastName: string;
  email: string;
  birthdate: Date;
  address: {
    street: string;
    streetNumber: string;
    city: string;
    zipCode: string;
    country: string;
  };
}
export interface UserForBankAccount {
  firstName: string;
  lastName: string;
  email: string;
  password: User;
  phoneNumber: number;
  role: string;

}
export interface BankAccount {
  iban: string;
  accountNumber: string;
  bankId: string;
  user: UserForBankAccount;
  balance: number;
}

export interface Transfer {
  id: number | null;
  recipient: BankAccount | null;
  sender: BankAccount | null;
  date: Date;
  reasonOfTransfer: string;
  sum: number;
  authorized: boolean;
}
