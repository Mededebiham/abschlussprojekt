import React, { useState, useEffect } from 'react';
import './css/NewPayout.css';
import axios, { AxiosResponse } from 'axios';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { Transfer, User, BankAccount, BankAPI } from '../store/types';
import { sendVerificationCode } from '../phoneAuth';
import OTPVerification from './OTPVerification';
import 'react-phone-input-2/lib/style.css';
import { ConfirmationResult } from 'firebase/auth';
//

const NewPayout: React.FC = () => {
  const [showInput1, setShowInput1] = useState(true);
  const [showInput2, setShowInput2] = useState(false);
  const [showInput3, setShowInput3] = useState(false);
  const [showInput6, setShowInput6] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
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
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [iban, setIban] = useState<string>('');
  const [ibanError, setIbanError] = useState<string>('');
  const [sumError, setSumError] = useState<string>('');
  const [recipientError, setRecipientError] = useState<string>('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

    let userPhone;

  useEffect(() => {
    const loggedIn = Cookies.get('isloggedin') === 'true';
    const userData = JSON.parse(Cookies.get('user') || '{}');
    const account = JSON.parse(Cookies.get('account') || '{}');
    userPhone = account.user.userPhone;
    if (!loggedIn || !userData) {
      navigate('/SignIn');
    } else {
      setUser(userData);
      setFormData((prevData) => ({
        ...prevData,
        sender: {
          id: account.user.id,
          iban: account.iban,
          accountNumber: account.accountNumber,
          bankId: account.bankId,
          balance: account.balance,
          user: userData,
          accountType: account.accountType,
          confirmedByAdmin: account.confirmedByAdmin
        }
      }));


      if (userData?.confirmedByAdmin === false) {
        navigate('/Unconfirmed');
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (isCameraOpen && cameraStream) {
      const video = document.getElementById('video') as HTMLVideoElement;
      if (video) {
        video.srcObject = cameraStream;
      }
    }
  }, [isCameraOpen, cameraStream]);

  const handleButtonClick = () => {
    if (showInput1) {
      if (bankData.iban && !recipientNotImportTheName) {
        setRecipientError('Empfänger darf nicht leer sein, wenn IBAN angegeben ist');
        return;
      }
      setShowInput1(false);
      setShowInput2(true);
    } else if (showInput2) {
      const sum = parseFloat(formData.sum.toString());
      if (isNaN(sum) || sum < 20) {
        setSumError('Beträge unter 20€ sind nicht zulässig');
        return; // Eğer hata varsa işlemi durdur
      } else {
        setSumError('');
      }
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
    if (name === 'sum') {
      const sum = parseFloat(value);
      if (isNaN(sum) || sum < 20) {
        setSumError('Beträge unter 20€ sind nicht zulässig');
      } else {
        setSumError('');
      }
    }
    if (name === 'recipient') {
      setRecipientNotImportTheName(value);
      setRecipientError('');
      console.log("Recipient changed:", value);
    }
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
    if (name === 'iban') {
      setIbanError('');
    }
  };

  const validateIban = (iban: string) => {
    if (iban.length < 15 && iban.length > 0) {
      setIbanError('Ungültige IBAN');
    } else {
      setIbanError('');
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
    validateIban(bankData.iban);
    if (ibanError) return;

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
    if (!confirmationResult) {
      sendVerificationCode("+491543332211", setConfirmationResult, setShowVerification);
    } else {
      try {
        const response = await axios.post('http://localhost:8088/transfers', formData);
        window.location.reload();
        navigate('/confirm-transaction', { state: { transferId: response.data.id } });
      } catch (error) {
        console.error('Transaction failed:', error);
      }
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
        const response = await fetch('http://localhost:8088/transfers/upload', {
          method: 'POST',
          body: formData,
        });

     //   const data = await response.text();
        const data = await response.json();
        if (response.ok) {
          setIban(data.iban);
          setBankData((prevData) => ({
            ...prevData,
            iban: data.iban,
          }));
          setFormData((prevData) => ({
            ...prevData,
            sum: parseFloat(data.betrag),
          }));
          setRecipientNotImportTheName(data.empfaenger);
        } else {
          console.error('File upload failed:', data.error);
          alert(`File upload failed: ${data.error}`);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file');
      }
    }
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setIsCameraOpen(true);
    } catch (error) {
      console.error('Error opening camera:', error);
      alert('Error opening camera');
    }
  };

  const capturePhoto = () => {
    const video = document.getElementById('video') as HTMLVideoElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
          setSelectedImage(file);
          setIsCameraOpen(false);
          if (cameraStream) {
            cameraStream.getTracks().forEach((track) => track.stop());
          }
        }
      }, 'image/jpeg');
    }
  };

  return (
      <div className="new-payout-container">
        <div className="new-payout-title">Überweisung</div>
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
          <button
              onClick={openCamera}
              style={{
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                cursor: 'pointer',
                marginLeft: '10px'
              }}
          >
            📸 Foto aufnehmen
          </button>
          {isCameraOpen && (
              <div>
                <video id="video" autoPlay style={{ width: '100%' }}></video>
                <button onClick={capturePhoto} style={{
                  backgroundColor: 'red',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}>Foto aufnehmen</button>
              </div>
          )}
          {selectedImage && (
              <div className="new-payout-image-preview">
                <p>{selectedImage.name}</p>
                <img src={URL.createObjectURL(selectedImage)} alt="Preview" />
                <button
                    onClick={handleSubmit}
                    className="new-payout-file-upload-button"
                    style={{
                      backgroundColor: 'red',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      marginTop: '10px'
                    }}
                >
                  Hochladen
                </button>
              </div>
          )}
        </div>
        <div className="new-payout-form-container text-black">
          <div className={`new-payout-input ${showInput1 ? 'show' : ''}`}>
            <p className="text-black font-bold">Empfänger</p>
            <input
                type="text"
                placeholder="Empfänger"
                name="recipient"
                value={recipientNotImportTheName}
                onChange={(e) => {
              setRecipientNotImportTheName(e.target.value);
              handleChange(e);
              }}
                className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {recipientError && (
                <p className="error-message">{recipientError}</p>
            )}

            <p className="text-black font-bold">IBAN</p>
            <input
                type="text"
                placeholder="IBAN"
                name="iban"
                value={bankData.iban}
                onChange={handleBankChange}
                onBlur={(e) => validateIban(e.target.value)} // Inputtan ayrıldığında IBAN doğrulama
                className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {ibanError && (
                <p className="error-message">{ibanError}</p>
            )}

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

          <div className={`new-payout-input ${showInput2 ? 'show' : ''}`}>
            <p className="text-black font-bold">Wie viel Geld möchten Sie schicken?</p>
            <input
                type="text"
                placeholder="Type here"
                name="sum"
                value={formData.sum}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {sumError && (
                <p className="error-message">{sumError}</p>
            )}
          </div>

          <div className={`new-payout-input ${showInput3 ? 'show' : ''}`}>
            <p className="text-black font-bold">Was ist der Grund für Ihre Transaktion?</p>
            <input
                type="text"
                placeholder="Type here"
                name="reasonOfTransfer"
                value={formData.reasonOfTransfer}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className={`new-payout-input ${showInput6 ? 'show' : ''}`}>
            <div className="new-payout-summary-card">
              <p>
                <strong>Empfänger:</strong> {recipientNotImportTheName}
              </p>
              <p>
                <strong>IBAN:</strong> {bankData.iban}
              </p>
              <p>
                <strong>Grund der Überweisung:</strong> {formData.reasonOfTransfer}
              </p>
              <p>
                <strong>Betrag:</strong> {formData.sum} EUR
              </p>
            </div>
            <button className="new-payout-button text-black" onClick={finishTransaction}>Geld senden</button>
          </div>
          {showInput1 && (
              <button className="new-payout-button text-black" disabled={input1Disabled} onClick={handleBankAccountClick}>Zur Überprüfung</button>
          )}
          {(showInput2 || showInput3) && (
              <button className="new-payout-button text-black" onClick={handleButtonClick}>Next</button>
          )}
        </div>

        <div id="recaptcha-container"></div>

        {showVerification && (
            <OTPVerification
                confirmationResult={confirmationResult}
                onVerify={() => {
                  console.log('OTP verified');
                  setShowVerification(false);
                  finishTransaction();
                }}
            />
        )}
      </div>
  );
};

export default NewPayout;
