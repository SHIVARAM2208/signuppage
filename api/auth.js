// Express-like API handler for login and signup
import clientPromise from "./db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("signuppage"); // Change as needed
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
    // For production, use JWT or sessions; here we just return success
    return res.status(200).json({ message: "Login successful" });
  }

  res.status(405).json({ error: "Method not allowed" });
}

export const config = {
  api: {
    bodyParser: true,
  },
};
