export function validateDbIdentifiers(identifiers: string[]): boolean {
  const identifierRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

  return identifiers.every(
    (identifier) =>
      typeof identifier === 'string' && identifierRegex.test(identifier),
  );
}
