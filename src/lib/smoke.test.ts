import { describe, it, expect } from 'vitest';
import { scaffoldOk } from '@lib/smoke';

describe('scaffold', () => {
  it('resolves path aliases and runs vitest', () => {
    expect(scaffoldOk()).toBe(true);
  });
});
