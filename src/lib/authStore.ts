// src/lib/auth.ts
import { writable } from 'svelte/store';

// This will track if the user is logged in or not
export const isLoggedIn = writable<boolean>(false);

// You can export other user-related data as well if needed
export const userSession = writable<any>(null);

