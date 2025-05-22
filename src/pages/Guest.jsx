// Guest.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Form, Row, Col, Badge, Modal, Button } from 'react-bootstrap';
import moment from 'moment';

const Guest = () => {
    const [reservas, setReservas] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroFecha, setFiltroFecha] = useState('');

    const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchReservas = async () => {
        try {
            const { data } = await axios.get('/api/reservas');
            setReservas(data);
        } catch (error) {
            console.error('Error al cargar reservas:', error);
        }
        };

        fetchReservas();
    }, []);

  const reservasFiltradas = reservas.filter((reserva) => {
    const nombreCompleto = `${reserva.nombre} ${reserva.apellidos}`.toLowerCase();
    const fechaEntrada = moment(reserva.fechaEntrada).format('YYYY-MM-DD');
    const coincideNombre = nombreCompleto.includes(filtroNombre.toLowerCase());
    const coincideFecha = !filtroFecha || fechaEntrada === filtroFecha;
    return coincideNombre && coincideFecha;
  });

  const estadoReserva = (reserva) => {
    const hoy = new Date();
    const entrada = new Date(reserva.fechaEntrada);
    const salida = new Date(reserva.fechaSalida);
    if (hoy < entrada) return <Badge bg="info">Pendiente</Badge>;
    if (hoy >= entrada && hoy <= salida) return <Badge bg="success">En curso</Badge>;
    return <Badge bg="secondary">Finalizada</Badge>;
  };

  const handleCancelar = async (reservaId) => {
    if (!window.confirm("¿Estás seguro de que quieres cancelar esta reserva?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/reservas/${reservaId}`);
      setReservas(prev => prev.filter(r => r._id !== reservaId));
    } catch (error) {
      console.error('Error al cancelar la reserva:', error);
      alert('Hubo un problema al cancelar la reserva.');
    }
  };

  const handleModificar = (reservaId) => {
        const reserva = reservas.find(r => r._id === reservaId);
        if (!reserva) {
            alert("No se encontró la reserva seleccionada.");
            return;
        }

        setReservaSeleccionada({
            _id: reserva._id,
            habitacionId: reserva.habitacionId,
            fechaEntrada: moment(reserva.fechaEntrada).format('YYYY-MM-DD'),
            fechaSalida: moment(reserva.fechaSalida).format('YYYY-MM-DD'),
            personas: reserva.personas || 1,
            nombre: reserva.nombre,
            apellidos: reserva.apellidos,
            email: reserva.email,
            dni: reserva.dni,
            telefono: reserva.telefono,
            precio: reserva.precio
        });

        setShowModal(true);
    };


  const handleGuardarCambios = async () => {
    if (!reservaSeleccionada) {
        alert("No hay reserva seleccionada.");
        return;
    }

    try {
        const {
        _id,
        fechaEntrada,
        fechaSalida,
        personas,
        habitacionId,
        nombre,
        apellidos,
        email,
        dni,
        telefono
        } = reservaSeleccionada;

        if (!habitacionId || !habitacionId.precio) {
        alert("No se pudo determinar la habitación para calcular el precio.");
        return;
        }

        const dias = (new Date(fechaSalida) - new Date(fechaEntrada)) / (1000 * 60 * 60 * 24);
        if (dias <= 0) {
        alert("La fecha de salida debe ser posterior a la fecha de entrada.");
        return;
        }

        const suplemento = habitacionId.suplementoPorPersona || 0;
        const personasExtra = Math.max(0, personas - 1);
        const nuevoPrecio = (habitacionId.precio + personasExtra * suplemento) * dias;

        const res = await axios.put(`http://localhost:5000/api/reservas/${_id}`, {
        fechaEntrada,
        fechaSalida,
        personas,
        precio: nuevoPrecio,
        nombre,
        apellidos,
        email,
        dni,
        telefono
        });

        setReservas((prev) =>
        prev.map((r) => (r._id === _id ? res.data.reserva : r))
        );
        setShowModal(false);
    } catch (error) {
        console.error('Error al modificar la reserva:', error);
        alert('No se pudo actualizar la reserva.');
    }
    };



  return (
    <div className="container mt-4">
      <h3 className="mb-3">Reservas de Clientes</h3>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre..."
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Control
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
          />
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th># Reserva</th>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Habitación</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Personas</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservasFiltradas.map((reserva) => (
            <tr key={reserva._id}>
                <td>{reserva._id.slice(-6).toUpperCase()}</td>
                <td>{reserva.nombre} {reserva.apellidos}</td>
                <td>{reserva.dni}</td>
                <td>{reserva.habitacionId?.nombre || '-'}</td>
                <td>{moment(reserva.fechaEntrada).format('DD MMM YYYY')}</td>
                <td>{moment(reserva.fechaSalida).format('DD MMM YYYY')}</td>
                <td>{reserva.personas}</td>
                <td>{reserva.email}</td>
                <td>{reserva.telefono}</td>
                <td>{reserva.precio}</td>
                <td>{estadoReserva(reserva)}</td>
                <td>
                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleModificar(reserva._id)} 
                        className="me-2"
                    >
                        Editar
                    </Button>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleCancelar(reserva._id)}
                    >
                        Cancelar
                    </Button>
                </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Editar Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {reservaSeleccionada && (
            <Form>
                <Form.Group className="mb-2">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                    type="text"
                    value={reservaSeleccionada.nombre}
                    onChange={(e) =>
                    setReservaSeleccionada({ ...reservaSeleccionada, nombre: e.target.value })
                    }
                />
                </Form.Group>
                <Form.Group className="mb-2">
                <Form.Label>Apellidos</Form.Label>
                <Form.Control
                    type="text"
                    value={reservaSeleccionada.apellidos}
                    onChange={(e) =>
                    setReservaSeleccionada({ ...reservaSeleccionada, apellidos: e.target.value })
                    }
                />
                </Form.Group>
                <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    value={reservaSeleccionada.email}
                    onChange={(e) =>
                    setReservaSeleccionada({ ...reservaSeleccionada, email: e.target.value })
                    }
                />
                </Form.Group>
                <Form.Group className="mb-2">
                <Form.Label>DNI</Form.Label>
                <Form.Control
                    type="text"
                    value={reservaSeleccionada.dni}
                    onChange={(e) =>
                    setReservaSeleccionada({ ...reservaSeleccionada, dni: e.target.value })
                    }
                />
                </Form.Group>
                <Form.Group className="mb-2">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                    type="text"
                    value={reservaSeleccionada.telefono}
                    onChange={(e) =>
                    setReservaSeleccionada({ ...reservaSeleccionada, telefono: e.target.value })
                    }
                />
                </Form.Group>
                <Form.Group className="mb-2">
                <Form.Label>Fecha Entrada</Form.Label>
                <Form.Control
                    type="date"
                    value={reservaSeleccionada.fechaEntrada}
                    onChange={(e) =>
                    setReservaSeleccionada({ ...reservaSeleccionada, fechaEntrada: e.target.value })
                    }
                />
                </Form.Group>
                <Form.Group className="mb-2">
                <Form.Label>Fecha Salida</Form.Label>
                <Form.Control
                    type="date"
                    value={reservaSeleccionada.fechaSalida}
                    onChange={(e) =>
                    setReservaSeleccionada({ ...reservaSeleccionada, fechaSalida: e.target.value })
                    }
                />
                </Form.Group>
                <Form.Group className="mb-2">
                <Form.Label>Personas</Form.Label>
                <Form.Control
                    type="number"
                    min={1}
                    value={reservaSeleccionada.personas}
                    onChange={(e) =>
                    setReservaSeleccionada({ ...reservaSeleccionada, personas: parseInt(e.target.value) })
                    }
                />
                </Form.Group>
            </Form>
            )}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
            </Button>
            <Button variant="primary" onClick={handleGuardarCambios}>
            Guardar cambios
            </Button>
        </Modal.Footer>
        </Modal>

    </div>

    
  );
};

export default Guest;
