// types.ts
export interface User {
  username: string;
  id: string;
  role: string;
  confirmedByAdmin:boolean;
  // Add more user-related fields as needed
}
export interface RegistRequest{
  id:string;
  date:Date;
  user:User1;
  isApproved:boolean;
}
export interface User1 {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  confirmedByAdmin: boolean;
  role: string;
  address: Address;
  bankAccount: BankAccount;
}
export interface Address {
  id: number;
  street: string;
  streetNumber: string;
  city: string;
  zipCode: string;
  country: string;
}
export interface LoginState {
  isLoggedIn: boolean;
  user: User | null;
}
export interface BankAPI {
  iban: string;
  accountNumber: string;
  bankId: string;
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
  id:string;
  iban: string;
  accountNumber: string;
  bankId: string;
  user: UserForBankAccount;
  balance: number;
  accountType:string;
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
