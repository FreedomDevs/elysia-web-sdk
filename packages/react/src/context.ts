import { createContext } from 'react';
import type { ElysiaClient } from '@elysiac/sdk';

export const ElysiaContext = createContext<ElysiaClient | null>(null);
