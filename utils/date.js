/**
 * Get the date with UTC format
 * @param {Date} date
 * @returns {string}
 */
exports.getUTC = (date) => {
  const result = date.toISOString();
  // get rid of the time zone
  return `${result.slice(0, result.length - 5)}Z`;
};

/**
 * Generate one week range data with the input date
 * @param {Date} date
 * @returns {Date[]}
 */
exports.getOneWeekRange = (start) => {
  return [...Array(7).keys()].map((key) => this.getCertainDate(start, key));
};

/**
 * Generate one week range for available date and expired date
 * @param {Date} date
 * @returns {[[string, string]]} [availableAt, expiresAt]
 */
exports.getRewardsRange = (start) => {
  return this.getOneWeekRange(start).map((date) => [
    this.getUTC(date),
    this.getUTC(this.getCertainDate(date)),
  ]);
};

/**
 * Get the next certain date with specific day
 * it is able to generate tomorrow via getCertainDate(date, 1) or getCertainDate(date)
 * @param {Date} date
 * @returns {Date}
 */
exports.getCertainDate = (date, next = 1) => {
  return new Date(this.transformDate(date).setDate(date.getDate() + next));
};

/**
 * whether date is valid with UTC format.
 * @param {string} date
 * @returns {boolean}
 */
exports.checkDate = (date) => {
  return !isNaN(Date.parse(date));
};

/**
 * Transform string to date
 * @param {string} date
 * @returns {Date}
 */
exports.transformDate = (date) => new Date(date);

/**
 * whether the input date is not passed yet to the expired date
 * @param {Date} date
 * @param {Date} expiresAt
 */
exports.checkExpired = (date, expiresAt) => {
  if (date <= expiresAt) {
    return false;
  }
  return true;
};
