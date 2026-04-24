import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, MapPin, Zap, Lock, AlertTriangle, CheckCircle } from 'lucide-react';

// Declare global checkout for North SDK
declare global {
  interface Window {
    checkout: any;
  }
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3004';

const App: React.FC = () => {
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'validating' | 'qualified' | 'rejected'>('idle');
  const [sessionData, setSessionData] = useState<any>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'Approved' | 'Declined' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (showCheckout && sessionData?.token && window.checkout && !mountedRef.current) {
      // Small delay to ensure DOM is fully ready and painted
      const timer = setTimeout(() => {
        if (containerRef.current) {
          try {
            console.log('Mounting North Checkout to:', containerRef.current);
            window.checkout.mount(
              sessionData.token,
              'north-checkout-container' // Try without hash first, some SDKs are picky
            );
            mountedRef.current = true;
          } catch (err) {
            console.error('Mount failed:', err);
            // Fallback to selector with hash if ID fails
            try {
              window.checkout.mount({
                token: sessionData.token,
                containerId: '#north-checkout-container'
              });
              mountedRef.current = true;
            } catch (err2) {
              console.error('Mount failed with selector too:', err2);
            }
          }
        }
      }, 100);

      // Listen for payment completion
      const unsubscribe = window.checkout.onPaymentComplete((response: any) => {
        console.log('Payment Event:', response);
        setPaymentStatus(response.status);
      });

      return () => {
        clearTimeout(timer);
        if (unsubscribe) unsubscribe();
      };
    }
  }, [showCheckout, sessionData]);

  const handleValidate = async () => {
    if (!zipCode) return;
    setStatus('validating');
    
    try {
      const response = await fetch(`${API_URL}/api/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, zipCode }),
      });

      if (response.ok) {
        const data = await response.json();
        setSessionData(data);
        setStatus('qualified');
        // Trigger the "Ghost Reveal" after a short delay
        setTimeout(() => setShowCheckout(true), 800);
      } else {
        setStatus('rejected');
      }
    } catch (error) {
      console.error('Validation failed', error);
      setStatus('rejected');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 sm:p-8">
      {/* Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl text-center mb-12"
      >
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-neon/10 border border-neon/20 shadow-neon-border">
            <Zap className="w-8 h-8 text-neon" />
          </div>
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
          Arctic Air <span className="text-neon">North</span>
        </h1>
        <p className="text-gray-400 text-sm mt-2 font-medium tracking-widest uppercase">
          Elite HVAC Dispatch Engine
        </p>
      </motion.div>

      <div className="w-full max-w-2xl space-y-6">
        {/* Proximity Gate */}
        <motion.div 
          className={`glass-morphism p-6 rounded-2xl transition-all duration-500 ${status === 'qualified' ? 'opacity-50 blur-sm pointer-events-none' : ''}`}
          layout
        >
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-neon" />
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">Proximity Gate</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 block">Service Address</label>
              <input 
                type="text"
                placeholder="Type address..."
                className="w-full bg-cyber-surface border border-cyber-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon/50 transition-colors"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 block">Postal Code</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Zip"
                  className="flex-1 bg-cyber-surface border border-cyber-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon/50 transition-colors"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
                <button 
                  onClick={handleValidate}
                  disabled={status === 'validating'}
                  className="bg-neon text-black font-black uppercase px-6 rounded-lg hover:bg-neon/90 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {status === 'validating' ? 'Checking...' : 'Verify'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ghost Checkout Section */}
        <AnimatePresence>
          {status === 'qualified' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative"
            >
              {/* Unlock Animation Overlay */}
              {!showCheckout && (
                <motion.div 
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center glass-morphism rounded-2xl neon-border"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Shield className="w-16 h-16 text-neon" />
                  </motion.div>
                  <p className="mt-4 text-neon font-black uppercase tracking-[0.2em] text-sm">Qualified Access Granted</p>
                </motion.div>
              )}

              {/* Success State Overlay */}
              {paymentStatus === 'Approved' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center glass-morphism rounded-2xl neon-border bg-cyber-bg/90"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                  <h2 className="text-2xl font-black text-white uppercase italic">Dispatch Confirmed</h2>
                  <p className="text-gray-400 text-xs mt-2 font-mono">Reference: {sessionData?.token}</p>
                </motion.div>
              )}

              {/* The "Ghost" iFrame Container */}
              <div className={`glass-morphism rounded-2xl overflow-hidden border transition-all duration-1000 ${showCheckout ? 'neon-border shadow-neon-glow border-neon' : 'border-transparent'}`}>
                <div className={`flex justify-between items-start mb-6 px-6 pt-6`}>
                  <div>
                    <h3 className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold">Secure Dispatch Payment</h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-black text-white italic">${sessionData?.amount}.00</span>
                      {sessionData?.isEmergency && (
                        <span className="bg-red-500/10 text-red-500 text-[8px] px-2 py-0.5 rounded border border-red-500/20 font-black uppercase tracking-widest">Emergency Surge</span>
                      )}
                    </div>
                  </div>
                  <Lock className="w-4 h-4 text-gray-600" />
                </div>

                {/* Real North iFrame Container */}
                <div ref={containerRef} id="north-checkout-container" className="min-h-[600px] w-full bg-black/10">
                  {!window.checkout && (
                    <div className="flex flex-col items-center justify-center h-[400px] p-8 text-center">
                      <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-700 mb-4 animate-spin" />
                      <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">
                        Loading North Protocol...
                      </p>
                    </div>
                  )}
                </div>
                
                {paymentStatus === 'Declined' && (
                  <div className="px-6 pb-6">
                    <p className="text-red-500 text-[10px] mt-4 uppercase font-black text-center">Transaction Declined. Please verify payment details.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {status === 'rejected' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-morphism p-8 rounded-2xl border border-red-500/30 text-center"
            >
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white uppercase italic">Out of Service Zone</h2>
              <p className="text-gray-400 text-sm mt-2 mb-6">
                Arctic Air hasn't expanded to your grid sector yet. Join the priority waitlist for early access.
              </p>
              
              <div className="flex gap-2">
                <input 
                  type="email"
                  placeholder="comm-link@sector.com"
                  className="flex-1 bg-cyber-surface border border-cyber-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500/50"
                />
                <button className="bg-white text-black font-black uppercase px-6 rounded-lg hover:bg-gray-200 transition-all">
                  Join
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="mt-auto pt-12 text-center">
        <div className="flex items-center gap-4 text-gray-700">
          <span className="h-[1px] w-8 bg-gray-800" />
          <span className="text-[8px] uppercase tracking-[0.4em] font-black">Powered by North Protocol</span>
          <span className="h-[1px] w-8 bg-gray-800" />
        </div>
      </footer>
    </div>
  );
};

export default App;
