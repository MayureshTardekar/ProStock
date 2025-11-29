export const isMarketOpen = (): boolean => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istTime = new Date(now.getTime() + istOffset);
    const day = istTime.getUTCDay(); // 0=Sunday, 6=Saturday
    const hours = istTime.getUTCHours();
    const minutes = istTime.getUTCMinutes();
    const totalMinutes = hours * 60 + minutes;

    // NSE hours: 9:15 AM (555 min) to 3:30 PM (930 min), Mon-Fri
    const marketStart = 9 * 60 + 15; // 9:15 AM = 555 minutes
    const marketEnd = 15 * 60 + 30;   // 3:30 PM = 930 minutes
    const isWeekday = day >= 1 && day <= 5; // Monday to Friday

    // Simple holiday check (YYYY-MM-DD)
    const todayStr = istTime.toISOString().split('T')[0];
    const holidays = [
        "2024-01-26", // Republic Day
        "2024-03-08", // Mahashivratri
        "2024-03-25", // Holi
        "2024-03-29", // Good Friday
        "2024-04-11", // Id-Ul-Fitr
        "2024-04-17", // Ram Navami
        "2024-05-01", // Maharashtra Day
        "2024-06-17", // Bakri Id
        "2024-07-17", // Moharram
        "2024-08-15", // Independence Day
        "2024-10-02", // Gandhi Jayanti
        "2024-11-01", // Diwali
        "2024-11-15", // Gurunanak Jayanti
        "2024-12-25", // Christmas
    ];
    const isHoliday = holidays.includes(todayStr);

    const isMarketHours = totalMinutes >= marketStart && totalMinutes < marketEnd;
    return isWeekday && isMarketHours && !isHoliday;
};
