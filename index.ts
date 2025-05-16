import fs from 'fs/promises';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const inventoryFile = `${__dirname}/inventory.json`;

interface Product {
    id: number;
    name: string;
    quantity: number;
    price: number;
    location: string;
}

// 1. inventory.json laden wenn nicht gegeben dann leeres array setzen

const loadInventory = async ():Promise<Product[]> => {
    try {
        const inventory = await fs.readFile(inventoryFile, 'utf-8');
        return JSON.parse(inventory) as Product[];
    } catch {
        return [];
    }
}


// 2. von den änderungen der hinzufügungen nehmen und überschreiben

const saveInventory = async (items: Product[]): Promise<void> => {
    await fs.writeFile(inventoryFile, JSON.stringify(items, null, 2));
}
// 3. Produkt hinzufuegen
const addProduct = async (): Promise<void> => {
    const inventory = await loadInventory();
    const { name, quantity, price, location } = await inquirer.prompt<{
        name: string;
        quantity: number;
        price: number;
        location: string;
    }>([
        {
            type: 'input',
            name: 'name',
            message: 'Produktname:',
        },
        {
            type: 'number',
            name: 'quantity',
            message: 'Menge:',
            validate: (val) => {
                if (typeof val !== 'number' || isNaN(val) || val < 0) {
                  return 'Bitte eine gültige Menge eingeben.';
                }
                return true;
              }
        },
        {
            type: 'number',
            name: 'price',
            message: 'Preis:',
            validate: (val) => {
                if (typeof(val) !== 'number' || isNaN(val) || val < 0) {
                    return 'Bitte eine gültige Menge eingeben.';
                }
                return true;
            }
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
// 4. Produkte listen

const listProducts = async (): Promise<void> => {
    const inventory = await loadInventory();
    if(inventory.length === 0) {
        console.log('📭 Keine Produkte im Lager.\n');
        return;
    }

    inventory.forEach((product, index) => {
        console.log(
          `${index + 1}. ${product.name} - Menge: ${product.quantity}, Preis: ${product.price}€, Lagerort: ${product.location}`
        );
      });
    };


// 5. Produkt anzeigen
const viewProduct = async (): Promise<void> => {
    const inventory = await loadInventory();
    if (inventory.length === 0) {
        console.log('📭 Keine Produkte im Lager.\n');
        return;
    }

    const { id } = await inquirer.prompt<{ id: number}>({
        type: 'list',
        name: 'id',
        message: 'Welches Produkt möchtest du anzeigen?',
        choices: inventory.map((item) => ({
            name: item.name,
            value: item.id,
        }))
    })

    let selectedItem = inventory.find(product => product.id === id);
    if(selectedItem) {
        console.log(`
    Produktdetails:
    - Name: ${selectedItem.name}
    - Menge: ${selectedItem.quantity}
    - Preis: ${selectedItem.price}€
    - Lagerort: ${selectedItem.location}`);
    }
}

// 6. Produkt bearbeiten

const editProduct = async (): Promise<void> => {
    const inventory = await loadInventory();
    
    if (inventory.length === 0) {
        console.log('📭 Keine Produkte zum Bearbeiten.\n');
        return;
    }

    const { id } = await inquirer.prompt<{ id: number }>({
        type: 'list',
        name: 'id',
        message: 'Welches Produkt möchtest du bearbeiten?',
        choices: inventory.map((item) => ({
            name: item.name,
            value: item.id,
        }))
    })

    const item = inventory.find(product => product.id === id);
    if(!item) {
        console.log('❌ Produkt nicht gefunden.');
        return;
    }

    const { name, quantity, price, location } = await inquirer.prompt<{
        name: string;
        quantity: number;
        price: number;
        location: string;
    }>([
        {
            type: 'input',
            name: 'name',
            message: 'Neuer Produktname:',
            default: item.name,

        },
        {
            type: 'number',
            name: 'quantity',
            message: 'Neue Menge:',
            default: item.quantity,
        },
        {
            type: 'number',
            name: 'price',
            message: 'Neuer Preis:',
            default: item.price,
        },
        {
            type: 'input',
            name: 'location',
            message: 'Neuer Lagerort:',
            default: item.location,
        }
        ]);

        item.name = name;
        item.quantity = quantity;
        item.price = price;
        item.location = location;

        await saveInventory(inventory);
        console.log('✏️ Produkt aktualisiert.\n');
}
// 7. Produkt löschen


const deleteProduct = async (): Promise<void> => {
    const inventory = await loadInventory();
    if (inventory.length === 0) {
        console.log('📭 Keine Produkte im Lager.\n');
        return;
    }

    const { id } = await inquirer.prompt<{ id: number }>({
        type: 'list',
        name: 'id',
        message: 'Welches Produkt möchtest du löschen?',
        choices: inventory.map((item) => ({
            name: item.name,
            value: item.id,
        }))
    });
    const latestInventory = await loadInventory();
    const updatedInventory = latestInventory.filter(product => product.id !== id);
    if (updatedInventory.length === latestInventory.length) {
        console.log('❌ Produkt konnte nicht gelöscht werden (nicht gefunden).');
        return;
    }
    

    await saveInventory(updatedInventory);
    console.log('🗑️ Produkt gelöscht.\n');
}

// 8. mainmenu erstellen

const mainMenu = async (): Promise<void> => {
    while(true) {
        
        const { action } = await inquirer.prompt<{ action: (() => Promise<any>) | 'exit' }>({
            type: 'list',
            name: 'action',
            message: 'Was möchtest du tun?',
            choices: [
            {name: '➕ Produkt hinzufügen', value: addProduct},
            {name: '📋 Alle Produkte anzeigen', value: listProducts},
            {name: '🔍 Produktdetails anzeigen', value: viewProduct},
            {name: '✏️  Produkt bearbeiten', value: editProduct},
            {name: '🗑️  Produkt löschen', value: deleteProduct},
            {name: '🚪 Beenden', value: 'exit'},
            ] 
        })
        if (action === 'exit') return;
        await action();

    }
}

mainMenu();
