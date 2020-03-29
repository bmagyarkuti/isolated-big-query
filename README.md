# Isolated BigQuery Runner

This tool aims to help parallelize running tests that perform
actual Google BigQuery calls, by running each query in a uniquely named dataset.
There's also a cleanup function to remove all the datasets that were
created for a test.

## Example Code:

```js
const IsolatedBigQuery = require("@bmagyarkuti/isolated-big-query");

let isolatedBigQuery;

beforeEach(function () {
  process.env["GOOGLE_APPLICATION_CREDENTIALS"] = config.get("credentialsPath");
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
  await isolatedBigQuery.populateTable("test_table", "test_dataset", [
    { some: "field" },
  ]);

  const query = "SELECT * FROM test_table";
  const result = await isolatedBigQuery.runQuery(query, "test_dataset");
  expect(result).toEqual([{ some: "field" }]);
});
```

## Development

`npm i`, then `npm t` to run tests.
