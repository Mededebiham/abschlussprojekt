import React, { useEffect, useState } from 'react';
import { useAlert } from '../alert';

const Alert = () => {
    const { alert, setAlert } = useAlert();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (alert) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                setTimeout(() => {
                    setAlert(null);
                }, 500); // Delay for the fade-out animation
            }, 3000); // 3 seconds

            return () => clearTimeout(timer); // Clear the timeout if the component unmounts
        }
    }, [alert, setAlert]);

    const alertStyles = {
        info: "text-blue border-blue",
        danger: "text-red border-red",
        success: "text-green border-green",
        warning: "text-yellow border-yellow",
    };

    return (
        <div className="flex justify-center mx-auto max-w-5xl mt-1 h-12">
            <div className={`flex items-center p-4 text-sm border rounded-lg ${alertStyles[alert?.type]} bg-base transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'} w-full`} role="alert">
                <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                </svg>
                <span className="sr-only">Info</span>
                <div>
                    {alert?.content}
                </div>
            </div>
        </div>
    );
};

export default Alert;
