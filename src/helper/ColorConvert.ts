
export function hexToRgbHex(hex: string) {
    // Remove the '#' if it exists
    hex = hex.replace(/^#/, '');

    // Extract the red, green, and blue parts
    const r = "0x"+ hex.substring(0, 2);
    const g = "0x"+hex.substring(2, 4);
    const b = "0x"+hex.substring(4, 6);

    return [r, g, b];  // Return the RGB values as a list in hex
}

