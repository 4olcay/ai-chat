export class ClientDisconnectError extends Error {
  constructor(reason: string = 'Client disconnected') {
    super(reason);
    this.name = 'ClientDisconnectError';
    Object.setPrototypeOf(this, ClientDisconnectError.prototype);
  }
}

export class ConnectionResetError extends Error {
  constructor(reason: string = 'Connection reset by peer') {
    super(reason);
    this.name = 'ConnectionResetError';
    Object.setPrototypeOf(this, ConnectionResetError.prototype);
  }
}
