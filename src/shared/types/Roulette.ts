export type RouletteResult = number;

export interface RouletteConfig {
  min: number;
  max: number;
  uniqueMode?: boolean;
}

export interface IRouletteEngine {
  spin(): RouletteResult;
  getLastResult(): RouletteResult | null;
  getHistory(): RouletteResult[];
  reset(): void;
  getConfig(): RouletteConfig;
  getRemainingCount(): number;
}
