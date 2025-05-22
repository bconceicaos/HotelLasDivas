import { Row, Col } from 'react-bootstrap';
import Gerencia from './Gerencia';

function Footer() {
  return (
    <footer className="footer shadow">
      <div className="py-4">
        <Row>
          <Col md={4}>
            <h5 className="footer-heading mb-4">HOTEL LAS DIVAS</h5>
            <p>&#169; 2025 Hotel Las Divas.</p>

            {/* Se pasa la función onLogin del componente App */}
            <Gerencia />  
          </Col>
          <Col md={4}>
            <h5 className="footer-heading mb-4">LINKS</h5>
            <ul className="footer-links">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/club">Club</a>
              </li>
              <li>
                <a href="/servicios">Servicios</a>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5 className="footer-heading mb-4">CONTACT</h5>
            <ul className="footer-contacto">
              <span>
                  <i className="fa fa-phone icon text-primary pr-3"></i>+1 (555) 123-4567 <br />
              </span>
              <span>
                  <i className="fa fa-envelope icon text-primary pr-3"></i>info@lasulashotel.com <br /> 
              </span>
              <span>
                  <i className="fa fa-map-marker icon text-primary pr-3"></i>123 Ocean Avenue Los Ángeles, CA 90001 Estados Unidos <br />
              </span> 
            </ul>
          </Col>
        </Row>
      </div>
    </footer>
  );
}

export default Footer;
