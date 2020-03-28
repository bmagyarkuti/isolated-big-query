const { BigQuery } = require("@google-cloud/bigquery");
const { v4 } = require("uuid");

class IsolatedTestCase {
  constructor() {
    this.bigQuery = new BigQuery();
    this.uuid = v4();
  }

  async runQuery(query, datasetId) {
    const options = {
      query,
      location: "EU",
      defaultDataset: { datasetId: this._withUniqueId(datasetId) }
    };
    const [job] = await this.bigQuery.createQueryJob(options);
    console.log(`Job ${job.id} started.`);

    const [rows] = await job.getQueryResults();

    const results = [];
    rows.forEach(row => results.push(row));
    return results;
  }

  async createDataset(id) {
    await this.bigQuery.createDataset(this._withUniqueId(id), {
      location: "EU"
    });
  }

  async createTableUsingTemplate(
    tableId,
    datasetId,
    templateTableId,
    templateDatasetId
  ) {
    const [templateTable] = await this.bigQuery
      .dataset(templateDatasetId)
      .table(templateTableId)
      .get();

    await this.bigQuery
      .dataset(this._withUniqueId(datasetId))
      .createTable(tableId, {
        schema: templateTable.metadata.schema,
        location: "EU"
      });
  }

  async populateTable(tableId, datasetId, rows) {
    await this.bigQuery
      .dataset(this._withUniqueId(datasetId))
      .table(tableId)
      .insert(rows);
  }

  _withUniqueId(id) {
    const base64Uuid = Buffer.from(this.uuid).toString("base64");
    return `${base64Uuid}_${id}`;
  }
}

module.exports = IsolatedTestCase;
