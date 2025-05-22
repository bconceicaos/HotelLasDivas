import { useAuth } from '../context/AuthContext';
import '../assets/styles/main.css';
import logo from '../assets/img/logo.png';
import { Nav, Navbar } from 'react-bootstrap';
import { House, People, CalendarCheck, DoorClosed, Bell, BoxArrowRight } from 'react-bootstrap-icons';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {

  const { user, logout } = useAuth();

  return (
    <div style={{ width: '250px', backgroundColor: '#475045' }}>
      <Navbar.Brand href="/" className="d-flex align-items-center">
        <img
          alt=""
          src={logo}
          width="110"
          height="110"
          className="d-inline-block align-top"
        />
      </Navbar.Brand>
      <Nav className="flex-column">
        <NavLink
          as={NavLink}
          to="/gerencia"
          className={({ isActive }) =>
            `d-flex align-items-center px-3 py-2 ${isActive ? 'active-link' : 'inactive-link'}`
          }
        >
          <House className="me-2" /> Home
        </NavLink>

        <NavLink 
          as={NavLink} 
          to="/guest" 
          className={({ isActive }) =>
            `d-flex align-items-center px-3 py-2 ${isActive ? 'active-link' : 'inactive-link'}`
          }
        >
          <People className="me-2" /> Guest
        </NavLink>
        <NavLink 
          as={NavLink} 
          to="/booking" 
          className={({ isActive }) =>
            `d-flex align-items-center px-3 py-2 ${isActive ? 'active-link' : 'inactive-link'}`
          }
        >
          <CalendarCheck className="me-2" /> Booking
        </NavLink>
        <NavLink 
          as={NavLink} 
          to="/rooms" 
          className={({ isActive }) =>
            `d-flex align-items-center px-3 py-2 ${isActive ? 'active-link' : 'inactive-link'}`
          }
        >
          <DoorClosed className="me-2" /> Rooms
        </NavLink>
        <NavLink 
          as={NavLink} 
          to="/staff"
          className={({ isActive }) =>
            `d-flex align-items-center px-3 py-2 ${isActive ? 'active-link' : 'inactive-link'}`
          }
        >
          <People className="me-2" /> Staff
        </NavLink>
        <NavLink 
          as={NavLink} 
          to="/notifications"
          className={({ isActive }) =>
            `d-flex align-items-center px-3 py-2 ${isActive ? 'active-link' : 'inactive-link'}`
          }>
          <Bell className="me-2" /> Notifications
        </NavLink>
        <Nav.Link 
          as="div"
          onClick={logout}
          className="d-flex align-items-center px-3 py-2 logout-link"
          style={{ cursor: 'pointer', color: 'white' }}
        >
          <BoxArrowRight className="me-2" /> Cerrar Sesión
        </Nav.Link>

      </Nav>
    </div>
  );
};

export default Sidebar;
