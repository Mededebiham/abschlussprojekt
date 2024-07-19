import React from 'react';

const FileUploadForm: React.FC = () => {
    return (
        <form>
            <div className="mb-5">
                <label htmlFor="message">Image</label>
                <input type="file" id="message" />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
}

export default FileUploadForm;
