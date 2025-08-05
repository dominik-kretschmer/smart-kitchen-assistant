async function testLogin() {
  try {
    const testUsername = `testuser_${Date.now()}`;
    const testPassword = 'password123';
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

      await createUserResponse.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
    }
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

    await loginResponse.json();
    const setCookieHeader = loginResponse.headers.get('set-cookie');

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

    const meResponse = await fetch('http://localhost:3000/api/auth/me', {
      method: 'GET',
      headers: {
        Cookie: `userId=${userId}; sessionToken=${sessionToken}`,
      },
      credentials: 'include',
    });

    await meResponse.json();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
  }
}

testLogin();
