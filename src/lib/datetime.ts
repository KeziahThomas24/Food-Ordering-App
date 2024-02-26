export function dbTimeForHuman(str: string): string {
    return str.replace('T', ' ').substring(0, 16);
  }
  