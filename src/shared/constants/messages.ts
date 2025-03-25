export const OK_200 = "Proceso realizado con éxito.";
export const ERR_401 = "No tiene autorización para ejecutar este proceso.";
export const ERR_400 =
  "Ocurrió un error al procesar su solicitud. Por favor, revise los datos enviados e inténtelo nuevamente.";
export const EXPRESS_VALIDATION_ERR =
  "Lo sentimos, la solicitud que has enviado es incorrecta. Por favor, revisa los datos proporcionados e inténtalo de nuevo.";
export const AUTH_FAILED = (detail: string) =>
  `Fallo al autenticar usuario, ${detail}.`;
export const FIND_RECORD_FAILED = (option: string) =>
  `No se pudo encontrar datos del ${option}.`;
export const DATABASE_ERR = `Error al guardar la información.`;
export const DATABASE_ERR_QUERY = `Error al consultar la información.`;
