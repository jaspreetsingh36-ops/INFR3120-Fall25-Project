// Frontend/script.js - Enhanced version with add/edit support and better auth handling
console.log('🚗 AutoRent script loaded');

class CarService {
    static async getAllCars() {
        try {
            console.log('📡 Fetching all cars from /api/cars');
            const response = await fetch('/api/cars');
            console.log('📡 Response status:', response.status);
            console.log('📡 Response content type:', response.headers.get('content-type'));
            
            const responseText = await response.text();
            console.log('📡 Response text (first 200 chars):', responseText.substring(0, 200));
            
            // Check if response is HTML (error page)
            if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
                throw new Error('Server returned HTML instead of JSON. API route may not exist.');
            }
            
            // Try to parse as JSON
            const cars = JSON.parse(responseText);
            console.log('📡 Cars received:', cars);
            return cars;
            
        } catch (error) {
            console.error('❌ Error fetching cars:', error);
            return [];
        }
    }

    static async getAvailableCars() {
        try {
            console.log('📡 Fetching available cars from /api/cars/available');
            const response = await fetch('/api/cars/available');
            console.log('📡 Response status:', response.status);
            console.log('📡 Response content type:', response.headers.get('content-type'));
            
            const responseText = await response.text();
            console.log('📡 Response text (first 200 chars):', responseText.substring(0, 200));
            
            // Check if response is HTML (error page)
            if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
                throw new Error('Server returned HTML instead of JSON. API route may not exist.');
            }
            
            // Try to parse as JSON
            const cars = JSON.parse(responseText);
            console.log('📡 Available cars received:', cars);
            return cars;
            
        } catch (error) {
            console.error('❌ Error fetching available cars:', error);
            return [];
        }
    }

    static async addCar(carData) {
        try {
            const token = AuthService.getToken();
            if (!token) {
                throw new Error('AUTH_REQUIRED');
            }

            const response = await fetch('/api/cars', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(carData)
            });
            
            if (response.status === 401) {
                throw new Error('AUTH_REQUIRED');
            }
            if (!response.ok) throw new Error('Failed to add car');
            return await response.json();
        } catch (error) {
            console.error('Error adding car:', error);
            throw error;
        }
    }

    static async updateCar(id, carData) {
        try {
            const token = AuthService.getToken();
            if (!token) {
                throw new Error('AUTH_REQUIRED');
            }

            const response = await fetch(`/api/cars/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(carData)
            });
            
            if (response.status === 401) {
                throw new Error('AUTH_REQUIRED');
            }
            if (!response.ok) throw new Error('Failed to update car');
            return await response.json();
        } catch (error) {
            console.error('Error updating car:', error);
            throw error;
        }
    }
