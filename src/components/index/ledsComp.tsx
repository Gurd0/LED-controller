/** @format */

import React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Edit2Icon, LightbulbIcon, MinusIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface Props {
  led: any;
  setLeds: any;
  editingId: any;
  finishEditing: any;
  startEditing: any;
  removeLed: any;
  toggleLed: any;
  changeLedColor: any;
  reconectDevice: any;
}

const LedsComp = ({
  led,
  editingId,
  finishEditing,
  startEditing,
  removeLed,
  toggleLed,
  changeLedColor,
  reconectDevice,
}: Props) => {
  return (
    <div key={led.id} className='bg-white border p-4 rounded-lg shadow-sm'>
      <div className='flex justify-between items-center mb-2'>
        {editingId === led.id ? (
          <Input
            type='text'
            defaultValue={led.name}
            onBlur={(e) => finishEditing(led.id, e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                finishEditing(led.id, (e.target as HTMLInputElement).value);
              }
            }}
            className='mr-2'
            autoFocus
          />
        ) : (
          <span className='font-semibold'>{led.name}</span>
        )}
        <div>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => startEditing(led.id)}
            className='mr-1'
          >
            <Edit2Icon className='w-4 h-4' />
          </Button>
          <Button variant='ghost' size='icon' onClick={() => removeLed(led.id)}>
            <MinusIcon className='w-4 h-4' />
          </Button>
        </div>
      </div>
      <div className='flex items-center mb-2'>
        <LightbulbIcon
          className='w-8 h-8 mr-2 transition-colors duration-300'
          style={{ color: led.isOn ? led.color : "#4b5563" }}
        />
        <Button
          onClick={() => toggleLed(led.id)}
          variant={led.isOn ? "default" : "outline"}
        >
          {led.isOn ? "Turn Off" : "Turn On"}
        </Button>
        {!led.isConnected && !led.isConnecting ? (
          <Button onClick={() => reconectDevice(led.id)}>Connect</Button>
        ) : (
          <>
            {led.isConnecting ? (
              <Skeleton className=''>
                <Button>Connect</Button>
              </Skeleton>
            ) : (
              <Button>Disconnect</Button>
            )}
          </>
        )}
      </div>
      <div className='flex items-center'>
        <Label htmlFor={`color-${led.id}`} className='mr-2'>
          Color:
        </Label>
        <Input
          id={`color-${led.id}`}
          type='color'
          value={led.color}
          onChange={(e) => changeLedColor(led.id, e.target.value)}
          className='w-12 h-8 p-0 border-none'
        />
        <span className='ml-2'>{led.color}</span>
      </div>
    </div>
  );
};

export default LedsComp;
