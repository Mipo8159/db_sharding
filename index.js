const app = require("express")();
const { Client } = require("pg");
const crypto = require("crypto");
const HashRing = require("hashring");
const hr = new HashRing();

hr.add("5435");
hr.add("5436");
hr.add("5437");

const clients = {
  5435: new Client({
    host: "localhost",
    port: "5435",
    user: "postgres",
    password: "Monolith8159",
    database: "postgres",
  }),
  5436: new Client({
    host: "localhost",
    port: "5436",
    user: "postgres",
    password: "Monolith8159",
    database: "postgres",
  }),
  5437: new Client({
    host: "localhost",
    port: "5437",
    user: "postgres",
    password: "Monolith8159",
    database: "postgres",
  }),
};

async function connect() {
  await clients["5435"].connect();
  await clients["5436"].connect();
  await clients["5437"].connect();
}
connect();

app.get("/:urlId", async (req, res) => {
  const urlId = req.params.urlId;
  const server = hr.get(urlId);

  const results = await clients[server].query(
    "SELECT * FROM url_table WHERE url_id = $1",
    [urlId]
  );

  if (results.rowCount > 0) {
    res.send({
      result: results.rows[0],
      server,
    });
  } else {
    res.sendStatus(404);
  }
});

app.post("/", async (req, res) => {
  const url = req.query.url;
  const hash = crypto.createHash("sha256").update(url).digest("base64");
  const urlId = hash.substring(0, 5);
  const server = hr.get(urlId);

  const response = await clients[server].query(
    "INSERT INTO url_table(url, url_id) VALUES ($1, $2)",
    [url, urlId]
  );

  res.send({
    response,
    url,
    hash,
    server,
  });
});

app.listen(8081, () => console.log("Listening to 8081"));
