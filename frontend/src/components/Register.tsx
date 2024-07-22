import React, { useState, useEffect } from 'react';
import axios from "axios";
import {User} from "../store/types";
import Cookies from "js-cookie";
import { login, LoginAction  } from '../store/reducers';
import {useNavigate} from "react-router-dom";

interface RegisterFormProps {
  onSubmit?: (formData: createUser) => void;
}

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: {
    street: string;
    streetNumber: string;
    city: string;
    zipCode: string;
    country: string;
  };
}
interface createUser {
  userDto : RegisterFormData;
  balance: number;
  accountType: string;
}

const Register: React.FC<RegisterFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: {
      street: '',
      streetNumber: '',
      city: '',
      zipCode: '',
      country: '',
    },
  });
  const [balance,setBalance]=useState(0);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isPasswordsMatch, setIsPasswordsMatch] = useState(true);
  const [errorApi, setErrorApi] = useState('');
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleBalanceChange = (e:  React.ChangeEvent<HTMLInputElement>) => {
    setBalance(Number(e.target.value));
  };


  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [name]: value,
      },
    });
  };

  const handleChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value } = e.target;
    setConfirmPassword(value);
  };
  const handleAccountTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAccountType(e.target.value);
  };

  useEffect(() => {
    const isPasswordsMatching = formData.password === confirmPassword;
    setIsPasswordsMatch(isPasswordsMatching);
  }, [formData.password, confirmPassword]);

  useEffect(() => {
    const { firstName, lastName, email, password, phoneNumber } = formData;
    const { street, streetNumber, city, zipCode, country } = formData.address;
    const isAnyFieldEmpty =
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phoneNumber ||
      !street ||
      !streetNumber ||
      !city ||
      !zipCode ||
      !country ||
        !accountType;

    setIsButtonDisabled(isAnyFieldEmpty || !isPasswordsMatch);
  }, [formData, isPasswordsMatch,accountType]);

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
     const registerUserForm={userDto:formData, balance:balance,accountType: accountType}
    try {
      const response = await axios.post('http://localhost:8088/users', registerUserForm, {

      });
      console.log(response.data); // Handle response from backend
      // Destructure the response outside the axios method
      const { firstName, id, role,confirmedByAdmin } = response.data; // Assuming response.data contains user data

      // Create a User object
      const user: User =
          { username: firstName, id, role,confirmedByAdmin };

      // Dispatch the login action with user data
      Cookies.set('isloggedin', 'true');
      Cookies.set('user', JSON.stringify(user));
      login(user);

      // Dispatch login success action with the user data
      //loginSuccess(user);
      navigate("/");
    } catch (error) {
      console.error('Error creating user:', error);
      setErrorApi('Failed to register. Please try again later.');
    }
  };


  return (
    <div className="w-full max-w-xs bg-transparent">
      <form onSubmit={handleSubmit} className="bg-white bg-opacity-25 shadow-md rounded px-8 pt-6 pb-8 ">
        <input type="text" name="firstName" placeholder="Vorname" value={formData.firstName} onChange={handleChange}
               className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        <input type="text" name="lastName" placeholder="Nachname" value={formData.lastName} onChange={handleChange}
               className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>

        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange}
               className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>

        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange}
               className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>

        <input
            type="password"
            name="confirmPassword"
            placeholder="Pasword wiederholen"
            value={confirmPassword}
            onChange={handleChangeConfirmPassword}
            className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        <input
            type="tel"
            name="phoneNumber"
            placeholder="Telefonnummer"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        <input
            type="text"
            name="street"
            placeholder="Straße"
            value={formData.address.street}
            onChange={handleAddressChange}
            className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        <input
            type="text"
            name="streetNumber"
            placeholder="Haus Nummer"
            value={formData.address.streetNumber}
            onChange={handleAddressChange}
            className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        <input type="text" name="city" placeholder="Stadt" value={formData.address.city} onChange={handleAddressChange}
               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        <input
            type="text"
            name="zipCode"
            placeholder="Postleitzahl"
            value={formData.address.zipCode}
            onChange={handleAddressChange}
            className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        <input
            type="text"
            name="country"
            placeholder="Land"
            value={formData.address.country}
            onChange={handleAddressChange}
            className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>

        <input
            type="number"
            name="balance"
            placeholder="Your deposit value"
            value={balance}
            onChange={handleBalanceChange}
            className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>

        <div className="my-2">
          <select
              name="accountType"
              id="accountType"
              value={accountType}
              onChange={handleAccountTypeChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="" disabled>Kontotyp</option>
            <option value="Girokonto">Girokonto</option>
            <option value="Sparkonto">Sparkonto</option>
          </select>
        </div>
        <button
            type="submit"
            disabled={isButtonDisabled}
            className={`bg-red-500 hover:bg-red-700 text-white font-bold my-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          Registrieren
        </button>
      </form>
    </div>
  );
};

export default Register;