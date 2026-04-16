import express from "express";

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
  try {
    const event = req.body;

    if (event.type === "membership.activated") {
      const responses = event.data.custom_field_responses || [];

      const tradingViewField = responses.find(
        (item) => item.question === "Usuario EXACTO de TradingView"
      );

      const supportEmailField = responses.find(
        (item) => item.question === "👉 Correo de soporte"
      );

      const tradingviewUsername = tradingViewField?.answer || null;
      const supportEmail = supportEmailField?.answer || null;

      console.log("🔥 NUEVA COMPRA");
      console.log("TradingView:", tradingviewUsername);
      console.log("Email:", supportEmail);
    }

    if (event.type === "membership.deactivated") {
      const responses = event.data.custom_field_responses || [];

      const tradingViewField = responses.find(
        (item) => item.question === "Usuario EXACTO de TradingView"
      );

      const tradingviewUsername = tradingViewField?.answer || null;

      console.log("❌ CANCELACIÓN");
      console.log("Quitar acceso a:", tradingviewUsername);
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
