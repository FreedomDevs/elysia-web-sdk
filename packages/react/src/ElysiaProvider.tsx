import type { ReactNode } from 'react';
import type { ElysiaClient } from '@elysiac/sdk';
import { ElysiaContext } from './context';

export interface ElysiaProviderProps {
  client: ElysiaClient;
  children: ReactNode;
}

export const ElysiaProvider = ({
  client,
  children,
}: ElysiaProviderProps) => {
  return (
    <ElysiaContext.Provider value={client}>
      {children}
    </ElysiaContext.Provider>
  );
};
