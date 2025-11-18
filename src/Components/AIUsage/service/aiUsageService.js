const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Fetch AI call count details for a user
export const fetchAiUsage = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/ai-usage`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            console.log( error);
            throw new Error('Failed to fetch AI usage');
        }
        
        const data = await response.json();
        return data.usageCount;
    } catch (err) {
        console.error('fetchAiUsage error:', err);
        throw err;
    }
}