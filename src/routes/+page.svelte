<script>
    import { goto } from '$app/navigation'; // Import the goto function
    import '../app.postcss';
    // Function to handle button click and navigate to the recipes page
    function navigateToRecipes() {
        goto('/recipes');
    }
</script>

<!-- Simple button that navigates to the recipes page on click -->
<button on:click={navigateToRecipes}>
    Go to Recipes
</button>

<style>
    /* Style the button */
    button {
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    button:hover {
        background-color: #45a049;
    }
</style>
