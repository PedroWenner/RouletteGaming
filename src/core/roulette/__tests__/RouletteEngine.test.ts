import { describe, it, expect, beforeEach } from 'vitest';
import { RouletteEngine } from '../RouletteEngine';

describe('RouletteEngine', () => {
  it('should generate numbers within range', () => {
    const engine = new RouletteEngine({ min: 1, max: 10 });
    for (let i = 0; i < 100; i++) {
      const result = engine.spin();
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
    }
  });

  it('should throw error for invalid range', () => {
    expect(() => new RouletteEngine({ min: 10, max: 1 })).toThrow();
  });

  it('should maintain history', () => {
    const engine = new RouletteEngine({ min: 1, max: 100 });
    const r1 = engine.spin();
    const r2 = engine.spin();
    expect(engine.getHistory()).toEqual([r1, r2]);
    expect(engine.getLastResult()).toBe(r2);
  });

  it('should respect unique mode', () => {
    const engine = new RouletteEngine({ min: 1, max: 3, uniqueMode: true });
    const results = new Set();
    results.add(engine.spin());
    results.add(engine.spin());
    results.add(engine.spin());
    expect(results.size).toBe(3);
    
    // Fourth spin should auto-reset and allow a previous number
    const r4 = engine.spin();
    expect([1, 2, 3]).toContain(r4);
  });

  it('should reset correctly', () => {
    const engine = new RouletteEngine({ min: 1, max: 10 });
    engine.spin();
    engine.reset();
    expect(engine.getHistory()).toEqual([]);
    expect(engine.getLastResult()).toBeNull();
  });
});
