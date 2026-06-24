// ========================================
// CONFIRMATION PAGE LOGIC - COMPLETE
// BlueSky Airlines - Professional Implementation
// ========================================

// Load booking data from localStorage
let bookingData = JSON.parse(localStorage.getItem('bookingData')) || {};
let completeBooking = JSON.parse(localStorage.getItem('completeBooking')) || {};
let seatData = JSON.parse(localStorage.getItem('selectedSeat')) || {};
let passengerData = JSON.parse(localStorage.getItem('passengerDetails')) || {};
let flightData = JSON.parse(localStorage.getItem('selectedFlight')) || {};

// Display PNR
const pnrSpan = document.getElementById('pnrNumber');
if (pnrSpan) {
    pnrSpan.textContent = bookingData.pnr || generatePNR();
}

// ========== GENERATE PNR IF NOT EXISTS ==========
function generatePNR() {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const numbers = '0123456789';
    let pnr = '';
    for (let i = 0; i < 2; i++) pnr += letters.charAt(Math.floor(Math.random() * letters.length));
    for (let i = 0; i < 4; i++) pnr += numbers.charAt(Math.floor(Math.random() * numbers.length));
    for (let i = 0; i < 2; i++) pnr += letters.charAt(Math.floor(Math.random() * letters.length));
    return pnr;
}

// ========== DISPLAY FLIGHT DETAILS ==========
function displayFlightDetails() {
    const flight = flightData.flight || { airline: 'Air India', flightNo: 'AI202' };
    const from = flightData.from || 'New Delhi (DEL)';
    const to = flightData.to || 'Mumbai (BOM)';
    const date = flightData.travelDate ? new Date(flightData.travelDate).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
    }) : '15 April 2026';
    const departure = flightData.flight?.dept || '08:30';
    const arrival = flightData.flight?.arr || '11:45';
    const duration = flightData.flight?.duration || '3h 15m';
    
    const flightDetailsDiv = document.getElementById('flightDetails');
    if (flightDetailsDiv) {
        flightDetailsDiv.innerHTML = `
            <div class="info-row">
                <span class="info-label"><i class="fas fa-plane"></i> Airline & Flight</span>
                <span class="info-value">${flight.airline} (${flight.flightNo})</span>
            </div>
            <div class="info-row">
                <span class="info-label"><i class="fas fa-map-marker-alt"></i> Route</span>
                <span class="info-value">${from} → ${to}</span>
            </div>
            <div class="info-row">
                <span class="info-label"><i class="fas fa-calendar"></i> Date</span>
                <span class="info-value">${date}</span>
            </div>
            <div class="info-row">
                <span class="info-label"><i class="fas fa-clock"></i> Departure</span>
                <span class="info-value">${departure}</span>
            </div>
            <div class="info-row">
                <span class="info-label"><i class="fas fa-clock"></i> Arrival</span>
                <span class="info-value">${arrival}</span>
            </div>
            <div class="info-row">
                <span class="info-label"><i class="fas fa-hourglass-half"></i> Duration</span>
                <span class="info-value">${duration}</span>
            </div>
        `;
    }
}

// ========== DISPLAY PASSENGER DETAILS ==========
function displayPassengerDetails() {
    const passengers = passengerData.passengers || [{ name: 'Rajesh Kumar', age: 28, gender: 'Male' }];
    const contact = passengerData.contact || { phone: '9876543210', email: 'rajesh@example.com' };
    
    const passengerDetailsDiv = document.getElementById('passengerDetails');
    if (passengerDetailsDiv) {
        let passengerHtml = '';
        passengers.forEach((p, index) => {
            passengerHtml += `
                <div class="info-row">
                    <span class="info-label"><i class="fas fa-user"></i> Passenger ${index + 1}</span>
                    <span class="info-value">${p.name} (${p.age} yrs, ${p.gender})</span>
                </div>
            `;
        });
        passengerHtml += `
            <div class="info-row">
                <span class="info-label"><i class="fas fa-phone-alt"></i> Phone</span>
                <span class="info-value">${contact.phone}</span>
            </div>
            <div class="info-row">
                <span class="info-label"><i class="fas fa-envelope"></i> Email</span>
                <span class="info-value">${contact.email}</span>
            </div>
        `;
        passengerDetailsDiv.innerHTML = passengerHtml;
    }
}

// ========== DISPLAY SEAT DETAILS ==========
function displaySeatDetails() {
    const seatNumber = seatData.seatNumber || 'Not selected';
    const seatClass = seatData.class || 'Economy';
    const seatPrice = seatData.price || 500;
    const isExtraLegroom = seatData.isExtraLegroom || false;
    
    let seatTypeText = '';
    const letter = seatData.letter;
    if (letter === 'A' || letter === 'F') seatTypeText = 'Window Seat 🪟';
    else if (letter === 'C' || letter === 'D') seatTypeText = 'Aisle Seat 🚶';
    else seatTypeText = 'Middle Seat •';
    
    const extraLegroomText = isExtraLegroom ? ' • Extra Legroom ⭐' : '';
    
    const seatDetailsDiv = document.getElementById('seatDetails');
    if (seatDetailsDiv) {
        seatDetailsDiv.innerHTML = `
            <div class="info-row">
                <span class="info-label"><i class="fas fa-chair"></i> Seat Number</span>
                <span class="info-value"><strong>${seatNumber}</strong>${extraLegroomText}</span>
            </div>
            <div class="info-row">
                <span class="info-label"><i class="fas fa-arrows-alt"></i> Seat Type</span>
                <span class="info-value">${seatTypeText}</span>
            </div>
            <div class="info-row">
                <span class="info-label"><i class="fas fa-crown"></i> Seat Class</span>
                <span class="info-value">${seatClass.toUpperCase()} Class</span>
            </div>
            <div class="info-row">
                <span class="info-label"><i class="fas fa-tag"></i> Seat Price</span>
                <span class="info-value">₹${seatPrice.toLocaleString()}</span>
            </div>
        `;
    }
}

// ========== DISPLAY PAYMENT DETAILS ==========
function displayPaymentDetails() {
    const paymentMethod = bookingData.paymentMethod || 'UPI';
    const paymentDate = bookingData.paymentDate || new Date().toLocaleString();
    const transactionId = bookingData.pnr || generateTransactionId();
    
    const paymentDetailsDiv = document.getElementById('paymentDetails');
    if (paymentDetailsDiv) {
        paymentDetailsDiv.innerHTML = `
            <div class="info-row">
                <span class="info-label"><i class="fas fa-credit-card"></i> Payment Method</span>
                <span class="info-value">${paymentMethod.toUpperCase()}</span>
            </div>
            <div class="info-row">
                <span class="info-label"><i class="fas fa-calendar-check"></i> Payment Date</span>
                <span class="info-value">${paymentDate}</span>
            </div>
            <div class="info-row">
                <span class="info-label"><i class="fas fa-hashtag"></i> Transaction ID</span>
                <span class="info-value">${transactionId}</span>
            </div>
            <div class="info-row">
                <span class="info-label"><i class="fas fa-check-circle"></i> Payment Status</span>
                <span class="info-value" style="color: #10b981;">Successful</span>
            </div>
        `;
    }
}

function generateTransactionId() {
    return 'TXN' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

// ========== DISPLAY FARE SUMMARY ==========
function displayFareSummary() {
    const baseFare = 4500;
    const seatPrice = seatData.price || 500;
    const taxes = Math.round((baseFare + seatPrice) * 0.05);
    const total = baseFare + seatPrice + taxes;
    
    const baseFareSpan = document.getElementById('baseFare');
    const seatFeeSpan = document.getElementById('seatFee');
    const taxesSpan = document.getElementById('taxes');
    const totalSpan = document.getElementById('totalAmount');
    
    if (baseFareSpan) baseFareSpan.textContent = `₹${baseFare.toLocaleString()}`;
    if (seatFeeSpan) seatFeeSpan.textContent = `₹${seatPrice.toLocaleString()}`;
    if (taxesSpan) taxesSpan.textContent = `₹${taxes.toLocaleString()}`;
    if (totalSpan) totalSpan.textContent = `₹${total.toLocaleString()}`;
}

// ========== GENERATE PDF TICKET ==========
async function downloadPDFTicket() {
    try {
        showToast('Generating PDF ticket...', 'success');
        
        const ticketElement = document.getElementById('ticketContent');
        
        const canvas = await html2canvas(ticketElement, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true,
            windowWidth: ticketElement.scrollWidth,
            windowHeight: ticketElement.scrollHeight
        });
        
        const { jsPDF } = window.jspdf;
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        
        // Add footer
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text('BlueSky Airlines - Official Boarding Pass', 105, 285, { align: 'center' });
        pdf.text(`Generated on: ${new Date().toLocaleString()}`, 105, 290, { align: 'center' });
        
        pdf.save(`BlueSky_Ticket_${pnrSpan.textContent}.pdf`);
        showToast('PDF Ticket downloaded successfully!', 'success');
        
    } catch (error) {
        console.error('PDF Generation Error:', error);
        showToast('Error generating PDF. Trying HTML download...', 'error');
        downloadHTMLTicket();
    }
}

// ========== DOWNLOAD HTML TICKET (Fallback) ==========
function downloadHTMLTicket() {
    const ticketContent = generateTicketHTML();
    const blob = new Blob([ticketContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BlueSky_Ticket_${pnrSpan.textContent}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('HTML Ticket downloaded successfully!', 'success');
}

function generateTicketHTML() {
    const flight = flightData.flight || { airline: 'Air India', flightNo: 'AI202' };
    const from = flightData.from || 'New Delhi (DEL)';
    const to = flightData.to || 'Mumbai (BOM)';
    const date = flightData.travelDate ? new Date(flightData.travelDate).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
    }) : '15 April 2026';
    const departure = flightData.flight?.dept || '08:30';
    const arrival = flightData.flight?.arr || '11:45';
    const passengers = passengerData.passengers || [{ name: 'Rajesh Kumar', age: 28, gender: 'Male' }];
    const seatNumber = seatData.seatNumber || 'Not selected';
    const totalAmount = document.getElementById('totalAmount')?.innerText || '₹5,600';
    const pnr = pnrSpan.textContent;
    
    return `<!DOCTYPE html>
    <html>
    <head>
        <title>BlueSky Airlines - E-Ticket ${pnr}</title>
        <meta charset="UTF-8">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f2f5; padding: 40px; }
            .ticket { max-width: 800px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 25px; text-align: center; }
            .header h1 { font-size: 28px; margin-bottom: 5px; }
            .pnr { background: #f8fafc; padding: 12px; text-align: center; border-bottom: 1px solid #e2e8f0; }
            .pnr strong { color: #3b82f6; font-size: 18px; }
            .badge { display: inline-block; background: #10b981; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-left: 10px; }
            .details { padding: 20px; }
            .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eef2f6; }
            .label { font-weight: 600; color: #475569; }
            .value { color: #1e293b; }
            .total { background: #f0fdf4; padding: 15px; border-radius: 12px; margin-top: 15px; }
            .total .row { border-bottom: none; }
            .footer { background: #f8fafc; padding: 15px; text-align: center; font-size: 11px; color: #64748b; }
            .qr { text-align: center; padding: 15px; background: #f8fafc; margin-top: 15px; border-radius: 12px; }
            .qr i { font-size: 40px; color: #1e293b; }
        </style>
    </head>
    <body>
        <div class="ticket">
            <div class="header">
                <i class="fas fa-plane" style="font-size: 32px;"></i>
                <h1>BlueSky Airlines</h1>
                <p>Electronic Ticket / Boarding Pass</p>
            </div>
            <div class="pnr">
                <span>PNR Number: </span><strong>${pnr}</strong>
                <span class="badge">CONFIRMED</span>
            </div>
            <div class="details">
                <div class="row"><span class="label">Flight:</span><span class="value">${flight.airline} (${flight.flightNo})</span></div>
                <div class="row"><span class="label">Route:</span><span class="value">${from} → ${to}</span></div>
                <div class="row"><span class="label">Date:</span><span class="value">${date}</span></div>
                <div class="row"><span class="label">Departure:</span><span class="value">${departure}</span></div>
                <div class="row"><span class="label">Arrival:</span><span class="value">${arrival}</span></div>
                ${passengers.map((p, i) => `<div class="row"><span class="label">Passenger ${i+1}:</span><span class="value">${p.name} (${p.age} yrs, ${p.gender})</span></div>`).join('')}
                <div class="row"><span class="label">Seat:</span><span class="value">${seatNumber}</span></div>
                <div class="total"><div class="row"><span class="label">Total Amount Paid:</span><span class="value" style="font-weight: bold; color: #10b981;">${totalAmount}</span></div></div>
                <div class="qr"><i class="fas fa-qrcode"></i><p>Scan for mobile check-in</p></div>
            </div>
            <div class="footer">
                <p>✈️ Please carry a valid ID proof for check-in</p>
                <p>📱 Web check-in opens 48 hours before departure</p>
                <p>Thank you for choosing BlueSky Airlines!</p>
            </div>
        </div>
    </body>
    </html>`;
}

// ========== PRINT TICKET ==========
function printTicket() {
    window.print();
}

// ========== SHARE ON WHATSAPP ==========
function shareOnWhatsApp() {
    const pnr = pnrSpan.textContent;
    const flight = flightData.flight || { airline: 'Air India', flightNo: 'AI202' };
    const from = flightData.from || 'New Delhi (DEL)';
    const to = flightData.to || 'Mumbai (BOM)';
    const date = flightData.travelDate || '15 April 2026';
    const seat = seatData.seatNumber || 'Not selected';
    const total = document.getElementById('totalAmount')?.innerText || '₹5,600';
    
    const message = `✈️ *BlueSky Airlines Booking Confirmed!*\n\n` +
                    `*PNR:* ${pnr}\n` +
                    `*Flight:* ${flight.airline} (${flight.flightNo})\n` +
                    `*Route:* ${from} → ${to}\n` +
                    `*Date:* ${date}\n` +
                    `*Seat:* ${seat}\n` +
                    `*Amount:* ${total}\n\n` +
                    `Thank you for choosing BlueSky Airlines! ✈️`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    showToast('Opening WhatsApp...', 'success');
}

// ========== BACK TO HOME ==========
function goToHome() {
    window.location.href = 'index.html';
}

// ========== TOAST NOTIFICATION ==========
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 300);
    }, 3000);
}

// ========== EVENT LISTENERS ==========
document.getElementById('downloadBtn')?.addEventListener('click', downloadPDFTicket);
document.getElementById('printBtn')?.addEventListener('click', printTicket);
document.getElementById('whatsappBtn')?.addEventListener('click', shareOnWhatsApp);
document.getElementById('homeBtn')?.addEventListener('click', goToHome);

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', () => {
    displayFlightDetails();
    displayPassengerDetails();
    displaySeatDetails();
    displayPaymentDetails();
    displayFareSummary();
});