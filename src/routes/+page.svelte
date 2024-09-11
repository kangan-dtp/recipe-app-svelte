<script lang="ts">
    import { createClient } from '@supabase/supabase-js';    
    import '../app.postcss';

    const supabaseURL = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const supabaseClient = createClient(supabaseURL, supabaseAnonKey);

  // Function to fetch all recipes from the Supabase database
  async function fetchRecipes() {
    try {
      const { data, error } = await supabaseClient
        .from('Recipes')  // Make sure 'Recipes' is the correct table name
        .select('*');      // Select all columns

      if (error) {
        console.error('Error fetching recipes:', error);
      } else {
        console.log('Fetched recipes:', data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  }

  // Call the function on component load
  fetchRecipes();
</script>

<div>
  <h1>Recipe Page</h1>
  <p>Check the console for the fetched recipes.</p>
</div>
