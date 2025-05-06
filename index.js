import fs from 'fs/promises';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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
            type: 'number',
            name: 'quantity',
            message: 'Menge:',
            validate: (val) => val >= 0 || 'Bitte eine gültige Menge eingeben.'
        },
        {
            type: 'number',
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


// 5. Produkt anzeigen
const viewProduct = async () => {
    const inventory = await loadInventory();
    if (inventory.length === 0) {
        console.log('📭 Keine Produkte im Lager.\n');
        return;
    }

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

// 6. Produkt bearbeiten

const editProduct = async () => {
    const inventory = await loadInventory();
    
    if (inventory.length === 0) {
        console.log('📭 Keine Produkte zum Bearbeiten.\n');
        return;
    }

    const { id } = await inquirer.prompt({
        type: 'list',
        name: 'id',
        message: 'Welches Produkt möchtest du bearbeiten?',
        choices: inventory.map((item) => ({
            name: item.name,
            value: item.id,
        }))
    })

    const item = inventory.find(product => product.id === id);

    const { name, quantity, price, location } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Neuer Produktname:',
            default: item.name,

        },
        {
            type: 'input',
            name: 'quantity',
            message: 'Neue Menge:',
            default: item.quantity,
        },
        {
            type: 'input',
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


const deleteProduct = async () => {
    const inventory = await loadInventory();
    if (inventory.length === 0) {
        console.log('📭 Keine Produkte im Lager.\n');
        return;
    }

    const { id } = await inquirer.prompt({
        type: 'list',
        name: 'id',
        message: 'Welches Produkt möchtest du löschen?',
        choices: inventory.map((item) => ({
            name: item.name,
            value: item.id,
        }))
    });

    const updatedInventory = inventory.filter(product => product.id !== id);
    await saveInventory(updatedInventory);
    console.log('🗑️ Produkt gelöscht.\n');
}

// 8. mainmenu erstellen

const mainMenu = async () => {
    while(true) {
        
        const { action } = await inquirer.prompt({
            type: 'list',
            name: 'action',
            message: 'Was möchtest du tun?',
            choices: [
            {name: '➕ Produkt hinzufügen', value: 'add'},
            {name: '📋 AlleProdukte anzeigen', value: 'list'},
            {name: '🔍 Produktdetails anzeigen', value: 'view'},
            {name: '✏️  Produkt bearbeiten', value: 'edit'},
            {name: '🗑️  Produkt löschen', value: 'delete'},
            {name: '🚪 Beenden', value: 'exit'},
            ] 
        })

        if(action === 'add') await addProduct();
        else if(action === 'list') await listProducts(); 
        else if(action === 'edit') await editProduct();
        else if(action === 'view') await viewProduct();
        else if(action === 'delete') await deleteProduct(); 
        else break;
    }
}

mainMenu();
