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

    static async deleteCar(id) {
        try {
            const token = AuthService.getToken();
            if (!token) {
                throw new Error('AUTH_REQUIRED');
            }

            const response = await fetch(`/api/cars/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.status === 401) {
                throw new Error('AUTH_REQUIRED');
            }
            if (!response.ok) throw new Error('Failed to delete car');
            return await response.json();
        } catch (error) {
            console.error('Error deleting car:', error);
            throw error;
        }
    }
}

// Display cars on homepage
async function loadHomepageCars() {
    const container = document.getElementById('carsGrid');
    if (!container) {
        console.log('❌ carsGrid container not found');
        return;
    }

    try {
        console.log('🏠 Loading homepage cars...');
        container.innerHTML = '<div class="loading">🔄 Loading available cars...</div>';
        
        const cars = await CarService.getAvailableCars();
        console.log('🏠 Cars loaded for homepage:', cars);
        
        if (cars.length === 0) {
            container.innerHTML = `
                <div class="no-cars-message" style="text-align: center; padding: 3rem; background: var(--card-bg); border-radius: 12px; border: 2px dashed rgba(255,255,255,0.1);">
                    <h3 style="color: var(--text-secondary); margin-bottom: 1rem;">🚗 No Cars Available</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">There are no cars available for rental at the moment.</p>
                    ${window.AuthService && window.AuthService.isAuthenticated() ? 
                        '<a href="add-car.html" class="btn btn-primary" style="margin-top: 1rem;">Add Your First Car</a>' : 
                        '<p style="color: var(--text-secondary);">Please check back later.</p>'
                    }
                </div>
            `;
            return;
        }

        let html = '';
        cars.forEach((car, index) => {
            console.log(`🎨 Rendering car ${index + 1}:`, car);
            const statusClass = car.status ? `status-${car.status.toLowerCase()}` : 'status-available';
            const statusText = car.status || 'Available';
            
            html += `
                <div class="car-card">
                    <div class="car-header">
                        <h3 class="car-model">${car.model || 'Unknown Model'}</h3>
                        <span class="car-type">${car.type || 'Unknown Type'}</span>
                    </div>
                    <div class="car-details">
                        <div class="car-detail">
                            <span class="detail-label">Year:</span>
                            <span class="detail-value">${car.year || 'N/A'}</span>
                        </div>
                        <div class="car-detail">
                            <span class="detail-label">Type:</span>
                            <span class="detail-value">${car.type || 'N/A'}</span>
                        </div>
                        <div class="car-detail">
                            <span class="detail-label">Status:</span>
                            <span class="detail-value ${statusClass}">${statusText}</span>
                        </div>
                    </div>
                    <div class="car-price">
                        $${car.dailyRate || '0'} <small>/ day</small>
                    </div>
                    <div class="car-description">
                        ${car.description || 'No description available.'}
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        console.log('✅ Homepage cars displayed successfully');
        
    } catch (error) {
        console.error('❌ Error loading homepage cars:', error);
        container.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 2rem; background: rgba(220,53,69,0.1); border-radius: 12px; border: 1px solid rgba(220,53,69,0.3);">
                <h3 style="color: var(--accent-red); margin-bottom: 1rem;">❌ API Connection Error</h3>
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">${error.message}</p>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">
                    The server is returning HTML instead of car data. Please check server routes.
                </p>
                <button onclick="loadHomepageCars()" class="btn btn-primary" style="margin-top: 1rem;">🔄 Retry</button>
            </div>
        `;
    }
}

// Load cars in cars.html table
async function loadCarsTable() {
    const tableBody = document.querySelector('#carsTable tbody');
    if (!tableBody) {
        console.log('❌ carsTable tbody not found');
        return;
    }

    try {
        console.log('📊 Loading cars table...');
        tableBody.innerHTML = '<tr><td colspan="7" class="loading" style="text-align: center; padding: 2rem;">🔄 Loading cars...</td></tr>';
        
        const cars = await CarService.getAllCars();
        console.log('📊 Cars for table:', cars);
        
        if (cars.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 3rem; background: var(--card-bg); border-radius: 8px;">
                        <div style="color: var(--text-secondary); margin-bottom: 1rem;">
                            <h3>🚗 No Cars in Database</h3>
                            <p>There are no cars in the system yet.</p>
                        </div>
                        ${window.AuthService && window.AuthService.isAuthenticated() ? 
                            '<a href="add-car.html" class="btn btn-primary">Add First Car</a>' : 
                            '<p>Please login to add cars.</p>'
                        }
                    </td>
                </tr>
            `;
            return;
        }

        let html = '';
        cars.forEach(car => {
            const statusClass = car.status ? `status-${car.status.toLowerCase()}` : 'status-available';
            const statusText = car.status || 'Available';
            
            html += `
                <tr>
                    <td><strong>${car.model || 'Unknown'}</strong></td>
                    <td>${car.type || 'N/A'}</td>
                    <td>${car.year || 'N/A'}</td>
                    <td>$${car.dailyRate || '0'}</td>
                    <td><span class="${statusClass}">${statusText}</span></td>
                    <td>${car.description || '-'}</td>
                    <td class="car-actions">
                        ${window.AuthService && window.AuthService.isAuthenticated() ? `
                            <button class="btn-edit" onclick="editCar('${car._id}')">Edit</button>
                            <button class="btn-delete" onclick="deleteCar('${car._id}')">Delete</button>
                        ` : '<span style="color: var(--text-secondary);">Login to manage</span>'}
                    </td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = html;
        console.log('✅ Cars table loaded successfully');
        
    } catch (error) {
        console.error('Error loading cars table:', error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; background: rgba(220,53,69,0.1);">
                    <div class="error-message">
                        <h4 style="color: var(--accent-red); margin-bottom: 0.5rem;">❌ Error Loading Cars</h4>
                        <p style="color: var(--text-secondary); margin-bottom: 1rem;">${error.message}</p>
                        <button onclick="loadCarsTable()" class="btn btn-primary">🔄 Retry</button>
                    </div>
                </td>
            </tr>
        `;
    }
}

// ===== Add Car Page =====
async function initAddCarForm() {
    const form = document.getElementById('addCarForm');
    if (!form) {
        return;
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const model = document.getElementById('model').value.trim();
        const type = document.getElementById('type').value;
        const year = parseInt(document.getElementById('year').value, 10);
        const dailyRate = parseFloat(document.getElementById('dailyRate').value);
        const status = document.getElementById('status').value;
        const description = document.getElementById('description').value.trim();

        const carData = { model, type, year, dailyRate, status, description };

        try {
            await CarService.addCar(carData);
            alert('Car added successfully!');
            window.location.href = 'cars.html';
        } catch (error) {
            if (error.message === 'AUTH_REQUIRED') {
                alert('Please login to add cars.');
                window.location.href = 'login.html';
            } else {
                alert('Error adding car: ' + error.message);
            }
        }
    });
}

// ===== Edit Car Page =====
function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

async function initEditCarForm() {
    const form = document.getElementById('editCarForm');
    if (!form) {
        return;
    }

    const carId = getQueryParam('id');
    if (!carId) {
        alert('No car ID provided');
        window.location.href = 'cars.html';
        return;
    }

    // Load existing car data into the form
    try {
        const response = await fetch(`/api/cars/${carId}`);
        if (!response.ok) {
            throw new Error('Failed to load car details');
        }
        const car = await response.json();

        const idInput = document.getElementById('carId');
        if (idInput) {
            idInput.value = carId;
        }
        document.getElementById('model').value = car.model || '';
        document.getElementById('type').value = car.type || '';
        document.getElementById('year').value = car.year || '';
        document.getElementById('dailyRate').value = car.dailyRate || '';
        document.getElementById('status').value = car.status || 'Available';
        document.getElementById('description').value = car.description || '';
    } catch (error) {
        alert('Error loading car: ' + error.message);
        window.location.href = 'cars.html';
        return;
    }

    // Handle form submit to update car
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const model = document.getElementById('model').value.trim();
        const type = document.getElementById('type').value;
        const year = parseInt(document.getElementById('year').value, 10);
        const dailyRate = parseFloat(document.getElementById('dailyRate').value);
        const status = document.getElementById('status').value;
        const description = document.getElementById('description').value.trim();

        const carData = { model, type, year, dailyRate, status, description };

        try {
            await CarService.updateCar(carId, carData);
            alert('Car updated successfully!');
            window.location.href = 'cars.html';
        } catch (error) {
            if (error.message === 'AUTH_REQUIRED') {
                alert('Please login to edit cars.');
                window.location.href = 'login.html';
            } else {
                alert('Error updating car: ' + error.message);
            }
        }
    });
}

// Test server connection
async function testServerConnection() {
    try {
        console.log('🔍 Testing server connection...');
        const response = await fetch('/api/health');
        const responseText = await response.text();
        
        // Check if response is HTML
        if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
            throw new Error('Server returned HTML instead of JSON');
        }
        
        const data = JSON.parse(responseText);
        console.log('✅ Server connection test:', data);
        return data;
    } catch (error) {
        console.error('❌ Server connection test failed:', error);
        return null;
    }
}

// Initialize based on current page
document.addEventListener('DOMContentLoaded', function() {
    console.log('📍 Current page:', window.location.pathname);
    console.log('🌐 Current origin:', window.location.origin);
    
    // Test server connection on load
    testServerConnection();
    
    // Update navigation if function exists
    if (typeof updateNavigation === 'function') {
        updateNavigation();
    }

    // Page-specific initializations
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('index.html') || currentPage === '/' || currentPage === '') {
        console.log('🏠 Initializing homepage...');
        loadHomepageCars();
    } else if (currentPage.includes('cars.html')) {
        console.log('📊 Initializing cars page...');
        loadCarsTable();
    } else if (currentPage.includes('add-car.html')) {
        console.log('➕ Initializing add car page...');
        initAddCarForm();
    } else if (currentPage.includes('edit-car.html')) {
        console.log('✏️ Initializing edit car page...');
        initEditCarForm();
    }
});

// Car management functions
async function deleteCar(carId) {
    if (!confirm('Are you sure you want to delete this car?')) return;
    
    try {
        await CarService.deleteCar(carId);
        alert('Car deleted successfully!');
        loadCarsTable();
    } catch (error) {
        if (error.message === 'AUTH_REQUIRED') {
            alert('Please login to manage cars.');
            window.location.href = 'login.html';
        } else {
            alert('Error deleting car: ' + error.message);
        }
    }
}

function editCar(carId) {
    window.location.href = `edit-car.html?id=${carId}`;
}
