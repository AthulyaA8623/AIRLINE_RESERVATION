// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const tableBody = document.getElementById('tableBody');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    const refreshBtn = document.getElementById('refreshBtn');
    const exportBtn = document.getElementById('exportBtn');
    
    // Modal Elements
    const flightModal = document.getElementById('flightModal');
    const modalBody = document.getElementById('modalBody');
    const modalEditBtn = document.getElementById('modalEditBtn');
    
    // State variables
    let allFlights = [];
    let currentViewingFlight = null;
    
    // Message container
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
    
    // Get bookings for a flight
    function getBookingsForFlight(flightId) {
        const stored = localStorage.getItem("airline_bookings");
        if (!stored) return [];
        try {
            const bookings = JSON.parse(stored);
            return bookings.filter(b => b.flightId === flightId && b.status === 'confirmed');
        } catch (e) {
            return [];
        }
    }
    
    // Calculate occupancy for a flight
    function calculateOccupancy(flight) {
        const bookings = getBookingsForFlight(flight.id);
        const bookedSeats = bookings.reduce((sum, booking) => sum + booking.passengers.length, 0);
        const occupancyPercent = (bookedSeats / flight.seats) * 100;
        return Math.min(100, Math.round(occupancyPercent));
    }
    
    // Check if flight is upcoming
    function isUpcomingFlight(flightDate) {
        return new Date(flightDate) >= new Date();
    }
    
    // Format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    }
    
    // Format time
    function formatTime(timeString) {
        return timeString;
    }
    
    // Format price
    function formatPrice(price) {
        return `₹${price.toLocaleString('en-IN')}`;
    }
    
    // Get filtered and sorted flights
    function getProcessedFlights() {
        let filtered = [...allFlights];
        const searchTerm = searchInput.value.toLowerCase();
        const status = statusFilter.value;
        const sort = sortFilter.value;
        
        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(flight => 
                flight.flightNo.toLowerCase().includes(searchTerm) ||
                flight.airline.toLowerCase().includes(searchTerm) ||
                `${flight.fromCity}→${flight.toCity}`.toLowerCase().includes(searchTerm) ||
                flight.fromCity.toLowerCase().includes(searchTerm) ||
                flight.toCity.toLowerCase().includes(searchTerm)
            );
        }
        
        // Status filter
        if (status === 'upcoming') {
            filtered = filtered.filter(flight => isUpcomingFlight(flight.date));
        } else if (status === 'completed') {
            filtered = filtered.filter(flight => !isUpcomingFlight(flight.date));
        }
        
        // Sort
        if (sort === 'date_asc') {
            filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sort === 'date_desc') {
            filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sort === 'price_asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sort === 'price_desc') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sort === 'flight_asc') {
            filtered.sort((a, b) => a.flightNo.localeCompare(b.flightNo));
        }
        
        return filtered;
    }
    
    // Update stats summary
    function updateStats(flights) {
        const totalFlights = flights.length;
        const upcomingFlights = flights.filter(f => isUpcomingFlight(f.date)).length;
        const totalSeats = flights.reduce((sum, f) => sum + f.seats, 0);
        const avgPrice = flights.length > 0 ? Math.round(flights.reduce((sum, f) => sum + f.price, 0) / flights.length) : 0;
        
        document.getElementById('totalFlights').textContent = totalFlights;
        document.getElementById('upcomingFlights').textContent = upcomingFlights;
        document.getElementById('totalSeats').textContent = totalSeats;
        document.getElementById('avgPrice').innerHTML = `₹${avgPrice.toLocaleString('en-IN')}`;
    }
    
    // Render flights table
    function renderFlights() {
        const processedFlights = getProcessedFlights();
        updateStats(processedFlights);
        
        if (processedFlights.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="9" class="empty-cell">
                        <i class="fas fa-plane-slash"></i><br>
                        No flights found
                    </td>
                </tr>
            `;
            return;
        }
        
        let html = '';
        processedFlights.forEach(flight => {
            const isUpcoming = isUpcomingFlight(flight.date);
            const statusClass = isUpcoming ? 'status-upcoming' : 'status-completed';
            const statusText = isUpcoming ? 'Upcoming' : 'Completed';
            const occupancy = calculateOccupancy(flight);
            
            html += `
                <tr onclick="viewFlightDetails('${flight.id}')" style="cursor: pointer;">
                    <td><strong>${flight.flightNo}</strong></td>
                    <td>${flight.airline}</td>
                    <td>${flight.fromCity} <i class="fas fa-arrow-right"></i> ${flight.toCity}</td>
                    <td>${formatDate(flight.date)}</td>
                    <td>${formatTime(flight.time)}</td>
                    <td>${formatPrice(flight.price)}</td>
                    <td>${flight.seats}</td>
                    <td>
                        <div class="occupancy-container">
                            <div class="occupancy-bar" style="width: ${occupancy}%"></div>
                        </div>
                        <span class="occupancy-text">${occupancy}% booked</span>
                    </td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = html;
    }
    
    // View flight details
    window.viewFlightDetails = function(flightId) {
        const flight = allFlights.find(f => f.id === flightId);
        if (!flight) return;
        
        currentViewingFlight = flight;
        const isUpcoming = isUpcomingFlight(flight.date);
        const occupancy = calculateOccupancy(flight);
        const bookings = getBookingsForFlight(flight.id);
        const bookedSeats = bookings.reduce((sum, b) => sum + b.passengers.length, 0);
        const availableSeats = flight.seats - bookedSeats;
        
        modalBody.innerHTML = `
            <div class="detail-group">
                <div class="detail-label"><i class="fas fa-plane"></i> Flight Information</div>
                <div class="detail-value">
                    <strong>Flight Number:</strong> ${flight.flightNo}<br>
                    <strong>Airline:</strong> ${flight.airline}
                </div>
            </div>
            <div class="detail-group">
                <div class="detail-label"><i class="fas fa-route"></i> Route</div>
                <div class="detail-value">
                    ${flight.fromCity} <i class="fas fa-arrow-right"></i> ${flight.toCity}
                </div>
            </div>
            <div class="detail-group">
                <div class="detail-label"><i class="fas fa-calendar"></i> Schedule</div>
                <div class="detail-value">
                    <strong>Date:</strong> ${formatDate(flight.date)}<br>
                    <strong>Time:</strong> ${flight.time}
                </div>
            </div>
            <div class="detail-group">
                <div class="detail-label"><i class="fas fa-tag"></i> Pricing</div>
                <div class="detail-value">
                    <strong>Price per seat:</strong> ${formatPrice(flight.price)}
                </div>
            </div>
            <div class="detail-group">
                <div class="detail-label"><i class="fas fa-chair"></i> Seat Availability</div>
                <div class="detail-value">
                    <strong>Total Seats:</strong> ${flight.seats}<br>
                    <strong>Booked Seats:</strong> ${bookedSeats}<br>
                    <strong>Available Seats:</strong> ${availableSeats}<br>
                    <strong>Occupancy Rate:</strong> ${occupancy}%
                </div>
            </div>
            <div class="detail-group">
                <div class="detail-label"><i class="fas fa-info-circle"></i> Status</div>
                <div class="detail-value">
                    <span class="status-badge ${isUpcoming ? 'status-upcoming' : 'status-completed'}">
                        ${isUpcoming ? 'Upcoming' : 'Completed'}
                    </span>
                </div>
            </div>
        `;
        
        flightModal.classList.add('show');
    };
    
    // Export to CSV
    function exportToCSV() {
        const processedFlights = getProcessedFlights();
        if (processedFlights.length === 0) {
            showMessage('No data to export!', 'error');
            return;
        }
        
        let csvRows = [];
        csvRows.push(['Flight No', 'Airline', 'From', 'To', 'Date', 'Time', 'Price', 'Total Seats', 'Occupancy %', 'Status']);
        
        processedFlights.forEach(flight => {
            const isUpcoming = isUpcomingFlight(flight.date);
            const occupancy = calculateOccupancy(flight);
            csvRows.push([
                flight.flightNo,
                flight.airline,
                flight.fromCity,
                flight.toCity,
                formatDate(flight.date),
                flight.time,
                flight.price,
                flight.seats,
                occupancy,
                isUpcoming ? 'Upcoming' : 'Completed'
            ]);
        });
        
        const csvContent = csvRows.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `flights_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showMessage('Export completed!', 'success');
    }
    
    // Refresh data
    function refreshData() {
        allFlights = getAllFlights();
        renderFlights();
        showMessage('Flights refreshed!', 'success');
    }
    
    // Modal close handlers
    function setupModalHandlers() {
        // Close modal when clicking X
        const closeBtns = document.querySelectorAll('.close-modal');
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                flightModal.classList.remove('show');
            });
        });
        
        // Close modal when clicking close button
        const closeModalBtn = document.querySelector('.close-modal-btn');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                flightModal.classList.remove('show');
            });
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === flightModal) {
                flightModal.classList.remove('show');
            }
        });
        
        // Edit button in modal
        if (modalEditBtn) {
            modalEditBtn.addEventListener('click', () => {
                if (currentViewingFlight) {
                    flightModal.classList.remove('show');
                    window.location.href = `Updateflight.html?id=${currentViewingFlight.id}`;
                }
            });
        }
    }
    
    // Event listeners
    function setupEventListeners() {
        searchInput.addEventListener('input', renderFlights);
        statusFilter.addEventListener('change', renderFlights);
        sortFilter.addEventListener('change', renderFlights);
        refreshBtn.addEventListener('click', refreshData);
        exportBtn.addEventListener('click', exportToCSV);
    }
    
    // Listen for storage changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'airline_flights' || e.key === 'airline_bookings') {
            allFlights = getAllFlights();
            renderFlights();
        }
    });
    
    // Initialize
    function init() {
        allFlights = getAllFlights();
        renderFlights();
        setupModalHandlers();
        setupEventListeners();
    }
    
    init();
});