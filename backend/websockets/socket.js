import { WebSocketServer, WebSocket } from 'ws';
import { verificarToken } from '../utils/jwt.js';
import cookie from 'cookie';

const usuariosConectados = new Map(); // email → ws

export const inicializarWebSocket = (server) => {
  const wss = new WebSocketServer({
    server,
    path: '/ws',
  });

  wss.on('connection', async (ws, req) => {
    try {
      // Leer y parsear cookies desde el encabezado
        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies['accessToken'];

      if (!token) {
        console.warn('❌ WebSocket rechazado: No se encontró accessToken en cookies');
        ws.send(JSON.stringify({ error: 'Token no proporcionado' }));
        return ws.close(1008, 'Token no proporcionado');
      }

      // Verifica el JWT
      const usuario = await verificarToken(token, process.env.JWT_SECRET);
      const email = usuario?.email;
      const rol = usuario?.rol;


      if (!email) {
        console.warn('❌ Token válido pero sin email');
        ws.send(JSON.stringify({ error: 'Token inválido (sin email)' }));
        return ws.close(1008, 'Token inválido');
      }

      // Asociar usuario al WebSocket
      console.log(`🟢 ${email} conectado por WebSocket`);
      ws.usuarioEmail = email;
      ws.rol = rol;

      usuariosConectados.set(email, ws);

      // Limpiar en desconexión
      ws.on('close', () => {
        console.log(`🔴 ${email} desconectado`);
        usuariosConectados.delete(email);
      });

      // Manejo de errores del socket
      ws.on('error', (err) => {
        console.error(`❌ Error WS con ${email}:`, err.message);
      });

    } catch (err) {
      console.error('❌ Error de autenticación WebSocket:', err.message || err);
      ws.send(JSON.stringify({ error: 'Token inválido o expirado' }));
      ws.close(1008, 'Token inválido o expirado');
    }
  });

  // Broadcast a todos los usuarios autenticados
  wss.broadcast = (tipo, payload) => {
    const mensaje = JSON.stringify({ tipo, payload });
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN && client.usuarioEmail) {
        client.send(mensaje);
      }
    }
  };

  // Emitir a un usuario específico
  wss.emitToUser = (email, tipo, payload) => {
    const ws = usuariosConectados.get(email);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ tipo, payload }));
    }
  };

  // Emitir solo a usuarios con rol "admin" (según una lista, o lógica más completa)
    wss.broadcastToAdmins = (tipo, payload) => {
    const mensaje = JSON.stringify({ tipo, payload });
    for (const [email, client] of usuariosConectados.entries()) {
      console.log(`Revisando ${email} con rol ${client.rol}`);
      if (client.rol === 'admin') {
        console.log(`Enviando a admin ${email}`);
        client.send(mensaje);
      }
    }
  };


  return wss;
};
