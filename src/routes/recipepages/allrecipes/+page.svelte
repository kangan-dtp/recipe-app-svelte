<script lang="ts">
    import { onMount } from 'svelte';
    import type { Recipe, CarouselRecipe } from '$lib/types'; // Import the CarouselRecipe type
    import { fetchAllRecipes, fetchAndFilterRecipes } from '$lib/fetchandfilterfunctions';
    import { goto } from '$app/navigation'; // For navigation to the recipe details

    let recipes: CarouselRecipe[] = [];
    let searchQuery: string = '';
    let error: string | null = null;

    onMount(async () => {
        try {
            console.log("Fetching all recipes...");
            recipes = await fetchAllRecipes();
            console.log("Fetched all recipes:", recipes);
        } catch (err) {
            console.error("Error fetching recipes:", err);
            error = 'Error fetching recipes';
        }
    });

    async function handleSearch() {
        try {
            console.log("Searching for recipes with keyword:", searchQuery);
            recipes = await fetchAndFilterRecipes(searchQuery);
            console.log("Search results:", recipes);
        } catch (err) {
            console.error("Error searching recipes:", err);
            error = 'Error searching recipes';
        }
    }

    function viewRecipe(recipeId: string) {
        goto(`/recipes/${recipeId}`);
    }
</script>

<!-- Center the search box -->
<div class="search-container">
    <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search recipes"
        class="search-box"
        on:input={handleSearch}
    />
</div>

{#if error}
    <p class="error">Error loading recipes: {error}</p>
{:else if recipes.length === 0}
    <p>Loading recipes...</p>
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
                        <td>{recipe.title}</td>
                        <td>{recipe.description}</td>
                        <td>
                            <button class="btn btn-primary">View Recipe</button>
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
