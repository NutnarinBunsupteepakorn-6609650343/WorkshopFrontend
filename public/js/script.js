// Function to submit the login form
function submitLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // Validate input fields
    if (!username || !password || !role) {
        document.getElementById('message').innerText = 'Please fill out all fields.';
        return;
    }

    // Send login request to backend API
    fetch('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Application-Key': 'TUa5ebfbd400c418e68406b47c0028666c69569e9c531052c0ab617899b509cd0f29311fbb85a2b0801f89f2e9f03d2a71'
        },
        body: JSON.stringify({
            "UserName": username,
            "PassWord": password,
            "Role": role
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Debugging: Log the response to inspect its structure

        if (data.status) {
            // User authenticated successfully, proceed to save user data to students table
            saveUserToStudents(data);

            // Display user info in the UI
            document.getElementById('message').innerText = 'Login successful!';
            showinfo(data);
        } else {
            // Login failed, show error message
            document.getElementById('message').innerText = data.message || 'Login failed. Please try again.';
            
            // Display a popup alert for login failure
            alert(data.message || 'Login failed. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('message').innerText = 'An error occurred. Please try again later.';
        
        // Display a popup alert for any errors
        alert('An error occurred. Please try again later.');
    });
}

// Function to save the user to the "students" table
function saveUserToStudents(data) {
    // Send request to save user data
    fetch('http://localhost:8080/api/student', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userName: data.username,
            type: data.type,
            engName: data.displayname_en,
            email: data.email,
            faculty: data.faculty
        })
    })
    .then(response => response.json())
    .then(result => {
        if (result.status) {
            console.log('User saved to students table');
        } else {
            console.log('Failed to save user to students table');
        }
    })
    .catch(error => {
        console.error('Error saving user:', error);
    });
}

// Function to display the returned data in the UI
function showinfo(data) {
    const account = document.getElementById('popup');
    console.log('Data received in showinfo:', data);

    account.innerHTML = `
        <h2>Account Info</h2>
        <p><strong>Student Number:</strong> ${data.username}</p>
        <p><strong>Name:</strong> ${data.displayname_en}</p>
        <p><strong>Email:</strong> ${data.email}</p> 
        <p><strong>Department:</strong> ${data.department}</p>
        <p><strong>Faculty:</strong>${data.faculty}</p>
    `;
    account.style.display = 'block';
}

// Function to toggle password visibility
function togglePassword() {
    const passwordField = document.getElementById('password');
    const toggleText = document.querySelector('.toggle-password');
    if (passwordField.type === "password") {
        passwordField.type = "text";
        toggleText.textContent = "Hide"; // Change text to "Hide"
    } else {
        passwordField.type = "password";
        toggleText.textContent = "Show"; // Change text to "Show"
    }
}

// Event listener for enabling/disabling the login button based on input validation
document.addEventListener("DOMContentLoaded", function() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const roleSelect = document.getElementById('role');
    const loginButton = document.getElementById('loginButton');

    // Validate form fields and enable/disable login button
    function validateForm() {
        if (usernameInput.value && passwordInput.value && roleSelect.value) {
            loginButton.disabled = false; // Enable button
            loginButton.style.cursor = 'pointer'; // Change cursor to pointer
        } else {
            loginButton.disabled = true; // Disable button
            loginButton.style.cursor = 'not-allowed'; // Change cursor to not-allowed
        }
    }

    // Add input event listeners to validate form
    usernameInput.addEventListener('input', validateForm);
    passwordInput.addEventListener('input', validateForm);
    roleSelect.addEventListener('change', validateForm);

    // Attach the submitLogin function to the login form submission
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission
        submitLogin(); // Call the submit login function
    });
});
