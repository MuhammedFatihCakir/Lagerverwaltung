import inquirer from 'inquirer';
import { loadInventory, saveInventory } from './inventory.ts';




export const editProduct = async (): Promise<void> => {
    const inventory = await loadInventory();
    
    if (inventory.length === 0) {
        console.log('📭 Keine Produkte zum Bearbeiten.\n');
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
        ],
    })

    if( category === 'zurück') return;
    
    let productsOfCategory = inventory.filter(product => product.category === category)
    const { id } = await inquirer.prompt<{ id: number | 'zurück'}>({
        type: 'list',
        name: 'id',
        message: 'welches Produkt möchtest du bearbeiten?',
        choices: [{name: 'Zurück', value: 'zurück'},
            ...productsOfCategory.map((item) => ({
                name: item.name,
                value: item.id,
            }))
        ]
    })
    if(id === 'zurück') {
        return editProduct();
    }

    const latestInventory = await loadInventory();
    const item = latestInventory.find(product => product.id === id);
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

        const { editConfirm } = await inquirer.prompt<{ editConfirm: boolean }>({
            type: 'confirm',
            name: 'editConfirm',
            message: 'Möchtest du das Produkt wirklich bearbeiten?',
            default: false
        })

        if(editConfirm) {
            item.name = name;
            item.quantity = quantity;
            item.price = price;
            item.location = location;
            await saveInventory(inventory);
            console.log('✏️ Produkt aktualisiert.\n');
        } else {
            console.log('❌ Bearbeitungsvorgang abgebrochen!.\n');
        }
}
