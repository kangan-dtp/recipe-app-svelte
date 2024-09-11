<script lang="ts">	
  import { createClient } from '@supabase/supabase-js';  ;
  import { onMount } from 'svelte';
  import { fetchAndFilterRecipes } from '$lib/fetchandfilterfunctions';
  import { goto } from '$app/navigation';
  import { isLoggedIn } from '$lib/authStore';

  const supabaseURL = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const supabaseClient = createClient(supabaseURL, supabaseAnonKey);

  const sections = [
    { name: 'Breakfast', image: '/images/breakfast.jpg', link: '/recipepages/breakfast' },
    { name: 'Lunch', image: '/images/lunch.jpg', link: '/recipepages/lunch' },
    { name: 'Dinner', image: '/images/dinner.jpg', link: '/recipepages/dinner' },
    { name: 'Snacks', image: '/images/snacks.jpg', link: '/recipepages/snacks' },
  ];

  // Search functionality
  let searchKeyword = '';
  let recipes: { id: number, title: string }[] = [];
 

  async function searchRecipes() {
    recipes = await fetchAndFilterRecipes(searchKeyword);
  }

     // Function to handle navigation to contributions page
     function navigateToContributions() {
        if ($isLoggedIn) {  // Check if the user is logged in using the reactive store
            goto('/contributions/member_submissions');
        } else {
            alert('You must be logged in to add a new recipe');
        }
    }
</script>

<div class="imagecontainer">
  <section class="grid grid-cols-2 md:grid-cols-4 gap-4">
    {#each sections as section}
      <a 
        href={section.link} 
        class="relative flex items-center justify-center overflow-hidden rounded-lg transition-transform transform hover:scale-105 group"
      >
        <img 
          class="w-full h-80 object-cover rounded-lg" 
          src={section.image} 
          alt={section.name}
        />
        <div class="title-overlay group-hover:opacity-100">
          <h2 class="text-white text-2xl font-bold">{section.name}</h2>
        </div>
      </a>
    {/each}
  </section>
</div>

<!-- Buttons -->
<div class="mt-8 flex justify-center space-x-4">
<button on:click={navigateToContributions} class="btn variant-filled bg-green-500 text-white px-4 py-2 rounded-md">
  Add Your Own Recipe
</button>

  <a href="/recipes" class="btn variant-filled bg-green-500 text-white px-4 py-2 rounded-md">View All Recipes</a>
</div>

<!-- Search Bar -->
<div class="searchbarcontainer mt-8">
  <input 
    type="text" 
    bind:value={searchKeyword} 
    class="input p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
    placeholder="Search all recipes" 
  />
  <button 
    on:click={searchRecipes} 
    class="btn variant-filled bg-green-500 text-white px-4 py-2 rounded-md"
  >
    Search
  </button>
</div>

<!-- Recipe Search Results -->
{#if recipes.length > 0}
  <div class="mt-4">
    <h2 class="text-xl font-semibold text-white">Search Results:</h2>
    <ul class="list-disc pl-5 mt-2">
      {#each recipes as recipe}
        <li><a href={`/recipes/${recipe.id}`} class="text-white hover:underline">{recipe.title}</a></li>
      {/each}
    </ul>
  </div>
{/if}

<style>
  .btn {
    display: inline-block;
    text-align: center;
    border-radius: 9999px; /* Fully rounded button */
    padding: 0.75rem 1.5rem; /* Adjust padding as needed */
  }

  .searchbarcontainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 16px;
    box-sizing: border-box;
  }

  .searchbarcontainer .input {
    width: 100%;
    max-width: 300px;
  }

  .searchbarcontainer .btn {
    margin-top: 8px;
  }

  .imagecontainer {
    margin-top: 100px;
    display: flex;
    justify-content: center;
  }

  .title-overlay {
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    text-align: center;
    opacity: 0;
    transition: opacity 0.3s;
    width: 100%; /* Make sure it covers the full width of the image */
  }

  .title-overlay h2 {
    margin: 0;
    font-size: 1.25rem; /* Smaller text size */
    color: white;
  }

  .group:hover .title-overlay {
    opacity: 1;
  }
</style>