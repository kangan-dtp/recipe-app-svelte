<script lang="ts">
    import { createClient } from '@supabase/supabase-js';
    import '../../app.postcss';
    import { onMount } from 'svelte';    
    import { goto } from '$app/navigation'; 
	
	
    const supabaseURL = 'https://ckzdwxkzhuehnecisehw.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNremR3eGt6aHVlaG5lY2lzZWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIzODg5MTYsImV4cCI6MjAzNzk2NDkxNn0.lfNhTrJUP9p8W_-dg7t-pxwKPyGVFGssNwuZ7yL6pqs';
    const supabaseClient = createClient(supabaseURL, supabaseKey);

    let Recipes: any[] = [];
    let Categories: any[] = [];
    let recipeIngredients: { name: string; quantity: string; unit: string }[] = [];
    let categoryMap: Record<number, string> = {}; 
    let r_recipes_title: string = '';
    let r_recipes_description: string = '';
    let r_recipes_instructions: string = '';
    let r_recipes_preparation_time: number = 0;
    let r_recipes_cooking_time: number = 0;
    let r_recipes_servings: number = 0;
    let selectedCategory: number | null = null;
    

    onMount(async () => {
        const { data: recipesData, error: recipesError } = await supabaseClient
            .from('Recipes')
            .select('r_recipes_title, r_recipes_description, r_recipes_instructions, r_recipes_preparation_time, r_recipes_cooking_time, r_recipes_servings, c_category_id');

        if (recipesError) {
            console.error('Error fetching recipes:', recipesError);
        } else {
            Recipes = recipesData;
            console.log('Recipes:', Recipes);  //bug fix...if database drops out
        }

        const { data: categoriesData, error: categoriesError } = await supabaseClient
            .from('Category')
            .select('*');

        if (categoriesError) {
            console.error('Error fetching categories:', categoriesError);
        } else {
            Categories = categoriesData;
            categoryMap = Categories.reduce((map, category) => {
                map[category.c_category_id] = category.c_category_name;
                return map;
            }, {});
            console.log('Categories:', Categories);  //bug fix...if database drops out
        }

        const { data: recipeIngredientsData, error: recipeIngredientsError } = await supabaseClient
            .from('Recipe Ingredients')
            .select('*');

        if (recipeIngredientsError) {
            console.error('Error fetching recipe ingredients:', recipeIngredientsError);
        } else {
            recipeIngredients = recipeIngredientsData;
            console.log('Recipe Ingredients:', recipeIngredients);  //bug fix...if database drops out
        }
    });

    async function createRecipe() {
    const { data, error } = await supabaseClient
        .from('Recipes')
        .insert([{
            r_recipes_title,
            r_recipes_description,
            r_recipes_instructions,
            r_recipes_preparation_time,
            r_recipes_cooking_time,
            r_recipes_servings,
            c_category_id: selectedCategory
        }])
        .single();

    if (error) {
        console.error('Error inserting recipe:', error);
        return null;
    } else {
        const recipeId = (data as { id: number })?.id;
        console.log('Recipe created with ID:', recipeId);
        
        r_recipes_title = '';
        r_recipes_description = '';
        r_recipes_instructions = '';
        r_recipes_preparation_time = 0;
        r_recipes_cooking_time = 0;
        r_recipes_servings = 0;
        selectedCategory = null;
        return recipeId;
    }
}


    function selectCategory(categoryId: number) {
        selectedCategory = categoryId;
    }
    

async function navigateToRecipeIngredients() {
    await createRecipe();  
    goto('/member_submissions/recipe_ingredients');
}

function handleButtonClick() {
    createRecipe();
    navigateToRecipeIngredients();
  }
    
</script>

<h1>Recipes</h1>

<form on:submit|preventDefault={createRecipe}>
    <table>
        <tr>
            <td><label for="r_recipes_title">Recipe Title</label></td>
            <td><input type="text" id="r_recipes_title" bind:value={r_recipes_title} required></td>
        </tr>
        <tr>
            <td><label for="r_recipes_description">Recipe Description</label></td>
            <td><input type="text" id="r_recipes_description" bind:value={r_recipes_description} required></td>
        </tr>
        <tr>
            <td><label for="r_recipes_instructions">Instructions</label></td>
            <td><input type="text" id="r_recipes_instructions" bind:value={r_recipes_instructions} required></td>
        </tr>
        <tr>
            <td><label for="r_recipes_preparation_time">Preparation Time (mins)</label></td>
            <td><input type="number" id="r_recipes_preparation_time" bind:value={r_recipes_preparation_time} required></td>
        </tr>
        <tr>
            <td><label for="r_recipes_cooking_time">Cooking Time (mins)</label></td>
            <td><input type="number" id="r_recipes_cooking_time" bind:value={r_recipes_cooking_time} required></td>
        </tr>
        <tr>
            <td><label for="r_recipes_servings">Servings</label></td>
            <td><input type="number" id="r_recipes_servings" bind:value={r_recipes_servings} required></td>
        </tr>
        <tr>
            <td><label for="category">Category</label></td>
            <td>
                <div>
                    {#each Categories as category}
                        <label>
                            <input
                                type="radio"
                                name="category"
                                value={category.c_category_id}
                                checked={selectedCategory === category.c_category_id}
                                on:change={() => selectCategory(category.c_category_id)}
                            />
                            {category.c_category_name}
                        </label>
                    {/each}
                </div>
            </td>
        </tr>
        <tr>
            <td colspan="2">
                <button id="cr" on:click={handleButtonClick}>
                    Create Recipe & Insert Ingredients
                </button>       
            </td>
        </tr>
        
       </table>
</form>

