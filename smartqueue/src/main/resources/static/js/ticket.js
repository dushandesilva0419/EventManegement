// STEP 3: REPLACE YOUR ticket.js WITH THIS COMPLETE VERSION
// Pre-fill form from URL parameters - ADD THIS AT THE VERY TOP
window.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);

    // Pre-fill Event Name
    const eventName = urlParams.get('eventName');
    if (eventName) {
        const eventNameInput = document.getElementById('eventNameInput');
        if (eventNameInput) {
            eventNameInput.value = eventName;
        }
    }

    // Pre-fill Event Date
    const eventDate = urlParams.get('eventDate');
    if (eventDate) {
        const eventDateInput = document.getElementById('eventDateInput');
        if (eventDateInput) {
            eventDateInput.value = eventDate;
        }
    }

    // Update order summary if fields were pre-filled
    if (eventName || eventDate) {
        updateOrderSummary();
    }
});

// Card Number Formatting
document.getElementById('cardNumber').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
});

// Expiry Date Formatting
document.getElementById('expiryDate').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length >= 3) {
        value = value.substring(0,2) + '/' + value.substring(2,4);
    }

    e.target.value = value;
});

// CVV - Numbers Only
document.getElementById('cvv').addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '');
});

// Live Update from Ticket Form to Order Summary
const ticketFormInputs = ['eventNameInput', 'eventDateInput', 'ticketTypeInput', 'quantityInput', 'priceInput', 'customerNameInput'];

ticketFormInputs.forEach(inputId => {
    const element = document.getElementById(inputId);
    if (element) {
        element.addEventListener('input', updateOrderSummary);
        element.addEventListener('change', updateOrderSummary);
    }
});

function updateOrderSummary() {
    // Update event name
    const eventName = document.getElementById('eventNameInput').value || 'Rock Concert 2026';
    document.getElementById('eventName').textContent = eventName;

    // Update event date
    const eventDateInput = document.getElementById('eventDateInput').value;
    if (eventDateInput) {
        const date = new Date(eventDateInput);
        const formatted = date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        document.getElementById('eventDate').textContent = formatted;
    }

    // Update ticket type
    const ticketType = document.getElementById('ticketTypeInput').value || 'VIP';
    document.getElementById('ticketType').textContent = ticketType;

    // Update quantity
    const quantity = parseInt(document.getElementById('quantityInput').value) || 1;
    document.getElementById('quantity').textContent = quantity;

    // Update price and calculations
    const price = parseFloat(document.getElementById('priceInput').value) || 50.00;
    const subtotal = price * quantity;
    const serviceFee = 5.00;
    const total = subtotal + serviceFee;

    document.getElementById('pricePerTicket').textContent = '$' + price.toFixed(2);
    document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('serviceFee').textContent = '$' + serviceFee.toFixed(2);
    document.getElementById('totalAmount').textContent = '$' + total.toFixed(2);
}

// Form submission handler
document.getElementById('paymentForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Get payment form data
    const formData = new FormData(e.target);

    // Get ticket form data
    const ticketData = {
        eventName: document.getElementById('eventNameInput').value,
        eventDate: document.getElementById('eventDateInput').value,
        ticketType: document.getElementById('ticketTypeInput').value,
        quantity: document.getElementById('quantityInput').value,
        price: document.getElementById('priceInput').value,
        customerName: document.getElementById('customerNameInput').value,
        customerEmail: document.getElementById('customerEmailInput').value
    };

    const paymentData = {
        cardHolderName: formData.get('cardHolderName'),
        cardNumber: formData.get('cardNumber').replace(/\s/g, ''),
        expiryDate: formData.get('expiryDate').replace(/\s/g, ''),
        cvv: formData.get('cvv'),
        amount: document.getElementById('totalAmount').textContent,
        ticketType: ticketData.ticketType,
        quantity: ticketData.quantity,
        // Include ticket data
        ticketData: ticketData
    };

    // Validate card number
    if (!validateCardNumber(paymentData.cardNumber)) {
        alert('Invalid card number!');
        return;
    }

    // Validate expiry date
    if (!validateExpiryDate(paymentData.expiryDate)) {
        alert('Invalid or expired card!');
        return;
    }

    // Validate CVV
    if (paymentData.cvv.length !== 3) {
        alert('Invalid CVV!');
        return;
    }

    try {
        // Show loading
        const submitBtn = e.target.querySelector('.btn-pay');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        // Send to backend
        const response = await fetch('/api/payments/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        });

        const result = await response.json();

        if (response.ok) {
            // Show success modal
            document.getElementById('bookingId').textContent = result.bookingId || generateBookingId();
            document.getElementById('successModal').classList.add('active');
        } else {
            alert(result.message || 'Payment failed. Please try again.');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }

    } catch (error) {
        console.error('Payment error:', error);
        alert('An error occurred. Please try again.');
        const submitBtn = e.target.querySelector('.btn-pay');
        submitBtn.innerHTML = '<i class="fas fa-lock"></i> Pay Securely';
        submitBtn.disabled = false;
    }
});

// Validate Card Number (Luhn Algorithm)
function validateCardNumber(cardNumber) {
    if (!/^\d{13,19}$/.test(cardNumber)) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i]);

        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        isEven = !isEven;
    }

    return (sum % 10) === 0;
}

// Validate Expiry Date
function validateExpiryDate(expiryDate) {
    const parts = expiryDate.split('/');
    if (parts.length !== 2) return false;

    const month = parseInt(parts[0]);
    const year = parseInt('20' + parts[1]);

    if (isNaN(month) || isNaN(year)) return false;
    if (month < 1 || month > 12) return false;

    const now = new Date();
    const expiry = new Date(year, month);

    return expiry > now;
}

// Generate Booking ID
function generateBookingId() {
    return Math.floor(100000 + Math.random() * 900000);
}