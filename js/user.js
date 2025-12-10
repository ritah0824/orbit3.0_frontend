// User Authentication Functions

// Check if user is logged in on page load
async function checkAuthStatus() {
    try {
        const response = await fetch(`${API_URL}/auth/status`, {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();
        
        if (data.success && data.authenticated) {
            console.log('✅ User is authenticated:', data.user.name);
            updateUIForLoggedInUser(data.user);
            return true;
        } else {
            console.log('❌ User not authenticated');
            updateUIForLoggedOutUser();
            return false;
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        updateUIForLoggedOutUser();
        return false;
    }
}

// Update UI based on authentication status
function updateUIForLoggedInUser(user) {
    document.getElementById('btn-sign-up').style.display = 'none';
    document.getElementById('btn-log-in').style.display = 'none';
    document.getElementById('btn-log-out').style.display = 'inline';
}

function updateUIForLoggedOutUser() {
    document.getElementById('btn-sign-up').style.display = 'inline';
    document.getElementById('btn-log-in').style.display = 'inline';
    document.getElementById('btn-log-out').style.display = 'none';
    
    // Clear tasks
    document.getElementById('task-list').innerHTML = '';
}

// Login function
async function login() {
    const name = document.getElementById('input-login-name').value.trim();
    const password = document.getElementById('input-login-password').value;
    const resultDiv = document.getElementById('login-result');

    // Clear previous error
    resultDiv.textContent = '';
    resultDiv.style.display = 'none';

    // Validation
    if (!name || !password) {
        resultDiv.textContent = 'Please fill in all fields. ';
        resultDiv.style. display = 'block';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ name, password })
        });

        const data = await response.json();

        if (data.success) {
            console.log('✅ Login successful');
            layerClose();
            updateUIForLoggedInUser(data.user);
            getTasks(); // Load user's tasks
        } else {
            resultDiv.textContent = data.error || 'Email or password invalid.';
            resultDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Login error:', error);
        resultDiv.textContent = 'Connection error. Please try again.';
        resultDiv.style.display = 'block';
    }
}

// Signup function
async function signup() {
    const name = document.getElementById('input-signup-name').value.trim();
    const password = document.getElementById('input-signup-password').value;
    const confirm = document.getElementById('input-signup-confirm').value;
    const resultDiv = document.getElementById('signup-result');

    // Clear previous error
    resultDiv.textContent = '';
    resultDiv.style.display = 'none';

    // Validation
    if (! name || !password || !confirm) {
        resultDiv.textContent = 'Please fill in all fields.';
        resultDiv.style.display = 'block';
        return;
    }

    if (name.length < 3) {
        resultDiv.textContent = 'Name must be at least 3 characters. ';
        resultDiv.style. display = 'block';
        return;
    }

    if (password. length < 6) {
        resultDiv.textContent = 'Password must be at least 6 characters.';
        resultDiv.style.display = 'block';
        return;
    }

    if (password !== confirm) {
        resultDiv.textContent = 'Passwords do not match.';
        resultDiv.style.display = 'block';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ name, password })
        });

        const data = await response.json();

        if (data.success) {
            console.log('✅ Signup successful');
            layerClose();
            updateUIForLoggedInUser(data. user);
            getTasks(); // Load empty task list
        } else {
            resultDiv.textContent = data. error || 'Signup failed. ';
            resultDiv.style. display = 'block';
        }
    } catch (error) {
        console.error('Signup error:', error);
        resultDiv.textContent = 'Connection error. Please try again.';
        resultDiv.style.display = 'block';
    }
}

// Logout function
async function logout() {
    try {
        const response = await fetch(`${API_URL}/logout`, {
            method: 'POST',
            credentials: 'include'
        });

        const data = await response.json();

        if (data.success) {
            console.log('✅ Logout successful');
            updateUIForLoggedOutUser();
            
            // Clear form inputs
            document.getElementById('input-login-name').value = '';
            document.getElementById('input-login-password').value = '';
            document.getElementById('input-signup-name').value = '';
            document. getElementById('input-signup-password').value = '';
            document.getElementById('input-signup-confirm').value = '';
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Open login popup
function loginOpen() {
    document.getElementById('tanceng-wrapper').style.display = 'flex';
    document.getElementById('tanceng-login').style.display = 'block';
    document.getElementById('tanceng-signup').style.display = 'none';
    document.getElementById('tanceng-report').style.display = 'none';
    
    // Clear error messages
    document.getElementById('login-result').style.display = 'none';
    document.getElementById('login-result').textContent = '';
}

// Open signup popup
function signupOpen() {
    document.getElementById('tanceng-wrapper').style.display = 'flex';
    document.getElementById('tanceng-signup').style.display = 'block';
    document.getElementById('tanceng-login').style.display = 'none';
    document.getElementById('tanceng-report').style.display = 'none';
    
    // Clear error messages
    document.getElementById('signup-result').style.display = 'none';
    document.getElementById('signup-result').textContent = '';
}

// Close popup layer
function layerClose() {
    document.getElementById('tanceng-wrapper').style.display = 'none';
    document.getElementById('tanceng-login').style.display = 'none';
    document.getElementById('tanceng-signup').style.display = 'none';
    document.getElementById('tanceng-report').style.display = 'none';
}

// Add Enter key support for login
document.addEventListener('DOMContentLoaded', function() {
    const loginInputs = ['input-login-name', 'input-login-password'];
    loginInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    login();
                }
            });
        }
    });

    const signupInputs = ['input-signup-name', 'input-signup-password', 'input-signup-confirm'];
    signupInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    signup();
                }
            });
        }
    });
});