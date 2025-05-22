import React, { useEffect, useState, useRef } from 'react';

const STORAGE_KEY = 'notifications';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const ws = useRef(null);
  const isConnected = useRef(false);

  // Cargar notificaciones de localStorage al montar
  useEffect(() => {
    const savedNotifications = localStorage.getItem(STORAGE_KEY);
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  // Guardar notificaciones en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const connectWebSocket = () => {
    if (ws.current || isConnected.current) return;

    const WS_URL = import.meta.env.DEV
      ? 'ws://localhost:5000/ws'
      : `wss://${window.location.host}/ws`;

    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      console.log('✅ WebSocket conectado');
      isConnected.current = true;
    };

    ws.current.onmessage = (event) => {

      try {
        const data = JSON.parse(event.data);

        if (!data || typeof data !== 'object') {
          console.warn('⚠️ Mensaje no es un objeto válido');
          return;
        }

        if (data.error) {
          console.error('❌ Error WebSocket:', data.error);
          return;
        }

        const { tipo: tipoMensaje, payload } = data;

        let mensaje = '';
        let tipo = '';

        switch (tipoMensaje) {
          case 'reserva':
            tipo = 'Reserva';
            if (payload && typeof payload === 'object') {
              const { habitacion, fechaEntrada, fechaSalida } = payload;

              const entrada = fechaEntrada ? new Date(fechaEntrada).toLocaleDateString() : '?';
              const salida = fechaSalida ? new Date(fechaSalida).toLocaleDateString() : '?';

              mensaje = `Reserva en habitación ${habitacion || 'N/A'} del ${entrada} al ${salida}`;
            } else {
              mensaje = 'Nueva reserva recibida';
            }
            break;

          case 'user':
            tipo = 'Usuario';
            mensaje = `Nuevo usuario registrado: ${payload?.email || 'Email no disponible'}`;
            break;

          default:
            tipo = 'Otro';
            mensaje = `Mensaje no reconocido: ${JSON.stringify(data)}`;
        }

        setNotifications((prev) => [
          {
            id: `${Date.now()}-${Math.random()}`,
            tipo,
            mensaje,
          },
          ...prev,
        ]);

      } catch (err) {
        console.error('❌ Error parseando mensaje WS:', err);
      }
    };


    ws.current.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };

    ws.current.onclose = () => {
      console.log('WebSocket desconectado');
      ws.current = null;
      isConnected.current = false;
    };
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
        console.log('WebSocket cerrado en cleanup');
      }
    };
  }, []);

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">🔔 Notificaciones</h2>
        <button className="btn btn-outline-danger" onClick={clearNotifications}>
          Borrar todas
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="alert alert-info text-center">
          No hay notificaciones nuevas.
        </div>
      ) : (
        <ul className="list-group">
          {notifications.map((noti) => (
            <li key={noti.id} className="list-group-item d-flex align-items-start flex-column">
              <div className="fw-bold text-primary">{noti.tipo}</div>
              <div>{noti.mensaje}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;

