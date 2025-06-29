const videoPlayer = document.getElementById('azan-player');
const countdownEl = document.getElementById('iqamah-countdown');

function playAzan(prayerName) {
  videoPlayer.src = `/video/${prayerName}.mp4`;
  videoPlayer.hidden = false;
  videoPlayer.play();
  
  startIqamahCountdown(prayerName);
}

function startIqamahCountdown(prayerName) {
  const iqamahDelay = 15; // Minutes (get from settings later)
  let minutesLeft = iqamahDelay;
  
  const countdown = setInterval(() => {
    countdownEl.textContent = `Iqamah in: ${minutesLeft} minutes`;
    
    if (minutesLeft <= 0) {
      clearInterval(countdown);
      videoPlayer.hidden = true;
      countdownEl.textContent = '';
    }
    
    minutesLeft--;
  }, 60000);
}

// Check if it's time for prayer
function checkPrayerTime() {
  const now = new Date();
  const currentTime = now.toTimeString().substr(0, 5);
  
  const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  for (const prayer of prayers) {
    if (prayerTimes[prayer]?.azan === currentTime) {
      playAzan(prayer);
      break;
    }
  }
}

// Check every minute
setInterval(checkPrayerTime, 60000);
