
export function hexToRgbHex(hex: string): number[] {
    // Remove the '#' if it exists
    hex = hex.replace(/^#/, '');

    // Extract the red, green, and blue parts, then convert them to numbers
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return [r, g, b];  // Return the RGB values as a list of numbers
}