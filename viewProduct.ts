import inquirer from 'inquirer';
import { loadInventory, saveInventory } from './inventory.ts';






export const viewProduct = async (): Promise<void> => {
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
        choices: [{name: 'Zurück', value: 'zurück'},
            ...allCategories.map((item) => ({
                name: item.category,
                value: item.category,
            })),
        ]
    })
    if(category === 'zurück') return;

    let productsOfCategory = inventory.filter(product => product.category === category)

    const { id } = await inquirer.prompt<{ id: number | 'zurück'}>({
        type: 'list',
        name: 'id',
        message: 'welches Produkt möchtest du anzeigen?',
        choices: [{name: 'Zurück', value: 'zurück'},
            ...productsOfCategory.map((item) => ({
                name: item.name,
                value: item.id,
            }))
        ]
    })
    if (id === 'zurück') {
        return viewProduct();
    }


    let selectedItem = productsOfCategory.find(product => product.id === id);
        if(selectedItem) {
            console.log(`
        Produktdetails:
        - Name: ${selectedItem.name}
        - Kategorie: ${selectedItem.category}
        - Menge: ${selectedItem.quantity}
        - Preis: ${selectedItem.price}€
        - Lagerort: ${selectedItem.location}`);
        }
}
