import { useContext } from 'react';
import { VehicleContext } from '../context/VehicleContext';

// This will properly type the return value of useVehicle
export const useVehicle = () => {
  return useContext(VehicleContext);
};

// No default export - this is correct for a hook file