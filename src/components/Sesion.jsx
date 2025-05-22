// Sesion.jsx
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';

function Sesion() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    dni: '',
    email: '',
    password: '',
    telefono: ''
  });
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignUp) {
        await axios.post('/api/auth/register', formData, { withCredentials: true });
        alert('Usuario registrado con éxito');
      } else {
        const loginData = {
          email: formData.email,
          password: formData.password
        };
        console.log("Loggeando con:", loginData);
        await axios.post('/api/auth/login', loginData, { withCredentials: true });
        alert('Inicio de sesión exitoso');
      }
    } catch (error) {
      console.error("Error en autenticación:", error.response?.data || error.message);
      setError(error.response?.data?.error || 'Hubo un error');
    }
  };

  return (
    <div className="card">
      <div className="login-box">
        <div className="login-snip">
          <h2>Hazte miembro del Club Las Divas</h2>

          <div className="hr"></div>

          <div className="tab-selector">
            <input
              id="tab-1"
              type="radio"
              name="tab"
              className="sign-in"
              checked={!isSignUp}
              onChange={() => setIsSignUp(false)}
            />
            <label htmlFor="tab-1" className="tab">Sign In</label>

            <input
              id="tab-2"
              type="radio"
              name="tab"
              className="sign-up"
              checked={isSignUp}
              onChange={() => setIsSignUp(true)}
            />
            <label htmlFor="tab-2" className="tab">Sign Up</label>
          </div>

          <div className="login-space">
            <form onSubmit={handleSubmit}>
              {isSignUp && (
                <>
                  <div className="group">
                    <label className="label">Nombre</label>
                    <input
                      name="nombre"
                      type="text"
                      className="input"
                      placeholder="Escribe tu nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="group">
                    <label className="label">Apellidos</label>
                    <input
                      name="apellidos"
                      type="text"
                      className="input"
                      placeholder="Escribe tu apellido"
                      value={formData.apellidos}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="group">
                    <label className="label">DNI</label>
                    <input
                      name="dni"
                      type="text"
                      className="input"
                      placeholder="Escribe tu DNI"
                      value={formData.dni}
                      onChange={handleChange}
                      pattern="[0-9]{8}[A-Za-z]"
                      required
                    />
                  </div>
                </>
              )}

              <div className="group">
                <label className="label">Email</label>
                <input
                  name="email"
                  type="email"
                  className="input"
                  placeholder="Escribe tu email"
                  value={formData.email}
                  onChange={handleChange}
                  pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                  required
                />
              </div>

              <div className="group">
                <label className="label">Contraseña</label>
                <input
                  name="password"
                  type="password"
                  className="input"
                  placeholder="Escribe tu contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {isSignUp && (
                <div className="group">
                  <label className="label">Teléfono</label>
                  <input
                    name="telefono"
                    type="tel"
                    className="input"
                    placeholder="Escribe tu teléfono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <Button variant="primary" type="submit">
                {isSignUp ? 'Registrarse' : 'Inicia sesión'}
              </Button>

              {error && <div className="error-message mt-2 text-danger">{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sesion;
