import React, { useState, useEffect } from 'react';
import './css/NewPayout.css'; // Import CSS file for styles
import { Transfer } from '../store/types'; // Import the Transfer interface
import axios, { AxiosResponse } from 'axios';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { User } from "../store/types";
import {BankAccount} from "../store/types"

interface BankAPI {
  iban: string;
  accountNumber: string;
  bankId: string;
}



const NewPayout: React.FC = () => {
  // State to manage the visibility of input fields
  const [showInput1, setShowInput1] = useState(true);
  const [showInput2, setShowInput2] = useState(false);
  const [showInput3, setShowInput3] = useState(false);
  const [showInput4, setShowInput4] = useState(false);
  const [showInput5, setShowInput5] = useState(false);
  const [showInput6, setShowInput6] = useState(false);
  const [showCodeError, setShowCodeError] = useState(false);
  const [codeError, setCodeError] = useState("The code doesn't fit!");
  const [input6Disabled, setInput6Disabled] = useState(true);
  const [input1Disabled, setInput1Disabled] = useState(true);
  const [codeRandom, setCodeRandom] = useState('');
  const [codeRecieved, setCodeRecieved] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Provide the type for user
  const [recipientNotImportTheName, setRecipientNotImportTheName] = useState('');

  useEffect(() => {
    // Retrieve parameters from cookies
    const loggedIn = Cookies.get('isloggedin') === 'true';
    const userData = JSON.parse(Cookies.get('user') || '{}');

    setIsLoggedIn(loggedIn);
    setUser(userData);
    // Set the formData inside the useEffect after user is set
    // First, we need to get the bank account connected to this userId
    getBankAccountOfUser(userData.id)
    .then((bankAccount) => {
      console.log(bankAccount); // This will log the bank account data once it's fetched
      // Set the formData inside the .then() block after bankAccount has been fetched
      setFormData({
        ...formData,
        sender: bankAccount,
      });
    })
    .catch((error) => {
      console.error('Error fetching bank account:', error);
    });
    
  }, []);



  const [bankData, setBankData] = useState<BankAPI>({
    accountNumber: '',
    bankId: '',
    iban: ''
  });

  const navigate = useNavigate();

  const [formData, setFormData] = useState<Transfer>({
    id:null,
    recipient: null,
    sender: null,
    date: new Date(),
    reasonOfTransfer: '',
    sum: 0,
    authorized: false
  });
  // Function to handle the click event on the button
  const handleButtonClick = () => {
    if (showInput1) {
      setShowInput1(false);
      setShowInput2(true);
    } else if (showInput2) {
      setShowInput2(false);
      setShowInput3(true);
    }
    else if (showInput3) {
      setShowInput3(false);
      setShowInput4(true);
      setShowInput6(true);
    } else if (showInput4) {
      setShowInput4(false);  //not being used because I deleted the phone verification
      setShowInput5(true);   //not being used because I deleted the phone verification
    }
    else if (showInput5) {
      setShowInput5(false);   //not being used because I deleted the phone verification
      setShowInput6(true);    //not being used because I deleted the phone verification
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const getBankAccountOfUser = async (userId: string | null) => {
    if (userId !== null) {
      try {
        const response = await axios.get(`http://localhost:8088/bankAccount/user/${userId}`);
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.error('Authentication failed:', error);
      }
    } else {
      return null;
    }
  }
  


  const handleBankChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(value);

    setBankData({
      ...bankData,
      [name]: value,
    });
    if ((name === 'iban' && value !== '') || ((name === 'accountNumber' && value !== '') && bankData.bankId !== '') || ((name === 'bankId' && value !== '') && bankData.accountNumber !== '')) {
      console.log("Not disabled anymore!");
      setInput1Disabled(false);
    }
  };

  // const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  //   const { value } = e.target;
  //   setPhone(value);
  //   console.log(user?.id);

  // };

  // const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  //   const { value } = e.target;
  //   setCodeRecieved(value);
  //   if (codeRandom === value) {
  //     setInput6Disabled(false);
  //     setShowCodeError(false); // Hide the error message if codes match
  //   } else {
  //     setInput6Disabled(true);
  //     setShowCodeError(true); // Show the error message if codes don't match
  //   }
  // };

  const finishTransaction = async () => {
    console.log("send the api request to the back");
    console.log(formData);

    try {
      const response = await axios.post('http://localhost:8088/transfers', formData);
      console.log(response.data);
      window.location.reload();
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };



  // const handleSendSms = async () => {
  //   handleButtonClick();
  //   try {
  //     console.log(phone);
  //     const response = await axios.post('http://localhost:8088/users/twillio', phone);
  //     const code = response.data.match(/\d{4}/); // Extract 4-digit code from response
  //     console.log(code);

  //     if (code) {
  //       setCodeRandom(code[0]); // Set the code in state as a string
  //     }
  //   } catch (error) {
  //     console.error('Authentication failed:', error);
  //   }
  // };

  const handleBankAccountClick = async () => {
    console.log("send the bank details in order to get the id of the bank account ");
    try {
      const response: AxiosResponse<BankAccount> = await axios.get('http://localhost:8088/bankAccount/accountNumbOrIBAN', {
        params: {
          bankId: bankData.bankId,
          accountNumber: bankData.accountNumber,
          IBAN: bankData.iban
        }
      });
      console.log(response.data);
      console.log(response.data.user);
      setFormData({
        ...formData,
        recipient: response.data,

      });

      if (response) {
        handleButtonClick();
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };


  return (
    <div className="container">
      {/* Input field 1 */}
      <div className={`input ${showInput1 ? 'show' : ''}`}>
        <p className="text-white font-bold">Who do you want to send the money to?</p>
        <input type="text" placeholder="Type your name here" name="recipient" value={recipientNotImportTheName} onChange={(e) => setRecipientNotImportTheName(e.target.value)} className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        <p className="text-white font-bold">IBAN number</p>
        <input type="text" placeholder="Type the IBAN here" name="iban" value={bankData.iban} onChange={handleBankChange} className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        <p className="text-white font-bold">Or Bank id with account number</p>
        <input type="text" placeholder="Type here" name="bankId" value={bankData.bankId} onChange={handleBankChange} className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        <input type="text" placeholder="Type here" name="accountNumber" value={bankData.accountNumber} onChange={handleBankChange} className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />


      </div>

      {/* Input field 2 */}
      <div className={`input ${showInput2 ? 'show' : ''}`}>
        <p className="text-white font-bold">How much money do you want to send?</p>
        <input type="text" placeholder="Type here" name="sum" value={formData.sum} onChange={handleChange} className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
      </div>

      {/* Input field 3 */}
      <div className={`input ${showInput3 ? 'show' : ''}`}>
        <p className="text-white font-bold">What is the reason of your transaction?</p>
        <input type="text" placeholder="Type here" name="reasonOfTransfer" value={formData.reasonOfTransfer} onChange={handleChange} className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
      </div>
      {/* Input field 4 */}
      {/* <div className={`input ${showInput4 ? 'show' : ''}`}>
        <p className="text-white font-bold">Please enter your phone number</p>
        <input type="text" placeholder="Type here" name="phone number" value={phone} onChange={handlePhoneChange} className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
      </div>
      <div className={`input ${showInput5 ? 'show' : ''}`}>
        <p className="text-white font-bold">Please enter the code you have recieved</p>
        <input type="number" placeholder="Type here" name="code" value={codeRecieved} onChange={handleCodeChange} className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        {showCodeError && <p className="text-white font-bold">{codeError}</p>}
      </div> */}
      <div className={`input ${showInput6 ? 'show' : ''}`}>
        <button onClick={finishTransaction}>Send the money</button>
      </div>

      {/* Button to toggle input fields */}
      {showInput1 &&
        <button disabled={input1Disabled} onClick={handleBankAccountClick}>Verify the account</button>
      }
      {(showInput5 === false && showInput6 === false && showInput4 === false && showInput1 === false) &&
        <button onClick={handleButtonClick}>Next</button>
      }
     {/* {showInput4 &&
        <button onClick={handleSendSms}>Send me an sms</button>
      }
      {showInput5 &&
        <button disabled={input6Disabled} onClick={handleButtonClick}>Verify</button>
      }*/}
    </div>
  );
}

export default NewPayout;
