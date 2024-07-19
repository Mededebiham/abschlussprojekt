import React, { useState, useEffect } from 'react'; //TODO
import './css/NewPayout.css'; // Import CSS file for styles //TODO
import { Transfer } from '../store/types'; // Import the Transfer interface //TODO
import axios, { AxiosResponse } from 'axios'; //TODO
import { useNavigate } from "react-router-dom"; //TODO
import Cookies from 'js-cookie'; //TODO
import { User } from "../store/types"; //TODO
import {BankAccount} from "../store/types" //TODO

interface BankAPI { //TODO
  iban: string; //TODO
  accountNumber: string; //TODO
  bankId: string; //TODO
}

const NewPayout: React.FC = () => { //TODO
  const [showInput1, setShowInput1] = useState(true); //TODO
  const [showInput2, setShowInput2] = useState(false); //TODO
  const [showInput3, setShowInput3] = useState(false); //TODO
  const [showInput4, setShowInput4] = useState(false); //TODO
  const [showInput5, setShowInput5] = useState(false); //TODO
  const [showInput6, setShowInput6] = useState(false); //TODO
  const [showCodeError, setShowCodeError] = useState(false); //TODO
  const [codeError, setCodeError] = useState("The code doesn't fit!"); //TODO
  const [input6Disabled, setInput6Disabled] = useState(true); //TODO
  const [input1Disabled, setInput1Disabled] = useState(true); //TODO
  const [codeRandom, setCodeRandom] = useState(''); //TODO
  const [codeRecieved, setCodeRecieved] = useState(''); //TODO
  const [phone, setPhone] = useState(''); //TODO
  const [isLoggedIn, setIsLoggedIn] = useState(false); //TODO
  const [user, setUser] = useState<User | null>(null); // Provide the type for user //TODO
  const [recipientNotImportTheName, setRecipientNotImportTheName] = useState(''); //TODO

  useEffect(() => { //TODO
    const loggedIn = Cookies.get('isloggedin') === 'true'; //TODO
    const userData = JSON.parse(Cookies.get('user') || '{}'); //TODO

    setIsLoggedIn(loggedIn); //TODO
    setUser(userData); //TODO
    getBankAccountOfUser(userData.id) //TODO
        .then((bankAccount) => { //TODO
          console.log(bankAccount); // This will log the bank account data once it's fetched //TODO
          setFormData({ //TODO
            ...formData, //TODO
            sender: bankAccount, //TODO
          }); //TODO
        })
        .catch((error) => { //TODO
          console.error('Error fetching bank account:', error); //TODO
        });
  }, []); //TODO

  const [bankData, setBankData] = useState<BankAPI>({ //TODO
    accountNumber: '', //TODO
    bankId: '', //TODO
    iban: '' //TODO
  }); //TODO

  const navigate = useNavigate(); //TODO

  const [formData, setFormData] = useState<Transfer>({ //TODO
    id:null, //TODO
    recipient: null, //TODO
    sender: null, //TODO
    date: new Date(), //TODO
    reasonOfTransfer: '', //TODO
    sum: 0, //TODO
    authorized: false //TODO
  }); //TODO

  const handleButtonClick = () => { //TODO
    if (showInput1) { //TODO
      setShowInput1(false); //TODO
      setShowInput2(true); //TODO
    } else if (showInput2) { //TODO
      setShowInput2(false); //TODO
      setShowInput3(true); //TODO
    }
    else if (showInput3) { //TODO
      setShowInput3(false); //TODO
      setShowInput4(true); //TODO
      setShowInput6(true); //TODO
    } else if (showInput4) { //TODO
      setShowInput4(false);  //not being used because I deleted the phone verification //TODO
      setShowInput5(true);   //not being used because I deleted the phone verification //TODO
    }
    else if (showInput5) { //TODO
      setShowInput5(false);   //not being used because I deleted the phone verification //TODO
      setShowInput6(true);    //not being used because I deleted the phone verification //TODO
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { //TODO
    const { name, value } = e.target; //TODO
    setFormData({ //TODO
      ...formData, //TODO
      [name]: value, //TODO
    }); //TODO
  };

  const getBankAccountOfUser = async (userId: string | null) => { //TODO
    if (userId !== null) { //TODO
      try { //TODO
        const response = await axios.get(`http://localhost:8088/bankAccount/user/${userId}`); //TODO
        console.log(response.data); //TODO
        return response.data; //TODO
      } catch (error) { //TODO
        console.error('Authentication failed:', error); //TODO
      } //TODO
    } else { //TODO
      return null; //TODO
    } //TODO
  } //TODO

  const handleBankChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { //TODO
    const { name, value } = e.target; //TODO
    console.log(value); //TODO

    setBankData({ //TODO
      ...bankData, //TODO
      [name]: value, //TODO
    }); //TODO
    if ((name === 'iban' && value !== '') || ((name === 'accountNumber' && value !== '') && bankData.bankId !== '') || ((name === 'bankId' && value !== '') && bankData.accountNumber !== '')) { //TODO
      console.log("Not disabled anymore!"); //TODO
      setInput1Disabled(false); //TODO
    } //TODO
  };

  const finishTransaction = async () => { //TODO
    console.log("send the api request to the back"); //TODO
    console.log(formData); //TODO

    try { //TODO
      const response = await axios.post('http://localhost:8088/transfers', formData); //TODO
      console.log(response.data); //TODO
      window.location.reload(); //TODO
    } catch (error) { //TODO
      console.error('Authentication failed:', error); //TODO
    } //TODO
  };

  const handleBankAccountClick = async () => { //TODO
    console.log("send the bank details in order to get the id of the bank account "); //TODO
    try { //TODO
      const response: AxiosResponse<BankAccount> = await axios.get('http://localhost:8088/bankAccount/accountNumbOrIBAN', { //TODO
        params: { //TODO
          bankId: bankData.bankId, //TODO
          accountNumber: bankData.accountNumber, //TODO
          IBAN: bankData.iban //TODO
        } //TODO
      }); //TODO
      console.log(response.data); //TODO
      console.log(response.data.user); //TODO
      setFormData({ //TODO
        ...formData, //TODO
        recipient: response.data, //TODO
      }); //TODO

      if (response) { //TODO
        handleButtonClick(); //TODO
      } //TODO
    } catch (error) { //TODO
      console.error('Request failed:', error); //TODO
    } //TODO
  };

  return (
      <div className="container">
        <div className={`input ${showInput1 ? 'show' : ''}`}>
          <p className="text-white font-bold">Empfänger</p>
          <input type="text" placeholder="Empfänger" name="recipient" value={recipientNotImportTheName} onChange={(e) => setRecipientNotImportTheName(e.target.value)} className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          <p className="text-white font-bold">IBAN</p>
          <input type="text" placeholder="IBAN" name="iban" value={bankData.iban} onChange={handleBankChange} className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          <p className="text-white font-bold">Oder BIC und Kontonummer</p>
          <input type="text" placeholder="BIC" name="bankId" value={bankData.bankId} onChange={handleBankChange} className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          <input type="text" placeholder="Kontonummer" name="accountNumber" value={bankData.accountNumber} onChange={handleBankChange} className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>

        <div className={`input ${showInput2 ? 'show' : ''}`}>
          <p className="text-white font-bold">How much money do you want to send?</p>
          <input type="text" placeholder="Type here" name="sum" value={formData.sum} onChange={handleChange} className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>

        <div className={`input ${showInput3 ? 'show' : ''}`}>
          <p className="text-white font-bold">What is the reason of your transaction?</p>
          <input type="text" placeholder="Type here" name="reasonOfTransfer" value={formData.reasonOfTransfer} onChange={handleChange} className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>

        <div className={`input ${showInput6 ? 'show' : ''}`}>
          <button onClick={finishTransaction}>Send the money</button>
        </div>

        {showInput1 &&
            <button disabled={input1Disabled} onClick={handleBankAccountClick}>Zur Überprüfung</button>
        }
        {(showInput5 === false && showInput6 === false && showInput4 === false && showInput1 === false) &&
            <button onClick={handleButtonClick}>Next</button>
        }
      </div>
  );
}

export default NewPayout;
