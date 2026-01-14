// Timeline utility functions for overlap detection and visualization

/**
 * Check if two date ranges overlap
 * @param {string} start1 - Start date of first range (YYYY-MM-DD)
 * @param {string} end1 - End date of first range (YYYY-MM-DD or null for ongoing)
 * @param {string} start2 - Start date of second range (YYYY-MM-DD)
 * @param {string} end2 - End date of second range (YYYY-MM-DD or null for ongoing)
 * @returns {boolean} - True if ranges overlap
 */
export const datesOverlap = (start1, end1, start2, end2) => {
  const s1 = new Date(start1);
  const e1 = end1 ? new Date(end1) : new Date(); // If no end date, assume current
  const s2 = new Date(start2);
  const e2 = end2 ? new Date(end2) : new Date();

  // Check if ranges overlap: start1 <= end2 AND end1 >= start2
  return s1 <= e2 && e1 >= s2;
};

/**
 * Find all timeline entries that overlap with a given entry
 * @param {Object} entry - Timeline entry to check
 * @param {Array} allEntries - All timeline entries
 * @returns {Array} - Array of overlapping entries
 */
export const findOverlappingEntries = (entry, allEntries) => {
  if (!entry.startDate) return [];

  return allEntries.filter(other => {
    if (other.id === entry.id) return false; // Don't compare with self
    if (!other.startDate) return false;

    return datesOverlap(
      entry.startDate,
      entry.endDate,
      other.startDate,
      other.endDate
    );
  });
};

/**
 * Calculate overlap count for each timeline entry
 * @param {Array} entries - All timeline entries
 * @returns {Object} - Map of entry id to overlap count and overlapping entries
 */
export const calculateOverlaps = (entries) => {
  const overlaps = {};

  entries.forEach(entry => {
    const overlapping = findOverlappingEntries(entry, entries);
    overlaps[entry.id] = {
      count: overlapping.length,
      entries: overlapping
    };
  });

  return overlaps;
};

/**
 * Organize timeline entries into swimlanes for visualization
 * Entries that overlap are placed in different swimlanes
 * @param {Array} entries - Timeline entries sorted by start date
 * @returns {Array} - Array of swimlanes, each containing non-overlapping entries
 */
export const organizeIntoSwimlanes = (entries) => {
  if (!entries || entries.length === 0) return [];

  // Sort entries by start date
  const sorted = [...entries].sort((a, b) => {
    const dateA = new Date(a.startDate || '1970-01-01');
    const dateB = new Date(b.startDate || '1970-01-01');
    return dateA - dateB;
  });

  const swimlanes = [];

  sorted.forEach(entry => {
    // Find the first swimlane where this entry doesn't overlap with any existing entry
    let placed = false;

    for (let i = 0; i < swimlanes.length; i++) {
      const lane = swimlanes[i];
      const hasOverlap = lane.some(existingEntry =>
        datesOverlap(
          entry.startDate,
          entry.endDate,
          existingEntry.startDate,
          existingEntry.endDate
        )
      );

      if (!hasOverlap) {
        lane.push(entry);
        placed = true;
        break;
      }
    }

    // If no suitable swimlane found, create a new one
    if (!placed) {
      swimlanes.push([entry]);
    }
  });

  return swimlanes;
};

/**
 * Format date range for display
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD or null)
 * @returns {string} - Formatted date range
 */
export const formatDateRange = (startDate, endDate) => {
  if (!startDate) return 'N/A';

  const start = new Date(startDate);
  const startStr = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  if (!endDate) {
    return `${startStr} - Present`;
  }

  const end = new Date(endDate);
  const endStr = end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return `${startStr} - ${endStr}`;
};

/**
 * Calculate duration in months
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD or null for ongoing)
 * @returns {number} - Duration in months
 */
export const calculateDuration = (startDate, endDate) => {
  if (!startDate) return 0;

  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  const months = (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  return Math.max(1, months); // Minimum 1 month
};

/**
 * Migrate old timeline entries to new format
 * Converts period string to startDate/endDate if needed
 * @param {Object} entry - Timeline entry
 * @returns {Object} - Migrated entry
 */
export const migrateTimelineEntry = (entry) => {
  // If entry already has startDate, return as-is
  if (entry.startDate) {
    return {
      ...entry,
      tags: entry.tags || [],
      status: entry.status || 'Completed'
    };
  }

  // If entry has old "period" format, try to parse it
  if (entry.period) {
    // Try to extract dates from period string
    // This is a best-effort migration
    const periodLower = entry.period.toLowerCase();

    // Default to 3 months ago as start date, present as end date
    const defaultStart = new Date();
    defaultStart.setMonth(defaultStart.getMonth() - 3);

    return {
      ...entry,
      startDate: defaultStart.toISOString().split('T')[0],
      endDate: periodLower.includes('present') || periodLower.includes('current') ? null : new Date().toISOString().split('T')[0],
      tags: entry.tags || [],
      status: entry.status || 'Completed',
      // Keep period for reference
      period: entry.period
    };
  }

  return entry;
};
