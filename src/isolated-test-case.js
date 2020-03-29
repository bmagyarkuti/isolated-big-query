const { BigQuery } = require("@google-cloud/bigquery");
const OpsStack = require("./ops-stack/ops-stack");
const { v4 } = require("uuid");
const sleep = require("./sleep/sleep");

class IsolatedTestCase {
  constructor() {
    this._bigQuery = new BigQuery();
    this._uuid = v4();
    this._cleanUpStack = new OpsStack();
  }

  getUuid() {
    return this._withUniqueId("");
  }

  async createDataset(id) {
    await this._bigQuery.createDataset(this._withUniqueId(id), {
      location: "EU"
    });
    this._cleanUpStack.addOperation(async () => {
      this.deleteDataset(id);
    });
  }

  async deleteDataset(id) {
    await this._bigQuery
      .dataset(this._withUniqueId(id))
      .delete({ force: true });
  }

  async createTableFromTemplate(
    tableId,
    datasetId,
    templateTableId,
    templateDatasetId
  ) {
    const [templateTable] = await this._bigQuery
      .dataset(templateDatasetId)
      .table(templateTableId)
      .get();

    await this._bigQuery
      .dataset(this._withUniqueId(datasetId))
      .createTable(tableId, {
        schema: templateTable.metadata.schema,
        location: "EU"
      });
  }

  async populateTable(tableId, datasetId, rows) {
    await this._bigQuery
      .dataset(this._withUniqueId(datasetId))
      .table(tableId)
      .insert(rows);
    await sleep(1000);
  }

  async runQuery(query, datasetId) {
    const options = {
      query,
      location: "EU",
      defaultDataset: { datasetId: this._withUniqueId(datasetId) }
    };
    const [job] = await this._bigQuery.createQueryJob(options);
    const [rows] = await job.getQueryResults();
    return rows.reduce((rows, row) => [...rows, row], []);
  }

  async cleanUp() {
    await this._cleanUpStack.perform();
  }

  _withUniqueId(id) {
    const base64Uuid = Buffer.from(this._uuid).toString("base64");
    return `${base64Uuid}_${id}`;
  }
}

module.exports = IsolatedTestCase;
