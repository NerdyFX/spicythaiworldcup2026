import React, { useState, useEffect } from 'react';
import { Trophy, User, CreditCard, Calendar, X, Phone } from 'lucide-react';

interface Registration {
  id: number;
  name: string;
  phone: string;
  amount: number;
  team: string;
  date: string;
  eligible: boolean;
}

const TEAMS = [
  'Argentina', 'Australia', 'Belgium', 'Brazil', 'Canada', 
  'Colombia', 'Croatia', 'Denmark', 'Egypt', 'England', 
  'France', 'Germany', 'Italy', 'Japan', 'Mexico', 
  'Morocco', 'Netherlands', 'Nigeria', 'Portugal', 'Saudi Arabia', 
  'Senegal', 'South Africa', 'South Korea', 'Spain', 'Switzerland', 
  'Tunisia', 'Uruguay', 'USA'
].sort();

const LOGO_SRC = "/logo.png";
const LOGO_FALLBACK = "https://img.icons8.com/color/96/thailand.png";

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '192.168.100.117' 
  ? 'http://192.168.100.117:3001/api' 
  : '/api';

function App() {
  // ... rest of state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [team, setTeam] = useState('');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [showCard, setShowCard] = useState<Registration | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch(`${API_BASE}/registrations`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server error');
      }
      const data = await response.json();
      setRegistrations(data);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching registrations:', error);
      setError(`Database Error: ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !team) return;

    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, amount: parseFloat(amount), team }),
      });

      const newReg = await response.json();
      if (newReg.eligible) {
        setShowCard(newReg);
      }
      
      setName('');
      setPhone('');
      setAmount('');
      setTeam('');
      fetchRegistrations();
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <div className="container">
      <header>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '10px' }}>
           <img 
             src={LOGO_SRC} 
             alt="Spicy Thai Logo" 
             style={{ height: '80px', borderRadius: '50%', backgroundColor: 'white', padding: '5px' }} 
             onError={(e) => e.currentTarget.src = LOGO_FALLBACK}
           />
           <div style={{ fontSize: '1.8rem', fontWeight: 'bold', opacity: 0.9 }}>🌶️ SPICY THAI RESTAURANT</div>
        </div>
        <h1><Trophy size={40} style={{ verticalAlign: 'middle', marginRight: '15px' }} /> World Cup Champion Guess</h1>
        <p>Register your guess! Spend over 1500 MZN to get your Digital Card.</p>
      </header>

      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center', border: '1px solid #f87171' }}>
          {error}
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label><User size={16} /> Customer Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g. João Silva" 
                required 
              />
            </div>
            <div className="form-group">
              <label><Phone size={16} /> Telephone Number</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="e.g. 84 123 4567" 
              />
            </div>
          </div>

          <div className="form-group">
            <label><CreditCard size={16} /> Bill Amount (MZN)</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              placeholder="1500" 
              required 
            />
          </div>

          <div className="form-group">
            <label><Trophy size={16} /> Predicted Champion</label>
            <select value={team} onChange={(e) => setTeam(e.target.value)} required>
              <option value="">Select a team</option>
              {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <button type="submit">Register Guess</button>
        </form>
      </div>

      <div className="dashboard">
        <h2><Calendar size={24} style={{ verticalAlign: 'middle', marginRight: '10px' }} /> Recent Registrations</h2>
        <div className="card" style={{ padding: '0' }}>
          <table>
            <thead>
              <tr>
                <th>Name / Phone</th>
                <th>Team</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map(reg => (
                <tr key={reg.id}>
                  <td>
                    <div><strong>{reg.name}</strong></div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{reg.phone}</div>
                  </td>
                  <td><strong>{reg.team}</strong></td>
                  <td>{reg.amount} MZN</td>
                  <td>
                    {reg.eligible ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="badge badge-success">Card Issued</span>
                        <button 
                          onClick={() => setShowCard(reg)} 
                          style={{ padding: '4px 8px', fontSize: '0.7rem', backgroundColor: 'var(--secondary)' }}
                        >
                          View Card
                        </button>
                      </div>
                    ) : (
                      <span className="badge badge-secondary">Standard</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCard && (
        <div className="modal-overlay" onClick={() => setShowCard(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={() => setShowCard(null)}><X /></span>
            <h2 style={{ color: 'var(--success)', marginBottom: '10px' }}>🎉 Congratulations!</h2>
            <p style={{ marginBottom: '20px' }}>Customer is eligible for the Digital Guess Card.</p>
            
            <div className="digital-card">
              <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img 
                    src={LOGO_SRC} 
                    alt="Logo" 
                    style={{ height: '40px', width: '40px', borderRadius: '50%', backgroundColor: 'white', padding: '2px', objectFit: 'cover' }} 
                    onError={(e) => e.currentTarget.src = LOGO_FALLBACK}
                  />
                  <span className="card-title">World Cup 2026</span>
                </div>
                <Trophy size={24} color="white" />
              </div>
              <div className="card-body">
                <div className="customer-name">{showCard.name || 'Guest'}</div>
                <div style={{ fontSize: '0.9rem', marginBottom: '10px', fontWeight: 'bold' }}>{showCard.phone || 'N/A'}</div>
                <div className="predicted-team">{showCard.team || 'None'}</div>
              </div>
              <div className="card-footer">
                <span>Spicy Thai Guest Card</span>
                <span>ID: {showCard.id ? showCard.id.toString().slice(-6) : '000000'}</span>
              </div>
            </div>

            <button onClick={() => setShowCard(null)} style={{ marginTop: '20px', width: '100%' }}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

