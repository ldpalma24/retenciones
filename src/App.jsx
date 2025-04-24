import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [inputNumber, setInputNumber] = useState('');
  const [ivaRate, setIvaRate] = useState(null); // Inicialmente no seleccionado
  const [islrRate, setIslrRate] = useState(null); // Inicialmente no seleccionado
  const [tasaDolar, setTasaDolar] = useState('1');
  const [results, setResults] = useState({
    baseImponible: 0,
    iva: 0,
    totalRetenido: 0,
    islr: 0,
    montoPostearDolares: 0,
    montoPostearBs: 0,
  });

  const handleTasaChange = (e) => {
    let value = e.target.value;
    value = value.replace(',', '.');
    if (/^\d*\.?\d*$/.test(value)) {
      setTasaDolar(value);
    }
  };

  const toggleIvaRate = (rate) => {
    setIvaRate(ivaRate === rate ? null : rate);
  };

  const toggleIslrRate = (rate) => {
    setIslrRate(islrRate === rate ? null : rate);
  };

  useEffect(() => {
    const montoTotal = parseFloat(inputNumber);
    const tasa = parseFloat(tasaDolar) || 0;

    if (isNaN(montoTotal)) return;

    const baseImponible = montoTotal / 1.16;
    const iva100 = montoTotal - baseImponible;
    const ivaRetenido = ivaRate !== null ? iva100 * ivaRate : 0;
    const islrRetenido = islrRate !== null ? baseImponible * islrRate : 0;
    const totalRetenido = ivaRetenido + islrRetenido;
    const montoPostearDolares = montoTotal - totalRetenido;
    const montoPostearBs = montoPostearDolares * tasa;

    setResults({
      baseImponible: baseImponible.toFixed(2),
      iva: ivaRetenido.toFixed(2),
      islr: islrRetenido.toFixed(2),
      totalRetenido: totalRetenido.toFixed(2),
      montoPostearDolares: montoPostearDolares.toFixed(2),
      montoPostearBs: montoPostearBs.toFixed(2),
    });
  }, [inputNumber, ivaRate, islrRate, tasaDolar]);

  return (
    <div className="app-container">
      <h1>Cálculo de Retenciones</h1>
      <div className="card">
        <input
          type="number"
          value={inputNumber}
          onChange={(e) => setInputNumber(e.target.value)}
          placeholder="Ingresa el monto total"
          className="input-field"
        />

        <div className="results-grid">
          <div className="result-row-full">
            <div className="result-box">
              <div className="result-title">Base Imponible (Total/1.16)</div>
              <div className="result-value">{results.baseImponible}$</div>
            </div>
          </div>

          <div className="result-row">
            <div className="result-box with-checkboxes">
              <div className="result-title">
                IVA Retenido ({ivaRate !== null ? `${ivaRate * 100}%` : '0%'} del IVA)
              </div>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={ivaRate === 0.75}
                    onChange={() => toggleIvaRate(0.75)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom"></span>
                  75% del IVA
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={ivaRate === 1}
                    onChange={() => toggleIvaRate(1)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom"></span>
                  100% del IVA
                </label>
              </div>
              <div className="result-value">{results.iva}$</div>
            </div>

            <div className="result-box with-checkboxes">
              <div className="result-title">
                ISLR Retenido (Base×{islrRate !== null ? islrRate * 100 : '0'}%)
              </div>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={islrRate === 0.02}
                    onChange={() => toggleIslrRate(0.02)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom"></span>
                  2%
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={islrRate === 0.03}
                    onChange={() => toggleIslrRate(0.03)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom"></span>
                  3%
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={islrRate === 0.05}
                    onChange={() => toggleIslrRate(0.05)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom"></span>
                  5%
                </label>
              </div>
              <div className="result-value">{results.islr}$</div>
            </div>
          </div>

          <div className="result-row">
            <div className="result-box">
              <div className="result-title">Total Retenido (IVA + ISLR)</div>
              <div className="result-value total-retenido">
                {results.totalRetenido}$
              </div>
            </div>
            <div className="result-box tasa-container">
              <div className="result-title">Tasa del Dólar</div>
              <div className="tasa-input-container">
                <input
                  type="text"
                  className="tasa-input"
                  value={tasaDolar}
                  onChange={handleTasaChange}
                  placeholder="1,00"
                />
                <span className="tasa-suffix">BS</span>
              </div>
            </div>
          </div>

          <div className="result-row">
            <div className="result-box highlight">
              <div className="result-title">
                Monto a Postear (BS) [($) × Tasa]
              </div>
              <div className="result-value">{results.montoPostearBs} Bs</div>
            </div>
            <div className="result-box highlight">
              <div className="result-title">
                Monto a Postear ($) [Total - Retenido]
              </div>
              <div className="result-value">{results.montoPostearDolares}$</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;