import supabaseClient from './supabase';
import type { CarouselRecipe } from './types';

// Function to fetch all recipes (no filtering)
export async function fetchAllRecipes(): Promise<CarouselRecipe[]> {
    try {
        const { data, error } = await supabaseClient
            .from('Recipes')
            .select('r_recipes_id, r_recipes_image, r_recipes_title, r_recipes_description');

        if (error) {
            throw new Error(`SupabaseClient error: ${error.message}`);
        }

        return data?.map((item) => ({
            id: item.r_recipes_id,
            image: item.r_recipes_image,
            title: item.r_recipes_title,
            description: item.r_recipes_description
        })) || [];
    } catch (error) {
        console.error('Error fetching all recipes:', error);
        return [];
    }
}

// Function to filter recipes based on a search keyword
export async function fetchAndFilterRecipes(keyword: string): Promise<CarouselRecipe[]> {
    try {
        const { data, error } = await supabaseClient
            .from('Recipes')
            .select('r_recipes_id, r_recipes_image, r_recipes_title, r_recipes_description')
            .ilike('r_recipes_title', `%${keyword}%`);

        if (error) {
            throw new Error(`Supabase error: ${error.message}`);
        }

        return data?.map((item) => ({
            id: item.r_recipes_id,
            image: item.r_recipes_image,
            title: item.r_recipes_title,
            description: item.r_recipes_description
        })) || [];
    } catch (error) {
        console.error('Error fetching filtered recipes:', error);
        return [];
    }
}

// Function to fetch recipes by category
export async function fetchRecipesByCategory(categoryId: number): Promise<CarouselRecipe[]> {
    try {
        const { data, error } = await supabaseClient
            .from('Recipes')
            .select('r_recipes_id, r_recipes_image, r_recipes_title, r_recipes_description')
            .eq('c_category_id', categoryId); 

        if (error) {
            throw new Error(`Supabase error: ${error.message}`);
        }

        return data?.map((item) => ({
            id: item.r_recipes_id,
            image: item.r_recipes_image,
            title: item.r_recipes_title,
            description: item.r_recipes_description
        })) || [];
    } catch (error) {
        console.error(`Error fetching recipes for category ${categoryId}:`, error);
        return [];
    }
}

export async function fetchBreakfastRecipes(): Promise<CarouselRecipe[]> {
    return fetchRecipesByCategory(1); 
}

export async function fetchLunchRecipes(): Promise<CarouselRecipe[]> {
    return fetchRecipesByCategory(3); 
}

export async function fetchDinnerRecipes(): Promise<CarouselRecipe[]> {
    return fetchRecipesByCategory(2); 
}

export async function fetchSnacksRecipes(): Promise<CarouselRecipe[]> {
    return fetchRecipesByCategory(4); 
}
