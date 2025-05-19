import inquirer from 'inquirer';
import { addProduct } from './addProduct.ts';
import { listProducts } from './listProducts.ts';
import { viewProduct } from './viewProduct.ts';
import { editProduct } from './editProduct.ts';
import { deleteProduct } from './deleteProduct.ts';




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
};

mainMenu();