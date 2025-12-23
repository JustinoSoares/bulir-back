// socket.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class SocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;

  handleConnection(client: Socket) {
    console.log('Socket conectado:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Socket desconectado:', client.id);
  }

  emit(event: string, payload: any) {
    this.server.emit(event, payload);
  }

  emitToRoom(room: string, event: string, payload: any) {
    this.server.to(room).emit(event, payload);
  }

  emitToUser(socketId: string, event: string, payload: any) {
    this.server.to(socketId).emit(event, payload);
  }
}
