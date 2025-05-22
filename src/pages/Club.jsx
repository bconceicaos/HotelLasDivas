import '../assets/styles/main.css';
import { CartFill, CupFill, GiftFill } from 'react-bootstrap-icons';
import Sesion from '../components/Sesion';

function Club () {
    return (
        <div className="container">
      <br /><br /><br />
      <section className='hero'>
        <h1>¡DESCUBRE TODAS LAS VENTAJAS DE PERTENECER AL CLUB!</h1>
      </section>

      <br /><br />
      <div className='row'>
        <div className=' col-md-6'>
          <section className='club-info'>
            <div className='info'>
              <h2>¿Cómo funciona el Club Las Divas?</h2>
              <p>Rellena el formulario para formar parte del Club Las Divas.</p>
              <p>Inicia sesión siempre que estés navegando en la web.</p>
              <p>Reserva siguiendo el proceso de reserva online de la manera habitual.</p>
              <p>Automáticamente se aplicará un descuento del 10% en tu reserva en Hotel Las Divas.</p>
            </div>
          </section>
          <section className='club-advantages'>
            <div className='advantages'>
              <h2>Ventajas de pertenecer al Club Las Divas</h2>
              <p>Regístrate en nuestro Club de Las Divas para disfrutar de descuentos y ventajas exclusivas durante tus vacaciones.</p>
              <ul>
                <li><CartFill /> Descuentos en todas tus reservas</li>
                <li><CupFill /> Consumiciones gratis</li>
                <li><GiftFill /> Regalos de bienvenida</li>
              </ul>
              <p>¡Disfruta de más ventajas y un trato aún mejor en cada estancia!</p>
            </div>
          </section>
        </div>
        <div className='col-md-6'>
          <section className='club-form'>
            {/* Se pasa la función onLogin del componente App */}
            <Sesion />
          </section>
        </div>
      </div>
    </div>
    );
}

export default Club;
