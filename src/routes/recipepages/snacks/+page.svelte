<script lang="ts">
    import { onMount } from 'svelte';
    import type { Recipe } from '$lib/types';
    import { fetchSnacksRecipes } from '$lib/fetchandfilterfunctions';
    import { goto } from '$app/navigation'; // For navigation to the recipe details
  
    let recipes: Recipe[] = [];
    let error: string | null = null;
  
    onMount(async () => {
        try {
            console.log("Fetching snacks recipes...");
            recipes = await fetchSnacksRecipes();
            console.log("Fetched snacks recipes:", recipes);
        } catch (err) {
            console.error("Error fetching snacks recipes:", err);
            error = 'Error fetching snacks recipes';
        }
    });
  
    function viewRecipe(recipeId: number) {
      goto(`/recipes/${recipeId}`);
  }
  
  </script>
  
  <!-- Center the search box -->
  <div class="search-container">
    <!-- Optionally, you can include a search box if needed -->
  </div>
  
  {#if error}
    <p class="error">Error loading recipes: {error}</p>
  {:else if recipes.length === 0}
    <p>No snack recipes found.</p>
  {:else}
    <div class="table-container">
        <table class="table table-compact table-hover">
            <thead>
                <tr>
                    <th class="table-sort-asc">Recipe</th>
                    <th>Description</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
              {#each recipes as recipe, i}
              <tr class={i % 2 === 0 ? '' : 'table-row-checked'}>
                  <td>{recipe.r_recipes_title || 'No title'}</td>
                  <td>{recipe.r_recipes_description || 'No description'}</td>
                  <td>
                      <button on:click={() => viewRecipe(recipe.id)} class="btn btn-primary">View Recipe</button>
                  </td>
              </tr>
          {/each}
          
            </tbody>
        </table>
    </div>
  {/if}
  
  <style>
    .search-container {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    }
  
    .search-box {
        width: 300px;
        padding: 8px;
        font-size: 16px;
        border-radius: 4px;
        border: 1px solid #ccc;
        margin: 20px;
    }
  
    .table-container {
        display: flex;
        justify-content: center;
        width: 100%;
    }
  
    table {
        margin: 0 auto;
        width: 60%;
        border-collapse: collapse;
    }
  
    th, td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }
  
    th {
        background-color: black;
        cursor: pointer;
    }
  
    .table-row-checked {
        background-color: #f0f8ff;
    }
  
    .btn {
        background-color: white;
        color: black;
        border: none;
        padding: 8px 12px;
        cursor: pointer;
        border-radius: 4px;
    }
  
    .btn:hover {
        background-color: grey;
    }
  
    .error {
        color: red;
        text-align: center;
    }
  </style>
  