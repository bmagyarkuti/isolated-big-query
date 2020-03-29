const IsolatedBigQuery = require("../../src/isolated-big-query");
const config = require("config");

module.exports = (row) => {
  let isolatedBigQuery;

  beforeEach(function () {
    process.env["GOOGLE_APPLICATION_CREDENTIALS"] = config.get(
      "credentialsPath"
    );
    isolatedBigQuery = new IsolatedBigQuery();
  });

  afterEach(async function () {
    await isolatedBigQuery.cleanUp();
  });

  it("creates, populates and queries", async () => {
    await isolatedBigQuery.createDataset("test_dataset");
    await isolatedBigQuery.createTableFromTemplate(
      "test_table",
      "test_dataset",
      "purchases",
      "templates"
    );
    await isolatedBigQuery.populateTable("test_table", "test_dataset", [row]);

    const query = "SELECT * FROM test_table";
    const result = await isolatedBigQuery.runQuery(query, "test_dataset");
    expect(result).toEqual([row]);
  });
};
