const http = require('http');

function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: body ? JSON.parse(body) : {} });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function test() {
    console.log('🚀 Starting Full Test...');

    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    let token = '';
    let userId = '';
    let cvId = '';

    // 1. Health
    try {
        const health = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/health',
            method: 'GET'
        });
        console.log('✅ Health:', health.status);
    } catch (e) {
        console.error('❌ Health Check Error:', e.message);
        process.exit(1);
    }

    // 2. Register
    try {
        const res = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/register',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            name: 'Test User',
            email: uniqueEmail,
            password: 'password123'
        });
        if (res.status === 201) {
            console.log('✅ Register:', res.status, 'ID:', res.data.user.id);
            token = res.data.token;
            userId = res.data.user.id;
        } else {
            console.error('❌ Register Failed:', res.status, res.data);
            process.exit(1);
        }
    } catch (e) {
        console.error('❌ Register Error:', e.message);
        process.exit(1);
    }

    // 3. Login
    try {
        const res = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            email: uniqueEmail,
            password: 'password123'
        });
        if (res.status === 200) {
            console.log('✅ Login:', res.status);
            token = res.data.token;
        } else {
            console.error('❌ Login Failed:', res.status, res.data);
        }
    } catch (e) {
        console.error('❌ Login Error:', e.message);
    }

    // 4. Create CV
    try {
        const res = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/cvs',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }, {
            title: 'My CV',
            templateId: 'modern',
            personalInfo: {
                fullName: 'Test User',
                email: uniqueEmail
            }
        });
        if (res.status === 201) {
            console.log('✅ Create CV:', res.status, 'ID:', res.data.cv.id);
            cvId = res.data.cv.id;
        } else {
            console.error('❌ Create CV Failed:', res.status, res.data);
        }
    } catch (e) {
        console.error('❌ Create CV Error:', e.message);
    }

    // 5. Get CVs
    try {
        const res = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/cvs',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.status === 200) {
            console.log('✅ Get CVs:', res.status, 'Count:', res.data.count);
        } else {
            console.error('❌ Get CVs Failed:', res.status, res.data);
        }
    } catch (e) {
        console.error('❌ Get CVs Error:', e.message);
    }

    // 6. Delete CV
    if (cvId) {
        try {
            const res = await request({
                hostname: 'localhost',
                port: 5000,
                path: `/api/cvs/${cvId}`,
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.status === 200) {
                console.log('✅ Delete CV:', res.status);
            } else {
                console.error('❌ Delete CV Failed:', res.status, res.data);
            }
        } catch (e) {
            console.error('❌ Delete CV Error:', e.message);
        }
    }
}

test();
