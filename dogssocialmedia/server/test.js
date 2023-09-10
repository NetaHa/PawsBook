//run npm start
//on another terminal 1.cd server 2.npm run dev
//to run tests "node test.js"
const baseURL = 'http://localhost:5000/api/users';  

async function testLoginWithCorrectCredentials() {
    const response = await fetch(`${baseURL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: 'test1@gmail.com',
            password: '12345',
        }),
    });

    const data = await response.json();

    if (response.status !== 200) {
        console.error('Failed test: Login with correct credentials');
        console.error(data);
        return;
    }

    if (!data.token || !('isAdmin' in data)) {
        console.error('Failed test: Login with correct credentials');
        console.error(data);
        return;
    }

    console.log('Passed test: Login with correct credentials');
}

async function testLoginWithWrongCredentials() {
    const response = await fetch(`${baseURL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: 'wrongEmail@gmail.com',
            password: 'wrongPassword',
        }),
    });

    const data = await response.json();

    if (response.status !== 400) {
        console.error('Failed test: Login with wrong credentials');
        console.error(data);
        return;
    }

    if (!data.error || data.error !== 'User not found') {
        console.error('Failed test: Login with wrong credentials');
        console.error(data);
        return;
    }

    console.log('Passed test: Login with wrong credentials');
}

async function testFetchAllUsers() {
    const response = await fetch(`${baseURL}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (response.status !== 200) {
        console.error('Failed test: Fetch all users');
        console.error(data);
        return;
    }

    if (!Array.isArray(data)) {
        console.error('Failed test: Fetch all users - Response should be an array');
        console.error(data);
        return;
    }

    console.log('Passed test: Fetch all users');
}

async function testDeleteUser() {
    const userId = 'bda93251-5303-44df-b6b2-a2ce537c4747';  

    const response = await fetch(`${baseURL}/${userId}`, {
        method: 'DELETE',
    });

    const data = await response.json();

    if (response.status !== 200) {
        console.error('Failed test: Delete user');
        console.error(data);
        return;
    }

    if (!data.success || data.message !== 'User deleted') {
        console.error('Failed test: Delete user - Unexpected response');
        console.error(data);
        return;
    }

    const fetchDeletedUserResponse = await fetch(`${baseURL}/api/users/${userId}`);
    if (fetchDeletedUserResponse.status !== 404) {  
        console.error('Failed test: Delete user - User still exists after delete');
        return;
    }

    console.log('Passed test: Delete user');
}

const secondbaseURL = 'http://localhost:5000/api';

async function testPostsEndpoint() {
    let response = await fetch(`${secondbaseURL}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: 'This is a test post'
        })
    });

    if (response.status !== 401) { 
        console.error('Failed test: Post without authorization - API did not return 401 Unauthorized');
        return;
    }

    const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBhYmEzZTBjLTM3MTYtNDgxYS1hNzI3LTE4YjJkYjU3ZmE4MSIsImVtYWlsIjoibmV0YUBnbWFpbC5jb20iLCJpYXQiOjE2OTQzNDY3OTgsImV4cCI6MTY5NDM1MDM5OH0.N0tGiHejvPx641O-KlmHszlBXmfmnJ-EsATKxLiEI14";
;

    response = await fetch(`${secondbaseURL}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${testToken}`
        },
        body: JSON.stringify({
            content: 'This is a test post by an authenticated user'
        })
    });

    const data = await response.json();

    if (response.status !== 200 || data.content !== 'This is a test post by an authenticated user') {
        console.error('Failed test: Post with valid user - Unexpected response');
        console.error(data);
        return;
    }
    console.log('Passed test: Post Endpoint');
}

const headers = {
    'Authorization': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBhYmEzZTBjLTM3MTYtNDgxYS1hNzI3LTE4YjJkYjU3ZmE4MSIsImVtYWlsIjoibmV0YUBnbWFpbC5jb20iLCJpYXQiOjE2OTQzNDY3OTgsImV4cCI6MTY5NDM1MDM5OH0.N0tGiHejvPx641O-KlmHszlBXmfmnJ-EsATKxLiEI14`, 
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

// Test for POST /api/posts
async function testCreatePost() {
    const response = await fetch(`${secondbaseURL}/posts`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ content: 'This is a test post' })
    });
    const data = await response.json();

    if(response.status !== 200 || data.content !== 'This is a test post') {
        console.error('Failed: testCreatePost');
    } else {
        console.log('Passed: testCreatePost');
    }
}

async function testLikePost() {
    const postId = 3; 
    const response = await fetch(`${secondbaseURL}/posts/${postId}/like`, {
        method: 'PATCH',
        headers: headers
    });
    const data = await response.json();

    if(response.status !== 200 || !data.likes.includes("0aba3e0c-3716-481a-a727-18b2db57fa81")) { // replace with your userId
        console.error('Failed: testLikePost');
    } else {
        console.log('Passed: testLikePost');
    }
}

async function testGetCurrentUser() {
    const response = await fetch(`${secondbaseURL}/users/currentUser`, {
        method: 'GET',
        headers: headers
    });
    const data = await response.json();

    if(response.status !== 200 || !data.id) {
        console.error('Failed: testGetCurrentUser');
    } else {
        console.log('Passed: testGetCurrentUser');
    }
}

async function testFollowUser() {
    const userIdToFollow = '0aba3e0c-3716-481a-a727-18b2db57fa81'; 
    const response = await fetch(`${secondbaseURL}/users/follow/${userIdToFollow}`, {
        method: 'POST',
        headers: headers
    });
    const data = await response.json();

    if(response.status !== 200 || data.message !== 'Successfully followed the user') {
        console.error('Failed: testFollowUser');
    } else {
        console.log('Passed: testFollowUser');
    }
}

async function testUnfollowUser() {
    const userIdToUnfollow = '0aba3e0c-3716-481a-a727-18b2db57fa81'; 
    const response = await fetch(`${secondbaseURL}/users/unfollow/${userIdToUnfollow}`, {
        method: 'POST',
        headers: headers
    });
    const data = await response.json();

    if(response.status !== 200 || data.message !== 'Successfully unfollowed the user') {
        console.error('Failed: testUnfollowUser');
    } else {
        console.log('Passed: testUnfollowUser');
    }
}

async function runTests() {
    await testLoginWithCorrectCredentials();
    await testLoginWithWrongCredentials();
    await testFetchAllUsers();
    //await testDeleteUser();
    await testPostsEndpoint();
    await testCreatePost();
    await testLikePost();
    await testGetCurrentUser();
    await testFollowUser();
    await testUnfollowUser();
    console.log("All tests passed");
}

runTests();
