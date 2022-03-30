const request = require("supertest");
const app = require("../app");
const { getUTC, getCertainDate } = require("../utils/date");

describe("Rewards API scenario", () => {
  it("should work well with default route", (done) => {
    request(app).get("/").expect(200, done);
  });

  it("should show all rewards with desired results", async () => {
    const result = await request(app).get(
      "/users/1/rewards?at=2020-03-15T00:00:00Z"
    );
    const partialData = [
      {
        availableAt: "2020-03-15T00:00:00Z",
        expiresAt: "2020-03-16T00:00:00Z",
        redeemedAt: null,
      },
      {
        availableAt: "2020-03-21T00:00:00Z",
        expiresAt: "2020-03-22T00:00:00Z",
        redeemedAt: null,
      },
    ];
    expect(result.body.data.length).toEqual(7);
    expect(result.body.data).toEqual(expect.arrayContaining(partialData));
  });

  it("should able to redeem with the proper date", async () => {
    const today = new Date();
    const todayUTC = getUTC(today).slice(0, 10) + "T00:00:00Z";
    await request(app).get(`/users/1/rewards?at=${todayUTC}`);
    const result = await request(app).patch(
      `/users/1/rewards/${todayUTC}/redeem`
    );
    expect(result.body.data).toEqual(
      expect.objectContaining({
        availableAt: todayUTC,
      })
    );
  });

  it("should return expired status if the current time was passed to the redeem's expired date", async () => {
    const today = new Date();
    const twoDaysAgo = getCertainDate(today, -2);
    const dateWithUTC = getUTC(twoDaysAgo).slice(0, 10) + "T00:00:00Z";
    await request(app).get(`/users/1/rewards?at=${dateWithUTC}`);
    const result = await request(app).patch(
      `/users/1/rewards/${dateWithUTC}/redeem`
    );

    expect(result.body).toEqual(
      expect.objectContaining({
        error: "This reward is already expired",
      })
    );
  });

  it("should throw with reward expired message", async () => {
    await request(app).get("/users/1/rewards?at=2020-03-15T00:00:00Z");
    const result = await request(app).patch(
      "/users/1/rewards/2020-03-25T00:00:00Z/redeem"
    );
    expect(result.body).toEqual(
      expect.objectContaining({
        error: "This reward is already expired",
      })
    );
  });
});
