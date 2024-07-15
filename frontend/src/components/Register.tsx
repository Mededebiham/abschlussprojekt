import React, { useState, useEffect } from 'react';

interface RegisterFormProps {
  onSubmit: (formData: RegisterFormData) => void;
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isPasswordsMatch, setIsPasswordsMatch] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
      !country;

    setIsButtonDisabled(isAnyFieldEmpty || !isPasswordsMatch);
  }, [formData, isPasswordsMatch]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-xs bg-transparent">
      <form onSubmit={handleSubmit} className="bg-white bg-opacity-25 shadow-md rounded px-8 pt-6 pb-8 ">
        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>

        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
       
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
       
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={handleChangeConfirmPassword}
          className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        <input
          type="text"
          name="street"
          placeholder="Street"
          value={formData.address.street}
          onChange={handleAddressChange}
          className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        <input
          type="text"
          name="streetNumber"
          placeholder="Street Number"
          value={formData.address.streetNumber}
          onChange={handleAddressChange}
          className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        <input type="text" name="city" placeholder="City" value={formData.address.city} onChange={handleAddressChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        <input
          type="text"
          name="zipCode"
          placeholder="Zip Code"
          value={formData.address.zipCode}
          onChange={handleAddressChange}
          className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.address.country}
          onChange={handleAddressChange}
          className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        <button
          type="submit"
          disabled={isButtonDisabled}
          className={`bg-red-500 hover:bg-red-700 text-white font-bold my-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;