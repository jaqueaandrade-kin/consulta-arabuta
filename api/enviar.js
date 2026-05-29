const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxyJZqBynvNwk8qkEyz2QlDVdhzXHXvb3la7QGCESzhePlFnw_v6-Ueay391XwseMM0/exec";

module.exports = async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  try {
    const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: body,
      redirect: "follow",
    });

    const text = await response.text();
    return res.status(200).send(text);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};
