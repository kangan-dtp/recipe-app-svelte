   <script lang='ts'>
   
        import { onMount } from 'svelte';
        import { createClient } from '@supabase/supabase-js';

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
    
    function handleRecipeSubmission() {
        console.log(recipeIngredients);
    }
    
</script>

<form on:submit|preventDefault={createRecipe}>
    <table>
        <tr>
            <td><label for="r_recipes_title">Recipe Title</label></td>
            <td>{r_recipes_title}</td>
        </tr>
        <tr>
            <td><label for="r_recipes_description">Recipe Description</label></td>
            <td>{r_recipes_description}</td>
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
</table>
</form>
<form id="recipe_ingredients_form">
    <table id="recipe_ingredients_table">
        <p>Click The Add More Recipe Ingredients To Insert A New Row</p>
        
        
        <p>Click On The "Recipe Submission" Button When You Have Included All Of Your Recipes Ingredients</p>
        <tr>
            <td colspan="2">
                <button
                    type="button"
                    style="background-color: white; color: black; border: 2px solid black; padding: 10px 20px; cursor: pointer;"
                    on:click={handleRecipeSubmission}
                >Recipe Submission</button>
            </td>
        </tr>    
        <tr>
            <th>Ingredient Name</th>
            <th>Quantity</th>
            <th>Unit</th>
        </tr>
        {#each recipeIngredients as ingredient, index}
            <tr>
                <td><input type="text" bind:value={ingredient.name} placeholder="Ingredient Name"></td>
                <td><input type="number" bind:value={ingredient.quantity} placeholder="Quantity"></td>
                <td><input type="text" bind:value={ingredient.unit} placeholder="Unit"></td>
            </tr>
        {/each}
    </table>
</form> <p>Click The Add More Recipe Ingredients To Insert A New Row</p>
        
        
       