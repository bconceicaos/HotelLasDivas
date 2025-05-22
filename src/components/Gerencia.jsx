import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

function Gerencia() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      }, { withCredentials: true });

      if (res.data?.user?.rol !== 'admin') {
        setError('Acceso solo para administradores.');
        return;
      }

      setSuccess('Login correcto. Bienvenido, admin.');
      setError('');
      // Redirigir o cerrar modal
      setTimeout(() => {
        handleClose();
        window.location.href = '/gerencia';  // o navegación programada
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
      setSuccess('');
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Gerencia
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Login de Administración</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleLogin}>
            <div className="group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Correo admin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="group mt-2">
              <label>Contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-danger mt-2">{error}</p>}
            {success && <p className="text-success mt-2">{success}</p>}
            <Button type="submit" variant="primary" className="mt-3">Iniciar sesión</Button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Gerencia;
