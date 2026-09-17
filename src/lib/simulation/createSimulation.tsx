import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import { createInitialState, simReducer, type SimAction, type SimState } from '@lib/simulation/machine';

export interface SimulationContextValue<Site extends string, Choice extends string> {
  state: SimState<Site, Choice>;
  dispatch: Dispatch<SimAction<Site, Choice>>;
}

/** Each level gets its own typed provider/hook pair without re-implementing the reducer. */
export function createSimulation<Site extends string, Choice extends string>() {
  const Context = createContext<SimulationContextValue<Site, Choice> | null>(null);

  function SimulationProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(
      (s: SimState<Site, Choice>, a: SimAction<Site, Choice>) => simReducer(s, a),
      undefined,
      createInitialState<Site, Choice>
    );
    return <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>;
  }

  function useSimulation(): SimulationContextValue<Site, Choice> {
    const ctx = useContext(Context);
    if (!ctx) throw new Error('useSimulation must be used inside its SimulationProvider');
    return ctx;
  }

  return { SimulationProvider, useSimulation };
}
