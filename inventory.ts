import fs from 'fs/promises';
import { Product } from './product.ts';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const inventoryFile = `${__dirname}/inventory.json`;




export const loadInventory = async ():Promise<Product[]> => {
    try {
        const inventory = await fs.readFile(inventoryFile, 'utf-8');
        return JSON.parse(inventory) as Product[];
    } catch {
        return [];
    }
}


export const saveInventory = async (items: Product[]): Promise<void> => {
    await fs.writeFile(inventoryFile, JSON.stringify(items, null, 2));
}