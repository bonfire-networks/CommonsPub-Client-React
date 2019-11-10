import React, { useContext } from 'react';
import { State as SessionContextT } from '../../redux/session';
import { createContext } from 'react';
import { StateContext } from './stateCtx';

export const SessionContext = createContext<SessionContextT>({ auth: null });

export const ProvideSessionCtx: React.FC = ({ children }) => {
  const { session } = useContext(StateContext);

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};