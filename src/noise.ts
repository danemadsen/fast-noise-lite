import { generateFractalFBmR2, generateFractalFBmR3 } from "./fractal/fbm";
import { generateFractalPingPongR2, generateFractalPingPongR3 } from "./fractal/ping-pong";
import { generateFractalRidgedR2, generateFractalRidgedR3 } from "./fractal/ridged";
import { cellularR2, cellularR3 } from "./noise/cellular";
import { openSimplex2R2, openSimplex2R3 } from "./noise/open-simplex-2";
import { openSimplex2SR2, openSimplex2SR3 } from "./noise/open-simplex-2s";
import { perlinR2, perlinR3 } from "./noise/perlin";
import { valueR2, valueR3 } from "./noise/value";
import { valueCubicR2, valueCubicR3 } from "./noise/value-cubic";
import { NoiseOptions } from "./types";

export function generateNoiseSingleR2(options: NoiseOptions, x: number, y: number): number {
    switch (options.noiseType) {
        case "open-simplex-2":
            return openSimplex2R2(options, x, y);
        case "open-simplex-2s":
            return openSimplex2SR2(options, x, y);
        case "cellular":
            return cellularR2(options, x, y);
        case "perlin":
            return perlinR2(options, x, y);
        case "value-cubic":
            return valueCubicR2(options, x, y);
        case "value":
            return valueR2(options, x, y);
        default:
            return 0;
    }
}

export function generateNoiseSingleR3(options: NoiseOptions, x: number, y: number, z: number): number {
    switch (options.noiseType) {
        case "open-simplex-2":
            return openSimplex2R3(options, x, y, z);
        case "open-simplex-2s":
            return openSimplex2SR3(options, x, y, z);
        case "cellular":
            return cellularR3(options, x, y, z);
        case "perlin":
            return perlinR3(options, x, y, z);
        case "value-cubic":
            return valueCubicR3(options, x, y, z);
        case "value":
            return valueR3(options, x, y, z);
        default:
            return 0;
    }
}

export function generateNoise(options: NoiseOptions, x: number, y: number, z?: number): number {
    x *= options.frequency;
    y *= options.frequency;
    
    if (z === undefined) {
        switch (options.noiseType) {
            case "open-simplex-2":
            case "open-simplex-2s":
                const SQRT3 = 1.7320508075688772935274463415059;
                const F2 = 0.5 * (SQRT3 - 1);
                let t = (x + y) * F2;
                x += t;
                y += t;
                break;
            default:
                break;
        }

        switch (options.fractalType) {
            default:
                return generateNoiseSingleR2(options, x, y);
            case "fbm":
                return generateFractalFBmR2(options, x, y);
            case "ridged":
                return generateFractalRidgedR2(options, x, y);
            case "ping-pong":
                return generateFractalPingPongR2(options, x, y);
        }
    }

    z *= options.frequency;
    
    switch (options.transformType3D) {
        case "improve-xy-planes": {
            let xy = x + y;
            let s2 = xy * -0.211324865405187;
            z *= 0.577350269189626;
            x += s2 - z;
            y += s2 - z;
            z += xy * 0.577350269189626;
            break;
        }
        case "improve-xz-planes": {
            let xz = x + z;
            let s2 = xz * -0.211324865405187;
            y *= 0.577350269189626;
            x += s2 - y;
            z += s2 - y;
            y += xz * 0.577350269189626;
            break;
        }
        case "default-open-simplex-2":
            const R3 = 2.0 / 3.0;
            let r = (x + y + z) * R3;
            x = r - x;
            y = r - y;
            z = r - z;
            break;
        default:
            break;
    }

    switch (options.fractalType) {
        default:
            return generateNoiseSingleR3(options, x, y, z);
        case "fbm":
            return generateFractalFBmR3(options, x, y, z);
        case "ridged":
            return generateFractalRidgedR3(options, x, y, z);
        case "ping-pong":
            return generateFractalPingPongR3(options, x, y, z);
    }
}
