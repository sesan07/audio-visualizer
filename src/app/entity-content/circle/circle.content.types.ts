import { RGBA } from 'ngx-color';

export interface CircleContent {
    isEmitted: boolean;
    startColor: RGBA;
    endColor: RGBA;
    multiplier: number;
    sampleCount: number;
    shadowBlur: number;
    randomStartColor?: boolean;
    randomEndColor?: boolean;
    baseRadius: number;
    sampleRadius: number;
}
