"use client";

import { useState } from "react";

export default function ProductForm() {

  const [name, setName] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [stock, setStock] = useState("");

  async function handleSubmit(e) {

    e.preventDefault();

    await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify({
        name,
        buyPrice: Number(buyPrice),
        sellPrice: Number(sellPrice),
        stock: Number(stock),
      }),
    });

    alert("Product Added");

    setName("");
    setBuyPrice("");
    setSellPrice("");
    setStock("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow space-y-4"
    >
      <input
        className="border p-3 w-full"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="border p-3 w-full"
        placeholder="Buy Price"
        value={buyPrice}
        onChange={(e) => setBuyPrice(e.target.value)}
      />

      <input
        className="border p-3 w-full"
        placeholder="Sell Price"
        value={sellPrice}
        onChange={(e) => setSellPrice(e.target.value)}
      />

      <input
        className="border p-3 w-full"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />

      <button className="bg-blue-600 text-white px-5 py-3 rounded">
        Save Product
      </button>

    </form>
  );
}