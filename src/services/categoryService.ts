import apiClient from './api';
import type { CategoriesResponse, Category } from '../types/category';

/**
 * Fetch all categories with their subcategories
 */
export const fetchCategories = async (): Promise<CategoriesResponse> => {
  try {
    const response = await apiClient.get<CategoriesResponse>(
      '/merchants/categories/with-subcategories/'
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw error;
  }
};

/**
 * Fetch categories for a specific transaction type (INCOME or EXPENSE)
 * For INCOME: returns only the Income category
 * For EXPENSE: returns all categories except Income
 */
export const fetchCategoriesByType = async (
  type: 'INCOME' | 'EXPENSE'
): Promise<CategoriesResponse> => {
  try {
    const response = await apiClient.get<CategoriesResponse>(
      '/merchants/categories/with-subcategories/'
    );

    // Filter categories based on transaction type
    const categories = response.data;

    if (type === 'INCOME') {
      // Return only Income category
      return categories.filter((cat: Category) =>
        cat.name.toLowerCase() === 'income'
      );
    } else {
      // Return all categories except Income
      return categories.filter((cat: Category) =>
        cat.name.toLowerCase() !== 'income'
      );
    }
  } catch (error) {
    console.error(`Failed to fetch ${type} categories:`, error);
    throw error;
  }
};
