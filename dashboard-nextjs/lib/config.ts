// API Configuration
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
// Remove trailing slash if present to avoid double slashes
export const API_BASE_URL = rawApiUrl.replace(/\/$/, '');
export const API_V1_URL = `${API_BASE_URL}/api/v1`;
