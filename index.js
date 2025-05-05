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
            validate: (val) => val >= 0 || 'Bitte eine gültige Menge eingeben.'
        },
        {
            type: 'input',
            name: 'price',
            message: 'Preis:',
            validate: (val) => val >= 0 || 'Bitte einen gültigen Preis eingeben.'
        },
        {
            type: 'input',
            name: 'location',
            message: 'Lagerort:',
        }
    ]);

    inventory.push({ id: Date.now(), name, quantity, price, location });
    await saveInventory(inventory);
    console.log('✅ Produkt wurde hinzugefügt.');
}
// await addProduct()
// 4. Produkte listen

const listProducts = async () => {
    const inventory = await loadInventory();
    if(inventory.length === 0) {
        console.log('📭 Keine Produkte im Lager.\n');
        return;
    }

    let i = 0;
    inventory.forEach(product => {
        i++;
        console.log(
            `${i}. ${product.name} - Menge: ${product.quantity}, Preis: ${product.price}€, Lagerort: ${product.location}`
        )});
}

// listProducts();

// 5. Produkt anzeigen
const viewProduct = async () => {
    const inventory = await loadInventory();

    const { id } = await inquirer.prompt({
        type: 'list',
        name: 'id',
        message: 'Welches Produkt möchtest du anzeigen?',
        choices: inventory.map((item) => ({
            name: item.name,
            value: item.id,
        }))
    })

    let selectedItem = inventory.find(product => product.id === id);
    console.log(`
Produktdetails:
- Name: ${selectedItem.name}
- Menge: ${selectedItem.quantity}
- Preis: ${selectedItem.price}€
- Lagerort: ${selectedItem.location}`);

}
// viewProduct();



// 6. Produkt bearbeiten
// 7. Produkt löschen
// 8. mainmenu erstellen