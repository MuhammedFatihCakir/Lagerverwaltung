import inquirer from 'inquirer';
import { categories } from './categories.ts';
import { loadInventory, saveInventory } from './inventory.ts';

export const addProduct = async (): Promise<void> => {
    const inventory = await loadInventory();
    const { name, category, quantity, price, location } = await inquirer.prompt<{
        name: string;
        category: string;
        quantity: number;
        price: number;
        location: string;
    }>([
        {
            type: 'input',
            name: 'name',
            message: 'Produktname:',
            validate: (val) => {
                if(!val.trim()) {
                    return '❌ Bitte gib einen gültigen Produktnamen ein!';
                } else {
                    return true;
                }
            }
        },
        {
            type: 'list',
            name: 'category',
            message: 'wähle die Produktkategorie aus!',
            choices: categories,
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
            validate: (val) => {
                if(!val.trim()) {
                    return '❌ Bitte gib einen gültigen Produktnamen ein!';
                } else {
                    return true;
                }
            }
        }
    ]);

    inventory.push({ id: Date.now(), name, category, quantity, price, location });
    await saveInventory(inventory);
    console.log('✅ Produkt wurde hinzugefügt.\n');
}