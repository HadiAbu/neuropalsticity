import { describe, it, expect } from 'vitest';
import { simReducer, initialState } from '@lib/simulation/machine';
import type { SimState } from '@lib/simulation/machine';

const at = (phase: SimState['phase'], overrides: Partial<SimState> = {}): SimState => ({
  ...initialState,
  phase,
  ...overrides,
});

describe('simReducer', () => {
  it('starts in overview with nothing selected', () => {
    expect(initialState.phase).toBe('overview');
    expect(initialState.site).toBeNull();
    expect(initialState.prediction).toBeNull();
  });

  it('focuses from overview', () => {
    expect(simReducer(initialState, { type: 'FOCUS' }).phase).toBe('focused');
  });

  it('returns to overview and clears the scenario', () => {
    const state = at('revealed', { site: 'hand', prediction: 'arm' });
    const next = simReducer(state, { type: 'RETURN_TO_OVERVIEW' });
    expect(next.phase).toBe('overview');
    expect(next.site).toBeNull();
    expect(next.prediction).toBeNull();
  });

  it('selects a site and moves to predicting', () => {
    const next = simReducer(at('focused'), { type: 'SELECT_SITE', site: 'hand' });
    expect(next.phase).toBe('predicting');
    expect(next.site).toBe('hand');
  });

  it('records a prediction and reveals', () => {
    const next = simReducer(at('predicting', { site: 'hand' }), { type: 'SUBMIT_PREDICTION', choice: 'fingers' });
    expect(next.phase).toBe('revealed');
    expect(next.prediction).toBe('fingers');
  });

  it('skips prediction straight to revealed with no prediction recorded', () => {
    const next = simReducer(at('predicting', { site: 'hand' }), { type: 'SKIP_PREDICTION' });
    expect(next.phase).toBe('revealed');
    expect(next.prediction).toBeNull();
  });

  it('advances to rehab at week 0', () => {
    const next = simReducer(at('revealed', { site: 'hand' }), { type: 'ADVANCE_TO_REHAB' });
    expect(next.phase).toBe('rehab');
    expect(next.rehabWeek).toBe(0);
  });

  it('scrubs the rehab week', () => {
    expect(simReducer(at('rehab', { site: 'hand' }), { type: 'SET_REHAB_WEEK', week: 8 }).rehabWeek).toBe(8);
  });

  it('resets to focused without leaving the level', () => {
    const state = at('rehab', { site: 'hand', prediction: 'arm', rehabWeek: 12 });
    const next = simReducer(state, { type: 'RESET_SCENARIO' });
    expect(next.phase).toBe('focused');
    expect(next.site).toBeNull();
    expect(next.prediction).toBeNull();
    expect(next.rehabWeek).toBe(0);
  });

  it('ignores actions that do not apply to the current phase', () => {
    const state = at('overview');
    expect(simReducer(state, { type: 'SELECT_SITE', site: 'hand' })).toBe(state);
    expect(simReducer(state, { type: 'SET_REHAB_WEEK', week: 4 })).toBe(state);
  });
});
