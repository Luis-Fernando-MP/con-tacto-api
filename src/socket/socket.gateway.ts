import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Usuario conectado', client.id);
    this.server.emit('chat', `👋 Usuario ${client.id} se ha conectado`);
  }

  handleDisconnect(client: Socket) {
    console.log('Usuario desconectado', client.id);
    this.server.emit('chat', `❌ Usuario ${client.id} se ha desconectado`);
  }

  @SubscribeMessage('chat')
  handleChat(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`💬 [${client.id}]: ${message}`);
    this.server.emit('chat', `${client.id}: ${message}`);
  }
}
