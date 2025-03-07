document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const menuItems = document.querySelectorAll('.menu-item');
    const pages = document.querySelectorAll('.page-content');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const closeBtns = document.querySelectorAll('.close');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutBtn = document.getElementById('logout-btn');
    const authButtons = document.getElementById('auth-buttons');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    const loginAlert = document.getElementById('login-alert');
    const registerAlert = document.getElementById('register-alert');

    // Check if user is logged in
    checkLoginStatus();

    // Navigation
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all menu items
            menuItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked menu item
            this.classList.add('active');
            
            // Hide all pages
            pages.forEach(page => page.classList.remove('active'));
            
            // Show the corresponding page
            const pageId = this.getAttribute('data-page');
            document.getElementById(pageId).classList.add('active');
        });
    });

    // Show login modal
    loginBtn.addEventListener('click', function() {
        loginModal.style.display = 'flex';
        loginAlert.textContent = '';
        loginForm.reset();
    });

    // Show register modal
    registerBtn.addEventListener('click', function() {
        registerModal.style.display = 'flex';
        registerAlert.textContent = '';
        registerForm.reset();
    });

    // Close modals
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
        });
    });

    // Switch to register modal from login
    showRegister.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'none';
        registerModal.style.display = 'flex';
        registerAlert.textContent = '';
        registerForm.reset();
    });

    // Switch to login modal from register
    showLogin.addEventListener('click', function(e) {
        e.preventDefault();
        registerModal.style.display = 'none';
        loginModal.style.display = 'flex';
        loginAlert.textContent = '';
        loginForm.reset();
    });

    // Login Form Submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Get users from local storage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Find user
        const user = users.find(u => (u.email === email || u.facebook === email) && u.password === password);
        
        if (user) {
            // Store logged in user
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Update UI
            loginModal.style.display = 'none';
            updateUserInterface(user);
            
            loginAlert.textContent = '';
            loginForm.reset();
        } else {
            loginAlert.textContent = 'Invalid email or password';
            loginAlert.style.color = 'red';
        }
    });

    // Register Form Submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const lastname = document.getElementById('lastname').value;
        const firstname = document.getElementById('firstname').value;
        const dob = document.getElementById('dob').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Validate passwords match
        if (password !== confirmPassword) {
            registerAlert.textContent = 'Passwords do not match';
            registerAlert.style.color = 'red';
            return;
        }
        
        // Get users from local storage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if email already exists
        if (users.some(user => user.email === email || user.facebook === email)) {
            registerAlert.textContent = 'Email or Facebook number already registered';
            registerAlert.style.color = 'red';
            return;
        }
        
        // Create new user
        const newUser = {
            lastname,
            firstname,
            dob,
            email: email.includes('@') ? email : '',
            facebook: !email.includes('@') ? email : '',
            password
        };
        
        // Add user to users array
        users.push(newUser);
        
        // Save to local storage
        localStorage.setItem('users', JSON.stringify(users));
        
        // Login the new user
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        // Update UI
        registerModal.style.display = 'none';
        updateUserInterface(newUser);
        
        registerAlert.textContent = '';
        registerForm.reset();
    });

    // Logout
    logoutBtn.addEventListener('click', function() {
        // Remove current user from local storage
        localStorage.removeItem('currentUser');
        
        // Update UI
        authButtons.style.display = 'flex';
        userInfo.style.display = 'none';
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target == loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target == registerModal) {
            registerModal.style.display = 'none';
        }
    });

    // Function to check login status on page load
    function checkLoginStatus() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (currentUser) {
            updateUserInterface(currentUser);
        }
    }

    // Function to update UI based on login status
    function updateUserInterface(user) {
        authButtons.style.display = 'none';
        userInfo.style.display = 'flex';
        userName.textContent = user.firstname + ' ' + user.lastname;
    }
});