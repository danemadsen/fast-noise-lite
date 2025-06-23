import { prime } from "../constants";
import { NoiseOptions } from "../types";
import { gradientCoordinateR2, lerp, interpolateQuintic, gradientCoordinateR3 } from "../utilities";

export function perlinR2(options: NoiseOptions, x: number, y: number): number {
    const seed = options.seed;

    let x0 = Math.floor(x);
    let y0 = Math.floor(y);

    let xd0 = x - x0;
    let yd0 = y - y0;
    let xd1 = xd0 - 1;
    let yd1 = yd0 - 1;

    let xs = interpolateQuintic(xd0);
    let ys = interpolateQuintic(yd0);

    x0 = Math.imul(x0, prime.x);
    y0 = Math.imul(y0, prime.y);
    let x1 = x0 + prime.x;
    let y1 = y0 + prime.y;

    let xf0 = lerp(
        gradientCoordinateR2(seed, x0, y0, xd0, yd0),
        gradientCoordinateR2(seed, x1, y0, xd1, yd0),
        xs
    );

    let xf1 = lerp(
        gradientCoordinateR2(seed, x0, y1, xd0, yd1),
        gradientCoordinateR2(seed, x1, y1, xd1, yd1),
        xs
    );

    return lerp(xf0, xf1, ys) * 1.4247691104677813;
}

export function perlinR3(options: NoiseOptions, x: number, y: number, z: number): number {
    const seed = options.seed;

    let x0 = Math.floor(x);
    let y0 = Math.floor(y);
    let z0 = Math.floor(z);

    let xd0 = x - x0;
    let yd0 = y - y0;
    let zd0 = z - z0;

    let xd1 = xd0 - 1;
    let yd1 = yd0 - 1;
    let zd1 = zd0 - 1;

    let xs = interpolateQuintic(xd0);
    let ys = interpolateQuintic(yd0);
    let zs = interpolateQuintic(zd0);

    x0 = Math.imul(x0, prime.x);
    y0 = Math.imul(y0, prime.y);
    z0 = Math.imul(z0, prime.z);

    let x1 = x0 + prime.x;
    let y1 = y0 + prime.y;
    let z1 = z0 + prime.z;

    let xf00 = lerp(
        gradientCoordinateR3(seed, x0, y0, z0, xd0, yd0, zd0),
        gradientCoordinateR3(seed, x1, y0, z0, xd1, yd0, zd0),
        xs
    );

    let xf10 = lerp(
        gradientCoordinateR3(seed, x0, y1, z0, xd0, yd1, zd0),
        gradientCoordinateR3(seed, x1, y1, z0, xd1, yd1, zd0),
        xs
    );

    let xf01 = lerp(
        gradientCoordinateR3(seed, x0, y0, z1, xd0, yd0, zd1),
        gradientCoordinateR3(seed, x1, y0, z1, xd1, yd0, zd1),
        xs
    );

    let xf11 = lerp(
        gradientCoordinateR3(seed, x0, y1, z1, xd0, yd1, zd1),
        gradientCoordinateR3(seed, x1, y1, z1, xd1, yd1, zd1),
        xs
    );

    let yf0 = lerp(xf00, xf10, ys);
    let yf1 = lerp(xf01, xf11, ys);

    return lerp(yf0, yf1, zs) * 0.964921414852142333984375;
}