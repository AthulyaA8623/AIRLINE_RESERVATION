// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const bookingsListDiv = document.getElementById('bookingsList');
    const emptyStateDiv = document.getElementById('emptyState');
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    // Modal Elements
    const cancelModal = document.getElementById('cancelModal');
    const closeModal = document.getElementById('closeModal');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const confirmCancelBtn = document.getElementById('confirmCancelBtn');
    const refundAmountSpan = document.getElementById('refundAmount');
    
    // State variables
    let allBookings = [];
    let allFlights = [];
    let currentTab = 'upcoming';
    let currentCancelBooking = null;
    
    // Get current logged-in user
    function getCurrentUser() {
        // Check sessionStorage first
        const userSession = sessionStorage.getItem('userSession');
        if (userSession) {
            try {
                return JSON.parse(userSession);
            } catch(e) {
                return null;
            }
        }
        
        // Check localStorage
        const userEmail = localStorage.getItem('user_email');
        if (userEmail) {
            return { 
                email: userEmail, 
                name: localStorage.getItem('user_name') || 'User' 
            };
        }
        
        // Demo user for testing - remove in production
        return { email: 'user@example.com', name: 'Test User' };
    }
    
    // Get all flights from localStorage
    function getAllFlights() {
        const stored = localStorage.getItem("airline_flights");
        if (!stored) return [];
        try {
            return JSON.parse(stored);
        } catch (e) {
            return [];
        }
    }
    
    // Get all bookings from localStorage
    function getAllBookings() {
        const stored = localStorage.getItem("user_bookings");
        if (!stored) return [];
        try {
            return JSON.parse(stored);
        } catch (e) {
            return [];
        }
    }
    
    // Save bookings to localStorage
    function saveBookingsToLocalStorage(bookings) {
        localStorage.setItem("user_bookings", JSON.stringify(bookings));
        // Dispatch event for real-time updates
        window.dispatchEvent(new Event('storage'));
    }
    
    // Get flight by ID
    function getFlightById(flightId) {
        return allFlights.find(f => f.id === flightId);
    }
    
    // Check if flight is upcoming
    function isUpcomingFlight(flightDate) {
        return new Date(flightDate) >= new Date();
    }
    
    // Format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    }
    
    // Format currency
    function formatCurrency(amount) {
        return '₹' + amount.toLocaleString('en-IN');
    }
    
    // Filter bookings based on tab and current user
    function getFilteredBookings() {
        const currentUser = getCurrentUser();
        
        let filtered = [...allBookings];
        
        // Filter by current user email
        if (currentUser && currentUser.email) {
            filtered = filtered.filter(booking => booking.userEmail === currentUser.email);
        }
        
        // If no user-specific bookings, show demo bookings for testing
        if (filtered.length === 0 && allBookings.length > 0) {
            // Show all bookings if no user match (for testing)
            filtered = [...allBookings];
        }
        
        // Filter by tab
        filtered = filtered.filter(booking => {
            const flight = getFlightById(booking.flightId);
            if (!flight) return false;
            
            if (currentTab === 'upcoming') {
                return booking.status === 'confirmed' && isUpcomingFlight(flight.date);
            } else if (currentTab === 'past') {
                return booking.status === 'confirmed' && !isUpcomingFlight(flight.date);
            } else if (currentTab === 'cancelled') {
                return booking.status === 'cancelled';
            }
            return true;
        });
        
        // Sort by date (most recent first)
        filtered.sort((a, b) => {
            const flightA = getFlightById(a.flightId);
            const flightB = getFlightById(b.flightId);
            if (!flightA || !flightB) return 0;
            return new Date(flightB.date) - new Date(flightA.date);
        });
        
        return filtered;
    }
    
    // Show notification message
    function showNotification(message, isError = false) {
        // Remove existing notifications
        const existing = document.querySelector('.custom-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = 'custom-notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${isError ? '#e74c3c' : '#2ecc71'};
            color: white;
            padding: 12px 20px;
            border-radius: 12px;
            z-index: 1000;
            font-weight: 500;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        `;
        notification.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i> ${message}`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Render bookings
    function renderBookings() {
        const filteredBookings = getFilteredBookings();
        
        if (filteredBookings.length === 0) {
            bookingsListDiv.innerHTML = '';
            emptyStateDiv.style.display = 'block';
            return;
        }
        
        emptyStateDiv.style.display = 'none';
        
        let html = '';
        filteredBookings.forEach(booking => {
            const flight = getFlightById(booking.flightId);
            if (!flight) return;
            
            const isUpcoming = isUpcomingFlight(flight.date);
            const totalAmount = flight.price * booking.passengers.length;
            const statusClass = booking.status === 'confirmed' ? 
                (isUpcoming ? 'status-upcoming' : 'status-past') : 'status-cancelled';
            const statusText = booking.status === 'confirmed' ? 
                (isUpcoming ? 'Upcoming' : 'Completed') : 'Cancelled';
            
            // Generate passenger names
            const passengerNames = booking.passengers.map(p => p.name).join(', ');
            
            html += `
                <div class="booking-card" data-booking-id="${booking.id}">
                    <div class="booking-header">
                        <div class="pnr">
                            <strong>PNR:</strong> ${booking.pnr}
                        </div>
                        <span class="status-badge ${statusClass}">${statusText}</span>
                    </div>
                    
                    <div class="booking-route">
                        <div class="route-details">
                            <div class="from-city">
                                <div class="city-code">${flight.fromCity}</div>
                                <div class="city-name">Departure</div>
                            </div>
                            <div class="route-arrow">
                                <i class="fas fa-plane"></i>
                            </div>
                            <div class="to-city">
                                <div class="city-code">${flight.toCity}</div>
                                <div class="city-name">Arrival</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="booking-details">
                        <div class="detail-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span><strong>Date:</strong> ${formatDate(flight.date)}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <span><strong>Time:</strong> ${flight.time}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-users"></i>
                            <span><strong>Passengers:</strong> ${booking.passengers.length}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-user"></i>
                            <span><strong>Travelers:</strong> ${passengerNames.substring(0, 40)}${passengerNames.length > 40 ? '...' : ''}</span>
                        </div>
                    </div>
                    
                    <div class="booking-footer">
                        <div class="total-amount">
                            Total Amount: <span>${formatCurrency(totalAmount)}</span>
                        </div>
                        <div class="booking-actions">
                            <button class="view-details-btn" onclick="viewBookingDetails('${booking.id}')">
                                <i class="fas fa-eye"></i> View Details
                            </button>
                            ${booking.status === 'confirmed' && isUpcoming ? 
                                `<button class="cancel-btn" onclick="cancelBooking('${booking.id}')">
                                    <i class="fas fa-times"></i> Cancel Booking
                                </button>` : ''
                            }
                        </div>
                    </div>
                </div>
            `;
        });
        
        bookingsListDiv.innerHTML = html;
    }
    
    // View booking details
    window.viewBookingDetails = function(bookingId) {
        const booking = allBookings.find(b => b.id === bookingId);
        if (!booking) return;
        
        const flight = getFlightById(booking.flightId);
        if (!flight) return;
        
        const totalAmount = flight.price * booking.passengers.length;
        let passengersHtml = '';
        booking.passengers.forEach((passenger, index) => {
            passengersHtml += `${index + 1}. ${passenger.name}`;
            if (passenger.age) passengersHtml += ` (Age: ${passenger.age})`;
            if (passenger.gender) passengersHtml += `, ${passenger.gender}`;
            passengersHtml += '\n';
        });
        
        alert(`✈️ BOOKING DETAILS\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📋 PNR: ${booking.pnr}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🛫 FLIGHT INFORMATION\n• Flight: ${flight.flightNo} (${flight.airline})\n• Route: ${flight.fromCity} → ${flight.toCity}\n• Date: ${formatDate(flight.date)}\n• Time: ${flight.time}\n\n👥 PASSENGER DETAILS\n• Total Passengers: ${booking.passengers.length}\n• Passenger List:\n${passengersHtml}\n\n💰 PAYMENT DETAILS\n• Total Amount: ${formatCurrency(totalAmount)}\n\n📌 STATUS: ${booking.status.toUpperCase()}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    };
    
    // Cancel booking
    window.cancelBooking = function(bookingId) {
        const booking = allBookings.find(b => b.id === bookingId);
        if (!booking) return;
        
        const flight = getFlightById(booking.flightId);
        if (!flight) return;
        
        const refundAmount = flight.price * booking.passengers.length;
        refundAmountSpan.textContent = formatCurrency(refundAmount);
        currentCancelBooking = bookingId;
        cancelModal.classList.add('show');
    };
    
    // Confirm cancel booking
    function confirmCancelBooking() {
        if (currentCancelBooking) {
            const bookingIndex = allBookings.findIndex(b => b.id === currentCancelBooking);
            if (bookingIndex !== -1) {
                allBookings[bookingIndex].status = 'cancelled';
                saveBookingsToLocalStorage(allBookings);
                renderBookings();
                showNotification('Booking cancelled successfully!');
            }
        }
        cancelModal.classList.remove('show');
        currentCancelBooking = null;
    }
    
    // Close modal
    function closeCancelModal() {
        cancelModal.classList.remove('show');
        currentCancelBooking = null;
    }
    
    // Switch tab
    function switchTab(tab) {
        currentTab = tab;
        tabBtns.forEach(btn => {
            if (btn.getAttribute('data-tab') === tab) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        renderBookings();
    }
    
    // Load all data
    function loadData() {
        allFlights = getAllFlights();
        allBookings = getAllBookings();
        renderBookings();
    }
    
    // Add animation styles
    function addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
            
            .custom-notification {
                animation: slideInRight 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Event listeners
    function setupEventListeners() {
        // Tab buttons
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                switchTab(btn.getAttribute('data-tab'));
            });
        });
        
        // Modal close buttons
        if (closeModal) closeModal.addEventListener('click', closeCancelModal);
        if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeCancelModal);
        if (confirmCancelBtn) confirmCancelBtn.addEventListener('click', confirmCancelBooking);
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === cancelModal) {
                closeCancelModal();
            }
        });
    }
    
    // Listen for storage changes (when new booking is made)
    window.addEventListener('storage', function(e) {
        if (e.key === 'airline_flights' || e.key === 'user_bookings') {
            loadData();
        }
    });
    
    // Also listen for custom event
    window.addEventListener('bookingsUpdated', function() {
        loadData();
    });
    
    // Initialize
    function init() {
        addAnimationStyles();
        setupEventListeners();
        loadData();
        
        // Log for debugging
        console.log('My Bookings page loaded');
        console.log('Flights:', allFlights.length);
        console.log('Bookings:', allBookings.length);
    }
    
    init();
});