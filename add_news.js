const { db } = require("./backend/src/db/database");

const insert = db.prepare("INSERT INTO bulletins (category, message, author_id) VALUES (?, ?, ?)");

insert.run("Rescue Operations", "SDRF teams successfully rescued 15 stranded tourists from Rohtang Pass.", 1);
insert.run("Weather Alerts", "Heavy rainfall warning issued for Kangra and Mandi districts for the next 48 hours.", 1);
insert.run("Road & Transport", "NH-3 between Kullu and Manali is temporarily closed due to severe landslides.", 1);
insert.run("General Information", "Relief camps established in Shimla. Contact local authorities for emergency supplies.", 1);

console.log("Fake news added successfully!");
