import axios from 'axios';

async function testLogin() {
    try {
        const res = await axios.post('http://localhost:8080/api/auth/login', {
            email: 'harikirankaite@gmail.com',
            password: 'password'
        });
        console.log("LOGIN SUCCESS", res.data);
    } catch (err) {
        console.log("LOGIN ERROR", err.response?.status, err.response?.data);
    }
}

testLogin();
