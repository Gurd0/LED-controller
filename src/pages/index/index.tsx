/** @format */

import { useState, useEffect } from "react";

import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import LedsComp from "@/components/index/ledsComp";
import { connectDevice, connectDeviceFromServer } from "@/helper/connectDevice";
import { CommandUtils } from "@/helper/CommandUtils";
import { hexToRgbHex } from "@/helper/ColorConvert";

interface LED {
  id: number;
  name: string;
  isOn: boolean;
  isConnected: boolean;
  color: string;
  characteristic?: any;
  device?: Device;
}
interface Device {
  deviceId: any;
  serviceUUID?: any;
  characteristicUUID: any;
}

export default function LEDControl() {
  const utils = new CommandUtils();
  const [leds, setLeds] = useState<LED[]>([]);
  const [nextId, setNextId] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const storedDeviceInfo = localStorage.getItem("bleLeds");

    if (storedDeviceInfo) {
      let tempLeds: LED[] = JSON.parse(storedDeviceInfo);
      tempLeds.map((led) => (led.isConnected = false));
      console.log(storedDeviceInfo);

      setLeds(tempLeds);
      setNextId(tempLeds.length);
    } else {
      const exampleLeds: LED[] = [];
      setLeds(exampleLeds);
    }
  }, []);

  useEffect(() => {
    if (leds.length != 0) {
      console.log("local data update");
      localStorage.setItem("bleLeds", JSON.stringify(leds));
    }
  }, [leds]);

  const reconectDevice = async () => {
    try {
      console.log("Getting existing permitted Bluetooth devices...");
      const devices = await navigator.bluetooth.getDevices();

      console.log("> Got " + devices.length + " Bluetooth devices.");
      // These devices may not be powered on or in range, so scan for
      // advertisement packets from them before connecting.
      for (const device of devices) {
        connectToBluetoothDevice(device);
      }
    } catch (error) {
      console.log("Argh! " + error);
    }
  };
  async function connectToBluetoothDevice(device: any) {
    const abortController = new AbortController();

    device.addEventListener(
      "advertisementreceived",
      async () => {
        console.log('> Received advertisement from "' + device.name + '"...');
        // Stop watching advertisements to conserve battery life.
        abortController.abort();
        console.log('Connecting to GATT Server from "' + device.name + '"...');
        try {
          //TODO add if to update right device.
          const server = await device.gatt.connect();
          console.log('> Bluetooth device "' + device.name + " connected.");
          connectDeviceFromServer(server).then((device) => {
            //TODO clean this up
            leds.map((led, index) => {
              if (led.device?.characteristicUUID == device.uuid) {
                console.log("does if run ???? ");
                const ledsTemp = leds;
                ledsTemp[index].characteristic = device;
                ledsTemp[index].isConnected = true;
                setLeds(ledsTemp);
              }
            });
          });
          console.log("Jippi");
        } catch (error) {
          console.log("Argh! " + error);
        }
      },
      { once: true }
    );

    try {
      console.log('Watching advertisements from "' + device.name + '"...');
      await device.watchAdvertisements({ signal: abortController.signal });
    } catch (error) {
      console.log("Argh! " + error);
    }
  }
  const addLed = async () => {
    await connectDevice().then((device) => {
      console.log(device);
      const newLedId = nextId;
      setLeds([
        ...leds,
        {
          id: newLedId,
          name: `LED-${String(newLedId).padStart(3, "0")}`,
          isOn: false,
          isConnected: true,
          color: "#ffffff",
          characteristic: device,
          device: {
            deviceId: newLedId,
            serviceUUID: device.service?.uuid,
            characteristicUUID: device.uuid,
          },
        },
      ]);
      setNextId(nextId + 1);
    });
  };

  const removeLed = (id: number) => {
    setLeds(leds.filter((led) => led.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
  };

  const toggleLed = (id: number) => {
    setLeds(
      leds.map((led) => (led.id === id ? { ...led, isOn: !led.isOn } : led))
    );
    leds.map(async (led) => {
      if (led.id === id && led.characteristic) {
        const onOffCommand = utils.createOnOffCommand(!led.isOn);
        await led.characteristic.writeValue(onOffCommand);
      }
    });
  };
  let debounceTimer: NodeJS.Timeout;
  const changeLedColor = (id: number, color: string) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer); // Stops lights from going (╯‵□′)╯︵┻━┻
    }

    debounceTimer = setTimeout(async () => {
      setLeds(leds.map((led) => (led.id === id ? { ...led, color } : led)));

      leds.map(async (led) => {
        if (led.id === id && led.characteristic) {
          const rgbHex = hexToRgbHex(color);
          const colorRgb = utils.createColorCommand(
            rgbHex[0],
            rgbHex[1],
            rgbHex[2]
          );
          await led.characteristic.writeValue(colorRgb);
        }
      });
    }, 10);
  };

  const startEditing = (id: number) => {
    setEditingId(id);
  };

  const finishEditing = (id: number, newName: string) => {
    setLeds(
      leds.map((led) =>
        led.id === id ? { ...led, name: newName.trim() || led.name } : led
      )
    );
    setEditingId(null);
  };

  const turnAllOn = () => {
    setLeds(leds.map((led) => ({ ...led, isOn: true })));
  };

  const turnAllOff = () => {
    setLeds(leds.map((led) => ({ ...led, isOn: false })));
  };

  return (
    <div className='min-h-screen bg-gray-100'>
      <header className='bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 shadow-lg'>
        <div className='container mx-auto'>
          <h1 className='text-4xl font-bold mb-2 text-center'>
            Bluetooth LED Control Panel
          </h1>
        </div>
      </header>

      <main className='container mx-auto p-4'>
        <div className='mb-4 flex justify-center'>
          <Button onClick={addLed} className='mr-2'>
            <PlusIcon className='w-4 h-4 mr-2' />
            Add Bluetooth LED
          </Button>
          <Button onClick={turnAllOn} className='mr-2'>
            Turn All On
          </Button>
          <Button onClick={turnAllOff} variant='outline'>
            Turn All Off
          </Button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {leds.map((led) => (
            <LedsComp
              led={led}
              setLeds={setLeds}
              editingId={editingId}
              finishEditing={finishEditing}
              startEditing={startEditing}
              removeLed={removeLed}
              toggleLed={toggleLed}
              changeLedColor={changeLedColor}
              reconectDevice={reconectDevice}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
