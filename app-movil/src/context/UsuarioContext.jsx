import { createContext, useContext, useState } from 'react';

const UsuarioContext = createContext(null);

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  return (
    <UsuarioContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UsuarioContext.Provider>
  );
};

export const useUsuario = () => {
  const context = useContext(UsuarioContext);
  if (!context) {
    throw new Error('useUsuario debe usarse dentro de UsuarioProvider');
  }
  return context;
};