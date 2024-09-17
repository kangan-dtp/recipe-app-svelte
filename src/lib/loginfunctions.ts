import supabase from '$lib/supabase';
import { isLoggedIn } from '$lib/authStore';
import { goto } from '$app/navigation';

let email: string = '';
let password: string = '';
let errorMessage: string = '';

// Handle user login
export async function handleLogin(email: string, password: string) {
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
export async function signInWithGithub() {
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
export async function handleLogout() {
    try {
        // Sign out from Supabase
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            throw error;
        }

        // Clear local state and storage
        isLoggedIn.set(false);
        errorMessage = 'Logged out successfully.';
        
        // Ensure no tokens or user info is retained
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.removeItem('supabase.auth.token');
        // Clear GitHub related tokens (if stored)
        localStorage.removeItem('github.auth.token');
        sessionStorage.removeItem('github.auth.token');

        // Refresh the page to clear any client-side state
        window.location.reload();

        // Redirect to home page
        goto('/');
    } catch (error) {
        errorMessage = `Error logging out: ${(error as Error).message || 'Unknown error'}`;
        console.error('Logout error:', error);
    }
}


// Navigate to recipe contributions page or show alert
export function navigateToContributions() {
    if (isLoggedIn) {  // Use reactive store value
        goto('/contributions'); // Update the path as needed
    } else {
        alert('You must be logged in to add a new recipe');
    }
}