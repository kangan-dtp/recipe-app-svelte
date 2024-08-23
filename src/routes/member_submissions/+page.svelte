<script lang="ts">
    import { createClient } from '@supabase/supabase-js';
    import '../../app.postcss';
    import { onMount } from 'svelte';

    const supabaseURL = 'https://ckzdwxkzhuehnecisehw.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNremR3eGt6aHVlaG5lY2lzZWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIzODg5MTYsImV4cCI6MjAzNzk2NDkxNn0.lfNhTrJUP9p8W_-dg7t-pxwKPyGVFGssNwuZ7yL6pqs';
    const supabaseClient = createClient(supabaseURL, supabaseKey);

    let Recipes: any[] = [];
    let Categories: any[] = [];
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
            console.log('Categories:', Categories);
        }
    });

    async function insertRecipe() {
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
            }]);

        if (error) {
            console.error('Error inserting recipe:', error);
        } else {
            Recipes = [...Recipes, ...data];
            r_recipes_title = '';
            r_recipes_description = '';
            r_recipes_instructions = '';
            r_recipes_preparation_time = 0;
            r_recipes_cooking_time = 0;
            r_recipes_servings = 0;
            selectedCategory = null;
        }
    }

    function selectCategory(categoryId: number) {
        selectedCategory = categoryId;
    }
</script>

<h1>Recipes</h1>

<form on:submit|preventDefault={insertRecipe}>
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
            <td><label>Category</label></td>
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
                <button type="submit" style="background-color: white; color: black; border: 2px solid black; padding: 10px 20px; cursor: pointer;">
                    Insert Recipe
                </button>
            </td>
        </tr>
    </table>
</form>

{#if Recipes.length > 0}
    <h2>Recipes List</h2>
    <ul>
        {#each Recipes as recipe}
            <li>
                <strong>{recipe.r_recipes_title}</strong> - {recipe.r_recipes_description} <br>
                Instructions: {recipe.r_recipes_instructions} <br>
                Prep Time: {recipe.r_recipes_preparation_time} mins <br>
                Cook Time: {recipe.r_recipes_cooking_time} mins <br>
                Servings: {recipe.r_recipes_servings} <br>
                Category: {categoryMap[recipe.c_category_id]} <!-- Display the category name -->
            </li>
        {/each}
    </ul>
{:else}
    <p>No Recipes</p>
{/if}
