// Date and Time Management
class DateTime {
  constructor() {
    this.init();
  }

  init() {
    this.updateDateTime();
    this.updateHijriDate();
    
    // Update every second
    setInterval(() => {
      this.updateDateTime();
    }, 1000);

    // Update Hijri date every hour
    setInterval(() => {
      this.updateHijriDate();
    }, 3600000);
  }

  updateDateTime() {
    const now = new Date();
    
    // Update digital clock
    const timeString = now.toLocaleTimeString('en-MY', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
      timeElement.textContent = timeString;
    }

    // Update day
    const dayNames = [
      'AHAD', 'ISNIN', 'SELASA', 'RABU', 
      'KHAMIS', 'JUMAAT', 'SABTU'
    ];
    
    const dayElement = document.getElementById('current-day');
    if (dayElement) {
      dayElement.textContent = dayNames[now.getDay()];
    }

    // Update Gregorian date
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      timeZone: 'Asia/Kuala_Lumpur'
    };
    
    const dateString = now.toLocaleDateString('ms-MY', options);
    const dateElement = document.getElementById('gregorian-date');
    if (dateElement) {
      dateElement.textContent = dateString;
    }
  }

  updateHijriDate() {
    try {
      // Using the hijri-date library that's loaded in HTML
      if (typeof HijriDate !== 'undefined') {
        const hijri = new HijriDate();
        const hijriString = hijri.format('DD MMMM YYYY H');
        
        const hijriElement = document.getElementById('hijri-date');
        if (hijriElement) {
          hijriElement.textContent = `${hijriString}H`;
        }
      } else {
        // Fallback if library not loaded
        const hijriElement = document.getElementById('hijri-date');
        if (hijriElement) {
          hijriElement.textContent = 'Tarikh Hijriah';
        }
      }
    } catch (error) {
      console.error('Error updating Hijri date:', error);
      
      // Simple fallback
      const hijriElement = document.getElementById('hijri-date');
      if (hijriElement) {
        hijriElement.textContent = 'Tarikh Hijriah';
      }
    }
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  new DateTime();
});
