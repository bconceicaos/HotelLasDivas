// ConfirmacionReserva.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { checkAuth } from '../services/authService';

function ConfirmacionReserva() {

  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [clienteId, setClienteId] = useState(null);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const habitacion = location.state.habitacion;
  const precioBase = location.state.precioReserva;
  const checkInDate = location.state.checkInDate;
  const checkOutDate = location.state.checkOutDate;
  const numPersonas = location.state.numPersonas;

  // Descuento si está loggeado
  const precioConDescuento = clienteId ? +(precioBase * 0.9).toFixed(2) : precioBase;


  useEffect(() => {
    const obtenerUsuario = async () => {
      const usuario = await checkAuth();
      if (usuario && usuario._id) {
        setClienteId(usuario._id);
      }
    };
    obtenerUsuario();
  }, []);

  const validarEmail = (email) => {
    // Patrón para validar email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validarTelefono = (telefono) => {
    // Patrón para validar número de teléfono (formato internacional opcional)
    const telefonoPattern = /^\+?\d{1,3}[- ]?\d{6,}$/;
    return telefonoPattern.test(telefono);
  };

  const validarDni = (dni) => {
    // Patrón para validar DNI (8 números y una letra)
    const dniPattern = /^\d{8}[a-zA-Z]$/;
    return dniPattern.test(dni);
  };

  const reservarHabitacion = async (e) => {
    e.preventDefault();

    // Validar datos antes de enviar la solicitud
    if (!validarEmail(email)) {
      setError('El email no es válido');
      return;
    }
    if (!validarTelefono(telefono)) {
      setError('El teléfono no es válido');
      return;
    }
    if (!validarDni(dni)) {
      setError('El DNI no es válido');
      return;
    }

    try {
      const datosReserva = {
        habitacionId: habitacion.habitacion_id,
        fechaEntrada: checkInDate,
        fechaSalida: checkOutDate,
        personas: numPersonas,
        precio: precioBase,
        nombre,
        apellidos,
        dni,
        email,
        telefono
      };

      if (clienteId) {
        datosReserva.clienteId = clienteId;
      }

      const response = await axios.post(
        'http://localhost:5000/api/reservas/crearReserva',
        datosReserva
      );

      if (response.status === 201) {
        console.log('Reserva exitosa');
        navigate('/confirmada');
      } else {
        console.error('Reserva fallida');
        setError('Hubo un error al realizar la reserva. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al reservar la habitación:', error);
      setError('Hubo un error al realizar la reserva. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="container"> <br />
      <div className='confirmacion'>
        <h2>Confirmar Reserva</h2>

        {/* ✅ RESUMEN DE RESERVA */}
        <div className="card p-3 mb-4 shadow-sm">
          <h4 className="mb-3">Resumen de la Reserva</h4>
          <p><strong>Habitación:</strong> {habitacion.nombre_habitacion}</p>
          <p><strong>Check-in:</strong> {new Date(checkInDate).toLocaleDateString()}</p>
          <p><strong>Check-out:</strong> {new Date(checkOutDate).toLocaleDateString()}</p>
          <p><strong>Personas:</strong> {numPersonas}</p>
          <p><strong>Precio:</strong> €{precioBase.toFixed(2)}</p>
          {clienteId && (
            <>
              <p><strong>Descuento por cliente registrado:</strong> 10%</p>
              <p><strong>Total con descuento:</strong> €{precioConDescuento.toFixed(2)}</p>
            </>
          )}
        </div>


        {/* FORMULARIO */}
        <div className='row'>
          <form onSubmit={reservarHabitacion}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input id="nombre" type="text" className="form-control" placeholder="Escribe tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="apellidos">Apellidos</label>
              <input id="apellidos" type="text" className="form-control" placeholder="Escribe tu apellido" value={apellidos} onChange={(e) => setApellidos(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="dni">DNI</label>
              <input id="dni" type="text" className="form-control" placeholder="Ingresa tu DNI" value={dni} onChange={(e) => setDni(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" className="form-control" placeholder="Escribe tu correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input id="telefono" type="tel" className="form-control" placeholder="Escribe tu número de teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="btn btn-primary">Reservar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ConfirmacionReserva;
