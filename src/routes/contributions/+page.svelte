<script lang="ts">
    import supabase from "$lib/supabase";
    import { onMount } from 'svelte';
  
    let categories = [];
    let recipeTitle = '';
    let recipeDescription = '';
    let recipeInstructions = '';
    let preparationTime = '';
    let cookingTime = '';
    let servings = '';
    let categoryId = '';
    let ingredients = [{ name: '', quantity: '', unit: '' }];
  
    // Fetch categories on mount
    onMount(async () => {
      const { data: categoriesData, error } = await supabase
        .from('Category')
        .select('c_category_id, c_category_name');
      if (error) {
        console.error('Error fetching categories:', error);
      } else {
        categories = categoriesData;
      }
    });
  
    async function submitRecipe() {
      try {
        // Insert into the Recipes table
        const { data: recipeData, error: recipeError } = await supabase
          .from('Recipes')
          .insert({
            r_recipes_title: recipeTitle,
            r_recipes_description: recipeDescription,
            r_recipes_instructions: recipeInstructions,
            r_recipes_preparation_time: preparationTime || 0,
            r_recipes_cooking_time: cookingTime || 0,
            r_recipes_servings: servings || 1,
            c_category_id: categoryId
          })
          .select();
  
        if (recipeError) {
          throw recipeError;
        }
  
        // Get the ID of the newly inserted recipe
        const recipeId = recipeData[0].r_recipes_id;
        console.log('Recipe submitted successfully with ID:', recipeId);
  
        // Insert ingredients into the recipe_ingredients table
        for (const ingredient of ingredients) {
          if (ingredient.name.trim() && ingredient.unit.trim() && ingredient.quantity !== '') {
            const quantity = parseFloat(ingredient.quantity); // Parse as a number
  
            if (isNaN(quantity)) {
              console.warn('Skipping invalid ingredient quantity:', ingredient);
              continue;  // Skip invalid quantities
            }
  
            // Log ingredient data before insertion
            console.log('Inserting ingredient:', {
              r_recipes_id: recipeId,
              ri_recipe_ingredients_name: ingredient.name,
              ri_recipe_ingredients_quantity: quantity,
              ri_recipe_ingredients_unit: ingredient.unit
            });
  
            const { error: ingredientError } = await supabase
              .from('recipe_ingredients')
              .insert({
                r_recipes_id: recipeId,  // Use the newly created recipe ID
                ri_recipe_ingredients_name: ingredient.name,
                ri_recipe_ingredients_quantity: quantity,
                ri_recipe_ingredients_unit: ingredient.unit
              });
  
            if (ingredientError) {
              throw ingredientError;
            }
          } else {
            console.warn('Skipping incomplete ingredient:', ingredient);
          }
        }
  
        alert('Recipe and ingredients submitted successfully!');
      } catch (error) {
        console.error('Error submitting recipe:', error.message);
        alert('Error submitting the recipe. Please try again.');
      }
    }
  
    function addIngredient() {
      // Add a new ingredient object to the array
      ingredients = [...ingredients, { name: '', quantity: '', unit: '' }];
    }
  
    function removeIngredient(index: number) {
      // Remove the ingredient at the specified index
      ingredients = ingredients.filter((_, i) => i !== index);
    }
  </script>
  
  <!-- Centered Form Container -->
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg" style="margin-top: 20px;">
    <h1 class="text-2xl font-semibold mb-4" style="color:black">Submit Your Recipe</h1>
  
    <!-- Form for adding recipes -->
    <form on:submit|preventDefault={submitRecipe} class="space-y-4">
      <div class="flex flex-col">
        <label class="block text-sm font-medium text-gray-700">
          Recipe Title
          <input bind:value={recipeTitle} class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" type="text" placeholder="Recipe Title" required />
        </label>
      </div>
  
      <div class="flex flex-col">
        <label class="block text-sm font-medium text-gray-700">
          Recipe Description
          <textarea bind:value={recipeDescription} class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" rows="4" placeholder="Recipe Description" required></textarea>
        </label>
      </div>
  
      <div class="flex flex-col">
        <label class="block text-sm font-medium text-gray-700">
          Instructions
          <textarea bind:value={recipeInstructions} class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" rows="4" placeholder="Instructions" required></textarea>
        </label>
      </div>
  
      <div class="flex flex-col">
        <label class="block text-sm font-medium text-gray-700">
          Preparation Time (minutes)
          <input bind:value={preparationTime} type="number" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" placeholder="Preparation Time (minutes)" required />
        </label>
      </div>
  
      <div class="flex flex-col">
        <label class="block text-sm font-medium text-gray-700">
          Cooking Time (minutes)
          <input bind:value={cookingTime} type="number" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" placeholder="Cooking Time (minutes)" required />
        </label>
      </div>
  
      <div class="flex flex-col">
        <label class="block text-sm font-medium text-gray-700">
          Servings
          <input bind:value={servings} type="number" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" placeholder="Servings" required />
        </label>
      </div>
  
      <div class="flex flex-col">
        <label class="block text-sm font-medium text-gray-700">
          Select a Category
          <select bind:value={categoryId} class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50">
            <option value="" disabled>Select a Category</option>
            {#each categories as category}
              <option value={category.c_category_id}>{category.c_category_name}</option>
            {/each}
          </select>
        </label>
      </div>
  
      <!-- Ingredients Section -->
      <div>
        <h3 class="text-lg font-semibold">Ingredients</h3>
        {#each ingredients as ingredient, index}
          <div class="flex flex-col space-y-2 mt-2">
            <div class="flex space-x-2">
              <input bind:value={ingredient.name} class="block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" placeholder="Ingredient Name" required />
              <input bind:value={ingredient.quantity} type="number" class="block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" placeholder="Quantity" required />
              <input bind:value={ingredient.unit} class="block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" placeholder="Unit" required />
              <button type="button" on:click={() => removeIngredient(index)} class="btn variant-filled">Remove Ingredient</button>
            </div>
          </div>
        {/each}
        <button type="button" on:click={addIngredient} class="btn variant-filled" style="margin-top: 10px;">Add Another Ingredient</button>
      </div>
  
      <button type="submit" class="btn variant-filled">Submit Recipe</button>
    </form>
  </div>
  