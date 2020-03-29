const createPopulateQuery = require("../lib/create-populate-query");

describe.each`
  purchase_id | total
  ${"abc"}    | ${12}
  ${"def"}    | ${24}
`("Serial Cases", createPopulateQuery);
