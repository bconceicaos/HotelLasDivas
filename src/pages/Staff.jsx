import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Table, Alert, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Staff = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    dni: '',
    email: '',
    password: '',
    telefono: '',
    rol: 'user',
  });

  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Estados para orden y filtro
  const [ordenCampo, setOrdenCampo] = useState(null); // 'nombre' o 'email' o 'rol', etc.
  const [ordenAscendente, setOrdenAscendente] = useState(true); // true=ascendente, false=descendente
  const [filtroRol, setFiltroRol] = useState('todos'); // 'todos', 'admin', 'user'


  useEffect(() => {
    if (user?.rol === 'admin') {
      fetchUsuarios();
    }
  }, [user]);

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users', {
        withCredentials: true,
      });
      setUsuarios(res.data);
    }catch (err) {
        console.error('Error al obtener usuarios:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Error al obtener los usuarios');
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      if (formData._id) {
        // Actualizar usuario
        const { _id, password, ...rest } = formData;
        const dataToSend = password ? formData : rest; // si no cambió contraseña no la enviamos
        const res = await axios.put(`http://localhost:5000/api/users/${_id}`, dataToSend, {
          withCredentials: true,
        });
        setMensaje(res.data.message || 'Usuario actualizado correctamente');
      } else {
        // Crear nuevo usuario
        const res = await axios.post('http://localhost:5000/api/users', formData, {
          withCredentials: true,
        });
        setMensaje(res.data.message);
      }
      setFormData({
        nombre: '',
        apellidos: '',
        dni: '',
        email: '',
        password: '',
        telefono: '',
        rol: 'user',
      });
      fetchUsuarios();
    } catch (err) {
      setError(err.response?.data?.message || 'Error en la operación');
    }
  };

  const cambiarRol = async (id, nuevoRol) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${id}`, { rol: nuevoRol }, {
        withCredentials: true,
      });
      fetchUsuarios();
    } catch (err) {
      setError('Error al cambiar el rol del usuario');
    }
  };

  if (user?.rol !== 'admin') {
    return <Alert variant="danger">No tienes permiso para acceder a esta página.</Alert>;
  }

  const eliminarUsuario = async (id) => {
    setMensaje('');
    setError('');
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        withCredentials: true,
      });
      setMensaje('Usuario eliminado exitosamente');
      fetchUsuarios();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar usuario');
    }
  };

  const cargarUsuarioParaEditar = (usuario) => {
    setFormData({
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      dni: usuario.dni,
      email: usuario.email,
      password: '', // vacío para no mostrar la contraseña
      telefono: usuario.telefono,
      rol: usuario.rol,
      _id: usuario._id, // guardamos el ID para saber que estamos editando
    });
    setMensaje('');
    setError('');
  };

  const ordenarUsuarios = (usuarios) => {
    if (!ordenCampo) return usuarios;

    return [...usuarios].sort((a, b) => {
      let valA = a[ordenCampo];
      let valB = b[ordenCampo];

      // Para que no falle con undefined o null
      valA = valA ? valA.toString().toLowerCase() : '';
      valB = valB ? valB.toString().toLowerCase() : '';

      if (valA < valB) return ordenAscendente ? -1 : 1;
      if (valA > valB) return ordenAscendente ? 1 : -1;
      return 0;
    });
  };

  const filtrarUsuarios = (usuarios) => {
    if (filtroRol === 'todos') return usuarios;
    return usuarios.filter(u => u.rol === filtroRol);
  };

  // Combina filtrado y orden
  const usuariosFiltradosYOrdenados = ordenarUsuarios(filtrarUsuarios(usuarios));

  // Cambiar orden
  const ordenarPorCampo = (campo) => {
    if (ordenCampo === campo) {
      setOrdenAscendente(!ordenAscendente);
    } else {
      setOrdenCampo(campo);
      setOrdenAscendente(true);
    }
  };

  if (user?.rol !== 'admin') {
    return <Alert variant="danger">No tienes permiso para acceder a esta página.</Alert>;
  }

  return (
    <Container className="mt-4">
      <h2>Gestión de Personal y Usuarios</h2>

      {mensaje && <Alert variant="success">{mensaje}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} className="my-4">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control name="nombre" value={formData.nombre} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Apellidos</Form.Label>
              <Form.Control name="apellidos" value={formData.apellidos} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>DNI</Form.Label>
              <Form.Control name="dni" value={formData.dni} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" type="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control name="telefono" value={formData.telefono} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select name="rol" value={formData.rol} onChange={handleChange}>
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Button type="submit" variant="primary">Registrar Usuario</Button>
        {formData._id && (
          <Button
            variant="secondary"
            onClick={() => setFormData({
              nombre: '',
              apellidos: '',
              dni: '',
              email: '',
              password: '',
              telefono: '',
              rol: 'user',
            })}
            className="ms-2"
          >
            Cancelar edición
          </Button>
        )}
      </Form>

      <Form.Group className="mb-3" style={{ maxWidth: '200px' }}>
        <Form.Label>Filtrar por Rol</Form.Label>
        <Form.Select
          value={filtroRol}
          onChange={e => setFiltroRol(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="admin">Administrador</option>
          <option value="user">Usuario</option>
        </Form.Select>
      </Form.Group>

      <h4>Usuarios registrados</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th style={{ cursor: 'pointer' }} onClick={() => ordenarPorCampo('nombre')}>
              Nombre {ordenCampo === 'nombre' ? (ordenAscendente ? '▲' : '▼') : ''}
            </th>
            <th>DNI</th>
            <th style={{ cursor: 'pointer' }} onClick={() => ordenarPorCampo('email')}>
              Email {ordenCampo === 'email' ? (ordenAscendente ? '▲' : '▼') : ''}
            </th>
            <th style={{ cursor: 'pointer' }} onClick={() => ordenarPorCampo('rol')}>
              Rol {ordenCampo === 'rol' ? (ordenAscendente ? '▲' : '▼') : ''}
            </th>
            <th>Telefono</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltradosYOrdenados.map((u) => (
            <tr key={u._id}>
              <td>{u.nombre} {u.apellidos}</td>
              <td>{u.dni}</td>
              <td>{u.email}</td>
              <td>{u.rol}</td>
              <td>{u.telefono}</td>
              <td>
                <Button
                  size="sm"
                  variant={u.rol === 'admin' ? 'secondary' : 'success'}
                  onClick={() => cambiarRol(u._id, u.rol === 'admin' ? 'user' : 'admin')}
                  disabled={u._id === user._id}
                >
                  {u.rol === 'admin' ? 'Revocar Admin' : 'Conceder Admin'}
                </Button>{' '}
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => cargarUsuarioParaEditar(u)}
                >
                  Editar
                </Button>{' '}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => eliminarUsuario(u._id)}
                  disabled={u._id === user._id}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Staff;