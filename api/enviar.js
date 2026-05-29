const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyxKTBszB3_5oWaVH0pBelx3jG-svQoMxSnEvdc0K6HHb7FYq6wR2FcXWixVjArQtiJ/exec";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ status: "erro", mensagem: "Método não permitido" });
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(req.body),
      redirect: "follow",
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { status: "ok", raw: text };
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ status: "erro", mensagem: err.message });
  }
}
