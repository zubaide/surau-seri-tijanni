// Helper function to get current prayer times
const updatePrayerTimes = async () => {
  try {
    const settings = JSON.parse(await fs.readFile(`${DATA_PATH}/settings.json`, 'utf8'));
    console.log(`Fetching prayer times for zone: ${settings.zone}`);

    // Using the working waktusolat.app API endpoint
    const response = await axios.get(`https://api.waktusolat.app/v2/solat/${settings.zone}`);

    console.log('API Response structure:', {
      zone: response.data.zone,
      year: response.data.year,
      month: response.data.month,
      prayersCount: response.data.prayers?.length
    });

    // Handle the waktusolat.app API response format
    let prayerTimes;

    if (response.data && response.data.prayers && Array.isArray(response.data.prayers)) {
      // Get today's date
      const today = new Date();
      const currentDay = today.getDate();
      
      // Find today's prayer times from the prayers array
      const todayPrayers = response.data.prayers.find(prayer => prayer.day === currentDay);
      
      if (todayPrayers) {
        // Convert Unix timestamps to HH:mm format
        prayerTimes = {
          imsak: moment.unix(todayPrayers.fajr - 600).format('HH:mm'), // Imsak is typically 10 minutes before Fajr
          subuh: moment.unix(todayPrayers.fajr).format('HH:mm'),
          syuruk: moment.unix(todayPrayers.syuruk).format('HH:mm'),
          zohor: moment.unix(todayPrayers.dhuhr).format('HH:mm'),
          asar: moment.unix(todayPrayers.asr).format('HH:mm'),
          maghrib: moment.unix(todayPrayers.maghrib).format('HH:mm'),
          isyak: moment.unix(todayPrayers.isha).format('HH:mm')
        };
        
        console.log(`Found prayer times for day ${currentDay}:`, todayPrayers);
      } else {
        console.warn(`No prayer times found for day ${currentDay}, using first available day`);
        const firstDay = response.data.prayers[0];
        prayerTimes = {
          imsak: moment.unix(firstDay.fajr - 600).format('HH:mm'),
          subuh: moment.unix(firstDay.fajr).format('HH:mm'),
          syuruk: moment.unix(firstDay.syuruk).format('HH:mm'),
          zohor: moment.unix(firstDay.dhuhr).format('HH:mm'),
          asar: moment.unix(firstDay.asr).format('HH:mm'),
          maghrib: moment.unix(firstDay.maghrib).format('HH:mm'),
          isyak: moment.unix(firstDay.isha).format('HH:mm')
        };
      }
    } else {
      // Fallback to default times if response format is unexpected
      console.warn('Unexpected API response format, using default times');
      prayerTimes = {
        imsak: "05:36",
        subuh: "05:46",
        syuruk: "06:57",
        zohor: "13:10",
        asar: "16:29",
        maghrib: "19:20",
        isyak: "20:28"
      };
    }

    await fs.writeFile(`${DATA_PATH}/prayer-times.json`, JSON.stringify(prayerTimes, null, 2));
    console.log('Prayer times updated successfully:', prayerTimes);

    return prayerTimes;
  } catch (error) {
    console.error('Prayer time update error:', error.message);
    console.error('Error details:', error.response?.data || error);

    // Return default times if API fails
    return {
      imsak: "05:36",
      subuh: "05:46",
      syuruk: "06:57",
      zohor: "13:10",
      asar: "16:29",
      maghrib: "19:20",
      isyak: "20:28"
    };
  }
};
