import { createClient } from '@supabase/supabase-js';

const supabaseClient = createClient('your-supabase-url', 'your-supabase-key');

export function addRecipeIngredients(recipeIngredients: { name: string; quantity: string; unit: string }[]): { name: string; quantity: string; unit: string }[] {
    return [...recipeIngredients, { name: '', quantity: '', unit: '' }];
}

export function handleAddRecipeIngredients(recipeIngredients: { name: string; quantity: string; unit: string }[]): { updatedIngredients: { name: string; quantity: string; unit: string }[], alertMessage: string } {
    
    const incompleteIngredient = recipeIngredients.find(ingredient => !ingredient.name || !ingredient.quantity || !ingredient.unit);
   
    if (incompleteIngredient) {
        return {
            updatedIngredients: recipeIngredients,
            alertMessage: 'Please fill in all fields before adding a new ingredient.'
        };
    }
   
    const updatedIngredients = addRecipeIngredients(recipeIngredients);

    return {
        updatedIngredients,
        alertMessage: ''
    };
}
export async function addRecipeIngredientsToDatabase(recipeId: number, recipeIngredients: { name: string; quantity: string; unit: string }[]) {
    const ingredientEntries = recipeIngredients.map(ingredient => ({
        recipe_id: recipeId, 
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit
    }));

    const { error } = await supabaseClient
        .from('Recipe Ingredients')
        .insert(ingredientEntries);

    if (error) {
        console.error('Error inserting recipe ingredients:', error);
    } else {
        console.log('Recipe ingredients added successfully');
        // Optionally clear ingredients or show a success message
        recipeIngredients = [];
    }
}
export function addRecipeIngredientsRow(): { name: string; quantity: string; unit: string } {
    return { name: '', quantity: '', unit: '' };
}