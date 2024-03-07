// src/api/api.js
import axios from 'axios';

// Base URL for the backend
const BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://localhost:5000';

class Room8Api {
    static token = localStorage.getItem('token');  // For storing the authentication token

    //Method to set the token
    static setToken(token) {
        Room8Api.token = token;
        // Store token in local storage to maintain authentication status across sessions
        localStorage.setItem('token', token);
    }

    static async request(endpoint, data = {}, method = 'get') {
        console.debug('API Call:', endpoint, data, method);
        const headers = { Authorization: `Bearer ${Room8Api.token}` }; // Use token for authentication in API calls
        const url = `${BASE_URL}/${endpoint}`;
        const params = method === 'get' ? data : {};

        try {
            return (await axios({ url, method, data, params, headers })).data;
        } catch (err) {
            console.error('API Error:', err.response);
            throw new Error(err.response?.data?.error?.message || 'Unknown API error');
        }
    }

    // User API calls
    static async login(data) {
        // login method to handle response with JWT token
        const response = await this.request('login', data, 'post');
        if (response.access_token) { // Check if the access token exists in the response
            this.setToken(response.access_token); // Update the token in the API utility
        }
        return response; // Return the full response including the user and token
    }

    static async signup(data) {
        return this.request('signup', data, 'post');
    }

    static async getUserDetails() {
        return this.request('api/users/me');
    }  

    static async updateUser(id, data) {
        return this.request(`users/${id}/update`, data, 'patch');
    }

    static async setUserFoster(userId) {
        return this.request(`users/${userId}/set-foster`, {}, 'patch');
    }

    // Cat API calls
    static async getAdoptableCats() {
        return this.request('api/cats/adoptable');
    }

    static async getCatDetails(catId) {
        return this.request(`api/cats/${catId}`);
    }

    static async addCat(data) {
        return this.request('api/cats', data, 'post');
    }

    static async updateCat(catId, data) {
        return this.request(`api/cats/${catId}`, data, 'patch');
    }

    static async deleteCat(catId) {
        return this.request(`api/cats/${catId}`, {}, 'delete');
    }

    static async adoptCat(catId) {
        return this.request(`api/cats/${catId}/adopt`, {}, 'patch');
    }

    static async getFeaturedCats() {
        return this.request('api/cats/featured');
    }

    // Donation API calls
    static async createCharge(data) {
        return this.request('create-charge', data, 'post');
    }

    // Volunteer API calls
    static async submitVolunteerForm(data) {
        return this.request('volunteer', data, 'post');
    }

    // Export data to Google Sheets
    static async exportCats() {
        return this.request('export/cats');
    }

    static async exportFosters() {
        return this.request('export/fosters');
    }

    // User management API calls
    static async createUser(data) {
        return this.request('api/users', data, 'post');
    }

    static async updateUser(userId, data) {
        return this.request(`api/users/${userId}`, data, 'patch');
    }

    static async setUserFoster(userId) {
        return this.request(`api/users/${userId}/set-foster`, {}, 'patch');
    }
}

export default Room8Api;
