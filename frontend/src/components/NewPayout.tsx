import React, { useState, useEffect } from 'react';
import './css/NewPayout.css'; // Import CSS file for styles
import axios, { AxiosResponse } from 'axios';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { Transfer, User, BankAccount, BankAPI } from '../store/types';

const NewPayout: React.FC = () => {
  const [showInput1, setShowInput1] = useState(true);
  const [showInput2, setShowInput2] = useState(false);
  const [showInput3, setShowInput3] = useState(false);
  const [showInput6, setShowInput6] = useState(false);
  const [input1Disabled, setInput1Disabled] = useState(true);
  const [formData, setFormData] = useState<Transfer>({
    id: null,
    recipient: null,
    sender: null,
    date: new Date(),
    reasonOfTransfer: '',
    sum: 0,
    authorized: false
  });
  const [bankData, setBankData] = useState<BankAPI>({
    accountNumber: '',
    bankId: '',
    iban: ''
  });
  const [user, setUser] = useState<User | null>(null);
  const [recipientNotImportTheName, setRecipientNotImportTheName] = useState('');
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [iban, setIban] = useState<string>('');

  useEffect(() => {
    const loggedIn = Cookies.get('isloggedin') === 'true';
    const userData = JSON.parse(Cookies.get('user') || '{}');

    if (!loggedIn || !userData) {
      navigate('/SignIn');
    } else {
      setUser(userData);
      getBankAccountOfUser(userData.id)
          .then((bankAccount) => {
            setFormData((prevData) => ({
              ...prevData,
              sender: bankAccount,
            }));
          })
          .catch((error) => {
            console.error('Error fetching bank account:', error);
          });

      if (userData?.confirmedByAdmin === false) {
        navigate('/Unconfirmed');
      }
    }
  }, [navigate]);

  const handleButtonClick = () => {
    if (showInput1) {
      setShowInput1(false);
      setShowInput2(true);
    } else if (showInput2) {
      setShowInput2(false);
      setShowInput3(true);
    } else if (showInput3) {
      setShowInput3(false);
      setShowInput6(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBankData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if ((name === 'iban' && value !== '') || (name === 'accountNumber' && value !== '' && bankData.bankId !== '') || (name === 'bankId' && value !== '' && bankData.accountNumber !== '')) {
      setInput1Disabled(false);
    }
  };

  const getBankAccountOfUser = async (userId: string | null) => {
    if (userId !== null) {
      try {
        const response = await axios.get(`http://localhost:8088/bankAccounts/user/${userId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching bank account:', error);
      }
    }
    return null;
  };

  const handleBankAccountClick = async () => {
    try {
      const response: AxiosResponse<BankAccount> = await axios.get('http://localhost:8088/bankAccounts/accountNumbOrIBAN', {
        params: {
          bankId: bankData.bankId,
          accountNumber: bankData.accountNumber,
          IBAN: bankData.iban
        }
      });
      setFormData((prevData) => ({
        ...prevData,
        recipient: response.data,
      }));
      if (response) {
        handleButtonClick();
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  const finishTransaction = async () => {
    try {
      const response = await axios.post('http://localhost:8088/transfers', formData);
      console.log(response.data);
      window.location.reload();
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleSubmit = async () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append('file', selectedImage);

      try {
        const response = await fetch('http://localhost:8088/transfers/upload', { // Anpassung der URL
          method: 'POST',
          body: formData,
        });

        const data = await response.text(); // Anpassung an den neuen Antworttyp
        if (response.ok) {
          setIban(data);
          setBankData((prevData) => ({
            ...prevData,
            iban: data, // hier: aktualisiere die IBAN im Zustand
          }));
        } else {
          console.error('File upload failed:', data);
          alert(`File upload failed: ${data}`);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file');
      }
    }
  };

  return (
      <div className="container">
        <div>
          <button
              onClick={handleUploadClick}
              style={{
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                cursor: 'pointer'
              }}
          >
            🧾 Rechnung hochladen
          </button>
          <input
              type="file"
              id="fileInput"
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleImageChange}
          />
          {selectedImage && (
              <div>
                <p style={{ color: 'black' }}>{selectedImage.name}</p>
                <img src={URL.createObjectURL(selectedImage)} alt="Preview" width="100" />
                <button
                    onClick={handleSubmit}
                    style={{
                      backgroundColor: 'red',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      marginTop: '10px' // Optional, um etwas Platz zu schaffen
                    }}
                >
                  Hochladen
                </button>
              </div>
          )}
        </div>
        <div className={`input ${showInput1 ? 'show' : ''}`}>
          <p className="text-black font-bold">Empfänger</p>
          <input
              type="text"
              placeholder="Empfänger"
              name="recipient"
              value={recipientNotImportTheName}
              onChange={(e) => setRecipientNotImportTheName(e.target.value)}
              className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <p className="text-black font-bold">IBAN</p>
          <input
              type="text"
              placeholder="IBAN"
              name="iban"
              value={bankData.iban} // hier: benutze den aktualisierten Zustand
              onChange={handleBankChange}
              className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <p className="text-black font-bold">Oder BIC und Kontonummer</p>
          <input
              type="text"
              placeholder="BIC"
              name="bankId"
              value={bankData.bankId}
              onChange={handleBankChange}
              className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <input
              type="text"
              placeholder="Kontonummer"
              name="accountNumber"
              value={bankData.accountNumber}
              onChange={handleBankChange}
              className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className={`input ${showInput2 ? 'show' : ''}`}>
          <p className="text-black font-bold">How much money do you want to send?</p>
          <input
              type="text"
              placeholder="Type here"
              name="sum"
              value={formData.sum}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className={`input ${showInput3 ? 'show' : ''}`}>
          <p className="text-black font-bold">What is the reason of your transaction?</p>
          <input
              type="text"
              placeholder="Type here"
              name="reasonOfTransfer"
              value={formData.reasonOfTransfer}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className={`input ${showInput6 ? 'show' : ''}`}>
          <button className="text-black" onClick={finishTransaction}>Send the money</button>
        </div>

        {showInput1 && (
            <button className="text-black" disabled={input1Disabled} onClick={handleBankAccountClick}>
              Zur Überprüfung
            </button>
        )}
        {(showInput2 || showInput3) && (
            <button onClick={handleButtonClick}>Next</button>
        )}
        {showInput1 &&
            <button className="text-black" disabled={input1Disabled} onClick={handleBankAccountClick}>Zur Überprüfung</button>
        }
        {(showInput2 || showInput3) &&
            <button className="text-black" onClick={handleButtonClick}>Next</button>
        }
      </div>
  );
};

export default NewPayout;
