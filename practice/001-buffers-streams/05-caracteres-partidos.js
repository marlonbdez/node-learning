const fs = require("node:fs");
fs.writeFileSync("ene.txt", "ñ");

fs.createReadStream("ene.txt", { highWaterMark: 1 }).on("data", (c) =>
  console.log("sin encoding:", c, c.toString()),
);

fs.createReadStream("ene.txt", { highWaterMark: 1, encoding: "utf8" }).on(
  "data",
  (c) => console.log("con encoding:", typeof c, c),
);
