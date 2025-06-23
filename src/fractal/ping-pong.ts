import { generateNoiseSingleR2, generateNoiseSingleR3 } from "../noise";
import { NoiseOptions } from "../types";
import { lerp, pingPong } from "../utilities";

export function generateFractalPingPongR2(options: NoiseOptions, x: number, y: number): number {
    options.seed++;
    let sum = 0;
    let amp = options.fractalBounding!;

    for (let i = 0; i < options.octaves!; i++) {
        let noise = pingPong(
            (generateNoiseSingleR2(options, x, y) + 1) * options.pingPongStrength!
        );
        sum += (noise - 0.5) * 2 * amp;
        amp *= lerp(1.0, noise, (options.weightedStrength ?? 0.0));

        x *= options.lacunarity!;
        y *= options.lacunarity!;
        amp *= options.gain!;
    }
    return sum;
}

export function generateFractalPingPongR3(options: NoiseOptions, x: number, y: number, z: number): number {
    options.seed++;
    let sum = 0;
    let amp = options.fractalBounding!;

    for (let i = 0; i < options.octaves!; i++) {
        let noise = pingPong(
            (generateNoiseSingleR3(options, x, y, z) + 1) * options.pingPongStrength!
        );
        sum += (noise - 0.5) * 2 * amp;
        amp *= lerp(1.0, noise, (options.weightedStrength ?? 0.0));

        x *= options.lacunarity!;
        y *= options.lacunarity!;
        z *= options.lacunarity!;
        amp *= options.gain!;
    }
    return sum;
}