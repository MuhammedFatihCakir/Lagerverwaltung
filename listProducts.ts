import { loadInventory, saveInventory } from './inventory.ts';




export const listProducts = async (): Promise<void> => {
    const inventory = await loadInventory();
    if(inventory.length === 0) {
        console.log('📭 Keine Produkte im Lager.\n');
        return;
    }

    inventory.forEach((product, index) => {
        console.log(
          `${index + 1}. ${product.name} - Kategorie: ${product.category}, Menge: ${product.quantity}, Preis: ${product.price}€, Lagerort: ${product.location}`
        );
      });
    };
