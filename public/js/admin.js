// Admin Panel Management
class AdminPanel {
  constructor() {
    this.init();
  }

  async init() {
    await this.loadCurrentData();
    this.setupEventListeners();
  }

  async loadCurrentData() {
    try {
      // Load current announcements
      const announcementsResponse = await fetch('/api/announcements');
      const announcementsData = await announcementsResponse.json();
      
      const announcementsEditor = document.getElementById('announcements-editor');
      if (announcementsEditor && announcementsData.announcements) {
        announcementsEditor.value = announcementsData.announcements.join('\n');
      }

      // Load current settings
      const settingsResponse = await fetch('/api/settings');
      const settingsData = await settingsResponse.json();
      
      const zoneCodeInput = document.getElementById('zone-code');
      if (zoneCodeInput && settingsData.zone) {
        zoneCodeInput.value = settingsData.zone;
      }

    } catch (error) {
      console.error('Error loading current data:', error);
    }
  }

  setupEventListeners() {
    // Save Announcements
    const saveAnnouncementsBtn = document.getElementById('save-announcements');
    if (saveAnnouncementsBtn) {
      saveAnnouncementsBtn.addEventListener('click', () => {
        this.saveAnnouncements();
      });
    }

    // Save Settings
    const saveSettingsBtn = document.getElementById('save-settings');
    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener('click', () => {
        this.saveSettings();
      });
    }
  }

  async saveAnnouncements() {
    try {
      const announcementsEditor = document.getElementById('announcements-editor');
      const announcements = announcementsEditor.value
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => line.trim());

      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ announcements })
      });

      if (response.ok) {
        this.showMessage('Announcements saved successfully!', 'success');
      } else {
        throw new Error('Failed to save announcements');
      }
    } catch (error) {
      console.error('Error saving announcements:', error);
      this.showMessage('Error saving announcements!', 'error');
    }
  }

  async saveSettings() {
    try {
      const zoneCodeInput = document.getElementById('zone-code');
      const zone = zoneCodeInput.value.trim();

      if (!zone) {
        this.showMessage('Please enter a valid zone code!', 'error');
        return;
      }

      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ zone, iqamahDelay: 15 })
      });

      if (response.ok) {
        this.showMessage('Settings saved successfully! Prayer times will update automatically.', 'success');
        
        // Trigger manual prayer time update
        await this.updatePrayerTimes();
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      this.showMessage('Error saving settings!', 'error');
    }
  }

  async updatePrayerTimes() {
    try {
      const response = await fetch('/api/update-prayer-times', {
        method: 'POST'
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Prayer times updated:', data);
        this.showMessage('Prayer times updated successfully!', 'success');
      }
    } catch (error) {
      console.error('Error updating prayer times:', error);
    }
  }

  showMessage(message, type) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.admin-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create new message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `admin-message p-3 rounded mb-4 ${
      type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 
      'bg-red-100 text-red-800 border border-red-200'
    }`;
    messageDiv.textContent = message;

    // Insert at the top of the container
    const container = document.querySelector('.max-w-4xl');
    if (container) {
      container.insertBefore(messageDiv, container.firstChild);
    }

    // Auto-remove after 5 seconds
    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  new AdminPanel();
});
