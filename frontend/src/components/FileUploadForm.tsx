import React from 'react';

const FileUploadForm: React.FC = () => {
    return (
        <form>
            <div className="mb-5">
                <label htmlFor="message">Bild</label>
                <input type="file" id="message" />
            </div>
            <button type="submit">Absenden</button>
        </form>
    );
}

export default FileUploadForm;
