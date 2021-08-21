import { RGB } from 'ngx-color';
import { getRandomNumber } from '../../shared/utils';

export function getGradientColor(startColor: RGB, endColor: RGB, fadePercent): RGB {
    let diffRed = endColor.r - startColor.r;
    let diffGreen = endColor.g - startColor.g;
    let diffBlue = endColor.b - startColor.b;

    diffRed = (diffRed * fadePercent) + startColor.r;
    diffGreen = (diffGreen * fadePercent) + startColor.g;
    diffBlue = (diffBlue * fadePercent) + startColor.b;

    return {
        r: Math.floor(diffRed),
        g: Math.floor(diffGreen),
        b: Math.floor(diffBlue)
    }
}

export function convertHexToColor(hex: string): RGB {
    return {
        r: parseInt(_trimHex(hex).substring(0, 2), 16),
        g: parseInt(_trimHex(hex).substring(2, 4), 16),
        b: parseInt(_trimHex(hex).substring(4, 6), 16),
    };
}

function _trimHex (hex: string) {
    return (hex.charAt(0) == '#') ? hex.substring(1, 7) : hex
}

export function convertColorToHex(color: RGB) {
    return '#' + Object.values(color).map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }).join('')
}

export function getRandomColor(): RGB {
    return {
        r: Math.round(getRandomNumber(0, 255)),
        g: Math.round(getRandomNumber(0, 255)),
        b: Math.round(getRandomNumber(0, 255))
    };
}
