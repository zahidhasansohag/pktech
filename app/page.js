"use client";

import { useState, useEffect } from 'react';

export default function POSBillingApp() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('Monthly Internet Bill');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // কমন আইটেমের লিস্ট
  const commonItems = [
    'Monthly Internet Bill',
    'ONU (ZTE/EPON)',
    'Dual Band Router',
    'Fiber Cable (Meter)',
    'Patch Cord',
    'Router Configuration'
  ];

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!itemName || !price) return;
    
    setItems([...items, { name: itemName, price: parseFloat(price), qty: parseInt(qty) }]);
    setPrice('');
    setQty(1);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleClear = () => {
    setItems([]);
    setCustomerName('');
    setCustomerPhone('');
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col md:flex-row gap-8 font-sans">
      
      {/* ---------------- ইনপুট সেকশন (প্রিন্টের সময় হাইড থাকবে) ---------------- */}
      <div className="print:hidden w-full md:w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">New Invoice</h2>
        
        <div className="mb-4 grid grid-cols-2 gap-4">
          <input 
            type="text" placeholder="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)}
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="text" placeholder="Phone Number" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)}
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <form onSubmit={handleAddItem} className="mb-6 space-y-4 border-t pt-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Select / Type Item</label>
            <input 
              list="item-options" type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} required
              className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <datalist id="item-options">
              {commonItems.map((item, idx) => <option key={idx} value={item} />)}
            </datalist>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Price (৳)</label>
              <input 
                type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0"
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Quantity</label>
              <input 
                type="number" value={qty} onChange={(e) => setQty(e.target.value)} required min="1"
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition">
            Add to Bill
          </button>
        </form>

        <div className="flex gap-4">
          <button onClick={handlePrint} className="flex-1 bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 transition">
            Print Bill (80mm)
          </button>
          <button onClick={handleClear} className="flex-1 bg-red-500 text-white font-bold py-3 rounded hover:bg-red-600 transition">
            Clear All
          </button>
        </div>
      </div>

      {/* ---------------- মেমো / রিসিট সেকশন (প্রিন্টের সময় শুধুমাত্র এটি দেখাবে) ---------------- */}
      <div className="w-full md:w-auto flex justify-center border-l pl-0 md:pl-8 print:border-none print:p-0 print:m-0">
        <div 
          id="printable-receipt" 
          className="bg-white p-4 text-black w-[80mm] shadow-lg print:shadow-none print:w-[80mm] print:p-0 text-sm font-mono mx-auto"
        >
          {/* হেডার */}
          <div className="text-center mb-4">
            <h1 className="font-bold text-2xl uppercase tracking-wider">PK NET</h1>
            <p className="text-xs">Khidirpur Bazar</p>
            <p className="text-xs">Hotline: 01XXX-XXXXXX</p>
            <div className="border-b-2 border-dashed border-gray-400 my-2"></div>
          </div>

          {/* কাস্টমার ইনফো */}
          <div className="mb-4 text-xs">
            <p><strong>Date:</strong> {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
            {customerName && <p><strong>Name:</strong> {customerName}</p>}
            {customerPhone && <p><strong>Phone:</strong> {customerPhone}</p>}
          </div>

          {/* আইটেম টেবিল */}
          <table className="w-full text-xs text-left mb-4">
            <thead>
              <tr className="border-b border-dashed border-gray-400">
                <th className="py-1 w-1/2">Item</th>
                <th className="py-1 w-1/4 text-center">Qty</th>
                <th className="py-1 w-1/4 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="py-1 break-words pr-2">{item.name}</td>
                  <td className="py-1 text-center">{item.qty}</td>
                  <td className="py-1 text-right">{item.price * item.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* টোটাল বিল */}
          <div className="border-t-2 border-dashed border-gray-400 pt-2 mb-6">
            <div className="flex justify-between font-bold text-base">
              <span>Grand Total:</span>
              <span>৳ {totalAmount}</span>
            </div>
          </div>

          {/* ফুটার ও কিউআর কোড (প্রতীকী) */}
          <div className="text-center text-xs flex flex-col items-center">
            <p className="mb-2">Thank you for staying connected!</p>
            <p className="mb-1">Pay via bKash/Nagad</p>
            <div className="w-20 h-20 border border-gray-800 flex items-center justify-center text-[10px] bg-gray-100">
              [QR Code]
            </div>
            <p className="mt-2 text-[10px] text-gray-500">Software Generated Receipt</p>
          </div>
        </div>
      </div>

    </div>
  );
}
