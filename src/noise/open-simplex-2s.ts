import { prime } from "../constants";
import { NoiseOptions } from "../types";
import { gradientCoordinateR2, gradientCoordinateR3 } from "../utilities";

export function openSimplex2SR2(options: NoiseOptions, x: number, y: number): number {
    const seed = options.seed;

    const SQRT3 = 1.7320508075688772935274463415059;
    const G2 = (3 - SQRT3) / 6;

    let i = Math.floor(x);
    let j = Math.floor(y);
    let xi = x - i;
    let yi = y - j;

    i = Math.imul(i, prime.x);
    j = Math.imul(j, prime.y);
    let i1 = i + prime.x;
    let j1 = j + prime.y;

    let t = (xi + yi) * G2;
    let x0 = xi - t;
    let y0 = yi - t;

    let a0 = 2.0 / 3.0 - x0 * x0 - y0 * y0;
    let value = a0 * a0 * (a0 * a0) * gradientCoordinateR2(seed, i, j, x0, y0);
    let a1 = 2 * (1 - 2 * G2) * (1 / G2 - 2) * t + (-2 * (1 - 2 * G2) * (1 - 2 * G2) + a0);
    let x1 = x0 - (1 - 2 * G2);
    let y1 = y0 - (1 - 2 * G2);
    value += a1 * a1 * (a1 * a1) * gradientCoordinateR2(seed, i1, j1, x1, y1);

    // Nested conditionals were faster than compact bit logic/arithmetic.
    let xmyi = xi - yi;
    if (t > G2) {
        if (xi + xmyi > 1) {
            let x2 = x0 + (3 * G2 - 2);
            let y2 = y0 + (3 * G2 - 1);
            let a2 = 2.0 / 3.0 - x2 * x2 - y2 * y2;
            if (a2 > 0) {
                value +=
                    a2 *
                    a2 *
                    (a2 * a2) *
                    gradientCoordinateR2(seed, i + (prime.x << 1), j + prime.y, x2, y2);
            }
        } else {
            let x2 = x0 + G2;
            let y2 = y0 + (G2 - 1);
            let a2 = 2.0 / 3.0 - x2 * x2 - y2 * y2;
            if (a2 > 0) {
                value +=
                    a2 * a2 * (a2 * a2) * gradientCoordinateR2(seed, i, j + prime.y, x2, y2);
            }
        }
    
        if (yi - xmyi > 1) {
            let x3 = x0 + (3 * G2 - 1);
            let y3 = y0 + (3 * G2 - 2);
            let a3 = 2.0 / 3.0 - x3 * x3 - y3 * y3;
            if (a3 > 0) {
                value +=
                    a3 *
                    a3 *
                    (a3 * a3) *
                    gradientCoordinateR2(seed, i + prime.x, j + (prime.y << 1), x3, y3);
            }
        } else {
            let x3 = x0 + (G2 - 1);
            let y3 = y0 + G2;
            let a3 = 2.0 / 3.0 - x3 * x3 - y3 * y3;
            if (a3 > 0) {
                value +=
                    a3 * a3 * (a3 * a3) * gradientCoordinateR2(seed, i + prime.x, j, x3, y3);
            }
        }
    } else {
        if (xi + xmyi < 0) {
            let x2 = x0 + (1 - G2);
            let y2 = y0 - G2;
            let a2 = 2.0 / 3.0 - x2 * x2 - y2 * y2;
            if (a2 > 0) {
                value +=
                    a2 * a2 * (a2 * a2) * gradientCoordinateR2(seed, i - prime.x, j, x2, y2);
            }
        } else {
            let x2 = x0 + (G2 - 1);
            let y2 = y0 + G2;
            let a2 = 2.0 / 3.0 - x2 * x2 - y2 * y2;
            if (a2 > 0) {
                value +=
                    a2 * a2 * (a2 * a2) * gradientCoordinateR2(seed, i + prime.x, j, x2, y2);
            }
        }
    
        if (yi < xmyi) {
            let x2 = x0 - G2;
            let y2 = y0 - (G2 - 1);
            let a2 = 2.0 / 3.0 - x2 * x2 - y2 * y2;
            if (a2 > 0) {
                value +=
                    a2 * a2 * (a2 * a2) * gradientCoordinateR2(seed, i, j - prime.y, x2, y2);
            }
        } else {
            let x2 = x0 + G2;
            let y2 = y0 + (G2 - 1);
            let a2 = 2.0 / 3.0 - x2 * x2 - y2 * y2;
            if (a2 > 0) {
                value +=
                    a2 * a2 * (a2 * a2) * gradientCoordinateR2(seed, i, j + prime.y, x2, y2);
            }
        }
    }

    return value * 18.24196194486065;
}

export function openSimplex2SR3(options: NoiseOptions, x: number, y: number, z: number): number {
    const seed = options.seed;

    let i = Math.floor(x);
    let j = Math.floor(y);
    let k = Math.floor(z);
    let xi = x - i;
    let yi = y - j;
    let zi = z - k;

    i = Math.imul(i, prime.x);
    j = Math.imul(j, prime.y);
    k = Math.imul(k, prime.z);
    let seed2 = seed + 1293373;

    let xNMask = Math.trunc(-0.5 - xi);
    let yNMask = Math.trunc(-0.5 - yi);
    let zNMask = Math.trunc(-0.5 - zi);

    let x0 = xi + xNMask;
    let y0 = yi + yNMask;
    let z0 = zi + zNMask;
    let a0 = 0.75 - x0 * x0 - y0 * y0 - z0 * z0;
    let value =
        a0 *
        a0 *
        (a0 * a0) *
        gradientCoordinateR3(
            seed,
            i + (xNMask & prime.x),
            j + (yNMask & prime.y),
            k + (zNMask & prime.z),
            x0,
            y0,
            z0
        );
    
    let x1 = xi - 0.5;
    let y1 = yi - 0.5;
    let z1 = zi - 0.5;
    let a1 = 0.75 - x1 * x1 - y1 * y1 - z1 * z1;
    value +=
        a1 *
        a1 *
        (a1 * a1) *
        gradientCoordinateR3(seed2, i + prime.x, j + prime.y, k + prime.z, x1, y1, z1);
    
    let xAFlipMask0 = ((xNMask | 1) << 1) * x1;
    let yAFlipMask0 = ((yNMask | 1) << 1) * y1;
    let zAFlipMask0 = ((zNMask | 1) << 1) * z1;
    let xAFlipMask1 = (-2 - (xNMask << 2)) * x1 - 1.0;
    let yAFlipMask1 = (-2 - (yNMask << 2)) * y1 - 1.0;
    let zAFlipMask1 = (-2 - (zNMask << 2)) * z1 - 1.0;
    
    let skip5 = false;
    let a2 = xAFlipMask0 + a0;
    if (a2 > 0) {
        let x2 = x0 - (xNMask | 1);
        value +=
            a2 *
            a2 *
            (a2 * a2) *
            gradientCoordinateR3(
                seed,
                i + (~xNMask & prime.x),
                j + (yNMask & prime.y),
                k + (zNMask & prime.z),
                x2,
                y0,
                z0
            );
    } else {
        let a3 = yAFlipMask0 + zAFlipMask0 + a0;
    
        if (a3 > 0) {
            let x3 = x0;
            let y3 = y0 - (yNMask | 1);
            let z3 = z0 - (zNMask | 1);
            value +=
                a3 *
                a3 *
                (a3 * a3) *
                gradientCoordinateR3(
                    seed,
                    i + (xNMask & prime.x),
                    j + (~yNMask & prime.y),
                    k + (~zNMask & prime.z),
                    x3,
                    y3,
                    z3
                );
        }
    
        let a4 = xAFlipMask1 + a1;
        if (a4 > 0) {
            let x4 = (xNMask | 1) + x1;
            value +=
                a4 *
                a4 *
                (a4 * a4) *
                gradientCoordinateR3(
                    seed2,
                    i + (xNMask & (prime.x * 2)),
                    j + prime.y,
                    k + prime.z,
                    x4,
                    y1,
                    z1
                );
            skip5 = true;
        }
    }

    let skip9 = false;
    let a6 = yAFlipMask0 + a0;
    if (a6 > 0) {
        let x6 = x0;
        let y6 = y0 - (yNMask | 1);
        value +=
            a6 *
            a6 *
            (a6 * a6) *
            gradientCoordinateR3(
                seed,
                i + (xNMask & prime.x),
                j + (~yNMask & prime.y),
                k + (zNMask & prime.z),
                x6,
                y6,
                z0
            );
    } else {
        let a7 = xAFlipMask0 + zAFlipMask0 + a0;
        if (a7 > 0) {
            let x7 = x0 - (xNMask | 1);
            let y7 = y0;
            let z7 = z0 - (zNMask | 1);
            value +=
                a7 *
                a7 *
                (a7 * a7) *
                gradientCoordinateR3(
                    seed,
                    i + (~xNMask & prime.x),
                    j + (yNMask & prime.y),
                    k + (~zNMask & prime.z),
                    x7,
                    y7,
                    z7
                );
        }
    
        let a8 = yAFlipMask1 + a1;
        if (a8 > 0) {
            let x8 = x1;
            let y8 = (yNMask | 1) + y1;
            value +=
                a8 *
                a8 *
                (a8 * a8) *
                gradientCoordinateR3(
                    seed2,
                    i + prime.x,
                    j + (yNMask & (prime.y << 1)),
                    k + prime.z,
                    x8,
                    y8,
                    z1
                );
            skip9 = true;
        }
    }

    let skipD = false;
    let aA = zAFlipMask0 + a0;
    if (aA > 0) {
        let xA = x0;
        let yA = y0;
        let zA = z0 - (zNMask | 1);
        value +=
            aA *
            aA *
            (aA * aA) *
            gradientCoordinateR3(
                seed,
                i + (xNMask & prime.x),
                j + (yNMask & prime.y),
                k + (~zNMask & prime.z),
                xA,
                yA,
                zA
            );
    } else {
        let aB = xAFlipMask0 + yAFlipMask0 + a0;
        if (aB > 0) {
            let xB = x0 - (xNMask | 1);
            let yB = y0 - (yNMask | 1);
            value +=
                aB *
                aB *
                (aB * aB) *
                gradientCoordinateR3(
                    seed,
                    i + (~xNMask & prime.x),
                    j + (~yNMask & prime.y),
                    k + (zNMask & prime.z),
                    xB,
                    yB,
                    z0
                );
        }
    
        let aC = zAFlipMask1 + a1;
        if (aC > 0) {
            let xC = x1;
            let yC = y1;
            let zC = (zNMask | 1) + z1;
            value +=
                aC *
                aC *
                (aC * aC) *
                gradientCoordinateR3(
                    seed2,
                    i + prime.x,
                    j + prime.y,
                    k + (zNMask & (prime.z << 1)),
                    xC,
                    yC,
                    zC
                );
            skipD = true;
        }
    }

    if (!skip5) {
        let a5 = yAFlipMask1 + zAFlipMask1 + a1;
        if (a5 > 0) {
            let x5 = x1;
            let y5 = (yNMask | 1) + y1;
            let z5 = (zNMask | 1) + z1;
            value +=
                a5 *
                a5 *
                (a5 * a5) *
                gradientCoordinateR3(
                    seed2,
                    i + prime.x,
                    j + (yNMask & (prime.y << 1)),
                    k + (zNMask & (prime.z << 1)),
                    x5,
                    y5,
                    z5
                );
        }
    }

    if (!skip9) {
        let a9 = xAFlipMask1 + zAFlipMask1 + a1;
        if (a9 > 0) {
            let x9 = (xNMask | 1) + x1;
            let y9 = y1;
            let z9 = (zNMask | 1) + z1;
            value +=
                a9 *
                a9 *
                (a9 * a9) *
                gradientCoordinateR3(
                    seed2,
                    i + (xNMask & (prime.x * 2)),
                    j + prime.y,
                    k + (zNMask & (prime.z << 1)),
                    x9,
                    y9,
                    z9
                );
        }
    }

    if (!skipD) {
        let aD = xAFlipMask1 + yAFlipMask1 + a1;
        if (aD > 0) {
            let xD = (xNMask | 1) + x1;
            let yD = (yNMask | 1) + y1;
            value +=
                aD *
                aD *
                (aD * aD) *
                gradientCoordinateR3(
                    seed2,
                    i + (xNMask & (prime.x << 1)),
                    j + (yNMask & (prime.y << 1)),
                    k + prime.z,
                    xD,
                    yD,
                    z1
                );
        }
    }

    return value * 9.046026385208288;
}