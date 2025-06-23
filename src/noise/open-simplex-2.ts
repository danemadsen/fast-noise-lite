import { prime } from "../constants";
import { NoiseOptions } from "../types";
import { gradientCoordinateR2, gradientCoordinateR3 } from "../utilities";

export function openSimplex2R2(options: NoiseOptions, x: number, y: number): number {
    const seed = options.seed;

    const SQRT3 = 1.7320508075688772935274463415059;
    const G2 = (3 - SQRT3) / 6;

    let i = Math.floor(x);
    let j = Math.floor(y);
    let xi = x - i;
    let yi = y - j;

    let t = (xi + yi) * G2;
    let x0 = xi - t;
    let y0 = yi - t;

    i = Math.imul(i, prime.x);
    j = Math.imul(j, prime.y);

    let n0, n1, n2;

    let a = 0.5 - x0 * x0 - y0 * y0;

    if (a <= 0) {
        n0 = 0;
    } else {
        n0 = a * a * (a * a) * gradientCoordinateR2(seed, i, j, x0, y0);
    }

    let c = 2 * (1 - 2 * G2) * (1 / G2 - 2) * t + (-2 * (1 - 2 * G2) * (1 - 2 * G2) + a);

    if (c <= 0) {
        n2 = 0;
    } else {
        let x2 = x0 + (2 * G2 - 1);
        let y2 = y0 + (2 * G2 - 1);
        n2 = c * c * (c * c) * gradientCoordinateR2(seed, i + prime.x, j + prime.y, x2, y2);
    }

    if (y0 > x0) {
        let x1 = x0 + G2;
        let y1 = y0 + (G2 - 1);
        let b = 0.5 - x1 * x1 - y1 * y1;
        if (b <= 0) {
            n1 = 0;
        } else {
            n1 = b * b * (b * b) * gradientCoordinateR2(seed, i, j + prime.y, x1, y1);
        }
    } else {
        let x1 = x0 + (G2 - 1);
        let y1 = y0 + G2;
        let b = 0.5 - x1 * x1 - y1 * y1;
        if (b <= 0) {
            n1 = 0;
        } else {
            n1 = b * b * (b * b) * gradientCoordinateR2(seed, i + prime.x, j, x1, y1);
        }
    }
    return (n0 + n1 + n2) * 99.83685446303647;
}

export function openSimplex2R3(options: NoiseOptions, x: number, y: number, z: number): number {
    const seed = options.seed;

    let i = Math.round(x);
    let j = Math.round(y);
    let k = Math.round(z);
    let x0 = x - i;
    let y0 = y - j;
    let z0 = z - k;

    let yNSign = Math.trunc((-1.0 - y0) | 1);
    let xNSign = Math.trunc((-1.0 - x0) | 1);
    let zNSign = Math.trunc((-1.0 - z0) | 1);

    let ax0 = xNSign * -x0;
    let ay0 = yNSign * -y0;
    let az0 = zNSign * -z0;
    i = Math.imul(i, prime.x);
    j = Math.imul(j, prime.y);
    k = Math.imul(k, prime.z);

    let value = 0;
    let a = 0.6 - x0 * x0 - (y0 * y0 + z0 * z0);

    for (let l = 0; ; l++) {
        if (a > 0) {
            value += a * a * (a * a) * gradientCoordinateR3(seed, i, j, k, x0, y0, z0);
        }
    
        if (ax0 >= ay0 && ax0 >= az0) {
            let b = a + ax0 + ax0;
            if (b > 1) {
                b -= 1;
                value +=
                    b *
                    b *
                    (b * b) *
                    gradientCoordinateR3(
                        seed,
                        i - xNSign * prime.x,
                        j,
                        k,
                        x0 + xNSign,
                        y0,
                        z0
                    );
            }
        } else if (ay0 > ax0 && ay0 >= az0) {
            let b = a + ay0 + ay0;
            if (b > 1) {
                b -= 1;
                value +=
                    b *
                    b *
                    (b * b) *
                    gradientCoordinateR3(
                        seed,
                        i,
                        j - yNSign * prime.y,
                        k,
                        x0,
                        y0 + yNSign,
                        z0
                    );
            }
        } else {
            let b = a + az0 + az0;
            if (b > 1) {
                b -= 1;
                value +=
                    b *
                    b *
                    (b * b) *
                    gradientCoordinateR3(
                        seed,
                        i,
                        j,
                        k - zNSign * prime.z,
                        x0,
                        y0,
                        z0 + zNSign
                    );
            }
        }
    
        if (l === 1) {
            break;
        }
    
        ax0 = 0.5 - ax0;
        ay0 = 0.5 - ay0;
        az0 = 0.5 - az0;
    
        x0 = xNSign * ax0;
        y0 = yNSign * ay0;
        z0 = zNSign * az0;
    
        a += 0.75 - ax0 - (ay0 + az0);
    
        i += (xNSign >> 1) & prime.x;
        j += (yNSign >> 1) & prime.y;
        k += (zNSign >> 1) & prime.z;
    
        xNSign = -xNSign;
        yNSign = -yNSign;
        zNSign = -zNSign;
    
        options.seed = ~seed;
    }
    return value * 32.69428253173828125;
}