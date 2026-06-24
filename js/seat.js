// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const flightSelect = document.getElementById('flightSelect');
    const flightInfo = document.getElementById('flightInfo');
    const seatListDiv = document.getElementById('seatList');
    
    // State variables
    let allFlights = [];
    let currentFlight = null;
    let seatMap = [];
    let selectedSeats = [];
    
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
    
    // Get seat configuration for a flight
    function getSeatConfig(flightId) {
        const stored = localStorage.getItem(`seat_config_${flightId}`);
        if (!stored) return null;
        try {
            return JSON.parse(stored);
        } catch (e) {
            return null;
        }
    }
    
    // Save seat configuration
    function saveSeatConfig(flightId, config) {
        localStorage.setItem(`seat_config_${flightId}`, JSON.stringify(config));
    }
    
    // Get booked seats from bookings
    function getBookedSeats(flightId) {
        const bookings = localStorage.getItem("airline_bookings");
        if (!bookings) return [];
        try {
            const bookingsList = JSON.parse(bookings);
            const flightBookings = bookingsList.filter(b => b.flightId === flightId);
            const bookedSeats = [];
            flightBookings.forEach(booking => {
                if (booking.seatNumbers) {
                    bookedSeats.push(...booking.seatNumbers);
                }
            });
            return bookedSeats;
        } catch (e) {
            return [];
        }
    }
    
    // Initialize seat map for a flight
    function initializeSeatMap(flight) {
        const existingConfig = getSeatConfig(flight.id);
        const bookedSeats = getBookedSeats(flight.id);
        
        if (existingConfig) {
            seatMap = existingConfig.map(seat => ({
                ...seat,
                isBooked: bookedSeats.includes(seat.id)
            }));
        } else {
            // Create default seat layout
            const rows = Math.ceil(flight.seats / 6);
            const seats = [];
            let seatCounter = 1;
            
            for (let row = 1; row <= rows; row++) {
                const rowLetter = String.fromCharCode(64 + row);
                for (let col = 1; col <= 6; col++) {
                    if (seatCounter <= flight.seats) {
                        const seatId = `${rowLetter}${col}`;
                        seats.push({
                            id: seatId,
                            row: row,
                            column: col,
                            rowLetter: rowLetter,
                            number: seatCounter,
                            isBooked: bookedSeats.includes(seatId),
                            isSelected: false
                        });
                        seatCounter++;
                    }
                }
            }
            seatMap = seats;
            saveSeatConfig(flight.id, seatMap);
        }
        
        selectedSeats = [];
        return seatMap;
    }
    
    // Render flight selector options
    function renderFlightSelector() {
        allFlights = getAllFlights();
        
        let options = '<option value="">-- Select a Flight --</option>';
        allFlights.forEach(flight => {
            options += `<option value="${flight.id}">${flight.flightNo} - ${flight.fromCity} → ${flight.toCity} (${flight.date})</option>`;
        });
        
        flightSelect.innerHTML = options;
    }
    
    // Render flight info
    function renderFlightInfo() {
        if (!currentFlight) {
            flightInfo.innerHTML = '';
            return;
        }
        
        const totalSeats = seatMap.length;
        const bookedSeats = seatMap.filter(s => s.isBooked).length;
        const availableSeats = totalSeats - bookedSeats;
        const occupancyRate = totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0;
        
        flightInfo.innerHTML = `
            <div class="flight-info-item">
                <i class="fas fa-plane"></i>
                <span><strong>Flight:</strong> ${currentFlight.flightNo}</span>
            </div>
            <div class="flight-info-item">
                <i class="fas fa-building"></i>
                <span><strong>Airline:</strong> ${currentFlight.airline}</span>
            </div>
            <div class="flight-info-item">
                <i class="fas fa-route"></i>
                <span><strong>Route:</strong> ${currentFlight.fromCity} → ${currentFlight.toCity}</span>
            </div>
            <div class="flight-info-item">
                <i class="fas fa-calendar"></i>
                <span><strong>Date:</strong> ${formatDate(currentFlight.date)}</span>
            </div>
            <div class="flight-info-item">
                <i class="fas fa-clock"></i>
                <span><strong>Time:</strong> ${currentFlight.time}</span>
            </div>
            <div class="flight-info-item">
                <i class="fas fa-chart-pie"></i>
                <span><strong>Occupancy:</strong> ${occupancyRate}% (${bookedSeats}/${totalSeats})</span>
            </div>
        `;
    }
    
    // Format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    }
    
    // Render seat map
    function renderSeatMap() {
        if (!currentFlight || seatMap.length === 0) {
            seatListDiv.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-chair"></i>
                    <h3>No Flight Selected</h3>
                    <p>Please select a flight from the dropdown above to manage seats.</p>
                </div>
            `;
            return;
        }
        
        const totalSeats = seatMap.length;
        const bookedSeats = seatMap.filter(s => s.isBooked).length;
        const availableSeats = totalSeats - bookedSeats;
        const selectedCount = selectedSeats.length;
        
        // Group seats by row
        const seatsByRow = {};
        seatMap.forEach(seat => {
            if (!seatsByRow[seat.row]) {
                seatsByRow[seat.row] = [];
            }
            seatsByRow[seat.row].push(seat);
        });
        
        let seatGridHTML = '';
        for (let row in seatsByRow) {
            seatGridHTML += '<div class="seat-row">';
            seatsByRow[row].forEach(seat => {
                let seatClass = '';
                if (seat.isBooked) {
                    seatClass = 'booked';
                } else if (selectedSeats.includes(seat.id)) {
                    seatClass = 'selected';
                } else {
                    seatClass = 'available';
                }
                
                seatGridHTML += `
                    <div class="seat ${seatClass}" data-seat-id="${seat.id}" data-seat-number="${seat.id}">
                        <i class="fas fa-chair"></i>
                        <span>${seat.id}</span>
                    </div>
                `;
            });
            seatGridHTML += '</div>';
        }
        
        const html = `
            <div class="seat-map-container">
                <div class="seat-header">
                    <h2><i class="fas fa-map"></i> Seat Map - ${currentFlight.flightNo}</h2>
                    <div class="seat-stats">
                        <div class="stat-badge">
                            <i class="fas fa-check-circle stat-badge-available"></i>
                            <span>Available: ${availableSeats}</span>
                        </div>
                        <div class="stat-badge">
                            <i class="fas fa-times-circle stat-badge-booked"></i>
                            <span>Booked: ${bookedSeats}</span>
                        </div>
                        <div class="stat-badge">
                            <i class="fas fa-star stat-badge-selected"></i>
                            <span>Selected: ${selectedCount}</span>
                        </div>
                    </div>
                </div>
                
                <div class="legend">
                    <div class="legend-item">
                        <div class="legend-color available"></div>
                        <span>Available Seat</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color booked"></div>
                        <span>Booked Seat</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color selected"></div>
                        <span>Selected Seat</span>
                    </div>
                </div>
                
                <div class="seat-grid">
                    ${seatGridHTML}
                </div>
                
                <div class="action-panel">
                    <button class="action-btn action-btn-primary" id="updateSeatsBtn">
                        <i class="fas fa-save"></i> Update Seat Configuration
                    </button>
                    <button class="action-btn action-btn-secondary" id="resetSelectionBtn">
                        <i class="fas fa-undo-alt"></i> Reset Selection
                    </button>
                    <button class="action-btn action-btn-danger" id="resetAllSeatsBtn">
                        <i class="fas fa-sync-alt"></i> Reset All Seats
                    </button>
                </div>
            </div>
        `;
        
        seatListDiv.innerHTML = html;
        
        // Attach seat click events
        document.querySelectorAll('.seat.available, .seat.selected').forEach(seatElement => {
            seatElement.addEventListener('click', (e) => {
                e.stopPropagation();
                const seatId = seatElement.getAttribute('data-seat-id');
                toggleSeatSelection(seatId);
            });
        });
        
        // Attach button events
        const updateBtn = document.getElementById('updateSeatsBtn');
        const resetSelectionBtn = document.getElementById('resetSelectionBtn');
        const resetAllBtn = document.getElementById('resetAllSeatsBtn');
        
        if (updateBtn) updateBtn.addEventListener('click', updateSeatConfiguration);
        if (resetSelectionBtn) resetSelectionBtn.addEventListener('click', resetSelection);
        if (resetAllBtn) resetAllBtn.addEventListener('click', resetAllSeats);
    }
    
    // Toggle seat selection
    function toggleSeatSelection(seatId) {
        const seat = seatMap.find(s => s.id === seatId);
        if (!seat || seat.isBooked) return;
        
        const index = selectedSeats.indexOf(seatId);
        if (index === -1) {
            selectedSeats.push(seatId);
        } else {
            selectedSeats.splice(index, 1);
        }
        
        renderSeatMap();
    }
    
    // Update seat configuration (mark selected seats as booked)
    function updateSeatConfiguration() {
        if (selectedSeats.length === 0) {
            showMessage('No seats selected to update!', 'info');
            return;
        }
        
        // Update seat map
        selectedSeats.forEach(seatId => {
            const seat = seatMap.find(s => s.id === seatId);
            if (seat && !seat.isBooked) {
                seat.isBooked = true;
            }
        });
        
        // Save to localStorage
        saveSeatConfig(currentFlight.id, seatMap);
        
        // Clear selection
        selectedSeats = [];
        
        // Re-render
        renderSeatMap();
        renderFlightInfo();
        
        showMessage(`✅ Successfully updated ${selectedSeats.length} seat(s)!`, 'success');
    }
    
    // Reset selection (clear selected seats)
    function resetSelection() {
        if (selectedSeats.length === 0) {
            showMessage('No seats selected to reset!', 'info');
            return;
        }
        
        selectedSeats = [];
        renderSeatMap();
        showMessage('Selection reset successfully!', 'success');
    }
    
    // Reset all seats (make all seats available)
    function resetAllSeats() {
        if (confirm('⚠️ WARNING: This will reset ALL seats to available status. This action cannot be undone! Are you sure?')) {
            seatMap.forEach(seat => {
                seat.isBooked = false;
            });
            selectedSeats = [];
            saveSeatConfig(currentFlight.id, seatMap);
            renderSeatMap();
            renderFlightInfo();
            showMessage('All seats have been reset to available!', 'success');
        }
    }
    
    // Load flight data
    function loadFlight(flightId) {
        currentFlight = allFlights.find(f => f.id === flightId);
        
        if (!currentFlight) {
            seatListDiv.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-chair"></i>
                    <h3>No Flight Selected</h3>
                    <p>Please select a flight from the dropdown above to manage seats.</p>
                </div>
            `;
            flightInfo.innerHTML = '';
            return;
        }
        
        initializeSeatMap(currentFlight);
        renderSeatMap();
        renderFlightInfo();
    }
    
    // Handle flight selection change
    function handleFlightChange() {
        const flightId = flightSelect.value;
        if (flightId) {
            loadFlight(flightId);
        } else {
            currentFlight = null;
            seatMap = [];
            selectedSeats = [];
            renderSeatMap();
            renderFlightInfo();
        }
    }
    
    // Seed demo seat configurations if needed
    function seedDemoData() {
        const flights = getAllFlights();
        flights.forEach(flight => {
            const existingConfig = getSeatConfig(flight.id);
            if (!existingConfig) {
                const bookedSeats = getBookedSeats(flight.id);
                const rows = Math.ceil(flight.seats / 6);
                const seats = [];
                let seatCounter = 1;
                
                for (let row = 1; row <= rows; row++) {
                    const rowLetter = String.fromCharCode(64 + row);
                    for (let col = 1; col <= 6; col++) {
                        if (seatCounter <= flight.seats) {
                            const seatId = `${rowLetter}${col}`;
                            seats.push({
                                id: seatId,
                                row: row,
                                column: col,
                                rowLetter: rowLetter,
                                number: seatCounter,
                                isBooked: bookedSeats.includes(seatId),
                                isSelected: false
                            });
                            seatCounter++;
                        }
                    }
                }
                saveSeatConfig(flight.id, seats);
            }
        });
    }
    
    // Listen for storage changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'airline_flights' || e.key === 'airline_bookings') {
            allFlights = getAllFlights();
            renderFlightSelector();
            if (currentFlight) {
                const stillExists = allFlights.find(f => f.id === currentFlight.id);
                if (stillExists) {
                    initializeSeatMap(currentFlight);
                    renderSeatMap();
                    renderFlightInfo();
                } else {
                    flightSelect.value = '';
                    handleFlightChange();
                }
            }
        }
    });
    
    // Initialize
    function init() {
        renderFlightSelector();
        seedDemoData();
        flightSelect.addEventListener('change', handleFlightChange);
    }
    
    init();
});