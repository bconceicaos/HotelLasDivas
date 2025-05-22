import api from './api';

export const getHabitaciones = async () => {
  const res = await api.get('/habitaciones');
  return res.data;
};
