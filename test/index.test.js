const md2Png = require("..");

// TODO: Implement module test
test("md2png", () => {
  expect(
    md2Png("./README.md", { output: "/dist/README.png", width: 500 })
  ).toBeTruthy();
});
