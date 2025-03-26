import React, { createContext, useState, useContext } from 'react';

interface Climate {
  isOn: boolean;
  temperature: number;
  fanSpeed: number;
  mode: 'face' | 'face-feet' | 'feet' | 'face-defrost';
  isAcOn: boolean;
  isRecirculationOn: boolean;
  isRearDefrostOn: boolean;
  isHeatedSeatsOn: boolean;
  cabinTemperature: number;
  autoMode?: boolean;
  recirculation?: boolean;
}

interface Vehicle {
  id: string;
  nickname: string;
  model: string;
  year: string | number;
  vin: string;
  isLocked: boolean;
  isRunning: boolean;
  fuelLevel: number;
  batteryLevel: number;
  odometerReading: number;
  climate: Climate;
}

interface VehicleContextType {
  vehicle: Vehicle;
  setVehicleState: (vehicle: Vehicle) => void;
  lockVehicle: () => void;
  unlockVehicle: () => void;
}

const defaultVehicle: Vehicle = {
  id: 'v1',
  nickname: 'My Renault',
  model: 'Captur',
  year: '2024',
  vin: 'RNLTCPT24XYZ12345',
  isLocked: true,
  isRunning: false,
  fuelLevel: 72,
  batteryLevel: 85,
  odometerReading: 3457,
  climate: {
    isOn: false,
    temperature: 22,
    fanSpeed: 2,
    mode: 'face',
    isAcOn: true,
    isRecirculationOn: false,
    isRearDefrostOn: false,
    isHeatedSeatsOn: false,
    cabinTemperature: 23,
    autoMode: false,
    recirculation: false
  }
};

const VehicleContext = createContext<VehicleContextType>({
  vehicle: defaultVehicle,
  setVehicleState: () => {},
  lockVehicle: () => {},
  unlockVehicle: () => {},
});

export const VehicleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicle, setVehicle] = useState<Vehicle>(defaultVehicle);
  
  const setVehicleState = (newVehicleState: Vehicle) => {
    setVehicle(newVehicleState);
  };
  
  const lockVehicle = () => {
    setVehicle({
      ...vehicle,
      isLocked: true
    });
  };
  
  const unlockVehicle = () => {
    setVehicle({
      ...vehicle,
      isLocked: false
    });
  };
  
  return (
    <VehicleContext.Provider value={{ vehicle, setVehicleState, lockVehicle, unlockVehicle }}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = () => useContext(VehicleContext);
export { VehicleContext };