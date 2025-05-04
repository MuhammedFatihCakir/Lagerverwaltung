import fs from 'fs/promises';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const inventoryFile = `${__dirname}/inventory.json`;

// 1. inventory.json laden wenn nicht gegeben dann leeres array setzen
// 2. von den änderungen der hinzufügungen nehmen und überschreiben
// 3. Produkt hinzufuegen
// 4. Produkte listen
// 5. Produkt anzeigen
// 6. Produkt bearbeiten
// 7. Produkt löschen
// 8. mainmenu erstellen