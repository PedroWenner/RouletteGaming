import { RouletteResult, RouletteConfig, IRouletteEngine } from '../../shared/types/Roulette';

export class RouletteEngine implements IRouletteEngine {
  private min: number;
  private max: number;
  private uniqueMode: boolean;
  private history: RouletteResult[] = [];
  private lastResult: RouletteResult | null = null;
  private availableNumbers: number[] = [];

  constructor(config: RouletteConfig) {
    this.validateConfig(config);
    this.min = Math.floor(config.min);
    this.max = Math.floor(config.max);
    this.uniqueMode = !!config.uniqueMode;
    
    if (this.uniqueMode) {
      this.initializeAvailableNumbers();
    }
  }

  private validateConfig(config: RouletteConfig): void {
    if (config.min > config.max) {
      throw new Error('Invalid range: min cannot be greater than max');
    }
    if (config.min < 0 || config.max < 0) {
      throw new Error('Invalid range: numbers must be non-negative');
    }
    if (!Number.isInteger(config.min) || !Number.isInteger(config.max)) {
      // We'll floor them in constructor but let's warn or throw if strictly required
    }
  }

  private initializeAvailableNumbers(): void {
    this.availableNumbers = [];
    for (let i = this.min; i <= this.max; i++) {
      this.availableNumbers.push(i);
    }
    this.shuffleAvailableNumbers();
  }

  private shuffleAvailableNumbers(): void {
    for (let i = this.availableNumbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.availableNumbers[i], this.availableNumbers[j]] = [this.availableNumbers[j], this.availableNumbers[i]];
    }
  }

  public spin(): RouletteResult {
    let result: number;

    if (this.uniqueMode) {
      if (this.availableNumbers.length === 0) {
        // Auto-reset unique numbers if all drawn
        this.initializeAvailableNumbers();
      }
      result = this.availableNumbers.pop()!;
    } else {
      result = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
    }

    this.lastResult = result;
    this.history.push(result);
    return result;
  }

  public getLastResult(): RouletteResult | null {
    return this.lastResult;
  }

  public getHistory(): RouletteResult[] {
    return [...this.history];
  }

  public reset(): void {
    this.history = [];
    this.lastResult = null;
    if (this.uniqueMode) {
      this.initializeAvailableNumbers();
    }
  }

  public getRemainingCount(): number {
    return this.availableNumbers.length;
  }

  public getConfig(): RouletteConfig {
    return {
      min: this.min,
      max: this.max,
      uniqueMode: this.uniqueMode,
    };
  }
}
