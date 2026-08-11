export function resourceValidate(resource: string): boolean {
  if (typeof resource !== 'string') {
    return false;
  }

  const resourceRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

  return resourceRegex.test(resource);
}
