// Announcements Management
class Announcements {
  constructor() {
    this.announcements = [];
    this.currentIndex = 0;
    this.init();
  }

  async init() {
    await this.loadAnnouncements();
    this.startAnnouncementRotation();
    
    // Refresh announcements every 5 minutes
    setInterval(() => {
      this.loadAnnouncements();
    }, 300000);
  }

  async loadAnnouncements() {
    try {
      const response = await fetch('/api/announcements');
      const data = await response.json();
      this.announcements = data.announcements || [];
      
      if (this.announcements.length === 0) {
        this.announcements = [
          'Selamat datang ke Surau Alor Setar',
          'Marilah kita tingkatkan amal ibadah',
          'Jangan lupa membaca Al-Quran setiap hari'
        ];
      }
      
      this.updateAnnouncementDisplay();
    } catch (error) {
      console.error('Error loading announcements:', error);
      this.announcements = ['Selamat datang ke Surau Alor Setar'];
      this.updateAnnouncementDisplay();
    }
  }

  updateAnnouncementDisplay() {
    const banner = document.getElementById('announcement-banner');
    if (banner && this.announcements.length > 0) {
      banner.textContent = this.announcements[this.currentIndex];
    }
  }

  startAnnouncementRotation() {
    // Change announcement every 10 seconds if there are multiple
    if (this.announcements.length > 1) {
      setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.announcements.length;
        this.updateAnnouncementDisplay();
      }, 10000);
    }
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  new Announcements();
});
