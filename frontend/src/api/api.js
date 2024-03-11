// src/api/api.js
import axios from 'axios';

// Base URL for the backend
const BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://localhost:5000';

class Room8Api {
    static token = localStorage.getItem('token');  // For storing the authentication token

    //Method to set the token
    static setToken(token) {
        this.token = token; // Updated to use 'this' to ensure we're setting the token on the correct instance.
        localStorage.setItem('token', token); // Store token in local storage to maintain authentication status across sessions
    }

    static async request(endpoint, data = {}, method = 'get') {
        console.debug('API Call:', endpoint, data, method);
        // Ensure headers are correctly set for all API calls
        const headers = {
            'Content-Type': 'application/json', // Ensures that the server treats the sent data as JSON.
            Authorization: `Bearer ${this.token}` // Updated to use 'this' to correctly reference the token stored in this class.
        };
        const url = `${BASE_URL}/${endpoint}`;
        const params = method === 'get' ? data : {};

        try {
            return (await axios({ url, method, data, params, headers })).data;
        } catch (err) {
            console.error('API Error:', err.response);
            let message = err.response?.data?.error?.message || 'Unknown API error';
            throw new Error(message, { cause: err });
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

    static async getUserDetailsById(userId) {
        return this.request(`api/users/${userId}`, {}, 'get');
    }
    
    static async changeUserPassword(userId, oldPassword, newPassword) {
        return this.request(`api/users/${userId}/password`, { old_password: oldPassword, new_password: newPassword }, 'patch');
    }
       
    static async createUser(data) {
        return this.request('api/users/create', data, 'post');
    }

    static async updateUser(userId, data) {
        return this.request(`/api/users/${userId}/update`, data, 'patch');
    }

    static async setUserFoster(userId) {
        return this.request(`api/users/${userId}/set-foster`, {}, 'patch');
    }

    static async getFosters(userId) {
        return this.request('api/fosters', {}, 'get');
    }

    static async getAdmins(userId) {
        return this.request('api/admins', {}, 'get')
    }

    static async deleteUser(userId) {
        return this.request(`api/users/${userId}`, {}, 'delete');
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

    static async toggleCatFeatured(catId) {
        return this.request(`api/cats/${catId}/feature`, {}, 'patch');
    }

    static async getFosterCats(fosterId) {
        return this.request(`api/fosters/${fosterId}/cats`);
    }

    static async reassignCat(catId, newFosterId) {
        return this.request(`api/cats/${catId}/reassign`, { new_foster_id: newFosterId }, 'post');
    }
    
    // Donation API calls
    static async createCharge(data) {
        return this.request('create-charge', data, 'post');
    }

    // Volunteer API calls
    static async submitVolunteerForm(data) {
        return this.request('api/volunteer', data, 'post');
    }

    // Export data to Google Sheets
    static async exportCats() {
        return this.request('export/cats');
    }

    static async exportFosters() {
        return this.request('export/fosters');
    }

 

}

export default Room8Api;
