// ========================================
// CLEAN PROFESSIONAL SEAT SELECTION LOGIC
// BlueSky Airlines - Premium Implementation
// ========================================

// Business Class Configuration
const BUSINESS_ROWS = [1, 2, 3, 4, 5];
const BUSINESS_LEFT = ['A', 'B'];
const BUSINESS_RIGHT = ['D', 'E'];

// Economy Class Configuration
const ECONOMY_START = 6;
const ECONOMY_END = 30;
const ECONOMY_LEFT = ['A', 'B', 'C'];
const ECONOMY_RIGHT = ['D', 'E', 'F'];

// Exit Rows (where emergency exits are located)
const EXIT_ROWS = [6, 7, 16, 17];

// Extra Legroom Rows
const EXTRA_LEGROOM_BUSINESS = [1];
const EXTRA_LEGROOM_ECONOMY = [6, 16];

// Pricing
const BUSINESS_PRICE = 1500;
const ECONOMY_PRICE = 500;
const EXTRA_LEGROOM_FEE = 2000;

// Pre-booked seats
const BOOKED_SEATS = [
    '1B', '2D', '3A', '4E', '5B',
    '6C', '7F', '8A', '9D', '10B', '11E', '12C', '13F', '14A', '15D',
    '16B', '17E', '18C', '19F', '20A', '21D', '22B', '23E', '24C', '25F'
];

let selectedSeat = null;
let selectedSeatData = null;

// DOM Elements
const businessContainer = document.getElementById('businessSeats');
const economyContainer = document.getElementById('economySeats');
const seatSelectionDisplay = document.getElementById('seatSelectionDisplay');
const baseFareSpan = document.getElementById('baseFare');
const seatFeeSpan = document.getElementById('seatFee');
const totalAmountSpan = document.getElementById('totalAmount');
const continueBtn = document.getElementById('continueBtn');

// ========== LOAD FLIGHT DATA ==========
function loadFlightData() {
    const passengerData = JSON.parse(localStorage.getItem('passengerDetails')) || {};
    if (passengerData.passengers && passengerData.passengers[0]) {
        document.getElementById('passengerName').textContent = passengerData.passengers[0].name;
    }
    
    const baseFare = 4500;
    baseFareSpan.textContent = `₹${baseFare.toLocaleString()}`;
    window.baseFare = baseFare;
}

// ========== CREATE SEAT ==========
function createSeat(seatId, row, letter, seatClass) {
    const seat = document.createElement('div');
    seat.className = 'seat';
    seat.setAttribute('data-seat', seatId);
    seat.setAttribute('data-class', seatClass);
    
    // Determine seat type
    let isWindow = false;
    let isAisle = false;
    let typeIcon = '';
    
    if (seatClass === 'business') {
        if (letter === 'A' || letter === 'E') {
            isWindow = true;
            typeIcon = '🪟';
        } else {
            isAisle = true;
            typeIcon = '🚶';
        }
    } else {
        if (letter === 'A' || letter === 'F') {
            isWindow = true;
            typeIcon = '🪟';
        } else if (letter === 'C' || letter === 'D') {
            isAisle = true;
            typeIcon = '🚶';
        } else {
            typeIcon = '•';
        }
    }
    
    if (isWindow) seat.classList.add('window');
    if (isAisle) seat.classList.add('aisle');
    
    // Check if booked
    const isBooked = BOOKED_SEATS.includes(seatId);
    
    // Check extra legroom
    let isExtraLegroom = false;
    if (seatClass === 'business' && EXTRA_LEGROOM_BUSINESS.includes(row)) {
        isExtraLegroom = true;
    }
    if (seatClass === 'economy' && EXTRA_LEGROOM_ECONOMY.includes(row)) {
        isExtraLegroom = true;
    }
    
    // Calculate price
    let price = (seatClass === 'business') ? BUSINESS_PRICE : ECONOMY_PRICE;
    if (isExtraLegroom) price += EXTRA_LEGROOM_FEE;
    
    // Set seat status
    if (isBooked) {
        seat.classList.add('booked');
    } else {
        seat.classList.add('available');
        if (isExtraLegroom) {
            seat.classList.add('premium');
        }
    }
    
    seat.innerHTML = `
        <div class="seat-number">${seatId}</div>
        <div class="seat-icon">${typeIcon}</div>
    `;
    
    if (!isBooked) {
        seat.title = `${seatClass.toUpperCase()} Class | ₹${price.toLocaleString()}`;
        seat.addEventListener('click', () => selectSeat(seatId, row, letter, seatClass, price, isExtraLegroom));
    } else {
        seat.title = 'Already Booked';
    }
    
    return seat;
}

// ========== GENERATE BUSINESS SEATS ==========
function generateBusinessSeats() {
    if (!businessContainer) return;
    businessContainer.innerHTML = '';
    
    for (let row of BUSINESS_ROWS) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'seat-row';
        
        const rowNum = document.createElement('div');
        rowNum.className = 'row-number';
        rowNum.textContent = row;
        rowDiv.appendChild(rowNum);
        
        const leftDiv = document.createElement('div');
        leftDiv.className = 'left-seats';
        BUSINESS_LEFT.forEach(letter => {
            leftDiv.appendChild(createSeat(`${letter}${row}`, row, letter, 'business'));
        });
        rowDiv.appendChild(leftDiv);
        
        const aisle = document.createElement('div');
        aisle.className = 'aisle';
        aisle.textContent = 'AISLE';
        rowDiv.appendChild(aisle);
        
        const rightDiv = document.createElement('div');
        rightDiv.className = 'right-seats';
        BUSINESS_RIGHT.forEach(letter => {
            rightDiv.appendChild(createSeat(`${letter}${row}`, row, letter, 'business'));
        });
        rowDiv.appendChild(rightDiv);
        
        businessContainer.appendChild(rowDiv);
    }
}

// ========== GENERATE ECONOMY SEATS ==========
function generateEconomySeats() {
    if (!economyContainer) return;
    economyContainer.innerHTML = '';
    
    for (let row = ECONOMY_START; row <= ECONOMY_END; row++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'seat-row';
        
        const rowNum = document.createElement('div');
        rowNum.className = 'row-number';
        rowNum.textContent = row;
        rowDiv.appendChild(rowNum);
        
        const leftDiv = document.createElement('div');
        leftDiv.className = 'left-seats';
        ECONOMY_LEFT.forEach(letter => {
            leftDiv.appendChild(createSeat(`${letter}${row}`, row, letter, 'economy'));
        });
        rowDiv.appendChild(leftDiv);
        
        const aisle = document.createElement('div');
        aisle.className = 'aisle';
        aisle.textContent = EXIT_ROWS.includes(row) ? 'EXIT' : 'AISLE';
        rowDiv.appendChild(aisle);
        
        const rightDiv = document.createElement('div');
        rightDiv.className = 'right-seats';
        ECONOMY_RIGHT.forEach(letter => {
            rightDiv.appendChild(createSeat(`${letter}${row}`, row, letter, 'economy'));
        });
        rowDiv.appendChild(rightDiv);
        
        economyContainer.appendChild(rowDiv);
    }
}

// ========== SELECT SEAT ==========
function selectSeat(seatId, row, letter, seatClass, price, isExtraLegroom) {
    // Remove previous selection
    if (selectedSeat) {
        const prevSeat = document.querySelector(`.seat[data-seat="${selectedSeat}"]`);
        if (prevSeat) {
            prevSeat.classList.remove('selected');
            if (prevSeat.classList.contains('premium')) {
                prevSeat.classList.add('premium');
            } else {
                prevSeat.classList.add('available');
            }
        }
    }
    
    // Mark new seat
    const newSeat = document.querySelector(`.seat[data-seat="${seatId}"]`);
    newSeat.classList.remove('available', 'premium');
    newSeat.classList.add('selected');
    
    // Get seat type text
    let seatTypeText = '';
    if (letter === 'A' || letter === 'F') seatTypeText = 'Window Seat 🪟';
    else if (letter === 'C' || letter === 'D') seatTypeText = 'Aisle Seat 🚶';
    else seatTypeText = 'Middle Seat •';
    
    selectedSeat = seatId;
    selectedSeatData = {
        seatNumber: seatId,
        row: row,
        letter: letter,
        class: seatClass,
        price: price,
        isExtraLegroom: isExtraLegroom,
        seatType: seatTypeText
    };
    
    updateSelectedDisplay();
    updatePriceSummary();
    
    continueBtn.disabled = false;
    showToast(`Seat ${seatId} selected • ₹${price.toLocaleString()}`, 'success');
}

// ========== UPDATE SELECTED DISPLAY ==========
function updateSelectedDisplay() {
    if (!selectedSeatData) return;
    
    const extraText = selectedSeatData.isExtraLegroom ? ' • Extra Legroom' : '';
    const classText = selectedSeatData.class === 'business' ? 'Business Class' : 'Economy Class';
    
    seatSelectionDisplay.innerHTML = `
        <div class="selected-seat-info">
            <div class="selected-seat-number">${selectedSeatData.seatNumber}</div>
            <div class="selected-seat-class">${classText} • ${selectedSeatData.seatType}${extraText}</div>
            <div class="selected-seat-price">₹${selectedSeatData.price.toLocaleString()}</div>
        </div>
    `;
}

// ========== UPDATE PRICE SUMMARY ==========
function updatePriceSummary() {
    if (!selectedSeatData) return;
    
    const seatFee = selectedSeatData.price;
    const total = (window.baseFare || 4500) + seatFee;
    
    seatFeeSpan.textContent = `₹${seatFee.toLocaleString()}`;
    totalAmountSpan.textContent = `₹${total.toLocaleString()}`;
}

// ========== CONFIRM SEAT ==========
function confirmSeat() {
    if (!selectedSeatData) {
        showToast('Please select a seat first', 'error');
        return;
    }
    
    localStorage.setItem('selectedSeat', JSON.stringify(selectedSeatData));
    const total = (window.baseFare || 4500) + selectedSeatData.price;
    localStorage.setItem('totalAmount', total);
    
    showToast(`Seat ${selectedSeatData.seatNumber} confirmed!`, 'success');
    setTimeout(() => {
        window.location.href = 'summary.html';
    }, 800);
}

// ========== TOAST NOTIFICATION ==========
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', () => {
    loadFlightData();
    generateBusinessSeats();
    generateEconomySeats();
});

continueBtn.addEventListener('click', confirmSeat);