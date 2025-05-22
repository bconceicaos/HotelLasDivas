// Reservas.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/main.css';
import RoomCard from '../components/RoomCard';
import { Form, FormGroup, FormControl, Button } from 'react-bootstrap';
import axios from 'axios';

function Reservas() {
  const [numPersonas, setNumPersonas] = useState(1);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [precioReserva, setPrecioReserva] = useState(0);
  const [habitacionesDisponibles, setHabitacionesDisponibles] = useState([]);
  const navigate = useNavigate();

  const handleBuscarDisponibilidad = async () => {
    if (!numPersonas || !checkInDate || !checkOutDate) {
      alert("Por favor completa todos los campos antes de buscar.");
      return;
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      alert("Fechas inválidas.");
      return;
    }

    if (checkOut <= checkIn) {
      alert("La fecha de check-out debe ser posterior a la de check-in.");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/api/habitaciones/disponibles`, {
        params: {
          numPersonas: Number(numPersonas),
          checkInDate,
          checkOutDate
        }
      });

      if (!res.data || !res.data.length) {
        alert("No hay habitaciones disponibles para los criterios seleccionados.");
        setHabitacionesDisponibles([]);
        return;
      }

      setHabitacionesDisponibles(res.data);

      // Asumiendo que hay una función para calcular el precio
      const precio = calcularPrecioPorNoche(res.data[0]);
      setPrecioReserva(precio);

    } catch (error) {
      alert("Ocurrió un error al buscar habitaciones.");
    }
  };


  const calcularPrecioPorNoche = (habitacion) => {
    if (!habitacion) return 0;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diffDays = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    // Precio base + suplemento por persona extra
    return (habitacion.precio_noche + (numPersonas - 1) * habitacion.suplemento_persona) * diffDays;
  };

  const handleSeleccionarHabitacion = (habitacion) => {
    navigate(`/confirmacion-reserva/${habitacion.habitacion_id}`, {
      state: {
        habitacion,
        precioReserva: calcularPrecioPorNoche(habitacion),
        checkInDate,
        checkOutDate,
        numPersonas
      }
    });
  };

  return (
    <div className="container">
      <h1 className="mt-5">¡Reserva ya tus vacaciones al mejor precio!</h1>
      <Form className="my-4 d-flex flex-column flex-md-row align-items-center justify-content-center gap-3">
        <FormGroup>
          <Form.Label>Nº de personas</Form.Label>
          <Form.Select 
            value={numPersonas} 
            onChange={(e) => setNumPersonas(parseInt(e.target.value) || 1)}
          >
            <option value="">Selecciona</option>
            {[1, 2, 3, 4, 5, 6, 7].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </Form.Select>
        </FormGroup>
        <FormGroup>
          <Form.Label>Check-in</Form.Label>
          <FormControl type="date" value={checkInDate} onChange={e => setCheckInDate(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Form.Label>Check-out</Form.Label>
          <FormControl type="date" value={checkOutDate} onChange={e => setCheckOutDate(e.target.value)} />
        </FormGroup>
        <Button onClick={handleBuscarDisponibilidad} variant="primary">Buscar disponibilidad</Button>
      </Form>

      <div className="row justify-content-center">
        {habitacionesDisponibles.map((habitacion) => (
          <div key={habitacion.habitacion_id} className="col-md-4 mb-4">
            <RoomCard
              nombreHabitacion={habitacion.nombre_habitacion}
              descripcion={habitacion.descripcion}
              caracteristicas={habitacion.caracteristicas}
              precioTotalPorNoche={calcularPrecioPorNoche(habitacion)}
              onSelect={() => handleSeleccionarHabitacion(habitacion)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reservas;
