import tickImage from '../assets/img/tick.png'; // Importando la imagen del icono

function Confirmada() {
  return (
    <div className="container">
        <h2>Reserva Confirmada</h2>
        <p>Tu reserva ha sido confirmada con éxito.</p>
        <img className="tick" src={tickImage} alt="Tick" /> {/* Using the imported tick image */}
    </div>
  );
}

export default Confirmada;
