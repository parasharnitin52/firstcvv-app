const http = require('http');

const API_PORT = 5000;

function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body || '{}') }));
        });
        req.on('error', reject);
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function testCVCreation() {
    console.log('🚀 Testing CV Creation API...');

    try {
        // 1. Register/Login to get token
        const userCredentials = {
            name: 'Debug User',
            email: `debug_${Date.now()}@test.com`,
            password: 'password123'
        };

        console.log('👤 Registering user...');
        const registerRes = await request({
            hostname: 'localhost',
            port: API_PORT,
            path: '/api/auth/register',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, userCredentials);

        if (registerRes.status !== 200 && registerRes.status !== 201) {
            console.error('❌ Registration failed:', registerRes.body);
            return;
        }

        const token = registerRes.body.token;
        console.log('✅ User registered. Token obtained.');

        // 2. Create CV
        const cvData = {
            title: 'My Valid CV',
            personalInfo: {
                fullName: 'Debug User',
                email: 'debug@test.com', // Valid email
                phone: '1234567890',
                location: 'Test City'
            },
            experience: [],
            education: [],
            skills: { technical: [], soft: [] }
        };

        console.log('📝 Creating CV...');
        const cvRes = await request({
            hostname: 'localhost',
            port: API_PORT,
            path: '/api/cvs',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }, cvData);

        if (cvRes.status === 201) {
            console.log('✅ CV Created Successfully!');
            console.log('CV ID:', cvRes.body.cv.id);
        } else {
            console.error('❌ CV Creation Failed:', cvRes.status, cvRes.body);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testCVCreation();
