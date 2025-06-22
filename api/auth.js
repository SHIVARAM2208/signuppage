const clientPromise = require("./db");
const bcrypt = require("bcryptjs");
const { signJwt, verifyJwt } = require("./jwt");

// Helper function for email and phone validation
function validateSignup({ username, password, name, email, phone }) {
  const errors = [];
  if (!username || !password || !name || !email || !phone) {
    errors.push("All fields are required.");
  }
  if (typeof email === "string" && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) {
    errors.push("Invalid email format.");
  }
  if (typeof phone === "string" && !/^\d{10,15}$/.test(phone.replace(/[^\d]/g, ""))) {
    errors.push("Invalid phone number format.");
  }
  return errors;
}

module.exports = async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("signuppage");
  const users = db.collection("users");

  if (req.method === "POST" && req.query.action === "signup") {
    const { username, password, name, email, phone } = req.body;
    const errors = validateSignup({ username, password, name, email, phone });
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(" ") });
    }
    const existing = await users.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.status(409).json({ error: "User or email already exists" });
    }
    const hashed = await bcrypt.hash(password, 10);
    await users.insertOne({
      username,
      password: hashed,
      name,
      email,
      phone,
      createdAt: new Date()
    });
    return res.status(201).json({ message: "User created" });
  }

  if (req.method === "POST" && req.query.action === "login") {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "Missing fields" });
    const user = await users.findOne({ username });
    if (!user)
      return res.status(401).json({ error: "Invalid credentials" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: "Invalid credentials" });
    // JWT token for sessionless authentication
    const token = signJwt({ username: user.username, id: user._id });
    return res.status(200).json({ message: "Login successful", token });
  }

  if (req.method === "GET" && req.query.action === "me") {
    // Example protected route usage
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "No token" });
    const token = auth.split(" ")[1];
    const payload = verifyJwt(token);
    if (!payload) return res.status(401).json({ error: "Invalid token" });
    // Fetch full user info except password
    const user = await users.findOne({ username: payload.username }, { projection: { password: 0 } });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json({ user });
  }

  return res.status(405).json({ error: "Method not allowed" });
};

module.exports.config = {
  api: {
    bodyParser: true,
  },
};
