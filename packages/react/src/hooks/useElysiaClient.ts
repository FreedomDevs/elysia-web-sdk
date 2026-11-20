import { useContext } from 'react';
import { ElysiaContext } from '../context';

export const useElysiaClient = () => {
  const client = useContext(ElysiaContext);

  if (!client) {
    throw new Error('useElysiaClient must be used within ElysiaProvider');
  }

  return client;
};
