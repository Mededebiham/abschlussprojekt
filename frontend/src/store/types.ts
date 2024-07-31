// types.ts
export interface User {
  firstName: string;
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
  id: number | null;
  confirmedByAdmin: boolean;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Optional since not always used
  phoneNumber?: string; // Optional
  role?: string; // Optional
  birthdate?: Date; // Optional if not in the Java entity
  address: Address;
  bankAccounts: BankAccount[];
}
export interface Address {
  id: number; // Assuming Address has an ID
  street: string;
  streetNumber: string;
  city: string;
  zipCode: string;
  country: string;
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
  id:number | null;
  iban: string;
  accountNumber: string;
  bankId: string;
  user: UserForBankAccount;
  balance: number;
  accountType:string;
  confirmedByAdmin:boolean;
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
