import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import {
  simReducer,
  initialState,
  type SimAction,
  type SimState,
} from '@levels/motor-cortex/simulation/machine';

interface SimContextValue {
  state: SimState;
  dispatch: Dispatch<SimAction>;
}

const SimContext = createContext<SimContextValue | null>(null);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(simReducer, initialState);
  return <SimContext.Provider value={{ state, dispatch }}>{children}</SimContext.Provider>;
}

export function useSimulation(): SimContextValue {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error('useSimulation must be used inside SimulationProvider');
  return ctx;
}
