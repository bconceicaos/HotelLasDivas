import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Table, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const Booking = () => {
  // Estado para formulario de reserva
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaEntrada, setFechaEntrada] = useState('');
  const [fechaSalida, setFechaSalida] = useState('');
  const [personas, setPersonas] = useState(1);
  const [habitacionId, setHabitacionId] = useState('');
  
  // Habitaciones disponibles para mostrar en select
  const [habitacionesDisponibles, setHabitacionesDisponibles] = useState([]);
  const [loadingHabitaciones, setLoadingHabitaciones] = useState(false);

  // Mensajes de feedback
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estado para calendario (ocupación)
  const [ocupacion, setOcupacion] = useState([]);
  const [loadingOcupacion, setLoadingOcupacion] = useState(false);

  // Obtener habitaciones disponibles cuando cambian fechas o personas
  useEffect(() => {
    const fetchDisponibles = async () => {
      setError('');
      setHabitacionesDisponibles([]);
      setHabitacionId('');
      if (!fechaEntrada || !fechaSalida || personas < 1) return;

      setLoadingHabitaciones(true);
      try {
        const res = await axios.get('/api/habitaciones/disponibles', {
          params: {
            checkInDate: fechaEntrada,
            checkOutDate: fechaSalida,
            numPersonas: personas
          }
        });
        setHabitacionesDisponibles(res.data);
        if (res.data.length > 0) setHabitacionId(res.data[0].habitacion_id);
      } catch (e) {
        setError('Error al cargar habitaciones disponibles.');
      } finally {
        setLoadingHabitaciones(false);
      }
    };
    fetchDisponibles();
  }, [fechaEntrada, fechaSalida, personas]);

  // Obtener ocupación para mostrar en calendario (últimos 7 días + próximos 7)
  useEffect(() => {
    const fetchOcupacion = async () => {
      setLoadingOcupacion(true);
      try {
        // Aquí tendrías un endpoint para obtener reservas o ocupación,
        // por simplicidad vamos a simular que se llaman todas reservas para la semana actual.
        // Adaptar según tu backend
        const res = await axios.get('/api/reservas');
        setOcupacion(res.data);
      } catch (e) {
        setError('Error al cargar ocupación.');
      } finally {
        setLoadingOcupacion(false);
      }
    };
    fetchOcupacion();
  }, []);

  // Función para crear reserva
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!nombre || !fechaEntrada || !fechaSalida || !habitacionId) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }
    if (new Date(fechaSalida) <= new Date(fechaEntrada)) {
      setError('La fecha de salida debe ser posterior a la de entrada.');
      return;
    }

    // Buscar precio base y suplemento
    const habitacion = habitacionesDisponibles.find(h => h.habitacion_id === habitacionId);
    if (!habitacion) {
      setError('Selecciona una habitación válida.');
      return;
    }

    // Calcular precio simple: precio_noche * noches + suplementoPorPersona * noches * (personas - 1)
    const noches = (new Date(fechaSalida) - new Date(fechaEntrada)) / (1000 * 60 * 60 * 24);
    const precioBase = habitacion.precio_noche * noches;
    const suplemento = habitacion.suplemento_persona * noches * (personas - 1);
    const precioTotal = precioBase + suplemento;

    try {
      await axios.post('/api/reservas/crearReserva', {
        habitacionId,
        fechaEntrada,
        fechaSalida,
        personas,
        precio: precioTotal,
        nombre,
        apellidos,
        dni,
        email,
        telefono
      });
      setSuccess('Reserva creada con éxito.');
      // Reset campos
      setNombre('');
      setApellidos('');
      setDni('');
      setEmail('');
      setTelefono('');
      setFechaEntrada('');
      setFechaSalida('');
      setPersonas(1);
      setHabitacionId('');
      setHabitacionesDisponibles([]);
      // Opcional: actualizar ocupación
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la reserva.');
    }
  };

  // Función para generar un array con los próximos 14 días para el calendario simple
  const generarDias = () => {
    const dias = [];
    const hoy = new Date();
    for(let i = -7; i <= 7; i++) {
      const dia = new Date(hoy);
      dia.setDate(hoy.getDate() + i);
      dias.push(dia);
    }
    return dias;
  };

  // Función para verificar si una habitación está ocupada en un día dado (para el calendario)
  const estaOcupada = (habitacionId, dia) => {
    // Recorremos las reservas y vemos si el día cae entre fechaEntrada y fechaSalida
    return ocupacion.some(r => 
      r.habitacionId === habitacionId &&
      new Date(r.fechaEntrada) <= dia &&
      new Date(r.fechaSalida) > dia
    );
  };

  return (
    <div className="container mt-4">
      <h2>Reservar Habitación</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="nombre" className="mb-3">
              <Form.Label>Nombre *</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="apellidos" className="mb-3">
              <Form.Label>Apellidos</Form.Label>
              <Form.Control
                type="text"
                value={apellidos}
                onChange={e => setApellidos(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group controlId="fechaEntrada" className="mb-3">
              <Form.Label>Fecha Entrada *</Form.Label>
              <Form.Control
                type="date"
                value={fechaEntrada}
                onChange={e => setFechaEntrada(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="fechaSalida" className="mb-3">
              <Form.Label>Fecha Salida *</Form.Label>
              <Form.Control
                type="date"
                value={fechaSalida}
                onChange={e => setFechaSalida(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="personas" className="mb-3">
              <Form.Label>Personas *</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={personas}
                onChange={e => setPersonas(Number(e.target.value))}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="habitacion" className="mb-3">
          <Form.Label>Habitación disponible *</Form.Label>
          {loadingHabitaciones ? (
            <div><Spinner animation="border" size="sm" /> Cargando habitaciones...</div>
          ) : habitacionesDisponibles.length === 0 ? (
            <div>No hay habitaciones disponibles para las fechas y personas seleccionadas.</div>
          ) : (
            <Form.Select
              value={habitacionId}
              onChange={e => setHabitacionId(e.target.value)}
              required
            >
              {habitacionesDisponibles.map(h => (
                <option key={h.habitacion_id} value={h.habitacion_id}>
                  {h.nombre_habitacion} - {h.descripcion} - Precio: {h.precio_noche}€
                </option>
              ))}
            </Form.Select>
          )}
        </Form.Group>

        <Row>
          <Col md={4}>
            <Form.Group controlId="dni" className="mb-3">
              <Form.Label>DNI</Form.Label>
              <Form.Control
                type="text"
                value={dni}
                onChange={e => setDni(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="telefono" className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="tel"
                value={telefono}
                onChange={e => setTelefono(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit" disabled={loadingHabitaciones || !habitacionId}>Crear Reserva</Button>
      </Form>

      <hr className="my-5" />

      <h3>Calendario de ocupación (Próximos 7 días)</h3>
      {loadingOcupacion ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Habitación</th>
              {generarDias().map(dia => (
                <th key={dia.toISOString()}>
                  {dia.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Mostrar las habitaciones (únicas) que hay en ocupación */}
            {[...new Set(ocupacion.map(r => r.habitacionId))].map(hId => {
              // Buscar nombre de habitación (puedes hacer fetch si quieres, aquí asumo ocupacion trae nombre)
              const id = typeof hId === 'object' ? hId._id : hId;
              const nombreHabitacion = typeof hId === 'object' ? hId.nombre : hId;
              return (
                <tr key={hId}>
                  <td>{nombreHabitacion}</td>
                  {generarDias().map(dia => (
                    <td key={dia.toISOString()} style={{ textAlign: 'center' }}>
                      {estaOcupada(hId, dia) ? '🛏️' : ''}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Booking;
