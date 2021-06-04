import { Color } from './visualizer.types';

export function getGradientColor(startColor: Color, endColor: Color, fadePercent): Color {
    let diffRed = endColor.red - startColor.red;
    let diffGreen = endColor.green - startColor.green;
    let diffBlue = endColor.blue - startColor.blue;

    diffRed = (diffRed * fadePercent) + startColor.red;
    diffGreen = (diffGreen * fadePercent) + startColor.green;
    diffBlue = (diffBlue * fadePercent) + startColor.blue;

    return {
        red: Math.floor(diffRed),
        green: Math.floor(diffGreen),
        blue: Math.floor(diffBlue)
    }
}

export function _convertHexToColor(hex: string): Color {
    return {
        red: parseInt(_trimHex(hex).substring(0, 2), 16),
        green: parseInt(_trimHex(hex).substring(2, 4), 16),
        blue: parseInt(_trimHex(hex).substring(4, 6), 16),
    };
}

function _trimHex (hex: string) {
    return (hex.charAt(0) == '#') ? hex.substring(1, 7) : hex
}

export function convertColorToHex(color: Color) {
    return '#' + Object.values(color).map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }).join('')
}
