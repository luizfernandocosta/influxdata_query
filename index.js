const dotenv = require("dotenv").config();

const { InfluxDB } = require("@influxdata/influxdb-client");

const token = process.env.INFLUXDB_TOKEN;
const url = process.env.INFLUXDB_HOST;

const client = new InfluxDB({ url, token });

let queryClient = client.getQueryApi(process.env.INFLUXDB_ORG);

const handleData = async (event) => {

  // This is only a test query, will change later for the query coming from the sensor
  let fluxQuery = `from(bucket: "test")
    |> range(start: ${event.time})
    |> filter(fn: (r) => r._measurement == "temperature")`;

  let collectedData = []

  try 
  {
    const data = queryClient.collectRows(fluxQuery);

    (await data).forEach((x) => collectedData.push(JSON.stringify(x)))
  }
  catch (e)
  {
    console.error(e)
  }

  return collectedData;

};

exports.handler = handleData;
