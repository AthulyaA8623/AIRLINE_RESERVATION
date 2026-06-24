// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const tableBody = document.getElementById('tableBody');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const refreshBtn = document.getElementById('refreshBtn');
    const exportBtn = document.getElementById('exportBtn');
    
    // Modal Elements
    const bookingModal = document.getElementById('bookingModal');
    const cancelModal = document.getElementById('cancelModal');
    const modalBody = document.getElementById('modalBody');
    
    // State variables
    let allBookings = [];
    let allFlights = [];
    let currentCancelBookingId = null;
    
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
    
    // Get all bookings from localStorage
    function getAllBookings() {
        const stored = localStorage.getItem("airline_bookings");
        if (!stored) return [];
        try {
            return JSON.parse(stored);
        } catch (e) {
            return [];
        }
    }
    
    // Save bookings to localStorage
    function saveBookingsToLocalStorage(bookings) {
        localStorage.setItem("airline_bookings", JSON.stringify(bookings));
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'airline_bookings',
            newValue: JSON.stringify(bookings)
        }));
    }
    
    // Generate PNR (already in booking data, but for reference)
    function generatePNR() {
        return 'PNR' + Math.random().toString(36).substring(2, 10).toUpperCase();
    }
    
    // Get flight by ID
    function getFlightById(flightId) {
        return allFlights.find(f => f.id === flightId);
    }
    
    // Filter bookings based on search and filters
    function getFilteredBookings() {
        let filtered = [...allBookings];
        const searchTerm = searchInput.value.toLowerCase();
        const status = statusFilter.value;
        const dateRange = dateFilter.value;
        
        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(booking => {
                const flight = getFlightById(booking.flightId);
                return booking.pnr.toLowerCase().includes(searchTerm) ||
                       (flight && flight.flightNo.toLowerCase().includes(searchTerm)) ||
                       (flight && `${flight.fromCity}→${flight.toCity}`.toLowerCase().includes(searchTerm)) ||
                       booking.passengers.some(p => p.name.toLowerCase().includes(searchTerm));
            });
        }
        
        // Status filter
        if (status !== 'all') {
            filtered = filtered.filter(booking => booking.status === status);
        }
        
        // Date filter
        if (dateRange !== 'all') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            filtered = filtered.filter(booking => {
                const flight = getFlightById(booking.flightId);
                if (!flight) return false;
                const flightDate = new Date(flight.date);
                flightDate.setHours(0, 0, 0, 0);
                
                if (dateRange === 'today') {
                    return flightDate.getTime() === today.getTime();
                } else if (dateRange === 'tomorrow') {
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    return flightDate.getTime() === tomorrow.getTime();
                } else if (dateRange === 'week') {
                    const weekEnd = new Date(today);
                    weekEnd.setDate(weekEnd.getDate() + 7);
                    return flightDate >= today && flightDate <= weekEnd;
                } else if (dateRange === 'month') {
                    const monthEnd = new Date(today);
                    monthEnd.setMonth(monthEnd.getMonth() + 1);
                    return flightDate >= today && flightDate <= monthEnd;
                }
                return true;
            });
        }
        
        return filtered;
    }
    
    // Update stats summary
    function updateStats(bookings) {
        const totalBookings = bookings.length;
        let totalPassengers = 0;
        let totalRevenue = 0;
        let confirmedCount = 0;
        
        bookings.forEach(booking => {
            totalPassengers += booking.passengers.length;
            const flight = getFlightById(booking.flightId);
            if (flight && booking.status === 'confirmed') {
                totalRevenue += flight.price * booking.passengers.length;
            }
            if (booking.status === 'confirmed') {
                confirmedCount++;
            }
        });
        
        document.getElementById('totalBookings').textContent = totalBookings;
        document.getElementById('totalPassengers').textContent = totalPassengers;
        document.getElementById('totalRevenue').innerHTML = `₹${totalRevenue.toLocaleString('en-IN')}`;
        document.getElementById('confirmedCount').textContent = confirmedCount;
    }
    
    // Format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    }
    
    // Render bookings table
    function renderBookings() {
        const filteredBookings = getFilteredBookings();
        updateStats(filteredBookings);
        
        if (filteredBookings.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="empty-cell">
                        <i class="fas fa-calendar-times"></i><br>
                        No bookings found
                    </td>
                </tr>
            `;
            return;
        }
        
        let html = '';
        filteredBookings.forEach(booking => {
            const flight = getFlightById(booking.flightId);
            if (!flight) return;
            
            const totalAmount = flight.price * booking.passengers.length;
            const statusClass = booking.status === 'confirmed' ? 'status-confirmed' : 
                               booking.status === 'cancelled' ? 'status-cancelled' : 'status-checked-in';
            const statusText = booking.status === 'confirmed' ? 'Confirmed' :
                              booking.status === 'cancelled' ? 'Cancelled' : 'Checked In';
            
            html += `
                <tr>
                    <td><strong>${booking.pnr}</strong></td>
                    <td>${flight.flightNo}<br><small>${flight.airline}</small></td>
                    <td>${flight.fromCity} <i class="fas fa-arrow-right"></i> ${flight.toCity}</td>
                    <td>${formatDate(flight.date)}<br><small>${flight.time}</small></td>
                    <td>${booking.passengers.length} passenger(s)</td>
                    <td>₹${totalAmount.toLocaleString('en-IN')}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn-sm btn-view" onclick="viewBookingDetails('${booking.id}')">
                                <i class="fas fa-eye"></i> View
                            </button>
                            ${booking.status === 'confirmed' ? 
                                `<button class="action-btn-sm btn-cancel" onclick="cancelBooking('${booking.id}')">
                                    <i class="fas fa-times"></i> Cancel
                                </button>` : ''
                            }
                        </div>
                    </td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = html;
    }
    
    // View booking details
    window.viewBookingDetails = function(bookingId) {
        const booking = allBookings.find(b => b.id === bookingId);
        if (!booking) return;
        
        const flight = getFlightById(booking.flightId);
        if (!flight) return;
        
        const totalAmount = flight.price * booking.passengers.length;
        
        let passengersHtml = '<ul class="passenger-list">';
        booking.passengers.forEach((passenger, index) => {
            passengersHtml += `<li>${index + 1}. ${passenger.name} ${passenger.age ? `(Age: ${passenger.age})` : ''} ${passenger.gender ? `- ${passenger.gender}` : ''}</li>`;
        });
        passengersHtml += '</ul>';
        
        modalBody.innerHTML = `
            <div class="detail-group">
                <div class="detail-label"><i class="fas fa-barcode"></i> PNR Number</div>
                <div class="detail-value"><strong>${booking.pnr}</strong></div>
            </div>
            <div class="detail-group">
                <div class="detail-label"><i class="fas fa-plane"></i> Flight Details</div>
                <div class="detail-value">
                    ${flight.flightNo} - ${flight.airline}<br>
                    ${flight.fromCity} → ${flight.toCity}<br>
                    Date: ${formatDate(flight.date)} | Time: ${flight.time}
                </div>
            </div>
            <div class="detail-group">
                <div class="detail-label"><i class="fas fa-users"></i> Passenger Details</div>
                <div class="detail-value">${passengersHtml}</div>
            </div>
            <div class="detail-group">
                <div class="detail-label"><i class="fas fa-rupee-sign"></i> Payment Details</div>
                <div class="detail-value">
                    Price per seat: ₹${flight.price.toLocaleString('en-IN')}<br>
                    Total Passengers: ${booking.passengers.length}<br>
                    <strong>Total Amount: ₹${totalAmount.toLocaleString('en-IN')}</strong>
                </div>
            </div>
            <div class="detail-group">
                <div class="detail-label"><i class="fas fa-info-circle"></i> Booking Status</div>
                <div class="detail-value">
                    <span class="status-badge ${booking.status === 'confirmed' ? 'status-confirmed' : booking.status === 'cancelled' ? 'status-cancelled' : 'status-checked-in'}">
                        ${booking.status === 'confirmed' ? 'Confirmed' : booking.status === 'cancelled' ? 'Cancelled' : 'Checked In'}
                    </span>
                    <br><small>Booked on: ${new Date(booking.bookingDate).toLocaleString()}</small>
                </div>
            </div>
        `;
        
        bookingModal.classList.add('show');
    };
    
    // Cancel booking
    window.cancelBooking = function(bookingId) {
        currentCancelBookingId = bookingId;
        cancelModal.classList.add('show');
    };
    
    // Confirm cancel booking
    function confirmCancelBooking() {
        if (currentCancelBookingId) {
            const bookingIndex = allBookings.findIndex(b => b.id === currentCancelBookingId);
            if (bookingIndex !== -1) {
                allBookings[bookingIndex].status = 'cancelled';
                saveBookingsToLocalStorage(allBookings);
                showMessage('Booking cancelled successfully!', 'success');
                loadBookings();
            }
        }
        cancelModal.classList.remove('show');
        currentCancelBookingId = null;
    }
    
    // Export to CSV
    function exportToCSV() {
        const filteredBookings = getFilteredBookings();
        if (filteredBookings.length === 0) {
            showMessage('No data to export!', 'error');
            return;
        }
        
        let csvRows = [];
        csvRows.push(['PNR', 'Flight No', 'Airline', 'Route', 'Date', 'Time', 'Passengers', 'Total Amount', 'Status']);
        
        filteredBookings.forEach(booking => {
            const flight = getFlightById(booking.flightId);
            if (flight) {
                const totalAmount = flight.price * booking.passengers.length;
                csvRows.push([
                    booking.pnr,
                    flight.flightNo,
                    flight.airline,
                    `${flight.fromCity} → ${flight.toCity}`,
                    formatDate(flight.date),
                    flight.time,
                    booking.passengers.length,
                    totalAmount,
                    booking.status
                ]);
            }
        });
        
        const csvContent = csvRows.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bookings_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showMessage('Export completed!', 'success');
    }
    
    // Load all data
    function loadBookings() {
        allFlights = getAllFlights();
        allBookings = getAllBookings();
        renderBookings();
    }
    
    // Refresh data
    function refreshData() {
        loadBookings();
        showMessage('Data refreshed!', 'success');
    }
    
    // Seed demo bookings if none exist
    function seedDemoBookings() {
        const existingBookings = getAllBookings();
        if (existingBookings.length === 0) {
            const flights = getAllFlights();
            if (flights.length > 0) {
                const demoBookings = [];
                const demoPassengers = [
                    [{ name: "Rajesh Kumar", age: 35, gender: "Male" }],
                    [{ name: "Priya Sharma", age: 28, gender: "Female" }, { name: "Aarav Sharma", age: 5, gender: "Male" }],
                    [{ name: "Amit Patel", age: 42, gender: "Male" }, { name: "Sneha Patel", age: 38, gender: "Female" }],
                    [{ name: "Neha Singh", age: 25, gender: "Female" }]
                ];
                
                flights.slice(0, 3).forEach((flight, index) => {
                    const booking = {
                        id: `booking_${Date.now()}_${index}`,
                        pnr: `PNR${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
                        flightId: flight.id,
                        passengers: demoPassengers[index % demoPassengers.length],
                        status: 'confirmed',
                        bookingDate: new Date().toISOString()
                    };
                    demoBookings.push(booking);
                });
                
                saveBookingsToLocalStorage(demoBookings);
            }
        }
    }
    
    // Modal close handlers
    function setupModalHandlers() {
        // Close modals when clicking X
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', function() {
                bookingModal.classList.remove('show');
                cancelModal.classList.remove('show');
            });
        });
        
        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === bookingModal) bookingModal.classList.remove('show');
            if (e.target === cancelModal) cancelModal.classList.remove('show');
        });
        
        // Cancel modal buttons
        const cancelNoBtn = document.getElementById('cancelNoBtn');
        const cancelYesBtn = document.getElementById('cancelYesBtn');
        
        if (cancelNoBtn) {
            cancelNoBtn.addEventListener('click', () => {
                cancelModal.classList.remove('show');
                currentCancelBookingId = null;
            });
        }
        
        if (cancelYesBtn) {
            cancelYesBtn.addEventListener('click', confirmCancelBooking);
        }
    }
    
    // Event listeners
    function setupEventListeners() {
        searchInput.addEventListener('input', renderBookings);
        statusFilter.addEventListener('change', renderBookings);
        dateFilter.addEventListener('change', renderBookings);
        refreshBtn.addEventListener('click', refreshData);
        exportBtn.addEventListener('click', exportToCSV);
    }
    
    // Listen for storage changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'airline_flights' || e.key === 'airline_bookings') {
            loadBookings();
        }
    });
    
    // Initialize
    function init() {
        seedDemoBookings();
        loadBookings();
        setupModalHandlers();
        setupEventListeners();
    }
    
    init();
});