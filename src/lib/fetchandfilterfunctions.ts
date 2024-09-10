import supabase from './supabase';
import type { CarouselRecipe } from './types';
import type { Recipe } from './types';

// Function to fetch all recipes (no filtering)
export async function fetchAllRecipes(): Promise<CarouselRecipe[]> {
    try {
        const { data, error } = await supabase
            .from('Recipes')
            .select('r_recipes_id, r_recipes_image, r_recipes_title, r_recipes_description');

        if (error) {
            throw new Error(`Supabase error: ${error.message}`);
        }

        return data.map((item) => ({
            id: item.r_recipes_id,
            image: item.r_recipes_image,
            title: item.r_recipes_title,
            description: item.r_recipes_description
        }));
    } catch (error) {
        console.error('Error fetching all recipes:', error);
        return [];
    }
}

// Function to filter recipes based on a search keyword
export async function fetchAndFilterRecipes(keyword: string): Promise<CarouselRecipe[]> {
    try {
        const { data, error } = await supabase
            .from('Recipes')
            .select('r_recipes_id, r_recipes_image, r_recipes_title, r_recipes_description')
            .ilike('r_recipes_title', `%${keyword}%`);

        if (error) {
            throw new Error(`Supabase error: ${error.message}`);
        }

        return data.map((item) => ({
            id: item.r_recipes_id,
            image: item.r_recipes_image,
            title: item.r_recipes_title,
            description: item.r_recipes_description
        }));
    } catch (error) {
        console.error('Error fetching filtered recipes:', error);
        return [];
    }
}

export async function fetchBreakfastRecipes(): Promise<any[]> {
    const { data, error } = await supabase
        .from('Recipes')
        .select('*')
        .eq('c_category_id', 1); // Filter by breakfast category

    if (error) {
        throw new Error(error.message);
    }

    return data.map((item: any) => ({
        r_recipes_id: item.r_recipes_id,
        r_recipes_image: item.r_recipes_image,
        r_recipes_title: item.r_recipes_title,
        r_recipes_description: item.r_recipes_description,
    }));
}

export async function fetchLunchRecipes(): Promise<any[]> {
    const { data, error } = await supabase
        .from('Recipes')
        .select('*')
        .eq('c_category_id', 3); // Filter by lunch category

    if (error) {
        throw new Error(error.message);
    }

    return data.map((item: any) => ({
        r_recipes_id: item.r_recipes_id,
        r_recipes_image: item.r_recipes_image,
        r_recipes_title: item.r_recipes_title,
        r_recipes_description: item.r_recipes_description,
    }));
}

export async function fetchDinnerRecipes(): Promise<any[]> {
    const { data, error } = await supabase
        .from('Recipes')
        .select('*')
        .eq('c_category_id', 2); // Filter by dinner category

    console.log('Fetched data:', data);
    if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
    }

    return data.map((item: any) => ({
        r_recipes_id: item.r_recipes_id,
        r_recipes_image: item.r_recipes_image,
        r_recipes_title: item.r_recipes_title,
        r_recipes_description: item.r_recipes_description,
    }));
}

export async function fetchSnacksRecipes(): Promise<any[]> {
    const { data, error } = await supabase
        .from('Recipes')
        .select('*')
        .eq('c_category_id', 4); // Filter by lunch category

    if (error) {
        throw new Error(error.message);
    }

    return data.map((item: any) => ({
        r_recipes_id: item.r_recipes_id,
        r_recipes_image: item.r_recipes_image,
        r_recipes_title: item.r_recipes_title,
        r_recipes_description: item.r_recipes_description,
    }));
}