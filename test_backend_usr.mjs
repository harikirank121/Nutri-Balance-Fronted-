import axios from 'axios';

async function testLoginUsername() {
    try {
        const res = await axios.post('http://localhost:8080/api/auth/login', {
            username: 'test12345@gmail.com',
            password: 'password123'
        });
        console.log("LOGIN SUCCESS", res.data);
    } catch (err) {
        console.log("LOGIN ERROR", err.response?.status, err.response?.data);
    }
}

testLoginUsername();
