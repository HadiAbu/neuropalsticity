import type { BodyPart, Hemisphere } from '@content/schema';

export type Phase = 'overview' | 'stripFocused' | 'predicting' | 'revealed' | 'rehab';

export interface SimState {
  phase: Phase;
  hemisphere: Hemisphere;
  lesionSite: BodyPart | null;
  prediction: BodyPart | null;
  rehabWeek: number;
}

export type SimAction =
  | { type: 'FOCUS_STRIP' }
  | { type: 'RETURN_TO_OVERVIEW' }
  | { type: 'SELECT_LESION'; site: BodyPart }
  | { type: 'SUBMIT_PREDICTION'; part: BodyPart }
  | { type: 'SKIP_PREDICTION' }
  | { type: 'ADVANCE_TO_REHAB' }
  | { type: 'SET_REHAB_WEEK'; week: number }
  | { type: 'RESET_SCENARIO' };

export const initialState: SimState = {
  phase: 'overview',
  hemisphere: 'left',
  lesionSite: null,
  prediction: null,
  rehabWeek: 0,
};

export function simReducer(state: SimState, action: SimAction): SimState {
  switch (action.type) {
    case 'FOCUS_STRIP':
      return state.phase === 'overview' ? { ...state, phase: 'stripFocused' } : state;

    case 'RETURN_TO_OVERVIEW':
      return { ...initialState, hemisphere: state.hemisphere };

    case 'SELECT_LESION':
      return state.phase === 'stripFocused'
        ? { ...state, phase: 'predicting', lesionSite: action.site }
        : state;

    case 'SUBMIT_PREDICTION':
      return state.phase === 'predicting'
        ? { ...state, phase: 'revealed', prediction: action.part }
        : state;

    case 'SKIP_PREDICTION':
      return state.phase === 'predicting' ? { ...state, phase: 'revealed' } : state;

    case 'ADVANCE_TO_REHAB':
      return state.phase === 'revealed' ? { ...state, phase: 'rehab', rehabWeek: 0 } : state;

    case 'SET_REHAB_WEEK':
      return state.phase === 'rehab' ? { ...state, rehabWeek: action.week } : state;

    case 'RESET_SCENARIO':
      return {
        ...initialState,
        phase: 'stripFocused',
        hemisphere: state.hemisphere,
      };
  }
}
