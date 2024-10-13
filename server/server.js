require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const stripe = require("stripe")(
  "sk_test_51PnMK1P1s4sL0zpChNrKS9ZKevUO9X2MLnkVbmtg36MbutLoRomYM0BoKWzuZCRyKl98K97TJ1incOtPTgg6dAa700ZYXoKV34"
);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));
mongoose
  .connect(process.env.MONGO_URI + "/userAuth")
  .then(() => {
    console.log("Connected to MongoDB (userAuth)");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB (userAuth)", error);
  });

const queryConnection = mongoose.createConnection(
  process.env.MONGO_URI + "/userQuery"
);

queryConnection.on("connected", () => {
  console.log("Connected to MongoDB (userQuery)");
});
queryConnection.on("error", (err) => {
  console.error("Failed to connect to MongoDB (userQuery)", err);
});
const userSchema = new mongoose.Schema({
  emailOrPhone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const querySchema = new mongoose.Schema({
  email: { type: String, required: true },
  query: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);
const Query = queryConnection.model("Query", querySchema);
let cart = [];
app.post("/signup", async (req, res) => {
  try {
    const { emailOrPhone, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).send("Passwords do not match");
    }
    const existingUser = await User.findOne({ emailOrPhone });
    if (existingUser) {
      return res.status(400).send("User already exists. Please log in.");
    }
    const newUser = new User({ emailOrPhone, password });
    await newUser.save();

    res.status(201).send("Signup successful");
  } catch (error) {
    console.error("Error during signup", error);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/connect", async (req, res) => {
  try {
    const { email, query } = req.body;
    if (!email || !query) {
      return res.status(400).json({ error: "Email and query are required" });
    }
    const newQuery = new Query({ email, query });
    await newQuery.save();

    res.status(200).json({ message: "Query saved successfully" });
  } catch (err) {
    console.error("Error saving query:", err);
    res.status(500).json({ error: "Failed to save query" });
  }
});
app.post("/login", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    const user = await User.findOne({ emailOrPhone, password });
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    res.send("Login successful");
  } catch (error) {
    console.error("Error during login", error);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/reset-password", async (req, res) => {
  try {
    const { emailOrPhone, newPassword, confirmNewPassword } = req.body;
    if (newPassword !== confirmNewPassword) {
      return res.status(400).send("Passwords do not match");
    }
    const user = await User.findOne({ emailOrPhone });
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.password = newPassword;
    await user.save();

    res.send("Password reset successful");
  } catch (error) {
    console.error("Error during password reset", error);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/stripe-checkout", async (req, res) => {
  try {
    const { items } = req.body;
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          images: [item.imgSrc],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://dukan-t3yb.onrender.com//success.html",
      cancel_url: "http://dukan-t3yb.onrender.com//cancel.html",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe Checkout session:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/clear-cart", async (req, res) => {
  try {
    cart = [];
    res.status(200).send("Cart cleared");
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).send("Failed to clear cart");
  }
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
app.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "success.html"));
});
app.get("/cancel", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "cancel.html"));
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
