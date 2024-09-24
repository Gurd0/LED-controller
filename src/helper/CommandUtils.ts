export class CommandUtils {

    // Powers lights on/off
    createOnOffCommand(isOn: boolean): Uint8Array {
        return new Uint8Array([
            0x7E,
            0x04,
            0x04,
            isOn ? 1 : 0,
            0x00,
            isOn ? 1 : 0,
            0xFF,
            0x00,
            0xEF
        ]);
    }

    // Sets color of the lights
    createColorCommand(redValue: number, greenValue: number, blueValue: number): Uint8Array {
        return new Uint8Array([
            0x7E,
            0x07,
            0x05,
            0x03,
            redValue,
            greenValue,
            blueValue,
            0x10,
            0xEF
        ]);
    }

    // Sets pattern according to 1 of 29 pre-programmed patterns
    createPatternCommand(pattern: number): Uint8Array {
        pattern = Math.min(Math.max(pattern, 0), 28);  // Coerce within 0..28
        return new Uint8Array([
            0x7E,
            0x05,
            0x03,
            pattern + 128,
            0x03,
            0xFF,
            0xFF,
            0x00,
            0xEF
        ]);
    }

    // Sets speed pattern will play at
    createSpeedCommand(speed: number): Uint8Array {
        speed = Math.min(Math.max(speed, 0), 100);  // Coerce within 0..100
        return new Uint8Array([
            0x7E,
            0x04,
            0x02,
            speed,
            0xFF,
            0xFF,
            0xFF,
            0x00,
            0xEF
        ]);
    }

    // Sets brightness of the lights
    createBrightnessCommand(brightness: number): Uint8Array {
        brightness = Math.min(Math.max(brightness, 0), 100);  // Coerce within 0..100
        return new Uint8Array([
            0x7E,
            0x04,
            0x01,
            brightness,
            0xFF,
            0xFF,
            0xFF,
            0x00,
            0xEF
        ]);
    }

    // Turns light strip internal mic on/off
    createMicOnOffCommand(isOn: boolean): Uint8Array {
        return new Uint8Array([
            0x7E,
            0x04,
            0x07,
            isOn ? 1 : 0,
            0xFF,
            0xFF,
            0xFF,
            0x00,
            0xEF
        ]);
    }

    // Sets mic EQ (0 = Classic, 1 = Soft, 2 = Dynamic, 3 = Disco)
    createMicEqCommand(eqMode: number): Uint8Array {
        eqMode = Math.min(Math.max(eqMode, 0), 3);  // Coerce within 0..3
        return new Uint8Array([
            0x7E,
            0x05,
            0x03,
            eqMode + 128,
            0x04,
            0xFF,
            0xFF,
            0x00,
            0xEF
        ]);
    }

    // Sets mic sensitivity
    createMicSensitivityCommand(sensitivity: number): Uint8Array {
        sensitivity = Math.min(Math.max(sensitivity, 0), 100);  // Coerce within 0..100
        return new Uint8Array([
            0x7E,
            0x04,
            0x06,
            sensitivity,
            0xFF,
            0xFF,
            0xFF,
            0x00,
            0xEF
        ]);
    }

    // Sets light strip internal clock
    createSyncTimeCommand(): Uint8Array {
        const now = new Date();
        return new Uint8Array([
            0x7E,
            0x07,
            0x83,
            now.getHours(),
            now.getMinutes(),
            now.getSeconds(),
            (now.getDay() === 0 ? 6 : now.getDay() - 1),  // Sunday = 0, make it 6, other days are -1
            0xFF,
            0xEF
        ]);
    }

    // Sets scheduling for the lights
    createTimingCommand(hour: number, minute: number, second: number, weekdays: boolean[], isOn: boolean, isSet: boolean): Uint8Array {
        const setOrClearMask = isSet ? 128 : 0;
        const packedWeekdays = this.packWeekdays(weekdays);

        return new Uint8Array([
            0x7E,
            0x08,
            0x82,
            hour,
            minute,
            second,
            isOn ? 0x00 : 0x01,  // This is intentionally inverted
            setOrClearMask | packedWeekdays,
            0xEF
        ]);
    }

    // Packs weekdays into a bit-packed integer (list of booleans)
    packWeekdays(weekdays: boolean[]): number {
        let packed = 0;
        for (let i = 0; i < 7; i++) {
            if (weekdays[i]) {
                packed |= 1 << i;
            }
        }
        return packed;
    }

    // Reorders the RGB wires of the controller
    createOrderChangeCommand(firstWire: number, secondWire: number, thirdWire: number): Uint8Array {
        return new Uint8Array([
            0x7E,
            0x06,
            0x81,
            firstWire,
            secondWire,
            thirdWire,
            0xFF,
            0x00,
            0xEF
        ]);
    }
}
