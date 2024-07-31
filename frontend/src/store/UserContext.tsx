import React, { createContext, useState, useContext, ReactNode } from 'react';
import { UserTable } from '../store/types'; // Adjust the import path as needed

interface UserContextType {
    user: UserTable | null;
    setUser: React.Dispatch<React.SetStateAction<UserTable | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserTable | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
