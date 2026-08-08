import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Recycle, 
  ShieldCheck, 
  Sparkles, 
  Truck, 
  Wallet, 
  ArrowRight, 
  CheckCircle2, 
  Leaf, 
  Lock, 
  Globe2, 
  Zap, 
  Cpu, 
  ChevronRight,
  BarChart3,
  Building2,
  TreeDeciduous,
  Sprout
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Calculator State
  const [plasticKg, setPlasticKg] = useState<number>(20);
  const [paperKg, setPaperKg] = useState<number>(25);
  const [metalKg, setMetalKg] = useState<number>(12);
  const [glassKg, setGlassKg] = useState<number>(30);
  const [eWasteKg, setEWasteKg] = useState<number>(8);

  // AI Demo State
  const [activeAiTab, setActiveAiTab] = useState<'plastic' | 'glass' | 'paper' | 'ewaste'>('plastic');

  // Admin Login Modal State
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('admin@ecocollect.lk');
  const [adminPassword, setAdminPassword] = useState('••••••••••••');

  // Calculations
  const totalWeight = plasticKg + paperKg + metalKg + glassKg + eWasteKg;
  const cashPayout = (plasticKg * 120) + (paperKg * 60) + (metalKg * 150) + (glassKg * 30) + (eWasteKg * 250);
  const ecoPoints = Math.round((plasticKg * 50) + (paperKg * 25) + (metalKg * 70) + (glassKg * 15) + (eWasteKg * 100));
  const co2AvoidedKg = parseFloat((totalWeight * 2.85).toFixed(1));
  const treesEquiv = Math.round(co2AvoidedKg / 12);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/admin');
  };

  const aiDemoData = {
    plastic: { title: 'PET Plastic Bottle', conf: '99.2%', pts: '50 pts/kg', price: 'LKR 120/kg', icon: '🧴', tips: 'Rinse thoroughly and flatten for maximum Eco Points yield.' },
    glass: { title: 'Clear Glass Container', conf: '97.8%', pts: '15 pts/kg', price: 'LKR 30/kg', icon: '🫙', tips: 'Remove metal caps and keep dry before doorstep collection.' },
    paper: { title: 'Corrugated Cardboard Box', conf: '98.5%', pts: '25 pts/kg', price: 'LKR 60/kg', icon: '📰', tips: 'Bundle neatly with twine for fast weigh-in verification.' },
    ewaste: { title: 'Electronic PCB / Gadget', conf: '99.6%', pts: '100 pts/kg', price: 'LKR 250/kg', icon: '💻', tips: 'High-value e-waste qualifies for 100 bonus Eco Points per kg!' }
  };

  return (
    <div style={{
      backgroundColor: '#F3FBE8', // Soft Organic Bamboo Cream Background
      color: '#18181B',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      minHeight: '100vh',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      {/* Keyframe & Custom Styles */}
      <style>{`
        @keyframes floatDoodle {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
        .doodle-animated {
          animation: floatDoodle 5s ease-in-out infinite;
        }
        .bamboo-card {
          background-color: #FFFFFF;
          border: 1.5px solid #18181B;
          border-radius: 24px;
          box-shadow: 4px 6px 0px #18181B;
          transition: all 0.25s ease;
        }
        .bamboo-card:hover {
          transform: translateY(-4px);
          box-shadow: 6px 10px 0px #18181B;
        }
        .pill-badge-outline {
          border: 1.5px solid #18181B;
          border-radius: 9999px;
          padding: 6px 18px;
          font-weight: 700;
          font-size: 13px;
        }
      `}</style>

      {/* Decorative Organic Squiggles & Leaf Elements */}
      <div style={{ position: 'absolute', top: '100px', left: '4%', opacity: 0.8, pointerEvents: 'none' }} className="doodle-animated">
        <svg width="40" height="40" viewBox="0 0 50 50" fill="none" stroke="#256D38" strokeWidth="4" strokeLinecap="round">
          <path d="M10 25 C15 10, 35 10, 40 25 C35 40, 15 40, 10 25 Z" />
        </svg>
      </div>

      <div style={{ position: 'absolute', top: '160px', right: '5%', opacity: 0.8, pointerEvents: 'none' }} className="doodle-animated">
        <svg width="50" height="50" viewBox="0 0 60 60" fill="none" stroke="#84CC16" strokeWidth="4" strokeLinecap="round">
          <path d="M10 10 Q30 50 50 10" />
        </svg>
      </div>

      {/* 1. Global Header (Organic Eco Style — ONLY ONE Admin Login Button) */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(16px)',
        backgroundColor: 'rgba(243, 251, 232, 0.92)',
        borderBottom: '1.5px solid #18181B',
        padding: '16px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            backgroundColor: '#256D38',
            border: '1.5px solid #18181B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '2px 3px 0px #18181B'
          }}>
            <Sprout size={24} color="#F4FCEB" />
          </div>
          <div>
            <span style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '-0.5px', color: '#18181B' }}>
              Eco<span style={{ color: '#256D38' }}>Collect</span>
            </span>
            <span style={{ fontSize: '10px', color: '#256D38', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block' }}>
              Building the Future, Naturally
            </span>
          </div>
        </div>

        {/* Clean Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '36px', fontSize: '14px', fontWeight: 700, color: '#18181B' }}>
          <a href="#overview" style={{ color: 'inherit', textDecoration: 'none' }}>Overview</a>
          <a href="#simulator" style={{ color: 'inherit', textDecoration: 'none' }}>ESG Calculator</a>
          <a href="#ai-classifier" style={{ color: 'inherit', textDecoration: 'none' }}>Gemini AI</a>
          <a href="#pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Licensing</a>
        </nav>

        {/* SINGLE AUTHORITATIVE ADMIN LOGIN BUTTON */}
        <button
          onClick={() => setIsAdminModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#256D38',
            color: '#FFFFFF',
            border: '1.5px solid #18181B',
            padding: '12px 24px',
            borderRadius: '9999px',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '3px 4px 0px #18181B',
            transition: 'transform 0.15s ease'
          }}
        >
          <Lock size={16} color="#FFFFFF" />
          <span>Admin Portal Login 🔐</span>
        </button>
      </header>

      {/* 2. Hero Presentation Section */}
      <section id="overview" style={{
        padding: '80px 48px 70px 48px',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '40px',
        alignItems: 'center'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#BEF264',
            border: '1.5px solid #18181B',
            padding: '6px 18px',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: 800,
            color: '#18181B',
            boxShadow: '2px 3px 0px #18181B',
            marginBottom: '24px'
          }}>
            <Leaf size={16} color="#256D38" />
            <span>SUSTAINABLE WASTE SOLUTIONS</span>
          </div>

          <h1 style={{
            fontSize: '58px',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-2px',
            color: '#18181B',
            margin: '0 0 16px 0'
          }}>
            Smart Waste Logistics & Sustainable Intelligence
          </h1>

          <p style={{
            fontSize: '20px',
            fontStyle: 'italic',
            color: '#256D38',
            fontWeight: 600,
            margin: '0 0 24px 0'
          }}>
            Building the Future, Naturally.
          </p>

          <p style={{
            fontSize: '16px',
            color: '#3F3F46',
            lineHeight: 1.6,
            margin: '0 0 36px 0',
            fontWeight: 500
          }}>
            Connecting households, municipal scrap collectors, and city council dispatchers with doorstep GPS verification, Gemini AI material scanning, and digital Eco Wallet settlements.
          </p>

          {/* Clean Metric Badges Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #18181B', borderRadius: '18px', padding: '16px', boxShadow: '3px 4px 0px #18181B' }}>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#256D38' }}>42.8 Tons</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#52525B', marginTop: '2px' }}>Recycled Waste</div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #18181B', borderRadius: '18px', padding: '16px', boxShadow: '3px 4px 0px #18181B' }}>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#84CC16' }}>98.4%</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#52525B', marginTop: '2px' }}>AI Accuracy</div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #18181B', borderRadius: '18px', padding: '16px', boxShadow: '3px 4px 0px #18181B' }}>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#18181B' }}>42 Fleets</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#52525B', marginTop: '2px' }}>Active Trucks</div>
            </div>
          </div>
        </div>

        {/* Hero Visual Card (Matching Pitch Deck Organic Card Style) */}
        <div style={{ position: 'relative' }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '28px',
            border: '2px solid #18181B',
            padding: '32px',
            boxShadow: '6px 8px 0px #18181B',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '1.5px solid #E4E4E7'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '18px', backgroundColor: '#BEF264', border: '1.5px solid #18181B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                  🍃
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#18181B' }}>EcoCollect Platform</div>
                  <div style={{ fontSize: '11px', color: '#256D38', fontWeight: 700 }}>Real-time PostgreSQL Sync</div>
                </div>
              </div>
              <span style={{ backgroundColor: '#BEF264', color: '#18181B', border: '1.5px solid #18181B', padding: '4px 12px', borderRadius: '9999px', fontSize: '11px', fontWeight: 900 }}>
                ONLINE
              </span>
            </div>

            <div style={{ backgroundColor: '#F4FCEB', borderRadius: '20px', padding: '20px', border: '1.5px solid #18181B', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#256D38', letterSpacing: '0.8px' }}>LIVE DISPATCH CENTER</div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#18181B', marginTop: '4px' }}>Kasun Perera — 15/A Havelock Road</div>
              <div style={{ fontSize: '13px', color: '#3F3F46', marginTop: '6px', fontWeight: 600 }}>
                Assigned Collector: <strong>Suresh Kumar (Truck WP-5842)</strong>
              </div>
            </div>

            <div style={{ backgroundColor: '#18181B', color: '#FFFFFF', borderRadius: '20px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Globe2 size={22} color="#BEF264" />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800 }}>Google Maps Navigation</div>
                  <div style={{ fontSize: '11px', color: '#A1A1AA' }}>Doorstep Range Verified (&lt;= 50m)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ESG Carbon & Waste Payout Simulator Section */}
      <section id="simulator" style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1.5px solid #18181B',
        borderBottom: '1.5px solid #18181B',
        padding: '90px 48px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#256D38', letterSpacing: '1px', textTransform: 'uppercase' }}>ESG IMPACT CALCULATOR</span>
            <h2 style={{ fontSize: '38px', fontWeight: 900, color: '#18181B', margin: '8px 0 12px 0', letterSpacing: '-1px' }}>
              Waste Payout & Carbon Offset Simulator
            </h2>
            <p style={{ fontSize: '16px', color: '#52525B', maxWidth: '580px', margin: '0 auto' }}>
              Adjust material batch weights to calculate expected cash payouts, Eco Points rewards, and certified CO2 footprint reduction.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '36px', alignItems: 'center' }}>
            {/* Sliders Box */}
            <div style={{
              backgroundColor: '#F4FCEB',
              borderRadius: '24px',
              padding: '32px',
              border: '1.5px solid #18181B',
              boxShadow: '4px 6px 0px #18181B',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              {[
                { label: 'Plastic (PET Bottles)', val: plasticKg, set: setPlasticKg, rate: 'LKR 120/kg · 50 pts/kg', icon: '🧴' },
                { label: 'Paper & Cardboard', val: paperKg, set: setPaperKg, rate: 'LKR 60/kg · 25 pts/kg', icon: '📰' },
                { label: 'Metal & Steel Scrap', val: metalKg, set: setMetalKg, rate: 'LKR 150/kg · 70 pts/kg', icon: '⚙️' },
                { label: 'Glass Bottles & Jars', val: glassKg, set: setGlassKg, rate: 'LKR 30/kg · 15 pts/kg', icon: '🫙' },
                { label: 'E-Waste & Electronics', val: eWasteKg, set: setEWasteKg, rate: 'LKR 250/kg · 100 pts/kg', icon: '💻' }
              ].map((mat, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#18181B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{mat.icon}</span>
                      <span>{mat.label}</span>
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 900, color: '#256D38' }}>{mat.val} Kg</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={mat.val}
                    onChange={(e) => mat.set(parseInt(e.target.value, 10) || 0)}
                    style={{ width: '100%', accentColor: '#256D38', cursor: 'pointer' }}
                  />
                  <div style={{ fontSize: '11px', color: '#52525B', marginTop: '2px' }}>Unit Rate: {mat.rate}</div>
                </div>
              ))}
            </div>

            {/* Payout Output Box */}
            <div style={{
              backgroundColor: '#18181B',
              borderRadius: '24px',
              padding: '36px',
              color: '#FFFFFF',
              border: '1.5px solid #18181B',
              boxShadow: '4px 6px 0px #BEF264',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#BEF264', letterSpacing: '0.8px' }}>ESTIMATED CASH PAYOUT</span>
                <div style={{ fontSize: '44px', fontWeight: 900, color: '#FFFFFF', marginTop: '4px' }}>
                  LKR {cashPayout.toLocaleString()}
                </div>
                <div style={{ fontSize: '13px', color: '#A1A1AA', marginTop: '2px' }}>Instant Eco Wallet credit upon doorstep weigh-in</div>
              </div>

              <div style={{ height: '1px', backgroundColor: '#27272A' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#A1A1AA', fontWeight: 700 }}>REDEEMABLE ECO POINTS</div>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: '#F59E0B', marginTop: '2px' }}>+{ecoPoints} pts</div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: '#A1A1AA', fontWeight: 700 }}>CO2 AVOIDED</div>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: '#BEF264', marginTop: '2px' }}>{co2AvoidedKg} Kg</div>
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(190, 242, 100, 0.12)',
                padding: '14px',
                borderRadius: '16px',
                fontSize: '13px',
                color: '#BEF264',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Leaf size={18} />
                <span>Equivalent to planting <strong>{treesEquiv} mature trees</strong> in urban Sri Lanka!</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Google Gemini AI Classifier Section */}
      <section id="ai-classifier" style={{
        padding: '90px 48px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#256D38', letterSpacing: '1px', textTransform: 'uppercase' }}>ARTIFICIAL INTELLIGENCE</span>
          <h2 style={{ fontSize: '38px', fontWeight: 900, color: '#18181B', margin: '8px 0 12px 0', letterSpacing: '-1px' }}>
            Google Gemini Vision AI Classifier
          </h2>
          <p style={{ fontSize: '16px', color: '#52525B', maxWidth: '580px', margin: '0 auto' }}>
            Smartphone camera scanner identifying material types with 98.4% precision to compute instant point yields.
          </p>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '36px',
          border: '1.5px solid #18181B',
          boxShadow: '4px 6px 0px #18181B',
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: '32px',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { id: 'plastic', label: 'PET Plastic Bottle', icon: '🧴' },
              { id: 'glass', label: 'Clear Glass Jar', icon: '🫙' },
              { id: 'paper', label: 'Corrugated Cardboard', icon: '📰' },
              { id: 'ewaste', label: 'E-Waste / Electronic PCB', icon: '💻' }
            ].map((tab) => {
              const isSelected = activeAiTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveAiTab(tab.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderRadius: '16px',
                    border: '1.5px solid #18181B',
                    backgroundColor: isSelected ? '#BEF264' : '#FFFFFF',
                    color: '#18181B',
                    fontWeight: 800,
                    fontSize: '15px',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '2px 3px 0px #18181B' : 'none'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </span>
                  <ChevronRight size={18} color="#18181B" />
                </button>
              );
            })}
          </div>

          <div style={{
            backgroundColor: '#18181B',
            borderRadius: '24px',
            padding: '32px',
            color: '#FFFFFF'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#BEF264', letterSpacing: '1px' }}>AI CAMERA SCANNER RESULT</span>
              <span style={{ backgroundColor: '#BEF264', color: '#18181B', border: '1px solid #18181B', padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 900 }}>
                {(aiDemoData as any)[activeAiTab].conf} CONFIDENCE
              </span>
            </div>

            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{(aiDemoData as any)[activeAiTab].icon}</div>
            <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>{(aiDemoData as any)[activeAiTab].title}</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', margin: '20px 0' }}>
              <div style={{ backgroundColor: '#27272A', padding: '14px', borderRadius: '14px' }}>
                <div style={{ fontSize: '11px', color: '#A1A1AA', fontWeight: 700 }}>PAYOUT RATE</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#BEF264', marginTop: '2px' }}>{(aiDemoData as any)[activeAiTab].price}</div>
              </div>

              <div style={{ backgroundColor: '#27272A', padding: '14px', borderRadius: '14px' }}>
                <div style={{ fontSize: '11px', color: '#A1A1AA', fontWeight: 700 }}>ECO POINTS YIELD</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#F59E0B', marginTop: '2px' }}>{(aiDemoData as any)[activeAiTab].pts}</div>
              </div>
            </div>

            <div style={{ fontSize: '13px', color: '#A1A1AA', lineHeight: 1.5, backgroundColor: 'rgba(255, 255, 255, 0.06)', padding: '12px 16px', borderRadius: '12px' }}>
              💡 <strong>Recycling Tip:</strong> {(aiDemoData as any)[activeAiTab].tips}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Enterprise Capabilities Grid */}
      <section style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1.5px solid #18181B',
        borderBottom: '1.5px solid #18181B',
        padding: '90px 48px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#256D38', letterSpacing: '1px', textTransform: 'uppercase' }}>ENTERPRISE FEATURES</span>
            <h2 style={{ fontSize: '38px', fontWeight: 900, color: '#18181B', margin: '8px 0 12px 0', letterSpacing: '-1px' }}>
              Core Platform Capabilities
            </h2>
            <p style={{ fontSize: '16px', color: '#52525B', maxWidth: '580px', margin: '0 auto' }}>
              Robust logistics connecting households, scrap fleet drivers, and municipal dispatchers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              {
                title: 'Google Maps GPS Turn-by-Turn',
                desc: 'Collector drivers receive live route directions and doorstep range checks (<= 50m).',
                icon: Globe2,
                tag: 'FLEET NAVIGATION'
              },
              {
                title: '1-Click Driver Allocation',
                desc: 'Admin dispatchers assign active trucks based on capacity, location, and job queues.',
                icon: Truck,
                tag: 'DISPATCH HUB'
              },
              {
                title: 'Collector Rejection Comment Logs',
                desc: 'Driver rejection reasons are recorded privately for Admin review and re-allocation.',
                icon: ShieldCheck,
                tag: 'ADMIN AUDIT'
              },
              {
                title: 'Instant Eco Wallet Payouts',
                desc: 'Verified weigh-in calculations credit cash equivalents and airtime reload vouchers.',
                icon: Wallet,
                tag: 'SETTLEMENTS'
              },
              {
                title: 'PostgreSQL Relational Storage',
                desc: '10 relational database tables enforcing strict user roles and ESG compliance logs.',
                icon: Zap,
                tag: 'RELATIONAL DB'
              },
              {
                title: 'Google Gemini AI Waste Scanner',
                desc: 'Visual classifier detects plastic, glass, paper, or e-waste with 98.4% accuracy.',
                icon: Cpu,
                tag: 'AI INTEGRATION'
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bamboo-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: '#BEF264',
                      border: '1.5px solid #18181B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#18181B'
                    }}>
                      <Icon size={20} />
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#256D38', letterSpacing: '0.8px' }}>{item.tag}</span>
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#18181B', margin: 0 }}>{item.title}</h3>
                  <p style={{ fontSize: '14px', color: '#52525B', margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Commercial Subscription Pricing (Pitch Deck Style) */}
      <section id="pricing" style={{ padding: '90px 48px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#256D38', letterSpacing: '1px', textTransform: 'uppercase' }}>ENTERPRISE PRICING</span>
          <h2 style={{ fontSize: '38px', fontWeight: 900, color: '#18181B', margin: '8px 0 12px 0', letterSpacing: '-1px' }}>
            Subscription Plans
          </h2>
          <p style={{ fontSize: '16px', color: '#52525B', maxWidth: '580px', margin: '0 auto' }}>
            Commercial licenses tailored for municipal councils, scrap fleet operators, and collection centers.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
          {[
            {
              title: 'Local Scrap Operator',
              price: 'LKR 4,900',
              period: '/ month',
              desc: 'Ideal for independent scrap collectors and regional collection centers.',
              features: ['Up to 5 Collector Trucks', 'Mobile App Job Dispatch', 'Wallet Points Settlement', 'Basic Pickup Directory']
            },
            {
              title: 'Municipal City Council',
              price: 'LKR 18,500',
              period: '/ month',
              desc: 'City-wide recycling management for municipal councils.',
              features: ['Unlimited Mobile Recycler Accounts', 'Up to 25 Collector Trucks', 'Doorstep Proximity Verification', 'Standard ESG Compliance Reports'],
              popular: true
            },
            {
              title: 'Enterprise Fleet Operator',
              price: 'LKR 38,000',
              period: '/ month',
              desc: 'For commercial waste aggregators and multi-city scrap fleets.',
              features: ['Unlimited Mobile Accounts & Fleet Trucks', 'Google Gemini AI Waste Scanner API', '1-Click Driver Allocation Hub', 'Categorized Real-time Alert System', 'Custom Material Rates Engine']
            }
          ].map((plan, idx) => (
            <div key={idx} style={{
              backgroundColor: plan.popular ? '#BEF264' : '#FFFFFF',
              border: '2px solid #18181B',
              borderRadius: '24px',
              padding: '36px',
              boxShadow: plan.popular ? '6px 8px 0px #18181B' : '4px 6px 0px #18181B',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}>
              {plan.popular && (
                <span style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#256D38',
                  color: '#FFFFFF',
                  border: '1.5px solid #18181B',
                  padding: '4px 16px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 900,
                  letterSpacing: '0.8px'
                }}>
                  MOST POPULAR
                </span>
              )}

              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#18181B', margin: 0 }}>{plan.title}</h3>
                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '36px', fontWeight: 900, color: '#18181B' }}>{plan.price}</span>
                  <span style={{ fontSize: '14px', color: '#3F3F46' }}>{plan.period}</span>
                </div>
                <p style={{ fontSize: '13px', color: '#3F3F46', marginTop: '8px', lineHeight: 1.5 }}>{plan.desc}</p>

                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {plan.features.map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#18181B' }}>
                      <CheckCircle2 size={16} color="#256D38" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1.5px solid #18181B', fontSize: '12px', color: '#18181B', fontWeight: 700, textAlign: 'center' }}>
                Enterprise License Included
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#18181B',
        color: '#A1A1AA',
        padding: '40px',
        textAlign: 'center',
        fontSize: '13px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
          <Sprout size={22} color="#BEF264" />
          <span style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF' }}>EcoCollect Enterprise</span>
        </div>
        <p style={{ margin: 0 }}>© 2026 EcoCollect Technologies Ltd. All rights reserved. Powered by Express & PostgreSQL Database Infrastructure.</p>
      </footer>

      {/* SINGLE AUTHORITATIVE ADMIN LOGIN MODAL */}
      {isAdminModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(24, 24, 27, 0.75)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '40px',
            width: '100%',
            maxWidth: '420px',
            border: '2px solid #18181B',
            boxShadow: '6px 10px 0px #18181B',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsAdminModalOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: '#71717A',
                fontSize: '22px',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              ✕
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#256D38', border: '1.5px solid #18181B',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Lock size={20} color="#FFFFFF" />
              </div>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#18181B' }}>Admin Portal Login</h3>
            </div>

            <p style={{ fontSize: '13px', color: '#52525B', marginBottom: '24px' }}>
              Enter your admin credentials to launch the central dispatch dashboard.
            </p>

            <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#18181B', marginBottom: '6px', display: 'block' }}>Admin Email</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: '#F4FCEB',
                    border: '1.5px solid #18181B',
                    color: '#18181B',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#18181B', marginBottom: '6px', display: 'block' }}>License Password</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: '#F4FCEB',
                    border: '1.5px solid #18181B',
                    color: '#18181B',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '12px',
                  padding: '14px',
                  borderRadius: '9999px',
                  border: '1.5px solid #18181B',
                  backgroundColor: '#256D38',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '3px 4px 0px #18181B'
                }}
              >
                Sign In to Admin Dashboard →
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
