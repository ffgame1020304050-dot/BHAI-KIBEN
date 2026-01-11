// Package data
const packages = {
    diamonds: [
        { id: 1, name: "25 Diamond", diamonds: 25, price: 24, originalPrice: 30, category: "diamond" },
        { id: 2, name: "50 Diamond", diamonds: 50, price: 45, originalPrice: 60, category: "diamond" },
        { id: 3, name: "115 Diamond", diamonds: 115, price: 78, originalPrice: 100, category: "diamond" },
        { id: 4, name: "240 Diamond", diamonds: 240, price: 160, originalPrice: 200, category: "diamond" },
        { id: 5, name: "480 Diamond", diamonds: 480, price: 310, originalPrice: 400, category: "diamond" },
        { id: 6, name: "610 Diamond", diamonds: 610, price: 390, originalPrice: 500, category: "diamond" },
        { id: 7, name: "1240 Diamond", diamonds: 1240, price: 795, originalPrice: 1000, category: "diamond" },
        { id: 8, name: "2530 Diamond", diamonds: 2530, price: 1679, originalPrice: 2100, category: "diamond" },
        { id: 9, name: "5060 Diamond", diamonds: 5060, price: 3358, originalPrice: 4200, category: "diamond" },
        { id: 10, name: "10120 Diamond", diamonds: 10120, price: 6716, originalPrice: 8400, category: "diamond" }
    ],
    weekly: [
        { id: 11, name: "Weekly", diamonds: "Weekly Pass", price: 160, originalPrice: 200, category: "weekly" },
        { id: 12, name: "Weekly Lite", diamonds: "Weekly Lite", price: 45, originalPrice: 60, category: "weekly" },
        { id: 13, name: "Monthly", diamonds: "Monthly Pass", price: 780, originalPrice: 1000, category: "weekly" }
    ],
    airdrop: [
        { id: 14, name: "0.99$ AirDrop", diamonds: "0.99$ Package", price: 145, originalPrice: 180, category: "airdrop" },
        { id: 15, name: "1.99$ AirDrop", diamonds: "1.99$ Package", price: 289, originalPrice: 360, category: "airdrop" },
        { id: 16, name: "3.99$ AirDrop", diamonds: "3.99$ Package", price: 449, originalPrice: 560, category: "airdrop" }
    ],
    evo: [
        { id: 17, name: "3 Day Evo Access", diamonds: "3 Day Access", price: 60, originalPrice: 75, category: "evo" },
        { id: 18, name: "7 Days Evo Access", diamonds: "7 Days Access", price: 100, originalPrice: 125, category: "evo" },
        { id: 19, name: "30 Days Evo Access", diamonds: "30 Days Access", price: 250, originalPrice: 300, category: "evo" }
    ]
};

// WhatsApp notification URL
const WHATSAPP_NUMBER = "8801748320647";

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load packages
    loadPackages();
    
    // Populate dropdown
    populatePackageDropdown();
    
    // Load orders
    loadOrders();
    
    // Setup event listeners
    setupEventListeners();
    
    // Mobile menu toggle
    setupMobileMenu();
});

// Load all packages
function loadPackages() {
    // Load diamond packages
    const diamondGrid = document.querySelector('.packages-grid:not(.weekly-grid):not(.airdrop-grid):not(.evo-grid)');
    packages.diamonds.forEach(pkg => {
        diamondGrid.appendChild(createPackageCard(pkg));
    });
    
    // Load weekly packages
    const weeklyGrid = document.querySelector('.weekly-grid');
    packages.weekly.forEach(pkg => {
        weeklyGrid.appendChild(createPackageCard(pkg));
    });
    
    // Load airdrop packages
    const airdropGrid = document.querySelector('.airdrop-grid');
    packages.airdrop.forEach(pkg => {
        airdropGrid.appendChild(createPackageCard(pkg));
    });
    
    // Load evo packages
    const evoGrid = document.querySelector('.evo-grid');
    packages.evo.forEach(pkg => {
        evoGrid.appendChild(createPackageCard(pkg));
    });
}

// Create package card HTML
function createPackageCard(pkg) {
    const card = document.createElement('div');
    card.className = 'package-card';
    card.dataset.id = pkg.id;
    card.dataset.name = pkg.name;
    card.dataset.price = pkg.price;
    
    card.innerHTML = `
        <div class="package-icon">
            <i class="fas fa-gem"></i>
        </div>
        <h3>${pkg.name}</h3>
        ${pkg.diamonds ? `<p class="diamonds">${pkg.diamonds}</p>` : ''}
        <p class="price">${pkg.price} BDT</p>
        ${pkg.originalPrice ? `<p class="original-price">${pkg.originalPrice} BDT</p>` : ''}
        <button class="select-btn" data-id="${pkg.id}">Select Package</button>
    `;
    
    return card;
}

// Populate package dropdown
function populatePackageDropdown() {
    const select = document.getElementById('package');
    
    // Add diamond packages
    packages.diamonds.forEach(pkg => {
        const option = document.createElement('option');
        option.value = pkg.id;
        option.textContent = `${pkg.name} - ${pkg.price} BDT`;
        select.appendChild(option);
    });
    
    // Add weekly packages
    packages.weekly.forEach(pkg => {
        const option = document.createElement('option');
        option.value = pkg.id;
        option.textContent = `${pkg.name} - ${pkg.price} BDT`;
        select.appendChild(option);
    });
    
    // Add airdrop packages
    packages.airdrop.forEach(pkg => {
        const option = document.createElement('option');
        option.value = pkg.id;
        option.textContent = `${pkg.name} - ${pkg.price} BDT`;
        select.appendChild(option);
    });
    
    // Add evo packages
    packages.evo.forEach(pkg => {
        const option = document.createElement('option');
        option.value = pkg.id;
        option.textContent = `${pkg.name} - ${pkg.price} BDT`;
        select.appendChild(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Package selection
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('select-btn')) {
            const packageId = e.target.dataset.id;
            const packageCard = e.target.closest('.package-card');
            const packageName = packageCard.dataset.name;
            const packagePrice = packageCard.dataset.price;
            
            // Set selected package
            document.getElementById('package').value = packageId;
            document.getElementById('price').value = packagePrice;
            
            // Scroll to form
            document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    // Package dropdown change
    document.getElementById('package').addEventListener('change', function() {
        const packageId = this.value;
        if (packageId) {
            // Find package price
            let price = 0;
            const allPackages = [...packages.diamonds, ...packages.weekly, ...packages.airdrop, ...packages.evo];
            const selectedPackage = allPackages.find(pkg => pkg.id == packageId);
            
            if (selectedPackage) {
                price = selectedPackage.price;
            }
            
            document.getElementById('price').value = price;
        }
    });
    
    // Form submission
    document.getElementById('topupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        placeOrder();
    });
    
    // Modal close buttons
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.querySelector('.close-btn').addEventListener('click', closeModal);
}

// Place new order
function placeOrder() {
    const packageSelect = document.getElementById('package');
    const packageId = packageSelect.value;
    const packageText = packageSelect.options[packageSelect.selectedIndex].text;
    const price = document.getElementById('price').value;
    const uid = document.getElementById('uid').value;
    const phone = document.getElementById('phone').value;
    const transaction = document.getElementById('transaction').value;
    
    if (!packageId || !uid || !phone || !transaction) {
        alert('Please fill all fields');
        return;
    }
    
    // Create order object
    const order = {
        id: Date.now(), // Unique ID based on timestamp
        package: packageText,
        price: price,
        uid: uid,
        phone: phone,
        transaction: transaction,
        status: 'pending',
        timestamp: new Date().toLocaleString('en-BD')
    };
    
    // Save order to localStorage
    saveOrder(order);
    
    // Send WhatsApp notification
    sendWhatsAppNotification(order);
    
    // Show success modal
    showSuccessModal();
    
    // Reset form
    document.getElementById('topupForm').reset();
    document.getElementById('price').value = '';
    
    // Reload orders
    loadOrders();
}

// Save order to localStorage
function saveOrder(order) {
    let orders = JSON.parse(localStorage.getItem('ff_orders')) || [];
    orders.unshift(order); // Add to beginning
    localStorage.setItem('ff_orders', JSON.stringify(orders));
}

// Load orders from localStorage
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('ff_orders')) || [];
    const tbody = document.getElementById('ordersTableBody');
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Add orders (show only recent 10)
    const recentOrders = orders.slice(0, 10);
    
    recentOrders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.package}</td>
            <td>${order.price} BDT</td>
            <td><span class="status ${order.status}">${order.status}</span></td>
            <td>${order.timestamp}</td>
        `;
        tbody.appendChild(row);
    });
    
    // Update stats
    updateStats(orders);
}

// Update order statistics
function updateStats(orders) {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const completed = orders.filter(o => o.status === 'completed').length;
    
    document.getElementById('totalOrders').textContent = total;
    document.getElementById('pendingOrders').textContent = pending;
    document.getElementById('completedOrders').textContent = completed;
}

// Send WhatsApp notification
function sendWhatsAppNotification(order) {
    const message = `*NEW ORDER - BHAI TOP UP*
    
📦 *Package:* ${order.package}
💰 *Price:* ${order.price} BDT
🎮 *UID:* ${order.uid}
📱 *Phone:* ${order.phone}
💳 *Transaction ID:* ${order.transaction}
⏰ *Time:* ${order.timestamp}
    
Please check admin panel to confirm order.`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappURL, '_blank');
}

// Show success modal
function showSuccessModal() {
    document.getElementById('successModal').style.display = 'flex';
}

// Close modal
function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}

// Setup mobile menu
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        if (navLinks.style.display === 'flex') {
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'var(--dark)';
            navLinks.style.padding = '20px';
            navLinks.style.gap = '15px';
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('nav') && window.innerWidth <= 768) {
            navLinks.style.display = 'none';
        }
    });
}