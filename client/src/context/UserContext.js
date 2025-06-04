import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userDetails, setUserdetails] = useState({
    avatar_url: String,
    name: String,
  });

  return (
    <UserContext.Provider value={{ userDetails, setUserdetails }}>
      {children}
    </UserContext.Provider>
  );
};
