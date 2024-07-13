import React, { useState } from 'react';
import { uploadImage, getImage } from './db'; // Importieren Sie die neuen Funktionen

const UploadPicture = () => {
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [downloadedImage, setDownloadedImage] = useState(null);
    const [userid, setUserid] = useState('1235'); // Beispielhafte UserID, kann dynamisch gesetzt werden

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setMessage(''); // Clear any previous message
    };

    const handleUpload = () => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (file) {
            uploadImage(userid, file)
                .then(data => {
                    if (data.success) {
                        setMessage('Bild erfolgreich gespeichert');
                    } else {
                        setMessage('Fehler: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Es gab einen Netzwerkfehler oder Serverfehler:', error);
                    setMessage('Fehler beim Speichern des Bildes');
                });
        }
    };

    const handleDownload = () => {
        getImage(userid)
            .then(blob => {
                const url = URL.createObjectURL(blob);
                setDownloadedImage(url);
                setMessage('Bild erfolgreich heruntergeladen');
            })
            .catch(error => {
                console.error('Es gab einen Netzwerkfehler oder Serverfehler:', error);
                setMessage('Fehler beim Herunterladen des Bildes');
            });
    };
/*
    return (
        <div>
            <h1>Bild hochladen und anzeigen</h1>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={!file}>
                Upload
            </button>
            {image && (
                <div style={{ marginTop: '20px' }}>
                    <img
                        src={image}
                        alt="Hochgeladenes Bild"
                        style={{ maxWidth: '500px', maxHeight: '500px', objectFit: 'contain' }}
                    />
                    <button onClick={handleSave} style={{ display: 'block', marginTop: '20px' }}>
                        Speichern
                    </button>
                </div>
            )}
            <button onClick={handleDownload} style={{ display: 'block', marginTop: '20px' }}>
                Herunterladen
            </button>
            {downloadedImage && (
                <div style={{ marginTop: '20px' }}>
                    <img
                        src={downloadedImage}
                        alt="Heruntergeladenes Bild"
                        style={{ maxWidth: '500px', maxHeight: '500px', objectFit: 'contain' }}
                    />
                </div>
            )}
            {message && (
                <div style={{ marginTop: '20px', color: message.includes('Fehler') ? 'red' : 'green' }}>
                    {message}
                </div>
            )}
        </div>
    );*/
};

export default UploadPicture;
