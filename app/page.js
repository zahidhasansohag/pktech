"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase Connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default function PKTechApp() {
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

  // ISP & Electronics Products List
  const commonItems = [
    'Monthly Internet Bill', 'ONU (XPON/EPON)', 'Dual Band Gigabit Router',
    'Single Band Router', 'Fiber Optic Cable (Meter)', 'Cat6 / UTP Cable (Meter)',
    'Patch Cord (SC-SC/APC)', 'Media Converter (MC)', 'RJ45 Connector',
    'MikroTik Router', 'Network Switch (Gigabit)', 'Splicing / Joint Charge',
    'Power Bank (10000mAh/20000mAh)', 'Smart Watch', 'Wireless Earbuds / TWS', 
    'Bluetooth Neckband', 'Mobile Charger / Type-C Cable', 'Installation Charge'
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

  // Delete Invoice Function
  const handleDeleteInvoice = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this invoice? This action cannot be undone.");
    if (!confirmDelete) return;

    if (supabase) {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);
      
      if (error) {
        alert("Error deleting invoice: " + error.message);
      } else {
        // UI থেকে সাথে সাথে রিমুভ করে দেওয়া
        setSalesData(salesData.filter(invoice => invoice.id !== id));
      }
    }
  };

  const totalRevenue = salesData.reduce((sum, invoice) => sum + Number(invoice.total_amount), 0);

  if (!isMounted) return null;

  return (
    // Pitch Black Background with Neon Green Selection
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-[#39FF14] selection:text-black">
      
      {/* ------------------ NAVIGATION (Hide on Print) ------------------ */}
      <nav className="print:hidden border-b border-[#39FF14]/20 bg-[#0a0a0a] sticky top-0 z-50 shadow-[0_4px_30px_rgba(57,255,20,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-[#39FF14] rounded-lg flex items-center justify-center text-[#39FF14] font-extrabold text-xl shadow-[0_0_10px_rgba(57,255,20,0.5)]">
              PK
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-widest text-white uppercase">PK <span className="text-[#39FF14] drop-shadow-[0_0_8px_rgba(57,255,20,0.8)]">TECH</span></h1>
              <p className="text-[10px] tracking-wider text-gray-400 uppercase">ISP & Electronics POS</p>
            </div>
          </div>
          
          <div className="flex bg-[#111] p-1 rounded-lg border border-[#39FF14]/30">
            <button 
              onClick={() => setActiveTab('billing')}
              className={`px-6 py-2 rounded-md font-bold transition-all duration-300 ${activeTab === 'billing' ? 'bg-[#39FF14] text-black shadow-[0_0_15px_rgba(57,255,20,0.4)]' : 'text-gray-400 hover:text-[#39FF14]'}`}
            >
              POS Billing
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-2 rounded-md font-bold transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-[#39FF14] text-black shadow-[0_0_15px_rgba(57,255,20,0.4)]' : 'text-gray-400 hover:text-[#39FF14]'}`}
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
            <div className="print:hidden w-full md:w-1/2 bg-[#0a0a0a] border border-[#39FF14]/30 p-8 rounded-2xl shadow-[0_0_30px_rgba(57,255,20,0.05)] relative overflow-hidden">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <span className="w-2 h-6 bg-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.8)] rounded-full"></span> New Invoice
              </h2>
              
              <div className="mb-5 grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#39FF14] mb-1 uppercase tracking-wider">Customer Name</label>
                  <input type="text" placeholder="e.g. Asif Iqbal" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="bg-[#111] text-white border border-[#222] p-3.5 rounded-xl w-full focus:outline-none focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14] transition" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#39FF14] mb-1 uppercase tracking-wider">Phone Number</label>
                  <input type="text" placeholder="017XX..." value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="bg-[#111] text-white border border-[#222] p-3.5 rounded-xl w-full focus:outline-none focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14] transition" />
                </div>
              </div>

              <form onSubmit={handleAddItem} className="mb-8 space-y-5 border-t border-[#222] pt-6">
                <div>
                  <label className="block text-xs font-semibold text-[#39FF14] mb-1 uppercase tracking-wider">Select Product / Service</label>
                  <input list="item-options" type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} required className="bg-[#111] text-white border border-[#222] p-3.5 rounded-xl w-full focus:outline-none focus:border-[#39FF14] transition" />
                  <datalist id="item-options">{commonItems.map((item, idx) => <option key={idx} value={item} />)}</datalist>
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#39FF14] mb-1 uppercase tracking-wider">Unit Price (৳)</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" className="bg-[#111] text-[#39FF14] font-bold border border-[#222] p-3.5 rounded-xl w-full focus:outline-none focus:border-[#39FF14]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#39FF14] mb-1 uppercase tracking-wider">Quantity</label>
                    <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} required min="1" className="bg-[#111] text-white font-bold border border-[#222] p-3.5 rounded-xl w-full focus:outline-none focus:border-[#39FF14]" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#111] border border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14] hover:text-black hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] font-extrabold text-sm tracking-wider uppercase py-4 rounded-xl transition-all duration-300">
                  + Add to List
                </button>
              </form>

              <div className="flex gap-4">
                <button onClick={handleSaveAndPrint} disabled={isSaving} className="flex-[2] bg-[#39FF14] text-black font-extrabold text-sm tracking-wider uppercase py-4 rounded-xl hover:bg-[#2EEB0F] transform active:scale-95 transition-all shadow-[0_0_15px_rgba(57,255,20,0.5)] disabled:opacity-50 disabled:shadow-none">
                  {isSaving ? "Saving..." : "Save & Print Receipt"}
                </button>
                <button onClick={handleClear} className="flex-1 bg-[#111] text-gray-400 font-bold py-4 rounded-xl hover:text-red-500 hover:border-red-500 border border-[#222] transition-all">
                  Clear
                </button>
              </div>
            </div>

            {/* ---------------- RECEIPT SECTION (Visible on Print) ---------------- */}
            <div className="w-full md:w-auto flex justify-center border-l border-[#222] pl-0 md:pl-10 print:border-none print:p-0 print:m-0 print:block">
              <div id="printable-receipt" className="bg-white p-4 text-black w-[80mm] shadow-2xl print:shadow-none print:w-[80mm] print:p-0 text-sm font-mono mx-auto">
                <div className="text-center mb-4">
                  <h1 className="font-extrabold text-3xl uppercase tracking-widest text-black">PK TECH</h1>
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
              <div className="bg-[#0a0a0a] border border-[#39FF14]/30 p-6 rounded-2xl relative overflow-hidden shadow-[0_0_20px_rgba(57,255,20,0.05)]">
                <div className="absolute -bottom-4 -right-4 text-[#39FF14] opacity-5 text-8xl">৳</div>
                <h3 className="text-[#39FF14] text-sm font-bold uppercase tracking-wider mb-2">Total Revenue</h3>
                <p className="text-4xl font-extrabold text-white">৳ {totalRevenue.toLocaleString()}</p>
              </div>
              
              <div className="bg-[#0a0a0a] border border-[#39FF14]/30 p-6 rounded-2xl relative overflow-hidden shadow-[0_0_20px_rgba(57,255,20,0.05)]">
                <div className="absolute -bottom-4 -right-4 text-[#39FF14] opacity-5 text-8xl">#</div>
                <h3 className="text-[#39FF14] text-sm font-bold uppercase tracking-wider mb-2">Total Invoices</h3>
                <p className="text-4xl font-extrabold text-white">{salesData.length}</p>
              </div>

              <div className="bg-[#0a0a0a] border border-[#39FF14]/30 p-6 rounded-2xl relative flex items-center justify-between shadow-[0_0_20px_rgba(57,255,20,0.05)]">
                <div>
                  <h3 className="text-[#39FF14] text-sm font-bold uppercase tracking-wider mb-2">Database Status</h3>
                  <p className="text-xl font-bold text-[#39FF14] flex items-center gap-2">
                    <span className="w-3 h-3 bg-[#39FF14] shadow-[0_0_8px_rgba(57,255,20,1)] rounded-full animate-pulse"></span> Online
                  </p>
                </div>
                <button onClick={fetchSalesData} className="p-3 bg-[#111] border border-[#39FF14]/50 hover:bg-[#39FF14] hover:text-black rounded-xl transition-all text-[#39FF14]">
                  🔄 Refresh
                </button>
              </div>
            </div>

            {/* Sales Table with Delete Option */}
            <div className="bg-[#0a0a0a] border border-[#39FF14]/30 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(57,255,20,0.05)]">
              <div className="px-6 py-5 border-b border-[#39FF14]/20 bg-[#111]">
                <h3 className="text-lg font-bold text-[#39FF14] uppercase tracking-wider drop-shadow-[0_0_5px_rgba(57,255,20,0.5)]">Sales History & Invoice Management</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#050505] text-gray-400 text-xs uppercase tracking-wider border-b border-[#222]">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Date & Time</th>
                      <th className="px-6 py-4 font-semibold">Customer Details</th>
                      <th className="px-6 py-4 font-semibold">Purchased Items</th>
                      <th className="px-6 py-4 text-right font-semibold">Total Amount</th>
                      <th className="px-6 py-4 text-center font-semibold text-red-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {isLoadingData ? (
                      <tr><td colSpan="5" className="text-center py-10 text-[#39FF14] animate-pulse">Loading data from cloud...</td></tr>
                    ) : salesData.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-10 text-gray-500">No sales recorded yet.</td></tr>
                    ) : (
                      salesData.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-[#111] transition-colors duration-200">
                          <td className="px-6 py-4 text-gray-300">
                            {new Date(invoice.created_at).toLocaleDateString()}<br/>
                            <span className="text-[10px] text-[#39FF14]">{new Date(invoice.created_at).toLocaleTimeString()}</span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-white">{invoice.customer_name}</p>
                            <p className="text-xs text-gray-500">{invoice.phone}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {invoice.items && invoice.items.map((item, idx) => (
                                <span key={idx} className="bg-[#050505] text-[#39FF14] text-[10px] px-2 py-1 rounded-md border border-[#39FF14]/30">
                                  {item.name} (x{item.qty})
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-extrabold text-[#39FF14]">
                            ৳ {invoice.total_amount}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button 
                              onClick={() => handleDeleteInvoice(invoice.id)}
                              className="text-red-500 hover:text-white bg-red-500/10 hover:bg-red-600 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                              title="Delete Invoice"
                            >
                              🗑️ Delete
                            </button>
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
 