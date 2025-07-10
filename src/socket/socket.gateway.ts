import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/chat/chat.service';
import TTSService from 'src/services/tts/tts.service';
import APP from 'src/constants';

@WebSocketGateway({ cors: APP.origins })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly tts: TTSService,
  ) {}

  private readonly roles = new Map<string, 'usuario' | 'tutor'>();
  private readonly usuarios = new Map<string, Socket>();
  private readonly tutores = new Map<string, Socket>();

  handleConnection(client: Socket) {
    console.log('🟢 Conectado:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('🔴 Desconectado:', client.id);
    this.roles.delete(client.id);
    this.usuarios.delete(client.id);
    this.tutores.delete(client.id);
    this.server.emit('usuariosConectados', [...this.usuarios.keys()]);
  }

  @SubscribeMessage('setRole')
  handleSetRole(
    @ConnectedSocket() client: Socket,
    @MessageBody() role: 'usuario' | 'tutor',
  ) {
    this.roles.set(client.id, role);

    if (role === 'usuario') {
      this.usuarios.set(client.id, client);
      client.join(client.id); // sala privada
      this.server.emit('usuariosConectados', [...this.usuarios.keys()]);
    }

    if (role === 'tutor') {
      this.tutores.set(client.id, client);
    }

    client.emit('roleConfirmed', `Rol asignado: ${role}`);
    console.log(`🎭 Rol '${role}' asignado a ${client.id}`);
  }

  @SubscribeMessage('chat')
  async handleUsuarioChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() prompt: string,
  ) {
    const role = this.roles.get(client.id);
    if (role !== 'usuario') return;

    const response = await this.chatService.to_create({
      prompt,
      test: true,
    });

    client.emit('audio', {
      respuesta: response.text,
      audioUrl: response.audio,
    });
  }

  @SubscribeMessage('tutorMensaje')
  async handleTutorMensaje(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { to: string; mensaje: string },
  ) {
    const role = this.roles.get(client.id);
    if (role !== 'tutor') return;

    const audio = await this.tts.speak({ text: data.mensaje });

    this.server.to(data.to).emit('notificacion', {
      mensaje: data.mensaje,
      audioUrl: audio,
    });

    client.emit('notificacion', {
      mensaje: data.mensaje,
      audioUrl: audio,
    });
  }
}
