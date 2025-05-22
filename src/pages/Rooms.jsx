import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Table, Alert, Spinner, Row, Col } from 'react-bootstrap';

const Rooms = () => {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numPersonas, setNumPersonas] = useState(1);
  const [habitaciones, setHabitaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [temporadaAlta, setTemporadaAlta] = useState(false);

  const fetchHabitaciones = async () => {
    setError('');
    if (!checkInDate || !checkOutDate || !numPersonas) {
      setError('Por favor completa todos los campos.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get('/api/habitaciones/disponibles', {
        params: { checkInDate, checkOutDate, numPersonas }
      });
      setHabitaciones(res.data);
    } catch (err) {
      setError('Error al obtener habitaciones disponibles.');
    } finally {
      setLoading(false);
    }
  };

  // Función para calcular días entre fechas (excluyendo el día de salida)
  const calcularDias = () => {
    const inicio = new Date(checkInDate);
    const fin = new Date(checkOutDate);
    const diffTime = fin.getTime() - inicio.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const calcularPrecio = (precioBase) => {
    return temporadaAlta ? (precioBase * 1.25) : precioBase;
  };

  const calcularTotal = (precioNoche, suplementoPorPersona) => {
    const dias = calcularDias();
    const precioBase = calcularPrecio(precioNoche);
    const total = (precioBase * dias) + (suplementoPorPersona * numPersonas * dias);
    return total.toFixed(2);
  };

  return (
    <Container className="mt-4">
      <h2>Buscar Habitaciones Disponibles</h2>

      <Form>
        <Row className="mb-3">
          <Col md={3}>
            <Form.Label>Check-in</Form.Label>
            <Form.Control 
              type="date" 
              value={checkInDate} 
              onChange={e => setCheckInDate(e.target.value)} 
            />
          </Col>
          <Col md={3}>
            <Form.Label>Check-out</Form.Label>
            <Form.Control 
              type="date" 
              value={checkOutDate} 
              onChange={e => setCheckOutDate(e.target.value)} 
            />
          </Col>
          <Col md={3}>
            <Form.Label>Número de personas</Form.Label>
            <Form.Control 
              type="number" 
              min="1" 
              value={numPersonas} 
              onChange={e => setNumPersonas(e.target.value)} 
            />
          </Col>
          <Col md={3} className="d-flex align-items-end">
            <Button variant="primary" onClick={fetchHabitaciones}>Buscar</Button>
          </Col>
        </Row>

        <Form.Check 
          type="switch"
          label="Temporada alta (+25%)"
          checked={temporadaAlta}
          onChange={() => setTemporadaAlta(!temporadaAlta)}
          className="mb-3"
        />
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <Spinner animation="border" />
      ) : (
        habitaciones.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Características</th>
                <th>Precio por noche</th>
                <th>Suplemento por persona</th>
                <th>Total estancia</th> {/* Nueva columna */}
              </tr>
            </thead>
            <tbody>
              {habitaciones.map(h => (
                <tr key={h.habitacion_id}>
                  <td>{h.nombre_habitacion}</td>
                  <td>{h.descripcion}</td>
                  <td>{h.caracteristicas}</td>
                  <td>{calcularPrecio(h.precio_noche).toFixed(2)} €</td>
                  <td>{h.suplemento_persona} €</td>
                  <td>{calcularTotal(h.precio_noche, h.suplemento_persona)} €</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No hay habitaciones disponibles para los criterios seleccionados.</p>
        )
      )}
    </Container>
  );
};

export default Rooms;
