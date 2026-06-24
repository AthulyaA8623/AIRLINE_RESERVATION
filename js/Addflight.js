// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // ----- DOM elements -----
    const flightNoInput = document.getElementById('flightNo');
    const airlineInput = document.getElementById('airline');
    const fromCityInput = document.getElementById('fromCity');
    const toCityInput = document.getElementById('toCity');
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    const priceInput = document.getElementById('price');
    const seatsInput = document.getElementById('seats');
    const addBtn = document.getElementById('addBtn');
    const messageDiv = document.getElementById('message');

    // Preview elements
    const previewContainer = document.getElementById('previewContainer');
    const previewFlightNoSpan = document.getElementById('previewFlightNo');
    const previewRouteSpan = document.getElementById('previewRoute');
    const previewDateTimeSpan = document.getElementById('previewDateTime');
    const previewPriceSpan = document.getElementById('previewPrice');
    const previewSeatsSpan = document.getElementById('previewSeats');
    const clearPreviewBtn = document.getElementById('clearPreviewBtn');

    // Helper: show temporary message
    let messageTimeout = null;

    function showMessage(text, isError = false) {
        if (messageTimeout) clearTimeout(messageTimeout);
        messageDiv.textContent = text;
        messageDiv.className = isError ? 'error-message' : 'success-message';
        messageTimeout = setTimeout(() => {
            if (messageDiv) {
                messageDiv.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    messageDiv.textContent = '';
                    messageDiv.className = '';
                    messageDiv.style.animation = '';
                }, 300);
            }
        }, 4000);
    }

    // Helper: validate all fields
    function getValidatedFlightData() {
        const flightNo = flightNoInput.value.trim();
        const airline = airlineInput.value.trim();
        const fromCity = fromCityInput.value.trim();
        const toCity = toCityInput.value.trim();
        const date = dateInput.value;
        const time = timeInput.value;
        let price = priceInput.value.trim();
        let seats = seatsInput.value.trim();

        // Validations
        if (!flightNo) {
            showMessage("❌ Flight Number is required.", true);
            flightNoInput.focus();
            return null;
        }
        if (flightNo.length < 2) {
            showMessage("❌ Flight Number must be at least 2 characters.", true);
            flightNoInput.focus();
            return null;
        }
        if (!airline) {
            showMessage("❌ Airline name is required.", true);
            airlineInput.focus();
            return null;
        }
        if (!fromCity) {
            showMessage("❌ Origin city (From) is required.", true);
            fromCityInput.focus();
            return null;
        }
        if (!toCity) {
            showMessage("❌ Destination city (To) is required.", true);
            toCityInput.focus();
            return null;
        }
        if (fromCity.toLowerCase() === toCity.toLowerCase()) {
            showMessage("⚠️ Origin and destination cannot be the same city.", true);
            return null;
        }
        if (!date) {
            showMessage("❌ Please select departure date.", true);
            dateInput.focus();
            return null;
        }
        if (!time) {
            showMessage("❌ Please select departure time.", true);
            timeInput.focus();
            return null;
        }
        
        const priceNum = parseFloat(price);
        if (isNaN(priceNum) || priceNum <= 0) {
            showMessage("⚠️ Price must be a positive number (₹).", true);
            priceInput.focus();
            return null;
        }
        if (priceNum > 1000000) {
            showMessage("⚠️ Price seems too high! Maximum is ₹10,00,000.", true);
            priceInput.focus();
            return null;
        }
        
        const seatsNum = parseInt(seats, 10);
        if (isNaN(seatsNum) || seatsNum < 1 || seatsNum > 500) {
            showMessage("⚠️ Available seats must be between 1 and 500.", true);
            seatsInput.focus();
            return null;
        }

        return {
            flightNo: flightNo.toUpperCase(),
            airline: airline,
            fromCity: fromCity,
            toCity: toCity,
            date: date,
            time: time,
            price: priceNum,
            seats: seatsNum
        };
    }

    // LocalStorage functions
    function getAllFlights() {
        const stored = localStorage.getItem("airline_flights");
        if (!stored) return [];
        try {
            return JSON.parse(stored);
        } catch (e) {
            return [];
        }
    }

    function saveFlightsToLocalStorage(flightsArray) {
        localStorage.setItem("airline_flights", JSON.stringify(flightsArray));
        // Trigger storage event for other tabs
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'airline_flights',
            newValue: JSON.stringify(flightsArray)
        }));
    }

    // Add new flight to storage
    function addFlightToStorage(flightData) {
        const flights = getAllFlights();
        
        // Check for duplicate flight
        const duplicateExists = flights.some(f => 
            f.flightNo.toLowerCase() === flightData.flightNo.toLowerCase() && 
            f.date === flightData.date && 
            f.fromCity.toLowerCase() === flightData.fromCity.toLowerCase()
        );
        
        if (duplicateExists) {
            showMessage(`⚠️ Warning: Flight ${flightData.flightNo} on ${flightData.date} from ${flightData.fromCity} already exists! Still added, but review may be needed.`, false);
        } else {
            showMessage(`✈️ Flight ${flightData.flightNo} added successfully!`, false);
        }
        
        // Generate unique ID
        const newId = Date.now() + '-' + Math.random().toString(36).substring(2, 8);
        const newFlight = {
            id: newId,
            ...flightData,
            createdAt: new Date().toISOString()
        };
        flights.push(newFlight);
        saveFlightsToLocalStorage(flights);
        return newFlight;
    }

    // Format date for display
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    }

    // Update preview panel with the latest added flight
    function updatePreviewPanel(flight) {
        if (!flight) {
            previewContainer.classList.add('hidden');
            return;
        }
        previewFlightNoSpan.textContent = `${flight.flightNo} (${flight.airline})`;
        previewRouteSpan.innerHTML = `<i class="fas fa-arrow-right"></i> ${flight.fromCity} → ${flight.toCity}`;
        previewDateTimeSpan.innerHTML = `<i class="far fa-calendar-check"></i> ${formatDate(flight.date)} at ${flight.time}`;
        previewPriceSpan.textContent = flight.price.toLocaleString('en-IN');
        previewSeatsSpan.textContent = flight.seats;
        previewContainer.classList.remove('hidden');
    }

    // Clear form fields (optional)
    function clearFormFields() {
        flightNoInput.value = '';
        airlineInput.value = '';
        fromCityInput.value = '';
        toCityInput.value = '';
        priceInput.value = '';
        seatsInput.value = '40';
        // Don't clear date and time as they have defaults
    }

    // Set default date to tomorrow
    function setDefaultDate() {
        if (!dateInput.value) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const yyyy = tomorrow.getFullYear();
            const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
            const dd = String(tomorrow.getDate()).padStart(2, '0');
            dateInput.value = `${yyyy}-${mm}-${dd}`;
        }
    }

    // Set default time
    function setDefaultTime() {
        if (!timeInput.value) {
            timeInput.value = "10:00";
        }
    }

    // Load last added flight preview on page load
    function loadLastAddedFlightPreview() {
        const flights = getAllFlights();
        if (flights.length === 0) {
            previewContainer.classList.add('hidden');
            return;
        }
        // Find the most recent flight by createdAt
        const sorted = [...flights].sort((a, b) => {
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : (typeof a.id === 'string' ? parseInt(a.id.split('-')[0]) || 0 : 0);
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : (typeof b.id === 'string' ? parseInt(b.id.split('-')[0]) || 0 : 0);
            return timeB - timeA;
        });
        if (sorted.length > 0) {
            updatePreviewPanel(sorted[0]);
        } else {
            previewContainer.classList.add('hidden');
        }
    }

    // Setup live validations and formatting
    function setupLiveValidations() {
        priceInput.addEventListener('input', function(e) {
            let val = this.value.trim();
            if (val !== '' && !isNaN(parseFloat(val)) && parseFloat(val) < 0) {
                this.value = 0;
            }
        });
        
        seatsInput.addEventListener('input', function() {
            let val = parseInt(this.value, 10);
            if (isNaN(val)) this.value = 40;
            if (val < 1) this.value = 1;
            if (val > 500) this.value = 500;
        });
        
        // Ensure flight number uppercase on blur
        flightNoInput.addEventListener('blur', function() {
            this.value = this.value.trim().toUpperCase();
        });
        
        // Capitalize first letters of airline, from, to
        const capitalizeWords = (str) => str.replace(/\b\w/g, l => l.toUpperCase());
        
        airlineInput.addEventListener('blur', function() {
            this.value = capitalizeWords(this.value.trim());
        });
        
        fromCityInput.addEventListener('blur', function() {
            this.value = capitalizeWords(this.value.trim());
        });
        
        toCityInput.addEventListener('blur', function() {
            this.value = capitalizeWords(this.value.trim());
        });
    }

    // Main add flight handler
    function handleAddFlight() {
        const flightData = getValidatedFlightData();
        if (!flightData) return;

        // Add loading state to button
        addBtn.classList.add('loading');
        const originalBtnText = addBtn.innerHTML;
        addBtn.innerHTML = '<i class="fas fa-spinner"></i> Adding...';
        
        // Simulate slight delay for better UX
        setTimeout(() => {
            // Store in localStorage
            const newlyAdded = addFlightToStorage(flightData);
            
            // Update preview
            updatePreviewPanel(newlyAdded);
            
            // Scroll to preview
            if (previewContainer) {
                previewContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            
            // Focus back to flight number for next entry
            flightNoInput.focus();
            
            // Reset button
            addBtn.classList.remove('loading');
            addBtn.innerHTML = originalBtnText;
        }, 300);
    }

    // Dismiss preview
    function dismissPreview() {
        previewContainer.classList.add('hidden');
    }

    // Seed demo flights if localStorage is empty
    function seedDemoFlightsIfEmpty() {
        const flights = getAllFlights();
        if (flights.length === 0) {
            const demoFlights = [
                {
                    id: "seed1-" + Date.now(),
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
                    id: "seed2-" + (Date.now() + 1000),
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
                    id: "seed3-" + (Date.now() + 2000),
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
                    id: "seed4-" + (Date.now() + 3000),
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
            saveFlightsToLocalStorage(demoFlights);
        }
    }

    // Bind events
    function bindEvents() {
        addBtn.addEventListener('click', handleAddFlight);
        if (clearPreviewBtn) {
            clearPreviewBtn.addEventListener('click', dismissPreview);
        }
        
        // Allow pressing Enter key on any input to trigger add
        const inputs = [flightNoInput, airlineInput, fromCityInput, toCityInput, dateInput, timeInput, priceInput, seatsInput];
        inputs.forEach(input => {
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFlight();
                    }
                });
            }
        });
    }

    // Listen for storage changes from other tabs
    window.addEventListener('storage', function(e) {
        if (e.key === 'airline_flights') {
            loadLastAddedFlightPreview();
        }
    });

    // Initialize everything
    function init() {
        seedDemoFlightsIfEmpty();
        setDefaultDate();
        setDefaultTime();
        setupLiveValidations();
        bindEvents();
        loadLastAddedFlightPreview();
        if (!priceInput.value) priceInput.placeholder = "e.g., 4500";
    }

    init();
});