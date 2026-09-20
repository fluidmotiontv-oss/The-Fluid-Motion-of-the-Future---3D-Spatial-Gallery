/**
 * Dragon 9 Temporal Standard Utility
 * 1 Day = 1440 Minutes (Standard Earth Day)
 * 1 Hour = 54 Minutes
 * 1 Day = 26.66... Dragon 9 Hours
 * Intermissions: Midday and Midnight recalibration periods.
 */

export interface Dragon9Time {
  hour: number;
  minute: number;
  second: number;
  isIntermission: boolean;
  intermissionType: 'midday' | 'midnight' | null;
  totalDayMinutes: number;
  formatted: string;
  remainingSecondsIntermission: number;
}

export function getDragon9Time(date: Date = new Date()): Dragon9Time {
  // Sync to New Zealand Time (Port Waikato / 'pee dub' context)
  const nzDate = new Date(date.toLocaleString('en-US', { timeZone: 'Pacific/Auckland' }));
  
  const h = nzDate.getHours();
  const m = nzDate.getMinutes();
  const s = nzDate.getSeconds();
  
  const totalMinutes = h * 60 + m;
  const totalSeconds = totalMinutes * 60 + s;
  
  // Dragon 9 Calculation
  // 1 D9 Hour = 54 Minutes = 3240 Seconds
  const d9HourRaw = totalSeconds / 3240;
  const d9Hour = Math.floor(d9HourRaw);
  const remainingSeconds = totalSeconds % 3240;
  const d9Minute = Math.floor(remainingSeconds / 60);
  const d9Second = remainingSeconds % 60;
  
  // Intermission Logic
  let isIntermission = false;
  let intermissionType: 'midday' | 'midnight' | null = null;
  let remainingSecondsIntermission = 0;
  
  // Midday Intermission (around hour 13)
  // Starts at 13:00:00 (minute 702), ends at 13:18:00 (minute 720)
  const totalD9Seconds = totalSeconds;
  const middayStartSeconds = 13 * 3240;
  const middayEndSeconds = middayStartSeconds + (18 * 60);

  if (totalD9Seconds >= middayStartSeconds && totalD9Seconds < middayEndSeconds) {
    isIntermission = true;
    intermissionType = 'midday';
    remainingSecondsIntermission = middayEndSeconds - totalD9Seconds;
  }
  
  // Midnight Intermission (end of day)
  // Starts at 26:00:00 (minute 1404), ends at 1440:00 (minute 1440)
  const midnightStartSeconds = 26 * 3240;
  const midnightEndSeconds = 1440 * 60;

  if (totalD9Seconds >= midnightStartSeconds) {
    isIntermission = true;
    intermissionType = 'midnight';
    remainingSecondsIntermission = midnightEndSeconds - totalD9Seconds;
  }

  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatted = isIntermission 
    ? `INTERMISSION [${intermissionType?.toUpperCase()}]`
    : `${pad(d9Hour)}:${pad(d9Minute)}:${pad(d9Second)} D9`;

  return {
    hour: d9Hour,
    minute: d9Minute,
    second: d9Second,
    isIntermission,
    intermissionType,
    totalDayMinutes: totalMinutes,
    formatted,
    remainingSecondsIntermission
  };
}
