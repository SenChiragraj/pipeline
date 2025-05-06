import { createContext, useContext, useState } from 'react';

const RepoContext = createContext();

export const useRepo = () => useContext(RepoContext);

export const RepoProvider = ({ children }) => {
  const [repoFullName, setRepoFullName] = useState(null);

  return (
    <RepoContext.Provider value={{ repoFullName, setRepoFullName }}>
      {children}
    </RepoContext.Provider>
  );
};
