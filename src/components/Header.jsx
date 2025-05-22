// Header.jsx
import { useAuth } from '../context/AuthContext';
import '../assets/styles/main.css';
import logo from '../assets/img/logo.png';
import profile from '../assets/img/profile.png';
import { Navbar, Nav, Button, NavDropdown } from 'react-bootstrap';

function Header() {

  const { user, logout } = useAuth();

  return (
    <Navbar expand="lg" className="fixed-top shadow custom-navbar">
      <div className="navbar-inner d-flex justify-content-between align-items-center w-100">
        <Navbar.Brand href="/" className="d-flex align-items-center">
        <img
          alt=""
          src={logo}
          width="110"
          height="110"
          className="d-inline-block align-top"
        />
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mx-auto d-flex justify-content-center">
          <Nav.Link href="/" className="text-uppercase"> Home </Nav.Link>
          <Nav.Link href="/servicios" className="text-uppercase"> Servicios </Nav.Link>
          <Nav.Link href="/reservas" className="text-uppercase"> Reservas </Nav.Link>
          <Nav.Link href="/contacto" className="text-uppercase"> Contacto </Nav.Link>
        </Nav>
      <Nav className="me-2 mb-2">
            {user ? (
              <NavDropdown
                title={
                  <img
                    src={profile}
                    width="40"
                    height="40"
                    alt="Perfil"
                    className="perfil img-fluid"
                    id="basic-nav-dropdown"
                  />
                }
                style={{ backgroundColor: '#475045', padding: '5px 10px' }}
              >
                <NavDropdown.Item href="/misreservas">
                  Mis Reservas
                </NavDropdown.Item>
                <NavDropdown.Item onClick={logout}>
                  Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Button
                variant="dark"
                size="sm"
                href="/club"
              >
                ÚNETE AL CLUB
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}

export default Header;
