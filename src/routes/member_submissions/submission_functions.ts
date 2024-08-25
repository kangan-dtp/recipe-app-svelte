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
