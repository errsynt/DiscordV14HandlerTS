import { ExtendedClient } from '../structures/ExtendedClient';
import { readdirSync } from 'fs';
import { join } from 'path';

export async function loadEvents(client: ExtendedClient) {
  const eventFiles = readdirSync(join(__dirname, '../events')).filter(file => file.endsWith('.ts'));
  for (const file of eventFiles) {
    try {
      const { event } = await import(join(__dirname, `../events/${file}`));
      if (!event || !event.name || !event.execute) {
        console.warn(`[ WARNING ] The event file '${file}' does not export a valid event.`);
        continue;
      }

      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
    } catch (error) {
      console.error(`Error loading event '${file}':`, error);
    }
  }
}
