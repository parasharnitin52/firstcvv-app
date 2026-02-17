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

async function testSmart() {
    console.log('🚀 Testing Smart Features...');

    // 1. Get Templates
    try {
        const res = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/smart/templates',
            method: 'GET'
        });
        console.log('✅ Templates:', res.status, 'Count:', res.data.count);
        if (res.data.count < 5) console.warn('⚠️ Expected more templates');
    } catch (e) {
        console.error('❌ Templates Error:', e.message);
    }

    // 2. Get Skills for "Computer Science"
    try {
        const degree = encodeURIComponent('Computer Science');
        const res = await request({
            hostname: 'localhost',
            port: 5000,
            path: `/api/smart/skills/${degree}`,
            method: 'GET'
        });
        console.log('✅ Skills (CS):', res.status, 'Count:', res.data.count);
        if (res.data.count === 0) console.warn('⚠️ Expected CS skills');
    } catch (e) {
        console.error('❌ Skills Error:', e.message);
    }

    // 3. Get Skills for "Marketing"
    try {
        const degree = encodeURIComponent('Marketing');
        const res = await request({
            hostname: 'localhost',
            port: 5000,
            path: `/api/smart/skills/${degree}`,
            method: 'GET'
        });
        console.log('✅ Skills (Marketing):', res.status, 'Count:', res.data.count);
    } catch (e) {
        console.error('❌ Skills Error:', e.message);
    }
}

testSmart();
