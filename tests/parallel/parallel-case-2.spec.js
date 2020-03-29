const IsolatedTestCase = require("../../src/isolated-test-case");
const config = require("config");

process.env["GOOGLE_APPLICATION_CREDENTIALS"] = config.get("credentialsPath");

describe("Parallel Case 2", () => {
  let isolatedTestCase;

  beforeEach(function () {
    isolatedTestCase = new IsolatedTestCase();
  });

  afterEach(async function () {
    await isolatedTestCase.cleanUp();
  });

  it.each`
    purchase_id | total
    ${"def"}    | ${24}
  `("creates datasets, tables, populates and queries", async row => {
    await isolatedTestCase.createDataset("test_dataset");
    await isolatedTestCase.createTableFromTemplate(
      "test_table",
      "test_dataset",
      "purchases",
      "templates"
    );
    await isolatedTestCase.populateTable("test_table", "test_dataset", [row]);

    const query = "SELECT * FROM test_table";
    const result = await isolatedTestCase.runQuery(query, "test_dataset");
    expect(result).toEqual([row]);
  });
});
