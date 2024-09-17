<script lang="ts">
    import '../app.postcss';
    import { onMount } from 'svelte';
    import supabase from '$lib/supabase';
    import { isLoggedIn } from '$lib/authStore';
    import { handleLogin, signInWithGithub, handleLogout } from '$lib/loginfunctions';
    import { goto } from '$app/navigation';

    let email: string = '';
    let password: string = '';
    let errorMessage: string = '';

    // Check auth status on page load
    onMount(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        isLoggedIn.set(!!session);
    });

    async function login(event: Event) {
        event.preventDefault();
        await handleLogin(email, password);
    }
</script>

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
        {#if !$isLoggedIn}
            <form on:submit|preventDefault={login} class="flex items-center">
                <input type="email" bind:value={email} placeholder="Email" required class="input-field mx-2" />
                <input type="password" bind:value={password} placeholder="Password" required class="input-field mx-2" />
                <button type="submit" class="btn variant-soft-primary">Login</button>
                <button type="button" class="btn variant-soft-primary" on:click={signInWithGithub}>
                    Login with GitHub
                </button>
            </form>
        {/if}
        {#if $isLoggedIn}
            <button type="button" class="btn variant-soft-primary" on:click={handleLogout}>Logout</button>
        {/if}
    </div>
</div>

{#if errorMessage}
    <p id="error-message" class="error-message text-white text-center">
        {errorMessage}
    </p>
{/if}

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
