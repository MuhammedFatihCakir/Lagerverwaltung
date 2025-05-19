import fs from 'fs/promises';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { categories } from './categories.ts';
import { loadInventory, saveInventory } from './inventory.ts';
import { addProduct } from './addProduct.ts';
import { listProducts } from './listProducts.ts';
import { viewProduct } from './viewProduct.ts';
import { editProduct } from './editProduct.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const inventoryFile = `${__dirname}/inventory.json`;



export const deleteProduct = async (): Promise<void> => {
    const inventory = await loadInventory();
    if (inventory.length === 0) {
        console.log('📭 Keine Produkte im Lager.\n');
        return;
    }

    const allCategories = inventory.filter(
        (product, index, self) =>
            index === self.findIndex(p => p.category === product.category)
        );

    const { category } = await inquirer.prompt<{ category: string}>({
        type: 'list',
        name: 'category',
        message: 'Aus welcher Kategorie?',
        choices: [
            {name: 'Zurück', value: 'zurück'},
            ...allCategories.map((item) => ({
                name: item.category,
                value: item.category,
            }))
        ]
    })
    if(category === 'zurück') return;

    let productsOfCategory = inventory.filter(product => product.category === category)

    const { id } = await inquirer.prompt<{ id: number | 'zurück'}>({
        type: 'list',
        name: 'id',
        message: 'welches Produkt möchtest du löschen?',
        choices: [{name:'Zurück', value: 'zurück'},
            ...productsOfCategory.map((item) => ({
                name: item.name,
                value: item.id,
            }))
        ]
    })
    if(id === 'zurück') {
        return deleteProduct();
    }


    const latestInventory = await loadInventory();
    const updatedInventory = latestInventory.filter(product => product.id !== id);
    if (updatedInventory.length === latestInventory.length) {
        console.log('❌ Produkt konnte nicht gelöscht werden (nicht gefunden).');
        return;
    }
    
    const{ deleteConfirm }  = await inquirer.prompt<{ deleteConfirm: boolean }>({
        type: 'confirm',
        name:'deleteConfirm',
        message: 'Möchtest du das Produkt wirklich löschen?',
        default: false
    })

    if(deleteConfirm) {
        await saveInventory(updatedInventory);
        console.log('🗑️ Produkt gelöscht.\n');
    } else {
        console.log('❌ Löschvorgang abgebrochen!.\n');
    }
}
