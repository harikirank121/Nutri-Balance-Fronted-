import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

async function verifyAdminFlow() {
    try {
        console.log("--- STARTING ADMIN VERIFICATION ---");

        // 1. Register an Admin
        console.log("Step 1: Registering an Admin user...");
        const regRes = await axios.post(`${BASE_URL}/auth/register`, {
            fullName: 'System Administrator',
            organizationName: 'NutriBalance Core',
            email: 'admin@nutribalance.com',
            password: 'adminpassword',
            role: 'ADMIN'
        });
        console.log("Registration Response:", regRes.data);

        // 2. Login as Admin
        console.log("\nStep 2: Logging in as Admin...");
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'admin@nutribalance.com',
            password: 'adminpassword'
        });
        console.log("Login Success. Role:", loginRes.data.role);

        // 3. Test Get All Users
        console.log("\nStep 3: Fetching all users (Admin API)...");
        const usersRes = await axios.get(`${BASE_URL}/admin/users`);
        console.log(`Users Found: ${usersRes.data.length}`);
        const lastUser = usersRes.data[usersRes.data.length - 1];
        console.log("Last Registered User:", lastUser.fullName, `(ID: ${lastUser.id})`);

        // 4. Test Update User
        console.log("\nStep 4: Updating User...");
        const updateRes = await axios.put(`${BASE_URL}/admin/users/${lastUser.id}`, {
            ...lastUser,
            fullName: 'Admin Updated'
        });
        console.log("Update Success. New Name:", updateRes.data.fullName);

        // 5. Test Get Diet Entries
        console.log("\nStep 5: Fetching all diet entries...");
        const dietRes = await axios.get(`${BASE_URL}/admin/diet-entries`);
        console.log(`Diet Entries Found: ${dietRes.data.length}`);

        console.log("\n--- VERIFICATION COMPLETE ---");
    } catch (err) {
        console.log("\n!!! VERIFICATION FAILED !!!");
        console.error("Status:", err.response?.status);
        console.error("Data:", err.response?.data || err.message);
    }
}

verifyAdminFlow();
