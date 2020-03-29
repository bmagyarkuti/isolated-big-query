const IsolatedTestCase = require("../../src/isolated-test-case");
const config = require("config");

module.exports = row => {
  let isolatedTestCase;

  beforeEach(function () {
    process.env["GOOGLE_APPLICATION_CREDENTIALS"] = config.get(
      "credentialsPath"
    );
    isolatedTestCase = new IsolatedTestCase();
  });

  afterEach(async function () {
    await isolatedTestCase.cleanUp();
  });

  it("creates datasets, tables, populates and queries", async () => {
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
};
