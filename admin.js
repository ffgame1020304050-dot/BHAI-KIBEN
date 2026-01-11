// Admin password
const ADMIN_PASSWORD = "19923581";

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    if (isLoggedIn === 'true') {
        showDashboard();
    }
    
    // Setup back button
    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = 'index.html';
    });
});

// Admin login
function adminLogin() {
    const password = document.getElementById('adminPassword').value;
    
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem('admin_logged_in', 'true');
        showDashboard();
    } else {
        alert('Incorrect password!');
        document.getElementById('adminPassword').value = '';
        document.getElementById('adminPassword').focus();
    }
}

// Show dashboard
function showDashboard() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('backBtn').style.display = 'flex';
    
    // Set greeting
    const hour = new Date().getHours();
    let greeting = '';
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 18) greeting = 'Good Afternoon';
    else greeting = 'Good Evening';
    
    document.getElementById('adminGreeting').textContent = greeting + ', Admin!';
    
    // Load orders
    loadAdminOrders();
}

// Logout
function logout() {
    localStorage.removeItem('admin_logged_in');
    location.reload();
}

// Load all orders for admin
function loadAdminOrders() {
    const orders = JSON.parse(localStorage.getItem('ff_orders')) || [];
    const tbody = document.getElementById('adminOrdersTable');
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Add all orders
    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.package}</td>
            <td>${order.price} BDT</td>
            <td>${order.uid}</td>
            <td>${order.phone}</td>
            <td>${order.transaction}</td>
            <td><span class="status ${order.status}">${order.status}</span></td>
            <td>${order.timestamp}</td>
            <td>
                <div class="order-actions">
                    ${order.status === 'pending' ? `
                        <button class="action-btn complete-btn" onclick="updateOrderStatus(${order.id}, 'completed')">
                            <i class="fas fa-check"></i> Complete
                        </button>
                        <button class="action-btn cancel-btn" onclick="updateOrderStatus(${order.id}, 'cancelled')">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    ` : ''}
                    <button class="action-btn delete-btn" onclick="deleteOrder(${order.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Update admin stats
    updateAdminStats(orders);
}

// Update order status
function updateOrderStatus(orderId, status) {
    let orders = JSON.parse(localStorage.getItem('ff_orders')) || [];
    const orderIndex = orders.findIndex(o => o.id == orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        localStorage.setItem('ff_orders', JSON.stringify(orders));
        
        // Send WhatsApp notification for status update
        sendStatusNotification(orders[orderIndex], status);
        
        // Reload orders
        loadAdminOrders();
    }
}

// Delete order
function deleteOrder(orderId) {
    if (!confirm('Are you sure you want to delete this order?')) {
        return;
    }
    
    let orders = JSON.parse(localStorage.getItem('ff_orders')) || [];
    orders = orders.filter(o => o.id != orderId);
    localStorage.setItem('ff_orders', JSON.stringify(orders));
    
    // Reload orders
    loadAdminOrders();
}

// Update admin statistics
function updateAdminStats(orders) {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const completed = orders.filter(o => o.status === 'completed').length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;
    
    document.getElementById('adminTotalOrders').textContent = total;
    document.getElementById('adminPendingOrders').textContent = pending;
    document.getElementById('adminCompletedOrders').textContent = completed;
    document.getElementById('adminCancelledOrders').textContent = cancelled;
}

// Send status notification via WhatsApp
function sendStatusNotification(order, newStatus) {
    const statusText = newStatus === 'completed' ? '✅ COMPLETED' : '❌ CANCELLED';
    const message = `*ORDER UPDATE - BHAI TOP UP*
    
📦 *Order ID:* ${order.id}
📋 *Package:* ${order.package}
💰 *Price:* ${order.price} BDT
🎮 *UID:* ${order.uid}
    
📢 *Status:* ${statusText}
⏰ *Updated:* ${new Date().toLocaleString('en-BD')}
    
Thank you for using BHAI TOP UP!`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/88${order.phone}?text=${encodedMessage}`;
    
    // Open WhatsApp to send notification
    window.open(whatsappURL, '_blank');
}

// Refresh orders
function refreshOrders() {
    loadAdminOrders();
    alert('Orders refreshed!');
}

// Export orders to JSON
function exportOrders() {
    const orders = JSON.parse(localStorage.getItem('ff_orders')) || [];
    const dataStr = JSON.stringify(orders, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `bhai-topup-orders-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Clear completed orders
function clearCompleted() {
    if (!confirm('Clear all completed and cancelled orders?')) {
        return;
    }
    
    let orders = JSON.parse(localStorage.getItem('ff_orders')) || [];
    orders = orders.filter(o => o.status === 'pending');
    localStorage.setItem('ff_orders', JSON.stringify(orders));
    
    loadAdminOrders();
    alert('Completed orders cleared!');
}