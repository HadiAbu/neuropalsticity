import { describe, it, expect } from 'vitest';
import { simReducer, initialState } from '@levels/motor-cortex/simulation/machine';
import type { SimState } from '@levels/motor-cortex/simulation/machine';

const at = (phase: SimState['phase'], overrides: Partial<SimState> = {}): SimState => ({
  ...initialState,
  phase,
  ...overrides,
});

describe('simReducer', () => {
  it('starts in overview with nothing selected', () => {
    expect(initialState.phase).toBe('overview');
    expect(initialState.lesionSite).toBeNull();
    expect(initialState.prediction).toBeNull();
  });

  it('focuses the strip from overview', () => {
    expect(simReducer(initialState, { type: 'FOCUS_STRIP' }).phase).toBe('stripFocused');
  });

  it('returns to overview and clears the scenario', () => {
    const state = at('revealed', { lesionSite: 'hand', prediction: 'arm' });
    const next = simReducer(state, { type: 'RETURN_TO_OVERVIEW' });
    expect(next.phase).toBe('overview');
    expect(next.lesionSite).toBeNull();
    expect(next.prediction).toBeNull();
  });

  it('selects a lesion and moves to predicting', () => {
    const next = simReducer(at('stripFocused'), { type: 'SELECT_LESION', site: 'hand' });
    expect(next.phase).toBe('predicting');
    expect(next.lesionSite).toBe('hand');
  });

  it('records a prediction and reveals', () => {
    const next = simReducer(at('predicting', { lesionSite: 'hand' }), {
      type: 'SUBMIT_PREDICTION',
      part: 'fingers',
    });
    expect(next.phase).toBe('revealed');
    expect(next.prediction).toBe('fingers');
  });

  it('skips prediction straight to revealed with no prediction recorded', () => {
    const next = simReducer(at('predicting', { lesionSite: 'hand' }), {
      type: 'SKIP_PREDICTION',
    });
    expect(next.phase).toBe('revealed');
    expect(next.prediction).toBeNull();
  });

  it('advances to rehab at week 0', () => {
    const next = simReducer(at('revealed', { lesionSite: 'hand' }), {
      type: 'ADVANCE_TO_REHAB',
    });
    expect(next.phase).toBe('rehab');
    expect(next.rehabWeek).toBe(0);
  });

  it('scrubs the rehab week', () => {
    const next = simReducer(at('rehab', { lesionSite: 'hand' }), {
      type: 'SET_REHAB_WEEK',
      week: 8,
    });
    expect(next.rehabWeek).toBe(8);
  });

  it('resets to stripFocused without leaving the level', () => {
    const state = at('rehab', { lesionSite: 'hand', prediction: 'arm', rehabWeek: 12 });
    const next = simReducer(state, { type: 'RESET_SCENARIO' });
    expect(next.phase).toBe('stripFocused');
    expect(next.lesionSite).toBeNull();
    expect(next.prediction).toBeNull();
    expect(next.rehabWeek).toBe(0);
  });

  it('ignores actions that do not apply to the current phase', () => {
    const state = at('overview');
    expect(simReducer(state, { type: 'SELECT_LESION', site: 'hand' })).toBe(state);
    expect(simReducer(state, { type: 'SET_REHAB_WEEK', week: 4 })).toBe(state);
  });
});
