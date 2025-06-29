let prayerTimes = {};

async function loadPrayerTimes() {
  try {
    const response = await fetch('/api/prayer-times');
    prayerTimes = await response.json();
    renderPrayerTable();
  } catch (error) {
    console.error('Error loading prayer times:', error);
  }
}

function renderPrayerTable() {
  const table = document.getElementById('prayer-times');
  if (!prayerTimes || !table) return;
  
  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  table.innerHTML = prayers.map(prayer => {
    const prayerKey = prayer.toLowerCase();
    const isCurrent = isCurrentPrayer(prayerKey);
    return `
      <tr class="${isCurrent ? 'bg-green-700' : ''}">
        <td class="py-2">${prayer}</td>
        <td class="py-2">${prayerTimes[prayerKey]?.azan || '-'}</td>
        <td class="py-2">${prayerTimes[prayerKey]?.iqamah || '-'}</td>
      </tr>
    `;
  }).join('');
}

function isCurrentPrayer(prayer) {
  // Placeholder - we'll implement this later
  return prayer === 'fajr';
}

// Update every minute to refresh prayer times
setInterval(loadPrayerTimes, 60000);
