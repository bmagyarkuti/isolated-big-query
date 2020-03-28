const IsolatedTestCase = require("./isolated-test-case");
const config = require("config");

process.env["GOOGLE_APPLICATION_CREDENTIALS"] = config.get("credentialsPath");

describe("Isolated Query Runner", () => {
  it("successfully runs a single query", async () => {
    const isolatedTestCase = new IsolatedTestCase();
    await isolatedTestCase.createDataset("test_dataset");
    await isolatedTestCase.createTableUsingTemplate(
      "test_table",
      "test_dataset",
      "purchases",
      "templates"
    );

    await isolatedTestCase.populateTable("test_table", "test_dataset", [
      {
        purchase_id: "abc",
        total: 12
      }
    ]);

    const query = "SELECT * FROM test_table";

    expect(
      await isolatedTestCase.runQuery(query, "test_dataset")
    ).toStrictEqual([
      {
        purchase_id: "abc",
        total: 12
      }
    ]);
  });

  it("successfully runs a second query", async () => {});
});
