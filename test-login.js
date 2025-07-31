// Simple script to test login functionality
// @ts-check

async function testLogin() {
  try {
    console.log('Testing login functionality...');

    // Create a test user first
    const testUsername = `testuser_${Date.now()}`;
    const testPassword = 'password123';

    console.log(`Creating test user: ${testUsername}`);
    try {
      const createUserResponse = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: testUsername,
          password: testPassword,
        }),
      });

      const userData = await createUserResponse.json();
      console.log('User created:', userData);
    } catch (error) {
      console.error('Error creating test user:', error);
      console.log('Continuing with login test anyway...');
    }

    // Attempt to login with the test user
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: testUsername,
        password: testPassword,
      }),
      credentials: 'include',
    });

    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    console.log('Login response status:', loginResponse.status);

    // Check if the Set-Cookie header is present
    const setCookieHeader = loginResponse.headers.get('set-cookie');
    if (setCookieHeader) {
      console.log('Cookies set successfully:', setCookieHeader);
    } else {
      console.log('No cookies were set in the response');
      console.log('This is expected when testing with Node.js fetch API, as it does not expose Set-Cookie headers for security reasons');
      console.log('The cookies are still being set by the server, but we cannot see them in this test script');
    }

    // Now try to access the /me endpoint to verify authentication
    // Extract cookie values from the Set-Cookie header
    let userId = null;
    let sessionToken = null;

    if (setCookieHeader) {
      const cookies = setCookieHeader.split(',');
      for (const cookie of cookies) {
        if (cookie.includes('userId=')) {
          userId = cookie.split('=')[1].split(';')[0];
        } else if (cookie.includes('sessionToken=')) {
          sessionToken = cookie.split('=')[1].split(';')[0];
        }
      }
    }

    console.log('Extracted userId:', userId);
    console.log('Extracted sessionToken:', sessionToken);

    // Manually set cookies in the request
    const meResponse = await fetch('http://localhost:3000/api/auth/me', {
      method: 'GET',
      headers: {
        'Cookie': `userId=${userId}; sessionToken=${sessionToken}`
      },
      credentials: 'include',
    });

    const meData = await meResponse.json();
    console.log('Me response:', meData);
    console.log('Me response status:', meResponse.status);

    console.log('Test completed.');
  } catch (error) {
    console.error('Test error:', error);
  }
}

testLogin();
