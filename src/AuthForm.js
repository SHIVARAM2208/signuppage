import React, { useState } from "react";

export default function SignupForm() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    phone: "",
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("Signing up...");
    const res = await fetch("/api/auth?action=signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setMsg(data.message || data.error);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Sign Up</h2>
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        required
        style={{ width: "100%", margin: "8px 0", padding: 8 }}
      />
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        required
        style={{ width: "100%", margin: "8px 0", padding: 8 }}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        style={{ width: "100%", margin: "8px 0", padding: 8 }}
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
        required
        pattern="[0-9]{10,15}"
        style={{ width: "100%", margin: "8px 0", padding: 8 }}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
        style={{ width: "100%", margin: "8px 0", padding: 8 }}
      />
      <button type="submit" style={{ width: "100%", padding: 10 }}>
        Sign Up
      </button>
      {msg && <div style={{ marginTop: 10 }}>{msg}</div>}
    </form>
  );
}
