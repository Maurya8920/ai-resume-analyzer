const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://namanmaurya4575_db_user:GNeimXCizboZScud@cluster0.gmshf1k.mongodb.net/?appName=Cluster0"
)
.then(() => {
  console.log("✅ Database Connected Successfully");
})
.catch((err) => {
  console.error("❌ Database Connection Error:", err.message);
});