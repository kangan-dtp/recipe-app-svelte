<script lang="ts">
    import '../app.postcss';
    import { onMount } from 'svelte';
    import supabase from '$lib/supabase';
    import { goto } from '$app/navigation';
    import { isLoggedIn } from '$lib/authStore';

    let email: string = '';
    let password: string = '';
    let errorMessage: string = '';

    // Check auth status on page load
    onMount(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        isLoggedIn.set(!!session);  // Use the store to set login status
    });

    // Handle user login
    async function handleLogin() {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                errorMessage = `Login failed: ${error.message}`;
                console.error('Login error:', error);
                return;
            }

            isLoggedIn.set(true);  // Set login status using the store
            errorMessage = 'Login successful';
        } catch (error) {
            errorMessage = `Unexpected error: ${(error as Error).message || 'Unknown error'}`;
            console.error('Unexpected error:', error);
        }
    }

    // Sign in with GitHub
    async function signInWithGithub() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
        });

        if (error) {
            errorMessage = `GitHub login failed: ${error.message}`;
            console.error('GitHub login error:', error);
            return;
        }

        isLoggedIn.set(true);  // Set login status using the store
        errorMessage = 'GitHub login successful';
    }

    // Handle user logout
    async function handleLogout() {
        try {
            await supabase.auth.signOut();
            isLoggedIn.set(false);  // Use the store to set login status to false
            errorMessage = 'Logged out successfully.';
            localStorage.removeItem('supabase.auth.token');
        } catch (error) {
            errorMessage = `Error logging out: ${(error as Error).message || 'Unknown error'}`;
            console.error('Logout error:', error);
        }
    }

    // Navigate to recipe contributions page or show alert
    function navigateToContributions() {
        if ($isLoggedIn) {  // Use reactive store value
            goto('/contributions'); // Update the path as needed
        } else {
            alert('You must be logged in to add a new recipe');
        }
    }
</script>

<!-- App Bar -->
<div class="app-bar bg-gray-800 text-white p-4 flex items-center">
    <div class="logo flex items-center">
        <img src="/images/logo.png" alt="Logo" class="logo-img" />
    </div>
    <div class="nav-links flex-1 text-center">
        <a href="/" class="nav-link">Home</a>
        <a href="/recipes" class="nav-link">All Recipes</a>
        <a href="/about" class="nav-link">About Us</a>
    </div>
    <div class="auth-buttons flex items-center ml-auto">
        {#if !$isLoggedIn}  <!-- Use the reactive store variable -->
            <form on:submit|preventDefault={handleLogin} class="flex items-center">
                <input
                    type="email"
                    bind:value={email}
                    placeholder="Email"
                    required
                    class="input-field mx-2"
                />
                <input
                    type="password"
                    bind:value={password}
                    placeholder="Password"
                    required
                    class="input-field mx-2"
                />
                <button type="submit" class="btn variant-soft-primary">Login</button>
                <button type="button" class="btn variant-soft-primary" on:click={signInWithGithub}>
                    Login with GitHub
                </button>
            </form>
        {/if}
        {#if $isLoggedIn}  <!-- Use the reactive store variable -->
            <button type="button" class="btn variant-soft-primary" on:click={handleLogout}>
                Logout
            </button>
        {/if}
    </div>
</div>

<!-- Error Message -->
{#if errorMessage}
    <p id="error-message" class="error-message text-white text-center">
        {errorMessage}
    </p>
{/if}

<!-- Content Slot -->
<slot />

<style>
    .app-bar {
        position: sticky;
        top: 0;
        width: 100%;
        z-index: 1000;
        display: flex;
        align-items: center;
        padding: 0 16px; /* Adjust padding if needed */
    }

    .logo-img {
        height: 130px; /* Set the height of the logo */
        width: auto; /* Maintain aspect ratio */
    }

    .nav-links {
        flex: 1; /* Allows this container to take up available space */
        display: flex; /* Align links horizontally */
    
    }

    .nav-link {
        margin: 0 15px; /* Adjust spacing between links */
        color: white; /* Link text color */
        text-decoration: none; /* Remove underline */
        font-size: 1rem; /* Adjust font size */
    }

    .nav-link:hover {
        text-decoration: underline; /* Add underline on hover */
    }

    .input-field {
        background-color: #333;
        color: white;
        border: 1px solid #555;
        padding: 8px;
        border-radius: 4px;
    }

    .btn {
        padding: 8px 16px;
        margin: 5px;
    }
</style>
