axios.get('https://backend-pesticide.onrender.com/api/products')
import React, { useState, useEffect } from 'react';

function App() {
  const [produse, setProduse] = useState([]);
  const [filters, setFilters] = useState({
    denumire: '',
    substanta: '',
    categorie: '',
    cultura: '',
    daunator: '',
  });
  const [error, setError] = useState(null);
const formatDoze = (text) => {
  const values = text
    ?.split('|')                        // Împărțim doar după |
    .map(item => item.trim().replace(',', '.'))  // Înlocuim virgula cu punct
    .filter(Boolean);

  const unique = Array.from(new Set(values));
  return unique.map((item, idx) => <div key={idx}>{item}</div>);
};

const formatList = (text) => {
  const values = text
    ?.split(/[,|]/)
    .map(item => item.trim())
    .filter(Boolean);

  const unique = Array.from(new Set(values));
  return unique.map((item, idx) => <div key={idx}>{item}</div>);
};

  const fetchProduse = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const res = await fetch(`https://backend-pesticide.onrender.com/produse/cautare?${params.toString()}`);
      if (!res.ok) throw new Error('Error fetching');
      const data = await res.json();
      setProduse(data);
    } catch {
      setError('Failed to fetch');
    }
  };

  useEffect(() => {
    fetchProduse();
  }, []);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = () => {
    fetchProduse();
  };

  return (
    <div className="app">
      <header>
        <img src="/logo.png" alt="Rodbun Logo" className="logo" />
        <h1>Identificator Produse Fitosanitare</h1>
      </header>
      <div className="filters">
        <input name="denumire" placeholder="Denumire Comercială" value={filters.denumire} onChange={handleFilterChange} />
        <input name="substanta" placeholder="Substanță Activă" value={filters.substanta} onChange={handleFilterChange} />

        <input name="categorie" placeholder="Categorie Produs" value={filters.categorie} onChange={handleFilterChange} />
        <input name="cultura" placeholder="Cultura" value={filters.cultura} onChange={handleFilterChange} />
        <input name="daunator" placeholder="Dăunător" value={filters.daunator} onChange={handleFilterChange} />
        <button onClick={handleSearch}>Caută</button>
      </div>
      {error && <div className="error">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Denumire Comerciala</th>
            <th>Substanțe Active</th>
            <th>Categorie Produs</th>
            <th>Culturi Omologate</th>
            <th>Dăunători Omologati</th>
	    <th>Doze Omologate</th>
	    <th>Disponibil</th>
          </tr>
        </thead>
        <tbody>
          {produse.map((p, i) => (
            <tr key={i}>
              <td>{p.denumire_produs}</td>
              <td className="celula-substante">{[p.substanta_activa_1, p.substanta_activa_2, p.substanta_activa_3, p.substanta_activa_4].filter(Boolean) .map((s, i) => (<div key={i} className="substanta-item">{s}</div>))}</td>
              <td>{p.categorie_produs}</td>
<td>{formatList(p.culturi_omologate)}</td>
<td>{formatList(p.daunatori_omologati)}</td>
<td>{formatList(p.doza_omologata)}</td>
<td>{p.vandut_de_rodbun}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
