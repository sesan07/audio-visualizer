import { RGBA } from 'ngx-color';

export interface ICircleContentConfig {
    isEmitted: boolean;
    amplitudes: Uint8Array;
    startColor: RGBA;
    endColor: RGBA;
    multiplier: number;
    sampleCount: number;
    shadowBlur: number;
    randomizeColors: boolean;
    baseRadius: number;
    sampleRadius: number;
}