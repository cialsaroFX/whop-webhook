import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Webhook activo");
});

function buscarRespuesta(responses, posiblesNombres) {
  return responses.find((item) => {
    const q = (item.question || "").toLowerCase().trim();
    return posiblesNombres.some((nombre) => q.includes(nombre));
  });
}

app.post("/webhook", async (req, res) => {
  try {
    const event = req.body;
    console.log("==== WEBHOOK RECIBIDO ====");
    console.log(JSON.stringify(event, null, 2));

    if (event.type === "membership.activated") {
      const responses = event.data?.custom_field_responses || [];

      const tradingViewField = buscarRespuesta(responses, [
        "tradingview",
        "trading view",
        "usuario exacto de tradingview",
        "usuario de tradingview"
      ]);

      const supportEmailField = buscarRespuesta(responses, [
        "correo de soporte",
        "correo",
        "email"
      ]);

      const tradingviewUsername = tradingViewField?.answer || null;
      const supportEmail = supportEmailField?.answer || null;

      console.log("🔥 NUEVA COMPRA");
      console.log("TradingView:", tradingviewUsername);
      console.log("Email:", supportEmail);

      if (!tradingviewUsername) {
        console.log("⚠️ No encontré el usuario de TradingView en custom_field_responses");
      }

      // AQUÍ luego conectamos la activación automática en TradingView
    }

    if (event.type === "membership.deactivated") {
      const responses = event.data?.custom_field_responses || [];

      const tradingViewField = buscarRespuesta(responses, [
        "tradingview",
        "trading view",
        "usuario exacto de tradingview",
        "usuario de tradingview"
      ]);

      const tradingviewUsername = tradingViewField?.answer || null;

      console.log("❌ CANCELACIÓN");
      console.log("Quitar acceso a:", tradingviewUsername);

      if (!tradingviewUsername) {
        console.log("⚠️ No encontré el usuario de TradingView para quitar acceso");
      }

      // AQUÍ luego conectamos la revocación automática en TradingView
    }

    res.status(200).send("ok");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("error");
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
