import axios from 'axios';

async function testRegister() {
    try {
        const res = await axios.post('http://localhost:8080/api/auth/register', {
            organizationName: "Test",
            fullName: "Test User",
            email: "test12345@gmail.com",
            password: "password123",
            role: "PARENT"
        });
        console.log("REGISTER SUCCESS", res.data);
    } catch (err) {
        console.log("REGISTER ERROR", err.response?.status, err.response?.data);
    }
}

testRegister();
