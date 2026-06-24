// ========================================
// PAYMENT PAGE LOGIC
// BlueSky Airlines - Professional Implementation
// ========================================

let totalAmount = parseInt(localStorage.getItem('totalAmount')) || 4500;
let selectedMethod = null;

// DOM Elements
const totalAmountSpan = document.getElementById('totalAmount');
const methodsGrid = document.getElementById('methodsGrid');
const paymentFormContainer = document.getElementById('paymentFormContainer');
const payBtn = document.getElementById('payBtn');

// Update total amount
totalAmountSpan.textContent = `₹${totalAmount.toLocaleString()}`;

// ========== PAYMENT METHOD SELECTION ==========
function selectPaymentMethod(method) {
    selectedMethod = method;
    
    document.querySelectorAll('.method-card').forEach(card => {
        card.classList.remove('selected');
    });
    const selectedCard = document.querySelector(`.method-card[data-method="${method}"]`);
    if (selectedCard) selectedCard.classList.add('selected');
    
    payBtn.disabled = false;
    showPaymentForm(method);
}

function showPaymentForm(method) {
    if (method === 'upi') {
        paymentFormContainer.innerHTML = `
            <div class="payment-form">
                <div class="form-group">
                    <label><i class="fab fa-google-pay"></i> UPI ID</label>
                    <input type="text" id="upiId" placeholder="username@okhdfcbank / @paytm / @phonepe">
                </div>
                <div class="form-note">
                    <i class="fas fa-info-circle"></i> Enter your UPI ID to receive payment request
                </div>
            </div>
        `;
    } else if (method === 'card') {
        paymentFormContainer.innerHTML = `
            <div class="payment-form">
                <div class="form-group">
                    <label><i class="fas fa-credit-card"></i> Card Number</label>
                    <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" oninput="formatCardNumber(this)">
                </div>
                <div class="form-group">
                    <label>Card Holder Name</label>
                    <input type="text" id="cardName" placeholder="Name as on card">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Expiry Date</label>
                        <input type="text" id="expiry" placeholder="MM/YY" maxlength="5" oninput="formatExpiry(this)">
                    </div>
                    <div class="form-group">
                        <label>CVV</label>
                        <input type="password" id="cvv" placeholder="123" maxlength="3">
                    </div>
                </div>
                <div class="form-note">
                    <i class="fas fa-shield-alt"></i> Your card details are 256-bit encrypted
                </div>
            </div>
        `;
    } else if (method === 'netbanking') {
        paymentFormContainer.innerHTML = `
            <div class="payment-form">
                <div class="form-group">
                    <label><i class="fas fa-university"></i> Select Bank</label>
                    <select id="bank">
                        <option value="">Select your bank</option>
                        <option value="sbi">State Bank of India (SBI)</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="axis">Axis Bank</option>
                        <option value="kotak">Kotak Mahindra Bank</option>
                        <option value="pnb">Punjab National Bank (PNB)</option>
                        <option value="yes">Yes Bank</option>
                    </select>
                </div>
                <div class="form-note">
                    <i class="fas fa-lock"></i> You will be redirected to your bank's secure page
                </div>
            </div>
        `;
    }
}

// Formatting functions
window.formatCardNumber = function(input) {
    let value = input.value.replace(/\s/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    let formatted = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) formatted += ' ';
        formatted += value[i];
    }
    input.value = formatted;
};

window.formatExpiry = function(input) {
    let value = input.value.replace(/\//g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
        input.value = value.slice(0, 2) + '/' + value.slice(2);
    } else {
        input.value = value;
    }
};

// Add event listeners
document.querySelectorAll('.method-card').forEach(card => {
    card.addEventListener('click', () => {
        const method = card.getAttribute('data-method');
        if (method) selectPaymentMethod(method);
    });
});

// ========== VALIDATE PAYMENT FORM ==========
function validatePaymentForm() {
    if (!selectedMethod) {
        showToast('Please select a payment method', 'error');
        return false;
    }
    
    if (selectedMethod === 'upi') {
        const upiId = document.getElementById('upiId')?.value;
        if (!upiId || !upiId.includes('@')) {
            showToast('Please enter a valid UPI ID (e.g., name@okhdfcbank)', 'error');
            return false;
        }
    } else if (selectedMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber')?.value.replace(/\s/g, '');
        const cardName = document.getElementById('cardName')?.value;
        const expiry = document.getElementById('expiry')?.value;
        const cvv = document.getElementById('cvv')?.value;
        
        if (!cardNumber || cardNumber.length < 16) {
            showToast('Please enter a valid 16-digit card number', 'error');
            return false;
        }
        if (!cardName || cardName.length < 3) {
            showToast('Please enter card holder name', 'error');
            return false;
        }
        if (!expiry || !expiry.match(/^\d{2}\/\d{2}$/)) {
            showToast('Please enter valid expiry date (MM/YY)', 'error');
            return false;
        }
        if (!cvv || cvv.length < 3) {
            showToast('Please enter valid CVV', 'error');
            return false;
        }
    } else if (selectedMethod === 'netbanking') {
        const bank = document.getElementById('bank')?.value;
        if (!bank) {
            showToast('Please select your bank', 'error');
            return false;
        }
    }
    
    return true;
}

// ========== SHOW OTP MODAL ==========
function showOTPModal() {
    const modal = document.createElement('div');
    modal.className = 'loading-overlay';
    modal.innerHTML = `
        <div class="otp-modal">
            <i class="fas fa-lock" style="font-size: 2rem; color: #3b82f6; margin-bottom: 1rem;"></i>
            <h3>OTP Verification</h3>
            <p>We've sent a one-time password to your registered mobile number</p>
            <div class="otp-code">123456</div>
            <input type="text" class="otp-input" id="otpInput" placeholder="Enter OTP" maxlength="6" autofocus>
            <button class="verify-btn" id="verifyOtpBtn">Verify & Pay</button>
            <div class="otp-note">Demo OTP: 123456 | This is a simulation</div>
        </div>
    `;
    document.body.appendChild(modal);
    
    setTimeout(() => document.getElementById('otpInput')?.focus(), 100);
    
    document.getElementById('verifyOtpBtn').onclick = () => {
        const enteredOTP = document.getElementById('otpInput').value;
        if (enteredOTP === '123456') {
            modal.remove();
            showProcessingAnimation();
        } else {
            showToast('Invalid OTP. Please try again.', 'error');
            document.getElementById('otpInput').value = '';
            document.getElementById('otpInput').focus();
        }
    };
    
    document.getElementById('otpInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('verifyOtpBtn').click();
        }
    });
}

// ========== SHOW PROCESSING ANIMATION ==========
function showProcessingAnimation() {
    const loader = document.createElement('div');
    loader.className = 'loading-overlay';
    loader.innerHTML = `
        <div class="spinner"></div>
        <div class="loading-text">Processing Payment</div>
        <div class="progress-bar">
            <div class="progress-fill"></div>
        </div>
        <div class="loading-text" style="font-size: 0.7rem; margin-top: 0.5rem;">Please do not refresh the page</div>
    `;
    document.body.appendChild(loader);
    
    let progress = 0;
    const progressFill = loader.querySelector('.progress-fill');
    const interval = setInterval(() => {
        progress += 10;
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.remove();
                paymentSuccess();
            }, 500);
        }
    }, 200);
}

// ========== PAYMENT SUCCESS ==========
function paymentSuccess() {
    const pnr = generatePNR();
    const completeBooking = JSON.parse(localStorage.getItem('completeBooking')) || {};
    const seatData = JSON.parse(localStorage.getItem('selectedSeat')) || {};
    const passengerData = JSON.parse(localStorage.getItem('passengerDetails')) || {};
    
    const bookingData = {
        pnr: pnr,
        bookingReference: completeBooking.bookingReference || generateBookingReference(),
        bookingDate: new Date().toISOString(),
        status: 'confirmed',
        totalAmount: totalAmount,
        paymentMethod: selectedMethod,
        paymentStatus: 'successful',
        paymentDate: new Date().toLocaleString(),
        flight: completeBooking.flight || {},
        passenger: passengerData,
        seat: seatData
    };
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    
    showToast('✅ Payment Successful! Redirecting to confirmation...', 'success');
    setTimeout(() => {
        window.location.href = 'confirmation.html';
    }, 2000);
}

function generatePNR() {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const numbers = '0123456789';
    let pnr = '';
    for (let i = 0; i < 2; i++) pnr += letters.charAt(Math.floor(Math.random() * letters.length));
    for (let i = 0; i < 4; i++) pnr += numbers.charAt(Math.floor(Math.random() * numbers.length));
    for (let i = 0; i < 2; i++) pnr += letters.charAt(Math.floor(Math.random() * letters.length));
    return pnr;
}

function generateBookingReference() {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const numbers = '0123456789';
    let ref = '';
    for (let i = 0; i < 3; i++) ref += letters.charAt(Math.floor(Math.random() * letters.length));
    for (let i = 0; i < 4; i++) ref += numbers.charAt(Math.floor(Math.random() * numbers.length));
    return ref;
}

// ========== PROCESS PAYMENT ==========
function processPayment() {
    if (!validatePaymentForm()) return;
    showOTPModal();
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
    }, 3000);
}

// ========== EVENT LISTENER ==========
payBtn.addEventListener('click', processPayment);