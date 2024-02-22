export class RndRoot {
    private seed: number;

    constructor(seed: number) {
        this.seed = seed;
    }

    getSeed(): number { return this.seed; }
    setSeed(newSeed: number) { this.seed = newSeed; }

    /**
     * Generate a seeded pseudo-random number between 0 and 1.
     */
    srand(): number {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }
}

export class RndBase extends RndRoot {
    private static instance: RndBase | null = null;
    private constructor() {super(99);}
    /**
     * Generate a random number between `lower` (inclusive) and `higher` (exclusive).
     * @param lower The lower bound
     * @param higher The upper bound
     */
    randomInRange(lower: number, higher: number = 0): number {
        if (higher === 0) {
            [lower, higher] = [0, lower];
        }

        if (lower > higher) {
            [lower, higher] = [higher, lower];
        }

        const range = higher - lower;
        const draw = this.srand() * range;
        return Math.floor(draw) + lower;
    }

    /**
     * Generate a random number between `lower` and `higher` (both inclusive).
     * @param lower The lower bound
     * @param higher The upper bound
     */
    randomInRangeClosed(lower: number, higher: number): number {
        return this.randomInRange(lower, higher + 1);
    }

    /**
     * Returns true roughly 1 out of N times.
     * @param N The divisor
     */
    hasOneInChance(N: number): boolean { 
        return this.randomInRange(N) === 0;
    }

    static getInstance(): RndBase {
        if (!RndBase.instance) {
            RndBase.instance = new RndBase();
        }
        return RndBase.instance;
    }

}
