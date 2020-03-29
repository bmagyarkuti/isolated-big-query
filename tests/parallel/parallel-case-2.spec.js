const createPopulateQuery = require("../lib/create-populate-query");

describe.each`
  purchase_id | total
  ${"def"}    | ${24}
`("Parallel Case 1", createPopulateQuery);
