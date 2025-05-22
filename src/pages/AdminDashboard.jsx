// AdminDashboard.jsx
import DashboardLayout from '../layouts/DashboardLayout';

import { Card, Row, Col, Container } from 'react-bootstrap';
import { People, CalendarCheck, Gear } from 'react-bootstrap-icons';

const AdminDashboard = () => {
  return (
    <Container fluid>
      <h2 className="mb-4">Bienvenido, Administrador 👋</h2>
      <p className="text-muted mb-5">Aquí puedes gestionar las operaciones principales del sistema.</p>

      <Row className="g-4">
        <Col md={6} lg={4}>
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <CalendarCheck size={32} className="text-primary me-3" />
              <div>
                <h5 className="mb-0">Reservas</h5>
                <p className="text-muted mb-0">Ver y gestionar reservas.</p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <People size={32} className="text-success me-3" />
              <div>
                <h5 className="mb-0">Huéspedes</h5>
                <p className="text-muted mb-0">Listado y detalles de huéspedes.</p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <Gear size={32} className="text-warning me-3" />
              <div>
                <h5 className="mb-0">Configuración</h5>
                <p className="text-muted mb-0">Ajustes del sistema y usuarios.</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;

