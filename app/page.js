"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase কানেকশন
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default function POSBillingApp() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('Monthly Internet Bill');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const commonItems = [
    'Monthly Internet Bill', 'ONU (XPON/EPON/GPON)', 'Dual Band Router (Gigabit)',
    'Single Band Router', 'Fiber Optic Cable (Meter)', 'Cat6 / UTP Cable (Meter)',
    'Patch Cord (SC-SC/APC)', 'Media Converter (MC)', 'RJ45 Connector',
    'MikroTik Router', 'ONU Power Adapter (12V)', 'Splicing / Joint Charge',
    'Installation / Setup Charge', 'Router Configuration'
  ];

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!itemName || !price) return;
    setItems([...items, { name: itemName, price: parseFloat(price), qty: parseInt(qty) }]);
    setPrice(''); setQty(1);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleSaveAndPrint = async () => {
    if (items.length === 0) {
      alert("Please add at least one item to the bill.");
      return;
    }

    // Supabase-এ সেভ করা
    if (supabase) {
      setIsSaving(true);
      const { error } = await supabase
        .from('invoices')
        .insert([{ 
          customer_name: customerName, 
          phone: customerPhone, 
          total_amount: totalAmount, 
          items: items 
        }]);
      
      setIsSaving(false);
      if (error) {
        alert("Database Error: " + error.message);
        return;
      }
    } else {
      console.warn("Supabase credentials not found. Printing without saving to database.");
    }

    // প্রিন্ট করা
    window.print();
  };

  const handleClear = () => {
    setItems([]); setCustomerName(''); setCustomerPhone('');
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#121212] p-4 md:p-8 flex flex-col md:flex-row gap-8 font-sans text-gray-200">
      
      <div className="print:hidden w-full md:w-1/2 bg-[#1e1e1e] border border-[#2a2a2a] p-6 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-extrabold mb-6 text-[#4ade80] tracking-wide uppercase">
          PK NET <span className="text-white text-xl">Billing</span>
        </h2>
        
        <div className="mb-4 grid grid-cols-2 gap-4">
          <input type="text" placeholder="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="bg-[#2a2a2a] text-white border border-[#444] p-3 rounded-lg w-full focus:outline-none focus:border-[#4ade80]" />
          <input type="text" placeholder="Phone Number" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="bg-[#2a2a2a] text-white border border-[#444] p-3 rounded-lg w-full focus:outline-none focus:border-[#4ade80]" />
        </div>

        <form onSubmit={handleAddItem} className="mb-6 space-y-4 border-t border-[#333] pt-5">
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Select / Type Product</label>
            <input list="item-options" type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} required className="bg-[#2a2a2a] text-white border border-[#444] p-3 rounded-lg w-full focus:outline-none focus:border-[#4ade80]" />
            <datalist id="item-options">{commonItems.map((item, idx) => <option key={idx} value={item} />)}</datalist>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Unit Price (৳)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" className="bg-[#2a2a2a] text-[#4ade80] font-bold border border-[#444] p-3 rounded-lg w-full focus:outline-none focus:border-[#4ade80]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Quantity</label>
              <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} required min="1" className="bg-[#2a2a2a] text-white font-bold border border-[#444] p-3 rounded-lg w-full focus:outline-none focus:border-[#4ade80]" />
            </div>
          </div>
          <button type="submit" className="w-full bg-[#4ade80] text-[#121212] font-extrabold text-lg py-3 rounded-lg hover:bg-[#22c55e] transform active:scale-95 transition-all shadow-[0_0_15px_rgba(74,222,128,0.4)]">
            + ADD PRODUCT
          </button>
        </form>

        <div className="flex gap-4">
          <button onClick={handleSaveAndPrint} disabled={isSaving} className="flex-1 bg-white text-black font-extrabold py-3 rounded-lg hover:bg-gray-200 transform active:scale-95 transition-all disabled:opacity-50">
            {isSaving ? "SAVING..." : "SAVE & PRINT"}
          </button>
          <button onClick={handleClear} className="flex-1 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transform active:scale-95 transition-all border border-red-500">
            CLEAR
          </button>
        </div>
      </div>

      <div className="w-full md:w-auto flex justify-center border-l border-[#333] pl-0 md:pl-8 print:border-none print:p-0 print:m-0">
        <div id="printable-receipt" className="bg-white p-4 text-black w-[80mm] shadow-lg print:shadow-none print:w-[80mm] print:p-0 text-sm font-mono mx-auto">
          <div className="text-center mb-4">
            <h1 className="font-extrabold text-2xl uppercase tracking-wider text-black">PK NET</h1>
            <p className="text-xs font-bold">Khidirpur Bazar</p>
            <p className="text-xs">Hotline: 01XXX-XXXXXX</p>
            <div className="border-b-2 border-dashed border-gray-400 my-2"></div>
          </div>

          <div className="mb-4 text-xs">
            <p><strong>Date:</strong> {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
            {customerName && <p><strong>Name:</strong> {customerName}</p>}
            {customerPhone && <p><strong>Phone:</strong> {customerPhone}</p>}
          </div>

          <table className="w-full text-xs text-left mb-4">
            <thead>
              <tr className="border-b border-dashed border-gray-400">
                <th className="py-1 w-1/2">Product</th>
                <th className="py-1 w-1/4 text-center">Qty</th>
                <th className="py-1 w-1/4 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="py-1 break-words pr-2">{item.name} <br/><span className="text-[10px] text-gray-500">@{item.price}</span></td>
                  <td className="py-1 text-center align-top">{item.qty}</td>
                  <td className="py-1 text-right align-top">{item.price * item.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t-2 border-dashed border-gray-400 pt-2 mb-6">
            <div className="flex justify-between font-extrabold text-base">
              <span>TOTAL DUE:</span>
              <span>৳ {totalAmount}</span>
            </div>
          </div>

          <div className="text-center text-xs flex flex-col items-center">
            <p className="mb-2 font-bold">Thank you for your business!</p>
            <p className="mb-1">Pay via bKash / Nagad</p>
            <div className="w-20 h-20 border border-gray-800 flex items-center justify-center text-[10px] bg-gray-100 font-bold">
              [QR CODE]
            </div>
            <p className="mt-2 text-[10px] text-gray-600">Generated by PK NET System</p>
          </div>
        </div>
      </div>
    </div>
  );
}
