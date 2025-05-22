import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Modal, Button, Form } from 'react-bootstrap';

function MisReservas() {
  const { user } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

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
      ...reserva,
      habitacionId: reserva.habitacionId,
      fechaEntrada: reserva.fechaEntrada,
      fechaSalida: reserva.fechaSalida,
      personas: reserva.personas || 1,
    });

    setShowModal(true);
  };

  const handleGuardarCambios = async () => {

      console.log("habitacionId en reservaSeleccionada:", reservaSeleccionada.habitacionId);

    try {
      const { _id, fechaEntrada, fechaSalida, personas, habitacionId } = reservaSeleccionada;

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
      const personasExtra = Math.max(0, personas - 1); // personas mínimas incluidas en el precio base
      const nuevoPrecio = (habitacionId.precio + personasExtra * suplemento) * dias;


      const res = await axios.put(`http://localhost:5000/api/reservas/${_id}`, {
        fechaEntrada,
        fechaSalida,
        personas,
        precio: nuevoPrecio,
      });

      setReservas(prev => prev.map(r => r._id === _id ? res.data.reserva : r));
      setShowModal(false);
    } catch (error) {
      console.error('Error al modificar la reserva:', error);
      alert('No se pudo actualizar la reserva.');
    }
  };


  useEffect(() => {
    const fetchReservas = async () => {
      if (!user || !user._id) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/reservas/cliente/${user._id}`);
        setReservas(res.data);
      } catch (error) {
        console.error('Error al obtener reservas del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, [user]);

  if (loading) return <div className="container">Cargando reservas...</div>;

  return (
    <div className="container">
      <h2 className="mb-4">Mis Reservas</h2>

      {reservas.length === 0 ? (
        <p>No tienes reservas registradas.</p>
      ) : (
      <div className="mis-reservas">
        <div className="row">
          {reservas.map((reserva) => (
            <div key={reserva._id} className="col-md-4 mb-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                    <h5 className="card-title">
                        {reserva.habitacionId?.nombre || `Habitación`}
                    </h5>
                    <p className="card-text">
                        <strong>Entrada:</strong> {new Date(reserva.fechaEntrada).toLocaleDateString()}
                    </p>
                    <p className="card-text">
                        <strong>Salida:</strong> {new Date(reserva.fechaSalida).toLocaleDateString()}
                    </p>
                    <p className="card-text"><strong>Personas:</strong> {reserva.personas}</p>
                    <p className="card-text"><strong>Precio:</strong> {reserva.precio} €</p>

                    <div className="mt-auto button-group">
                      <button className="btn-cancelar" onClick={() => handleCancelar(reserva._id)}>Cancelar</button>
                      <button className="btn-modificar" onClick={() => handleModificar(reserva._id)}>Modificar</button>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      )}

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modificar Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reservaSeleccionada && (
            <Form>
              <Form.Group>
                <Form.Label>Fecha de Entrada</Form.Label>
                <Form.Control
                  type="date"
                  value={reservaSeleccionada.fechaEntrada ? reservaSeleccionada.fechaEntrada.slice(0, 10) : ''}
                  onChange={e => setReservaSeleccionada(prev => ({ ...prev, fechaEntrada: e.target.value }))}
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>Fecha de Salida</Form.Label>
                <Form.Control
                  type="date"
                  value={reservaSeleccionada.fechaSalida ? reservaSeleccionada.fechaSalida.slice(0, 10) : ''}
                  onChange={e => setReservaSeleccionada(prev => ({ ...prev, fechaSalida: e.target.value }))}
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>Personas</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max={reservaSeleccionada.habitacionId.personasMax || 10}
                  value={reservaSeleccionada.personas ?? ''}
                  onChange={e => setReservaSeleccionada(prev => ({ ...prev, personas: parseInt(e.target.value) || 1 }))}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleGuardarCambios}>Guardar Cambios</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default MisReservas;
