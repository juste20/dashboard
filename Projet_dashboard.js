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

    // Product Management DOM Elements
    const productForm = document.getElementById('product-form');
    const productsList = document.getElementById('products-list');
    const editProductModal = document.getElementById('edit-product-modal');
    const editProductForm = document.getElementById('edit-product-form');
    const editProductAlert = document.getElementById('edit-product-alert');

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
            
            // If we're navigating to the products page, load the products
            if (pageId === 'products') {
                loadProducts();
            }
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
            if (editProductModal) {
                editProductModal.style.display = 'none';
            }
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
        if (e.target == editProductModal) {
            editProductModal.style.display = 'none';
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

    // PRODUCT MANAGEMENT FUNCTIONS

    // Add Product Form Submission
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check if user is logged in
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) {
                alert('Please login to add products');
                return;
            }
            
            const productName = document.getElementById('product-name').value;
            const productPrice = parseFloat(document.getElementById('product-price').value);
            const productCategory = document.getElementById('product-category').value;
            const productDescription = document.getElementById('product-description').value;
            
            // Handle image file
            let productImageURL = '';
            const productImageInput = document.getElementById('product-image');
            if (productImageInput.files.length > 0) {
                const file = productImageInput.files[0];
                // For simplicity, we'll just store a fake URL
                // In a real application, you'd upload this to a server
                productImageURL = URL.createObjectURL(file);
            }
            
            // Create product object
            const product = {
                id: Date.now().toString(),
                name: productName,
                price: productPrice,
                category: productCategory,
                description: productDescription,
                image: productImageURL,
                createdBy: currentUser.email || currentUser.facebook,
                createdAt: new Date().toISOString()
            };
            
            // Get existing products
            const products = JSON.parse(localStorage.getItem('products')) || [];
            
            // Add new product
            products.push(product);
            
            // Save to local storage
            localStorage.setItem('products', JSON.stringify(products));
            
            // Reset form
            productForm.reset();
            
            // Reload products list
            loadProducts();
            
            // Show success message
            alert('Product added successfully!');
        });
    }

    // Function to load products
    function loadProducts() {
        if (!productsList) return;
        
        // Clear products list
        productsList.innerHTML = '';
        
        // Get products from local storage
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        // If no products, show message
        if (products.length === 0) {
            productsList.innerHTML = '<p class="no-products">No products available. Add your first product!</p>';
            return;
        }
        
        // Loop through products and create elements
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            // Set product card HTML
            productCard.innerHTML = `
                <div class="product-image">
                    ${product.image ? `<img src="${product.image}" alt="${product.name}">` : '<div class="no-image">No Image</div>'}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-category">${product.category}</p>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <p class="product-description">${product.description}</p>
                    <div class="product-actions">
                        <button class="view-product" data-id="${product.id}">View Details</button>
                        ${currentUser && (currentUser.email === product.createdBy || currentUser.facebook === product.createdBy) ? 
                            `<button class="edit-product" data-id="${product.id}">Edit</button>
                             <button class="delete-product" data-id="${product.id}">Delete</button>` : ''}
                    </div>
                </div>
            `;
            
            productsList.appendChild(productCard);
        });
        
        // Add event listeners to buttons
        addProductButtonListeners();
    }

    // Function to add event listeners to product buttons
    function addProductButtonListeners() {
        // View product details
        const viewButtons = document.querySelectorAll('.view-product');
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                viewProductDetails(productId);
            });
        });
        
        // Edit product
        const editButtons = document.querySelectorAll('.edit-product');
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                openEditProductModal(productId);
            });
        });
        
        // Delete product
        const deleteButtons = document.querySelectorAll('.delete-product');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                deleteProduct(productId);
            });
        });
    }

    // Function to view product details
    function viewProductDetails(productId) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const product = products.find(p => p.id === productId);
        
        if (product) {
            // In a real app, you might show a modal with details
            alert(`
                Product: ${product.name}
                Category: ${product.category}
                Price: $${product.price.toFixed(2)}
                Description: ${product.description}
                Added on: ${new Date(product.createdAt).toLocaleDateString()}
            `);
        }
    }

    // Function to open edit product modal
    function openEditProductModal(productId) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const product = products.find(p => p.id === productId);
        
        if (product && editProductModal && editProductForm) {
            // Fill form with product data
            document.getElementById('edit-product-id').value = product.id;
            document.getElementById('edit-product-name').value = product.name;
            document.getElementById('edit-product-price').value = product.price;
            document.getElementById('edit-product-category').value = product.category;
            document.getElementById('edit-product-description').value = product.description;
            
            // Show current image if exists
            const currentImageContainer = document.getElementById('current-product-image-container');
            if (currentImageContainer) {
                if (product.image) {
                    currentImageContainer.innerHTML = `<img src="${product.image}" alt="${product.name}" style="max-width: 100px; max-height: 100px;">`;
                } else {
                    currentImageContainer.innerHTML = '';
                }
            }
            
            // Show modal
            editProductModal.style.display = 'flex';
        }
    }

    // Edit Product Form Submission
    if (editProductForm) {
        editProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const productId = document.getElementById('edit-product-id').value;
            const productName = document.getElementById('edit-product-name').value;
            const productPrice = parseFloat(document.getElementById('edit-product-price').value);
            const productCategory = document.getElementById('edit-product-category').value;
            const productDescription = document.getElementById('edit-product-description').value;
            
            // Get products from local storage
            const products = JSON.parse(localStorage.getItem('products')) || [];
            const productIndex = products.findIndex(p => p.id === productId);
            
            if (productIndex !== -1) {
                // Check if there's a new image
                let productImageURL = products[productIndex].image; // Keep existing image by default
                const productImageInput = document.getElementById('edit-product-image');
                if (productImageInput.files.length > 0) {
                    const file = productImageInput.files[0];
                    productImageURL = URL.createObjectURL(file);
                }
                
                // Update product
                products[productIndex] = {
                    ...products[productIndex],
                    name: productName,
                    price: productPrice,
                    category: productCategory,
                    description: productDescription,
                    image: productImageURL,
                    updatedAt: new Date().toISOString()
                };
                
                // Save to local storage
                localStorage.setItem('products', JSON.stringify(products));
                
                // Close modal
                editProductModal.style.display = 'none';
                
                // Reload products
                loadProducts();
                
                // Show success message
                alert('Product updated successfully!');
            }
        });
    }

    // Function to delete product
    function deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            const products = JSON.parse(localStorage.getItem('products')) || [];
            const updatedProducts = products.filter(p => p.id !== productId);
            
            // Save updated products to local storage
            localStorage.setItem('products', JSON.stringify(updatedProducts));
            
            // Reload products
            loadProducts();
            
            // Show success message
            alert('Product deleted successfully!');
        }
    }

    // Initial load of products if on products page
    if (document.getElementById('products') && document.getElementById('products').classList.contains('active')) {
        loadProducts();
    }
});