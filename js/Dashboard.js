// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
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

    // Get all bookings from localStorage (if exists)
    function getAllBookings() {
        const stored = localStorage.getItem("airline_bookings");
        if (!stored) return [];
        try {
            return JSON.parse(stored);
        } catch (e) {
            return [];
        }
    }

    // Calculate total revenue from bookings
    function calculateTotalRevenue(flights, bookings) {
        let totalRevenue = 0;
        bookings.forEach(booking => {
            const flight = flights.find(f => f.id === booking.flightId);
            if (flight) {
                totalRevenue += flight.price * booking.seatsBooked;
            }
        });
        return totalRevenue;
    }

    // Calculate occupancy rate
    function calculateOccupancyRate(flights) {
        if (flights.length === 0) return 0;
        let totalSeats = 0;
        let totalBookedSeats = 0;
        
        flights.forEach(flight => {
            totalSeats += flight.seats;
            // Assuming some bookings exist, you can track booked seats
            // For demo, let's assume 70% occupancy average
            totalBookedSeats += Math.floor(flight.seats * 0.7);
        });
        
        return Math.round((totalBookedSeats / totalSeats) * 100);
    }

    // Generate stats cards
    function generateStatsCards() {
        const flights = getAllFlights();
        const bookings = getAllBookings();
        const statsGrid = document.getElementById('statsGrid');
        
        // Calculate statistics
        const totalFlights = flights.length;
        const activeFlights = flights.filter(f => new Date(f.date) >= new Date()).length;
        const totalBookings = bookings.length;
        const totalRevenue = calculateTotalRevenue(flights, bookings);
        const occupancyRate = calculateOccupancyRate(flights);
        
        // Create stats cards HTML
        const statsHTML = `
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-plane"></i>
                </div>
                <div class="stat-info">
                    <h3>Total Flights</h3>
                    <div class="stat-number">${totalFlights}</div>
                    <div class="stat-trend ${activeFlights > 0 ? 'trend-up' : 'trend-down'}">
                        <i class="fas ${activeFlights > 0 ? 'fa-arrow-up' : 'fa-arrow-down'}"></i>
                        <span>${activeFlights} Active Flights</span>
                    </div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-ticket-alt"></i>
                </div>
                <div class="stat-info">
                    <h3>Total Bookings</h3>
                    <div class="stat-number">${totalBookings}</div>
                    <div class="stat-trend trend-up">
                        <i class="fas fa-arrow-up"></i>
                        <span>+12% this month</span>
                    </div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-rupee-sign"></i>
                </div>
                <div class="stat-info">
                    <h3>Total Revenue</h3>
                    <div class="stat-number">₹${totalRevenue.toLocaleString('en-IN')}</div>
                    <div class="stat-trend trend-up">
                        <i class="fas fa-arrow-up"></i>
                        <span>+8% vs last month</span>
                    </div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-chart-pie"></i>
                </div>
                <div class="stat-info">
                    <h3>Occupancy Rate</h3>
                    <div class="stat-number">${occupancyRate}%</div>
                    <div class="stat-trend ${occupancyRate > 65 ? 'trend-up' : 'trend-down'}">
                        <i class="fas ${occupancyRate > 65 ? 'fa-arrow-up' : 'fa-arrow-down'}"></i>
                        <span>${occupancyRate > 65 ? 'Above average' : 'Needs improvement'}</span>
                    </div>
                </div>
            </div>
        `;
        
        statsGrid.innerHTML = statsHTML;
    }

    // Display recent flights in table
    function displayRecentFlights() {
        const flights = getAllFlights();
        const tbody = document.getElementById('recentFlightsBody');
        
        if (flights.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data"><i class="fas fa-info-circle"></i> No flights available. Add your first flight!</td></tr>';
            return;
        }
        
        // Sort flights by date (most recent first) and get last 5
        const recentFlights = [...flights]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        
        let tableHTML = '';
        recentFlights.forEach(flight => {
            const flightDate = new Date(flight.date);
            const today = new Date();
            const isPast = flightDate < today;
            
            tableHTML += `
                <tr>
                    <td><strong>${flight.flightNo}</strong></td>
                    <td>${flight.airline}</td>
                    <td>${flight.fromCity} <i class="fas fa-arrow-right route-arrow"></i> ${flight.toCity}</td>
                    <td>${formatDate(flight.date)}</td>
                    <td>${flight.time}</td>
                    <td>₹${flight.price.toLocaleString('en-IN')}</td>
                    <td>
                        <span class="status-badge ${isPast ? 'status-delayed' : 'status-on-time'}">
                            ${isPast ? 'Completed' : `${flight.seats} seats`}
                        </span>
                    </td>
                </tr>
            `;
        });
        
        tbody.innerHTML = tableHTML;
    }

    // Helper function to format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    }

    // Seed demo data if no flights exist
    function seedDemoDataIfNeeded() {
        const flights = getAllFlights();
        
        if (flights.length === 0) {
            const demoFlights = [
                {
                    id: "demo1-" + Date.now(),
                    flightNo: "AI101",
                    airline: "Air India",
                    fromCity: "Delhi",
                    toCity: "Mumbai",
                    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                    time: "08:30",
                    price: 5500,
                    seats: 120,
                    createdAt: new Date().toISOString()
                },
                {
                    id: "demo2-" + (Date.now() + 1000),
                    flightNo: "6E204",
                    airline: "IndiGo",
                    fromCity: "Bangalore",
                    toCity: "Goa",
                    date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
                    time: "14:20",
                    price: 3890,
                    seats: 180,
                    createdAt: new Date().toISOString()
                },
                {
                    id: "demo3-" + (Date.now() + 2000),
                    flightNo: "SG815",
                    airline: "SpiceJet",
                    fromCity: "Chennai",
                    toCity: "Hyderabad",
                    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                    time: "18:45",
                    price: 3200,
                    seats: 150,
                    createdAt: new Date().toISOString()
                },
                {
                    id: "demo4-" + (Date.now() + 3000),
                    flightNo: "UK955",
                    airline: "Vistara",
                    fromCity: "Mumbai",
                    toCity: "Delhi",
                    date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
                    time: "21:15",
                    price: 6200,
                    seats: 140,
                    createdAt: new Date().toISOString()
                }
            ];
            
            localStorage.setItem("airline_flights", JSON.stringify(demoFlights));
        }
        
        // Seed demo bookings if none exist
        const bookings = getAllBookings();
        if (bookings.length === 0) {
            const flightsList = getAllFlights();
            if (flightsList.length > 0) {
                const demoBookings = [
                    {
                        id: "booking1-" + Date.now(),
                        flightId: flightsList[0].id,
                        passengerName: "Rajesh Kumar",
                        seatsBooked: 2,
                        bookingDate: new Date().toISOString()
                    },
                    {
                        id: "booking2-" + (Date.now() + 1000),
                        flightId: flightsList[1].id,
                        passengerName: "Priya Sharma",
                        seatsBooked: 1,
                        bookingDate: new Date().toISOString()
                    }
                ];
                localStorage.setItem("airline_bookings", JSON.stringify(demoBookings));
            }
        }
    }

    // Refresh dashboard data
    function refreshDashboard() {
        generateStatsCards();
        displayRecentFlights();
    }

    // Listen for storage changes (if flights added from another tab)
    window.addEventListener('storage', function(e) {
        if (e.key === 'airline_flights' || e.key === 'airline_bookings') {
            refreshDashboard();
        }
    });

    // Initialize dashboard
    function init() {
        seedDemoDataIfNeeded();
        refreshDashboard();
    }

    init();
});