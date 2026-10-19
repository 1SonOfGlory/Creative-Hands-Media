const bookingForm = document.getElementById('booking-form');
const statusEl = document.getElementById('booking-status');
const businessContact = {
  phone: ['233', '55', '143', '8315'].join(''),
  email: ['freehandscreative', 'multimedia', '@', 'gmail', '.com'].join('')
};

if (bookingForm && statusEl) {
  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(bookingForm);
    const payload = Object.fromEntries(formData.entries());

    if (!payload.fullName || !payload.email || !payload.phone || !payload.eventType || !payload.eventDate || !payload.location) {
      statusEl.textContent = 'Please complete all required fields.';
      return;
    }

    const existing = JSON.parse(localStorage.getItem('creative_hands_bookings') || '[]');
    existing.push({ ...payload, submittedAt: new Date().toISOString() });
    localStorage.setItem('creative_hands_bookings', JSON.stringify(existing));

    const message = [
      'New enquiry - Free Hands Creative Multimedia',
      `Name: ${payload.fullName}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone}`,
      `Event Type: ${payload.eventType}`,
      `Event Date: ${payload.eventDate}`,
      `Location: ${payload.location}`,
      `Details: ${payload.details || 'N/A'}`
    ].join('\n');

    const whatsappUrl = `https://wa.me/${businessContact.phone}?text=${encodeURIComponent(message)}`;
    const emailUrl = `mailto:${businessContact.email}?subject=${encodeURIComponent('New Event Enquiry')}&body=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank', 'noopener');
    window.location.href = emailUrl;

    statusEl.textContent = 'Enquiry prepared for WhatsApp and Email. If blocked, allow popups and try again.';
    bookingForm.reset();
  });
}



