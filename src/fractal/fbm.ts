import { generateNoiseSingleR2, generateNoiseSingleR3 } from "../noise";
import { NoiseOptions } from "../types";
import { lerp } from "../utilities";

export function generateFractalFBmR2(options: NoiseOptions, x: number, y: number): number {
    options.seed++;
    let sum = 0;
    let amp = options.fractalBounding!;

    for (let i = 0; i < options.octaves!; i++) {
        let noise = generateNoiseSingleR2(options, x, y);
        sum += noise * amp;
        amp *= lerp(1.0, Math.min(noise + 1, 2) * 0.5, (options.weightedStrength ?? 0.0));

        x *= options.lacunarity!;
        y *= options.lacunarity!;
        amp *= options.gain!;
    }

    return sum;
}

export function generateFractalFBmR3(options: NoiseOptions, x: number, y: number, z: number): number {
    options.seed++;
    let sum = 0;
    let amp = options.fractalBounding!;

    for (let i = 0; i < options.octaves!; i++) {
        let noise = generateNoiseSingleR3(options, x, y, z);
        sum += noise * amp;
        amp *= lerp(1.0, (noise + 1) * 0.5, (options.weightedStrength ?? 0.0));

        x *= options.lacunarity!;
        y *= options.lacunarity!;
        z *= options.lacunarity!;
        amp *= options.gain!;
    }
    return sum;
}