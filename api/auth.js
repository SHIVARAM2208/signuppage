const clientPromise = require("./db");
const bcrypt = require("bcryptjs");
const { signJwt, verifyJwt } = require("./jwt");

module.exports = async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("signuppage");
  const users = db.collection("users");

  if (req.method === "POST" && req.query.action === "signup") {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "Missing fields" });
    const existing = await users.findOne({ username });
    if (existing)
      return res.status(409).json({ error: "User already exists" });
    const hashed = await bcrypt.hash(password, 10);
    await users.insertOne({ username, password: hashed });
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
    return res.status(200).json({ user: payload });
  }

  return res.status(405).json({ error: "Method not allowed" });
};

module.exports.config = {
  api: {
    bodyParser: true,
  },
};
