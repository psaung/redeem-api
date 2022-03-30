const {
  getUTC,
  checkDate,
  getCertainDate,
  getOneWeekRange,
  getRewardsRange,
  transformDate,
  checkExpired,
} = require("../utils/date");
const { compose } = require("../utils/fp");

describe("Date Utilities", () => {
  it("should validate the date with truthy or falsy depends on the input", () => {
    const validDate = "2020-03-15T00:00:00Z";
    expect(checkDate(validDate)).toBe(true);

    const invalidDate = "2020-03-15T00";
    expect(checkDate(invalidDate)).toBe(false);
  });

  it("should give back the tomorrow date", () => {
    const today = "2020-03-15T00:00:00Z";
    const result = "2020-03-16T00:00:00Z";
    const fn = compose(transformDate, getCertainDate, getUTC);
    expect(fn(today)).toBe(result);
  });

  it("should generate one week interval", () => {
    const start = "2020-03-15T00:00:00Z";
    const end = "2020-03-21T00:00:00Z";
    const fn = compose(transformDate, getOneWeekRange);
    expect(fn(start).map((date) => getUTC(date))).toEqual(
      expect.arrayContaining([start, end])
    );
  });

  it("should generate rewards", () => {
    const start = "2020-03-15T00:00:00Z";
    const first = ["2020-03-15T00:00:00Z", "2020-03-16T00:00:00Z"];
    const last = ["2020-03-21T00:00:00Z", "2020-03-22T00:00:00Z"];
    const fn = compose(transformDate, getRewardsRange);
    expect(fn(start)).toEqual(expect.arrayContaining([first, last]));
  });

  it("should not pass the current date", () => {
    const today = new Date();
    const tomorrow = getCertainDate(today, 1);
    expect(checkExpired(today, tomorrow)).toEqual(false);
  });

  it("should pass the current date", () => {
    const today = new Date();
    const yesterday = getCertainDate(today, -1);
    expect(checkExpired(today, yesterday)).toEqual(true);
  });
});
