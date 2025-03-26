// Mock data service
export const getDashboardData = () => {
  // Simulate some randomness in the data
  const fuelLevel = Math.floor(Math.random() * 30) + 50; // 50-80%
  const batteryLevel = Math.floor(Math.random() * 40) + 60; // 60-100%
  const range = Math.floor(fuelLevel * 5.5); // Rough calculation based on fuel level
  const cabinTemp = Math.floor(Math.random() * 3) + 21; // 21-23°C
  const outsideTemp = Math.floor(Math.random() * 5) + 18; // 18-22°C
  
  return {
    fuelLevel,
    batteryLevel,
    range,
    cabinTemp,
    outsideTemp,
    tirePressureStatus: Math.random() > 0.8 ? 'Low - Rear Right' : 'Normal',
    lastService: '2023-12-15',
    nextService: '2024-06-15',
    odometer: 3457,
    lastTrip: {
      distance: 12.5,
      avgFuelConsumption: 5.8,
      duration: 25,
    }
  };
};

// No default export - this is correct for a service file