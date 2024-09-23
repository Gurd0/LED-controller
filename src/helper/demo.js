/** @format */

import { useEffect, useState } from "react";
import { CommandUtils } from "./helper/CommandUtils";
import "./App.css";

import Wheel from "@uiw/react-color-wheel";
import { hsvaToHex } from "@uiw/color-convert";
import { hsvToRgb, hexToRgbHex } from "./helper/ColorConvert";

function App() {
  const [devices, setDevices] = useState([]);
  const [characteristic, setCharacteristic] = useState();

  const [hsva, setHsva] = useState({ h: 214, s: 43, v: 90, a: 1 });

  const utils = new CommandUtils();

  const request = async () => {
    navigator.bluetooth
      .requestDevice({
        acceptAllDevices: true,
        optionalServices: ["0000fff0-0000-1000-8000-00805f9b34fb"], // Required to access service later.
      })
      .then((device) => {
        setDevices([device]);
        connect();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const connect = async () => {
    console.log(devices);
    const server = await devices[0].gatt.connect();
    console.log(server);

    // Step 3: Get a specific service (for example, 'battery_service')
    const service = await server.getPrimaryService(
      "0000fff0-0000-1000-8000-00805f9b34fb"
    );

    // Step 4: Get a characteristic from the service (for example, battery level)
    const characteristics = await service.getCharacteristics(); // This should be the characteristic UUID or name
    console.log(characteristics[0].uuid);
    const characteristicTemp = await service.getCharacteristic(
      characteristics[0].uuid
    );
    setCharacteristic(characteristicTemp);
  };
  const powerState = async (bool) => {
    const onOffCommand = utils.createOnOffCommand(bool);
    await characteristic.writeValue(onOffCommand);
  };

  useEffect(() => {
    const asyncFunc = async () => {
      const hex = hsvaToHex(hsva);
      const rgbHex = hexToRgbHex(hex);
      const colorRgb = utils.createColorCommand(
        rgbHex[0],
        rgbHex[1],
        rgbHex[2]
      );
      await characteristic.writeValue(colorRgb);
    };
    const timeOutId = setTimeout(() => asyncFunc(), 100);
    return () => clearTimeout(timeOutId);
  }, [hsva]);
  return (
    <div className='flex flex-col'>
      <button onClick={request}>click</button>
      {devices.map((d, index) => {
        return d.name;
      })}
      <div>
        <button onClick={() => powerState(true)}>On</button>
        <button onClick={() => powerState(false)}>Off</button>
      </div>
      <div>
        <Wheel
          color={hsva}
          onChange={(color) => setHsva({ ...hsva, ...color.hsva })}
        />
      </div>
    </div>
  );
}

export default App;
