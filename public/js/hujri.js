function updateHijriDate() {
  try {
    const today = new Date();
    const hijri = new HijriDate(today);
    document.getElementById('hijri-date').textContent = 
      `${hijri.getDate()} ${hijri.getMonthName()} ${hijri.getFullYear()}H`;
  } catch (error) {
    console.error('Error updating Hijri date:', error);
  }
}

// Update Hijri date daily after Maghrib
function scheduleHijriUpdate() {
  const now = new Date();
  const updateTime = new Date();
  
  // Set update time to 30 minutes after Maghrib (placeholder)
  updateTime.setHours(19, 30, 0); // Adjust based on actual Maghrib time
  
  if (now > updateTime) {
    updateHijriDate();
    // Schedule next update for tomorrow
    updateTime.setDate(updateTime.getDate() + 1);
  }
  
  const delay = updateTime - now;
  setTimeout(() => {
    updateHijriDate();
    // Schedule daily updates
    setInterval(updateHijriDate, 24 * 60 * 60 * 1000);
  }, delay);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateHijriDate();
  scheduleHijriUpdate();
});
