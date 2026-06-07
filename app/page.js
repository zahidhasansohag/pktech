"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase Connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default function PKTechPremiumApp() {
  // ------------------ AUTHENTICATION STATES ------------------
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // ------------------ APP APP STATES ------------------
  const [activeTab, setActiveTab] = useState('billing');
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

  // Check Login Status on Load
  useEffect(() => {
    setIsMounted(true);
    const savedAuth = localStorage.getItem('pktech_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'dashboard') {
      fetchSalesData();
    }
  }, [activeTab, isAuthenticated]);

  // Product List
  const commonItems = [
    'Monthly Internet Bill', 'ONU (XPON/EPON)', 'Dual Band Gigabit Router',
    'Single Band Router', 'Fiber Optic Cable (Meter)', 'Cat6 / UTP Cable (Meter)',
    'Patch Cord (SC-SC/APC)', 'Media Converter (MC)', 'RJ45 Connector',
    'MikroTik Router', 'Network Switch (Gigabit)', 'Splicing / Joint Charge',
    'Power Bank (10000mAh/20000mAh)', 'Smart Watch', 'Wireless Earbuds / TWS', 
    'Bluetooth Neckband', 'Mobile Charger / Type-C Cable', 'Installation Charge'
  ];

  // ------------------ LOGIN & LOGOUT FUNCTIONS ------------------
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === '2222') {
      setIsAuthenticated(true);
      setLoginError(false);
      localStorage.setItem('pktech_auth', 'true'); // Remember login
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('pktech_auth');
    setUsername('');
    setPassword('');
  };

  // ------------------ BILLING FUNCTIONS ------------------
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!itemName || !price) return;
    setItems([...items, { name: itemName, price: parseFloat(price), qty: parseInt(qty) }]);
    setItemName('');
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

  const handleDeleteInvoice = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this invoice?");
    if (!confirmDelete) return;

    if (supabase) {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);
      
      if (error) {
        alert("Error deleting invoice: " + error.message);
      } else {
        setSalesData(salesData.filter(invoice => invoice.id !== id));
      }
    }
  };

  const totalRevenue = salesData.reduce((sum, invoice) => sum + Number(invoice.total_amount), 0);

  if (!isMounted) return null;

  // ==========================================
  //               LOGIN SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-white">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="bg-[#1e293b]/80 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-cyan-400 rounded-2xl flex items-center justify-center text-slate-900 font-extrabold text-3xl shadow-lg mx-auto mb-4">
              PK
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-wider">PK <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">TECH</span></h1>
            <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest">Secure Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="w-full bg-slate-900/50 text-white border border-slate-700 rounded-xl p-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-slate-900/50 text-white border border-slate-700 rounded-xl p-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                placeholder="Enter password"
                required
              />
            </div>
            
            {loginError && (
              <p className="text-red-400 text-sm text-center font-medium bg-red-400/10 py-2 rounded-lg border border-red-400/20">
                Invalid Username or Password!
              </p>
            )}

            <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-900 font-extrabold text-lg py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] transform active:scale-95">
              LOGIN TO DASHBOARD
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  //               MAIN APP SCREEN
  // ==========================================
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans relative overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      
      {/* Background Glow Effect */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      {/* ------------------ NAVIGATION BAR ------------------ */}
      <nav className="print:hidden bg-[#1e293b]/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-cyan-400 rounded-xl flex items-center justify-center text-slate-900 font-extrabold text-xl shadow-lg">
              PK
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-widest">PK <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">TECH</span></h1>
              <p className="text-[10px] tracking-wider text-slate-400 uppercase">Premium Management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-[#0f172a] p-1 rounded-xl border border-slate-800">
              <button 
                onClick={() => setActiveTab('billing')}
                className={`px-5 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${activeTab === 'billing' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                POS Billing
              </button>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-5 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                Dashboard
              </button>
            </div>
            
            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl transition-all"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
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
            <div className="print:hidden w-full md:w-1/2 bg-[#1e293b]/50 backdrop-blur-sm border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl relative">
              <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-3">
                <span className="w-2 h-6 bg-gradient-to-b from-emerald-400 to-cyan-500 rounded-full"></span> New Invoice
              </h2>
              
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Customer Name</label>
                  <input type="text" placeholder="e.g. Asif Iqbal" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="bg-[#0f172a] text-white border border-slate-700 p-3.5 rounded-xl w-full focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Phone Number</label>
                  <input type="text" placeholder="017XX..." value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="bg-[#0f172a] text-white border border-slate-700 p-3.5 rounded-xl w-full focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
              </div>

              <form onSubmit={handleAddItem} className="mb-8 space-y-5 border-t border-slate-800 pt-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Select Product / Service</label>
                  <input list="item-options" type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} required className="bg-[#0f172a] text-white border border-slate-700 p-3.5 rounded-xl w-full focus:outline-none focus:border-emerald-500 transition-colors" />
                  <datalist id="item-options">{commonItems.map((item, idx) => <option key={idx} value={item} />)}</datalist>
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Unit Price (৳)</label>
                    <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" className="bg-[#0f172a] text-emerald-400 font-bold border border-slate-700 p-3.5 rounded-xl w-full focus:outline-none focus:border-emerald-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Quantity</label>
                    <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} required min="1" className="bg-[#0f172a] text-white font-bold border border-slate-700 p-3.5 rounded-xl w-full focus:outline-none focus:border-emerald-500 transition-colors" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#0f172a] border border-slate-700 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500 font-extrabold text-sm tracking-wider uppercase py-4 rounded-xl transition-all duration-300">
                  + Add to List
                </button>
              </form>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleSaveAndPrint} disabled={isSaving} className="flex-[2] bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 font-extrabold text-sm tracking-widest uppercase py-4 rounded-xl hover:from-emerald-400 hover:to-cyan-400 transform active:scale-95 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50">
                  {isSaving ? "Saving..." : "Save & Print Receipt"}
                </button>
                <button onClick={handleClear} className="flex-1 bg-transparent text-slate-400 font-bold py-4 rounded-xl hover:bg-slate-800 border border-slate-700 transition-all">
                  Clear All
                </button>
              </div>
            </div>

            {/* ---------------- RECEIPT SECTION (Visible on Print) ---------------- */}
            <div className="w-full md:w-auto flex justify-center print:border-none print:p-0 print:m-0 print:block">
              <div id="printable-receipt" className="bg-white p-4 text-black w-[80mm] shadow-xl print:shadow-none print:w-[80mm] print:p-0 text-sm font-mono mx-auto rounded-lg print:rounded-none">
                <div className="text-center mb-3">
                  <h1 className="font-extrabold text-3xl uppercase tracking-widest text-black">PK TECH</h1>
                  <p className="text-xs font-bold mt-1">Khidirpur Bazar</p>
                  <p className="text-xs font-bold">Hotline: +880 1575-823886</p>
                  <div className="border-b-2 border-dashed border-gray-500 my-2"></div>
                </div>

                <div className="mb-4 text-xs">
                  <p><strong>Date:</strong> {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                  <p><strong>Name:</strong> {customerName || 'Walk-in Customer'}</p>
                  <p><strong>Phone:</strong> {customerPhone || 'N/A'}</p>
                </div>

                <table className="w-full text-xs text-left mb-4">
                  <thead>
                    <tr className="border-b border-dashed border-gray-500">
                      <th className="py-2 w-1/2 font-bold">Product</th>
                      <th className="py-2 w-1/4 text-center font-bold">Qty</th>
                      <th className="py-2 w-1/4 text-right font-bold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td className="py-2 break-words pr-2">{item.name} <br/><span className="text-[10px] text-gray-600">@{item.price}</span></td>
                        <td className="py-2 text-center align-top">{item.qty}</td>
                        <td className="py-2 text-right align-top">{item.price * item.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="border-t-2 border-dashed border-gray-500 pt-2 mb-5 mt-1">
                  <div className="flex justify-between font-extrabold text-base">
                    <span>TOTAL:</span>
                    <span>৳ {totalAmount}</span>
                  </div>
                </div>

                <div className="text-center text-xs flex flex-col items-center">
                  <p className="mb-2 font-bold">Thank you for your business!</p>
                  <div className="w-20 h-20 border-2 border-black flex items-center justify-center text-[10px] bg-gray-100 font-bold mb-2">
                    [bKash QR]
                  </div>
                  <p className="mt-1 text-[10px] text-gray-500">Generated by PK TECH</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
              <div className="bg-[#1e293b]/60 backdrop-blur-sm border border-slate-800 p-6 rounded-3xl relative overflow-hidden shadow-lg">
                <div className="absolute -bottom-4 -right-4 text-emerald-500 opacity-10 text-8xl">৳</div>
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total Revenue</h3>
                <p className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">৳ {totalRevenue.toLocaleString()}</p>
              </div>
              
              <div className="bg-[#1e293b]/60 backdrop-blur-sm border border-slate-800 p-6 rounded-3xl relative overflow-hidden shadow-lg">
                <div className="absolute -bottom-4 -right-4 text-emerald-500 opacity-10 text-8xl">#</div>
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total Invoices</h3>
                <p className="text-3xl md:text-4xl font-extrabold text-white">{salesData.length}</p>
              </div>

              <div className="bg-[#1e293b]/60 backdrop-blur-sm border border-slate-800 p-6 rounded-3xl relative flex flex-col justify-center shadow-lg">
                <div className="flex justify-between items-center w-full">
                  <div>
                    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Status</h3>
                    <p className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></span> Online
                    </p>
                  </div>
                  <button onClick={fetchSalesData} className="p-3 bg-[#0f172a] border border-slate-700 hover:border-emerald-500 text-slate-400 hover:text-emerald-400 rounded-xl transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#1e293b]/60 backdrop-blur-sm border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="px-6 py-5 border-b border-slate-800 bg-[#0f172a]/50">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-emerald-400"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                   Sales History
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap md:whitespace-normal">
                  <thead className="bg-[#0f172a] text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4 font-bold">Date & Time</th>
                      <th className="px-6 py-4 font-bold">Customer Details</th>
                      <th className="px-6 py-4 font-bold">Items</th>
                      <th className="px-6 py-4 text-right font-bold">Total Amount</th>
                      <th className="px-6 py-4 text-center font-bold text-red-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {isLoadingData ? (
                      <tr><td colSpan="5" className="text-center py-10 text-emerald-400 font-medium animate-pulse">Loading data...</td></tr>
                    ) : salesData.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-10 text-slate-500">No sales recorded yet.</td></tr>
                    ) : (
                      salesData.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-[#0f172a]/50 transition-colors duration-200">
                          <td className="px-6 py-4 text-slate-300">
                            {new Date(invoice.created_at).toLocaleDateString()}<br/>
                            <span className="text-[10px] text-emerald-400 font-medium">{new Date(invoice.created_at).toLocaleTimeString()}</span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-white">{invoice.customer_name}</p>
                            <p className="text-xs text-slate-500">{invoice.phone}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1.5">
                              {invoice.items && invoice.items.map((item, idx) => (
                                <span key={idx} className="bg-[#0f172a] text-slate-300 text-[10px] px-2.5 py-1 rounded-lg border border-slate-700">
                                  {item.name} <span className="text-emerald-400 font-bold">(x{item.qty})</span>
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-extrabold text-white text-base">
                            ৳ {invoice.total_amount}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button 
                              onClick={() => handleDeleteInvoice(invoice.id)}
                              className="text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                            >
                              Delete
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
