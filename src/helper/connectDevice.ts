/** @format */

/// <reference types="web-bluetooth" />

export const connectDevice = async () => {
  return navigator.bluetooth
    .requestDevice({
      acceptAllDevices: true,
      optionalServices: ["0000fff0-0000-1000-8000-00805f9b34fb"], // Required to access service later.
    })
    .then(async (device: any) => {
      const server = await device.gatt.connect();
      console.log(server);

      const service = await server.getPrimaryService("0000fff0-0000-1000-8000-00805f9b34fb");

      const characteristics = await service.getCharacteristics(); 
      console.log(characteristics[0].uuid);
      return service.getCharacteristic(characteristics[0].uuid);
    })
    .catch((error: any) => {
      console.error(error);
    });
};
export const connectDeviceFromServer = async (server: any ) => {
  try{
    const service = await server.getPrimaryService("0000fff0-0000-1000-8000-00805f9b34fb");

    const characteristics = await service.getCharacteristics(); 
    console.log(characteristics[0].uuid);
    return service.getCharacteristic(characteristics[0].uuid);
  }catch(err){
    console.log(err)
  }
}