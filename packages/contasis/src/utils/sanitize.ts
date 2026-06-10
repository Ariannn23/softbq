export function sanitizeBusinessName(name: string): string {
  if (!name) {
    return "";
  }

  return name
    // Permite letras (incluyendo ñ y tildes), numeros, espacios y puntuacion basica
    // Todo lo que no coincida (como comillas, grados, simbolos raros) sera eliminado
    .replace(/[^\p{L}\p{N}\s.,&()-]/gu, "")
    .replace(/[\n\r\t]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
