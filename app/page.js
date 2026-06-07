"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase Connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default function PKTechPremiumApp() {
  const [activeTab, setActiveTab] = useState('billing'); // 'billing' or 'dashboard'
  const [isMounted, setIsMounted] = useState(false);
  
  // Billing States
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('Monthly Internet Bill');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Dashboard States
  const [salesData, setSalesData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (activeTab === 'dashboard') {
      fetchSalesData();
    }
  }, [activeTab]);

  // ISP Products List
  const commonItems = [
    'Monthly Internet Bill', 'ONU (XPON/EPON/GPON)', 'Dual Band Router (Gigabit)',
    'Single Band Router', 'Fiber Optic Cable (Meter)', 'Cat6 / UTP Cable (Meter)',
    'Patch Cord (SC-SC/APC)', 'Media Converter (MC)', 'RJ45 Connector',
    'MikroTik Router', 'ONU Power Adapter (12V)', 'Splicing / Joint Charge',
    'Installation / Setup Charge', 'Router Configuration'
  ];

  // ------------------ BILLING FUNCTIONS ------------------
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

    if (supabase) {
      setIsSaving(true);
      const { error } = await supabase
        .from('invoices')
        .insert([{ 
          customer_name: customerName || 'Walk-in Customer', 
          phone: customerPhone || 'N/A', 
          total_amount: totalAmount, 
          items: items 
        }]);
      
      setIsSaving(false);
      if (error) {
        alert("Database Error: " + error.message);
        return;
      }
    } else {
      alert("Supabase not connected properly!");
      return;
    }

    window.print();
  };

  const handleClear = () => {
    setItems([]); setCustomerName(''); setCustomerPhone('');
  };

  // ------------------ DASHBOARD FUNCTIONS ------------------
  const fetchSalesData = async () => {
    setIsLoadingData(true);
    if (supabase) {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setSalesData(data);
      if (error) console.error("Fetch error:", error.message);
    }
    setIsLoadingData(false);
  };

  const totalRevenue = salesData.reduce((sum, invoice) => sum + Number(invoice.total_amount), 0);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans selection:bg-[#4ade80] selection:text-black">
      
      {/* ------------------ PREMIUM TOP NAVIGATION (Hide on Print) ------------------ */}
      <nav className="print:hidden border-b border-[#222] bg-[#121212] sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4ade80] rounded-xl flex items-center justify-center text-black font-extrabold text-xl shadow-[0_0_15px_rgba(74,222,128,0.3)]">
              PK
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-widest text-white uppercase">PK <span className="text-[#4ade80]">TECH</span></h1>
              <p className="text-[10px] tracking-wider text-gray-400 uppercase">Premium ISP Management</p>
            </div>
          </div>
          
          <div className="flex bg-[#1e1e1e] p-1 rounded-lg border border-[#333]">
            <button 
              onClick={() => setActiveTab('billing')}
              className={`px-6 py-2 rounded-md font-bold transition-all ${activeTab === 'billing' ? 'bg-[#4ade80] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              POS Billing
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-2 rounded-md font-bold transition-all ${activeTab === 'dashboard' ? 'bg-[#4ade80] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* ------------------ MAIN CONTENT AREA ------------------ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* ==========================================
                      TAB 1: POS BILLING 
        ========================================== */}
        {activeTab === 'billing' && (
          <>
            <div className="print:hidden w-full md:w-1/2 bg-[#141414] border border-[#2a2a2a] p-8 rounded-2xl shadow-2xl relative overflow-hidden">
              {/* Premium Glow Effect */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#4ade80] opacity-10 rounded-full blur-3xl"></div>

              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <span className="w-2 h-6 bg-[#4ade80] rounded-full"></span> New Invoice
              </h2>
              
              <div className="mb-5 grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Customer Name</label>
                  <input type="text" placeholder="e.g. Asif Iqbal" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="bg-[#1e1e1e] text-white border border-[#333] p-3.5 rounded-xl w-full focus:outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] transition" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Phone Number</label>
                  <input type="text" placeholder="017XX..." value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="bg-[#1e1e1e] text-white border border-[#333] p-3.5 rounded-xl w-full focus:outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] transition" />
                </div>
              </div>

              <form onSubmit={handleAddItem} className="mb-8 space-y-5 border-t border-[#222] pt-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Select Product / Service</label>
                  <input list="item-options" type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} required className="bg-[#1e1e1e] text-white border border-[#333] p-3.5 rounded-xl w-full focus:outline-none focus:border-[#4ade80] transition" />
                  <datalist id="item-options">{commonItems.map((item, idx) => <option key={idx} value={item} />)}</datalist>
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Unit Price (৳)</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" className="bg-[#1e1e1e] text-[#4ade80] font-bold border border-[#333] p-3.5 rounded-xl w-full focus:outline-none focus:border-[#4ade80]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Quantity</label>
                    <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} required min="1" className="bg-[#1e1e1e] text-white font-bold border border-[#333] p-3.5 rounded-xl w-full focus:outline-none focus:border-[#4ade80]" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#1e1e1e] border border-[#333] text-[#4ade80] hover:bg-[#4ade80] hover:text-black font-extrabold text-sm tracking-wider uppercase py-4 rounded-xl transition-all">
                  + Add to List
                </button>
              </form>

              <div className="flex gap-4">
                <button onClick={handleSaveAndPrint} disabled={isSaving} className="flex-[2] bg-[#4ade80] text-black font-extrabold text-sm tracking-wider uppercase py-4 rounded-xl hover:bg-[#22c55e] transform active:scale-95 transition-all shadow-[0_0_20px_rgba(74,222,128,0.2)] disabled:opacity-50">
                  {isSaving ? "Saving to Cloud..." : "Save & Print Receipt"}
                </button>
                <button onClick={handleClear} className="flex-1 bg-transparent text-gray-400 font-bold py-4 rounded-xl hover:text-red-500 border border-[#333] hover:border-red-500 transition-all">
                  Clear
                </button>
              </div>
            </div>

            {/* ---------------- RECEIPT SECTION (Visible on Print) ---------------- */}
            <div className="w-full md:w-auto flex justify-center border-l border-[#222] pl-0 md:pl-10 print:border-none print:p-0 print:m-0 print:block">
              <div id="printable-receipt" className="bg-white p-4 text-black w-[80mm] shadow-2xl print:shadow-none print:w-[80mm] print:p-0 text-sm font-mono mx-auto">
                <div className="text-center mb-4">
                  <h1 className="font-extrabold text-3xl uppercase tracking-widest text-black">PK NET</h1>
                  <p className="text-xs font-bold mt-1">Khidirpur Bazar</p>
                  <p className="text-xs">Hotline: 01XXX-XXXXXX</p>
                  <div className="border-b-2 border-dashed border-gray-400 my-3"></div>
                </div>

                <div className="mb-4 text-xs">
                  <p><strong>Date:</strong> {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                  <p><strong>Name:</strong> {customerName || 'Walk-in Customer'}</p>
                  <p><strong>Phone:</strong> {customerPhone || 'N/A'}</p>
                </div>

                <table className="w-full text-xs text-left mb-4">
                  <thead>
                    <tr className="border-b border-dashed border-gray-400">
                      <th className="py-2 w-1/2">Product</th>
                      <th className="py-2 w-1/4 text-center">Qty</th>
                      <th className="py-2 w-1/4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td className="py-2 break-words pr-2">{item.name} <br/><span className="text-[10px] text-gray-500">@{item.price}</span></td>
                        <td className="py-2 text-center align-top">{item.qty}</td>
                        <td className="py-2 text-right align-top">{item.price * item.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="border-t-2 border-dashed border-gray-400 pt-3 mb-6 mt-2">
                  <div className="flex justify-between font-extrabold text-lg">
                    <span>TOTAL:</span>
                    <span>৳ {totalAmount}</span>
                  </div>
                </div>

                <div className="text-center text-xs flex flex-col items-center">
                  <p className="mb-2 font-bold">Thank you for your business!</p>
                  <div className="w-24 h-24 border-2 border-black flex items-center justify-center text-[10px] bg-gray-100 font-bold mb-2">
                    [bKash QR]
                  </div>
                  <p className="mt-1 text-[10px] text-gray-600">Generated by PK TECH Software</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ==========================================
                      TAB 2: ADMIN DASHBOARD 
        ========================================== */}
        {activeTab === 'dashboard' && (
          <div className="w-full print:hidden">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#141414] border border-[#2a2a2a] p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute -bottom-4 -right-4 text-[#4ade80] opacity-5 text-8xl">৳</div>
                <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Total Revenue</h3>
                <p className="text-4xl font-extrabold text-white">৳ {totalRevenue.toLocaleString()}</p>
              </div>
              
              <div className="bg-[#141414] border border-[#2a2a2a] p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute -bottom-4 -right-4 text-[#4ade80] opacity-5 text-8xl">#</div>
                <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Total Invoices</h3>
                <p className="text-4xl font-extrabold text-white">{salesData.length}</p>
              </div>

              <div className="bg-[#141414] border border-[#2a2a2a] p-6 rounded-2xl relative flex items-center justify-between">
                <div>
                  <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Database Status</h3>
                  <p className="text-xl font-bold text-[#4ade80] flex items-center gap-2">
                    <span className="w-3 h-3 bg-[#4ade80] rounded-full animate-pulse"></span> Connected
                  </p>
                </div>
                <button onClick={fetchSalesData} className="p-3 bg-[#1e1e1e] border border-[#333] hover:border-[#4ade80] rounded-xl transition text-[#4ade80]">
                  🔄 Refresh
                </button>
              </div>
            </div>

            {/* Sales Table */}
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-2xl">
              <div className="px-6 py-5 border-b border-[#222] bg-[#1a1a1a]">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Recent Sales History</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#1e1e1e] text-gray-400 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Date & Time</th>
                      <th className="px-6 py-4 font-semibold">Customer Details</th>
                      <th className="px-6 py-4 font-semibold">Purchased Items</th>
                      <th className="px-6 py-4 text-right font-semibold">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {isLoadingData ? (
                      <tr><td colSpan="4" className="text-center py-10 text-gray-500">Loading data from cloud...</td></tr>
                    ) : salesData.length === 0 ? (
                      <tr><td colSpan="4" className="text-center py-10 text-gray-500">No sales recorded yet.</td></tr>
                    ) : (
                      salesData.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-[#1a1a1a] transition">
                          <td className="px-6 py-4 text-gray-300">
                            {new Date(invoice.created_at).toLocaleDateString()}<br/>
                            <span className="text-[10px] text-gray-500">{new Date(invoice.created_at).toLocaleTimeString()}</span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-white">{invoice.customer_name}</p>
                            <p className="text-xs text-gray-500">{invoice.phone}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {invoice.items && invoice.items.map((item, idx) => (
                                <span key={idx} className="bg-[#222] text-gray-300 text-[10px] px-2 py-1 rounded-md border border-[#333]">
                                  {item.name} (x{item.qty})
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-extrabold text-[#4ade80]">
                            ৳ {invoice.total_amount}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
