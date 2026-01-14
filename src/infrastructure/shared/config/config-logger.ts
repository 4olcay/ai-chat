export const configLogger = {
  error: (message: string): void => {
    const timestamp = new Date().toISOString();
    console.error(`${timestamp} [error]: ${message}`);
  },
  info: (message: string): void => {
    const timestamp = new Date().toISOString();
    console.info(`${timestamp} [info]: ${message}`);
  },
  debug: (message: string): void => {
    const timestamp = new Date().toISOString();
    console.debug(`${timestamp} [debug]: ${message}`);
  },
};
