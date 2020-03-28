const IsolatedTestCase = require("./isolated-test-case");
const config = require("config");

process.env["GOOGLE_APPLICATION_CREDENTIALS"] = config.get("credentialsPath");

describe("Isolated Query Runner", () => {
  let isolatedTestCase;

  beforeEach(function () {
    isolatedTestCase = new IsolatedTestCase();
    console.log(isolatedTestCase.getUuid());
  });

  afterEach(async function () {
    await isolatedTestCase.cleanUp();
    console.log(isolatedTestCase.getUuid());
  });

  it.only("successfully runs a single query", async () => {
    await isolatedTestCase.createDataset("test_dataset");
    await isolatedTestCase.createTableUsingTemplate(
      "test_table",
      "test_dataset",
      "purchases",
      "templates"
    );
    const row = {
      purchase_id: "abc",
      total: 12
    };
    await isolatedTestCase.populateTable("test_table", "test_dataset", [row]);

    const query = "SELECT * FROM test_table";
    const result = await isolatedTestCase.runQuery(query, "test_dataset");
    expect(result).toStrictEqual([row]);
    console.log("finished running");
  });

  // it("successfully runs a second query", async () => {});
});
