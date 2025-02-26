// src/api/starryAi.ts

import axios from 'axios';

const BASE_URL = 'https://api.starryai.com/creations/';

interface PostResponse {
  id: string;
  [key: string]: any; // In case the API returns more fields
}

interface GetImageResponse {
  status: string;
  imageUrl?: string;
  [key: string]: any;
}

/**
 * Calls the StarryAI API to create a post with a description.
 * Other fields are set to default values.
 * @param description - The required description for the art.
 * @returns A promise resolving to the post ID.
 */
export async function createArtPost(description: string): Promise<PostResponse> {
  try {
    const data = {
      description,              // Required field from user input
      style: 'abstract',        // Default style
      resolution: '1024x1024',  // Default resolution
      colorScheme: 'vibrant',   // Default color scheme
    };

    const response = await axios.post(`${BASE_URL}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': "" // Replace with env variable in production
      },
    });

    return response.data as PostResponse;
  } catch (error) {
    console.error('Error creating art post:', error);
    throw new Error('Failed to create art post');
  }
}

/**
 * Fetches the completed image URL using the post ID.
 * @param id - The ID of the created art post.
 * @returns A promise resolving to the image URL if completed.
 */
export async function getCompletedImage(id: string): Promise<string> {
  try {
    const response = await axios.get<GetImageResponse>(`${BASE_URL}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': ""
      },
    });

    const { status, imageUrl } = response.data;

    if (status === 'completed' && imageUrl) {
      return imageUrl;
    } else {
      throw new Error(`Image not completed. Current status: ${status}`);
    }
  } catch (error) {
    console.error('Error fetching completed image:', error);
    throw new Error('Failed to fetch completed image');
  }
}