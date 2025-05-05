import fs from 'fs/promises';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { type } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const inventoryFile = `${__dirname}/inventory.json`;

// 1. inventory.json laden wenn nicht gegeben dann leeres array setzen

const loadInventory = async () => {
    try {
        const inventory = await fs.readFile(inventoryFile, 'utf-8');
        return JSON.parse(inventory);
    } catch {
        return [];
    }
}

console.log(await loadInventory());

// 2. von den änderungen der hinzufügungen nehmen und überschreiben

const saveInventory = async (items) => {
    await fs.writeFile(inventoryFile, JSON.stringify(items, null, 2));
}
// 3. Produkt hinzufuegen
const addProduct = async () => {
    const inventory = await loadInventory();
    const { name, quantity, price, location } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Produktname:',
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'Menge:',
        },
        {
            type: 'input',
            name: 'price',
            message: 'Preis:',
        },{
            type: 'input',
            name: 'location',
            message: 'Lagerort::',
        }
    ]);

    inventory.push({ name, quantity, price, location });
    // !!!!!!!!!!!!!!!!!!! NUN DER SAVE FUNCTION ÜBERGEBEN !!!!!!!!!!!!!!!!!

}

// 4. Produkte listen
// 5. Produkt anzeigen
// 6. Produkt bearbeiten
// 7. Produkt löschen
// 8. mainmenu erstellen