const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
    token: "o2pOz2qnFhJkuXJMOz6AR4cWDM1UuFQXlsV7ZsqD",
});

async function test() {
    try {
        const response = await cohere.chat({
          model: "command-a-03-2025",
          message: "hello",
          max_tokens: 300,
          temperature: 0.7,
        });
        console.log("SUCCESS:", response);
    } catch (err) {
        console.error("ERROR:");
        console.error(err);
    }
}
test();
