const createPopulateQuery = require("../lib/create-populate-query");

describe.each`
  purchase_id | total
  ${"abc"}    | ${12}
`("Parallel Case 1", createPopulateQuery);
