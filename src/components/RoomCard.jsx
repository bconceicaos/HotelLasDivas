// RoomCard.jsx
function RoomCard({ nombreHabitacion, descripcion, caracteristicas,  precioTotalPorNoche, onSelect }) {
  
  return (
      <div className="room-card card" style={{ height: '490px' }}>
          <div className="card-body">
              <h3 className="card-title">{nombreHabitacion}</h3>
              <p className="card-text">{descripcion}</p>
              <ul className="list-group list-group-custom mb-2">
                  <li className="list-group-item">{caracteristicas}</li>
              </ul>
              <p className="card-text">Precio por noche: {precioTotalPorNoche}€</p>
              <br />
              <button className="btn btn-primary" onClick={onSelect}>Seleccionar Habitación</button>
          </div>
      </div>
  );
}

export default RoomCard;