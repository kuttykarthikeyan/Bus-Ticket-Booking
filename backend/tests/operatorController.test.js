
jest.mock("../utils/authUtils.js", () => ({
  hashPassword: jest.fn(() => "hashed_password"),
}));

test("should hash password", () => {
  expect(require("../utils/authUtils.js").hashPassword()).toBe("hashed_password");
});
