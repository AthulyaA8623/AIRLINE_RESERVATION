// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const flightListDiv = document.getElementById('flightList');
    
    // State variables
    let allFlights = [];
    let currentFilter = 'all';
    let searchTerm = '';
    let flightToDelete = null;
    
    // Create message container if not exists
    let messageDiv = document.getElementById('message');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'message';
        document.body.appendChild(messageDiv);
    }
    
    // Helper: Show message
    let messageTimeout = null;
    function showMessage(text, type = 'success') {
        if (messageTimeout) clearTimeout(messageTimeout);
        messageDiv.textContent = text;
        messageDiv.className = `${type}-message`;
        messageTimeout = setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = '';
        }, 3000);
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
    
    // Save flights to localStorage
    function saveFlightsToLocalStorage(flights) {
        localStorage.setItem("airline_flights", JSON.stringify(flights));
        // Trigger storage event for other tabs
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'airline_flights',
            newValue: JSON.stringify(flights)
        }));
    }
    
    // Check if flight has bookings
    function hasBookings(flightId) {
        const bookings = localStorage.getItem("airline_bookings");
        if (!bookings) return false;
        try {
            const bookingsList = JSON.parse(bookings);
            return bookingsList.some(booking => booking.flightId === flightId);
        } catch (e) {
            return false;
        }
    }
    
    // Delete flight by ID
    function deleteFlight(flightId) {
        const flight = allFlights.find(f => f.id === flightId);
        if (!flight) {
            showMessage('Flight not found!', 'error');
            return false;
        }
        
        // Check if flight has bookings
        if (hasBookings(flightId)) {
            showMessage(`Cannot delete ${flight.flightNo}! This flight has existing bookings.`, 'error');
            return false;
        }
        
        // Remove flight
        const updatedFlights = allFlights.filter(f => f.id !== flightId);
        saveFlightsToLocalStorage(updatedFlights);
        allFlights = updatedFlights;
        
        showMessage(`✈️ Flight ${flight.flightNo} deleted successfully!`, 'success');
        renderFlightList();
        return true;
    }
    
    // Format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    }
    
    // Check if flight is upcoming
    function isUpcomingFlight(flightDate) {
        return new Date(flightDate) >= new Date();
    }
    
    // Filter flights based on search and filter
    function getFilteredFlights() {
        let filtered = [...allFlights];
        
        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(flight => 
                flight.flightNo.toLowerCase().includes(term) ||
                flight.airline.toLowerCase().includes(term) ||
                flight.fromCity.toLowerCase().includes(term) ||
                flight.toCity.toLowerCase().includes(term)
            );
        }
        
        // Apply status filter
        if (currentFilter === 'upcoming') {
            filtered = filtered.filter(flight => isUpcomingFlight(flight.date));
        } else if (currentFilter === 'completed') {
            filtered = filtered.filter(flight => !isUpcomingFlight(flight.date));
        }
        
        // Sort by date (most recent first)
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        return filtered;
    }
    
    // Create modal for delete confirmation
    function showDeleteModal(flight) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>Confirm Deletion</h3>
                <p>Are you sure you want to delete flight <strong>${flight.flightNo}</strong> (${flight.fromCity} → ${flight.toCity})?</p>
                <p style="font-size: 0.85rem; color: #e74c3c;">⚠️ This action cannot be undone!</p>
                <div class="modal-buttons">
                    <button class="modal-btn modal-btn-cancel" id="cancelDeleteBtn">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button class="modal-btn modal-btn-confirm" id="confirmDeleteBtn">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.classList.add('show');
        
        // Handle cancel
        document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
            flightToDelete = null;
        });
        
        // Handle confirm
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            deleteFlight(flight.id);
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
            flightToDelete = null;
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
                flightToDelete = null;
            }
        });
    }
    
    // Render flight list
    function renderFlightList() {
        const filteredFlights = getFilteredFlights();
        
        if (filteredFlights.length === 0) {
            flightListDiv.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-plane-slash"></i>
                    <h3>No Flights Found</h3>
                    <p>${allFlights.length === 0 ? 'No flights available. Add some flights first!' : 'No flights match your search criteria.'}</p>
                    ${allFlights.length === 0 ? '<button onclick="window.location.href=\'Addflight.html\'" style="margin-top: 1rem; padding: 10px 24px; background: #1f6e8c; color: white; border: none; border-radius: 40px; cursor: pointer;"><i class="fas fa-plus"></i> Add Flight</button>' : ''}
                </div>
            `;
            return;
        }
        
        // Create search and filter UI
        const flightsHTML = `
            <div class="search-section">
                <div class="search-box">
                    <div class="search-input-wrapper">
                        <i class="fas fa-search"></i>
                        <input type="text" id="searchInput" placeholder="Search by flight number, airline, or route..." value="${searchTerm}">
                    </div>
                    <div class="filter-buttons">
                        <button class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">All Flights</button>
                        <button class="filter-btn ${currentFilter === 'upcoming' ? 'active' : ''}" data-filter="upcoming">Upcoming</button>
                        <button class="filter-btn ${currentFilter === 'completed' ? 'active' : ''}" data-filter="completed">Completed</button>
                    </div>
                </div>
            </div>
            <div class="flight-list-header">
                <h3><i class="fas fa-list"></i> Available Flights</h3>
                <span class="flight-count">${filteredFlights.length} flight${filteredFlights.length !== 1 ? 's' : ''}</span>
            </div>
            <div class="flight-grid" id="flightGrid"></div>
        `;
        
        flightListDiv.innerHTML = flightsHTML;
        
        // Render flight cards
        const flightGrid = document.getElementById('flightGrid');
        let cardsHTML = '';
        
        filteredFlights.forEach(flight => {
            const isUpcoming = isUpcomingFlight(flight.date);
            const hasExistingBookings = hasBookings(flight.id);
            
            cardsHTML += `
                <div class="flight-card" data-flight-id="${flight.id}">
                    <div class="flight-header">
                        <div>
                            <div class="flight-number">
                                <i class="fas fa-plane"></i> ${flight.flightNo}
                            </div>
                            <div class="flight-airline">
                                <i class="fas fa-building"></i> ${flight.airline}
                            </div>
                        </div>
                        <span class="flight-status ${isUpcoming ? 'status-upcoming' : 'status-completed'}">
                            <i class="fas ${isUpcoming ? 'fa-clock' : 'fa-check-circle'}"></i>
                            ${isUpcoming ? 'Upcoming' : 'Completed'}
                        </span>
                    </div>
                    
                    <div class="flight-route">
                        <span class="route-city">${flight.fromCity}</span>
                        <i class="fas fa-plane route-arrow"></i>
                        <span class="route-city">${flight.toCity}</span>
                    </div>
                    
                    <div class="flight-details">
                        <div class="detail-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span><strong>Date:</strong> ${formatDate(flight.date)}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <span><strong>Time:</strong> ${flight.time}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-chair"></i>
                            <span><strong>Seats:</strong> ${flight.seats}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-rupee-sign"></i>
                            <span><strong>Price:</strong> ₹${flight.price.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                    
                    <div class="flight-price">
                        <i class="fas fa-tag"></i> ₹${flight.price.toLocaleString('en-IN')} per seat
                    </div>
                    
                    <button class="delete-btn" data-flight-id="${flight.id}" ${!isUpcoming ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                        <i class="fas fa-trash-alt"></i> 
                        ${!isUpcoming ? 'Cannot Delete (Flight Completed)' : (hasExistingBookings ? 'Has Bookings - Cannot Delete' : 'Delete Flight')}
                    </button>
                </div>
            `;
        });
        
        flightGrid.innerHTML = cardsHTML;
        
        // Attach event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            if (!btn.disabled) {
                btn.addEventListener('click', (e) => {
                    const flightId = btn.getAttribute('data-flight-id');
                    const flight = filteredFlights.find(f => f.id === flightId);
                    if (flight && isUpcomingFlight(flight.date)) {
                        if (hasBookings(flightId)) {
                            showMessage(`Cannot delete ${flight.flightNo}! This flight has existing bookings.`, 'error');
                        } else {
                            showDeleteModal(flight);
                        }
                    }
                });
            }
        });
        
        // Attach search event listener
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchTerm = e.target.value;
                renderFlightList();
            });
        }
        
        // Attach filter button event listeners
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                currentFilter = btn.getAttribute('data-filter');
                renderFlightList();
            });
        });
    }
    
    // Load flights and render
    function loadFlights() {
        allFlights = getAllFlights();
        renderFlightList();
    }
    
    // Listen for storage changes (if flights added from another tab)
    window.addEventListener('storage', function(e) {
        if (e.key === 'airline_flights') {
            loadFlights();
        }
    });
    
    // Initialize
    loadFlights();
});