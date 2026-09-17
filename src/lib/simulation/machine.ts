import type { Hemisphere } from '@/types';

export type Phase = 'overview' | 'focused' | 'predicting' | 'revealed' | 'rehab';

export interface SimState<Site extends string = string, Choice extends string = string> {
  phase: Phase;
  hemisphere: Hemisphere;
  /** What the player acted on: a lesion site, a stimulus — whatever the level's mechanic keys on. */
  site: Site | null;
  prediction: Choice | null;
  rehabWeek: number;
}

export type SimAction<Site extends string = string, Choice extends string = string> =
  | { type: 'FOCUS' }
  | { type: 'RETURN_TO_OVERVIEW' }
  | { type: 'SELECT_SITE'; site: Site }
  | { type: 'SUBMIT_PREDICTION'; choice: Choice }
  | { type: 'SKIP_PREDICTION' }
  | { type: 'ADVANCE_TO_REHAB' }
  | { type: 'SET_REHAB_WEEK'; week: number }
  | { type: 'RESET_SCENARIO' };

export function createInitialState<Site extends string, Choice extends string>(): SimState<Site, Choice> {
  return { phase: 'overview', hemisphere: 'left', site: null, prediction: null, rehabWeek: 0 };
}

export const initialState: SimState = createInitialState();

export function simReducer<Site extends string, Choice extends string>(
  state: SimState<Site, Choice>,
  action: SimAction<Site, Choice>
): SimState<Site, Choice> {
  switch (action.type) {
    case 'FOCUS':
      return state.phase === 'overview' ? { ...state, phase: 'focused' } : state;

    case 'RETURN_TO_OVERVIEW':
      return { phase: 'overview', hemisphere: state.hemisphere, site: null, prediction: null, rehabWeek: 0 };

    case 'SELECT_SITE':
      return state.phase === 'focused' ? { ...state, phase: 'predicting', site: action.site } : state;

    case 'SUBMIT_PREDICTION':
      return state.phase === 'predicting' ? { ...state, phase: 'revealed', prediction: action.choice } : state;

    case 'SKIP_PREDICTION':
      return state.phase === 'predicting' ? { ...state, phase: 'revealed' } : state;

    case 'ADVANCE_TO_REHAB':
      return state.phase === 'revealed' ? { ...state, phase: 'rehab', rehabWeek: 0 } : state;

    case 'SET_REHAB_WEEK':
      return state.phase === 'rehab' ? { ...state, rehabWeek: action.week } : state;

    case 'RESET_SCENARIO':
      return { phase: 'focused', hemisphere: state.hemisphere, site: null, prediction: null, rehabWeek: 0 };
  }
}
