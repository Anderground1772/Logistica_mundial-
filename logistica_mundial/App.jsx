import React, { useState, useEffect } from 'react';

const styles = {
  container: { fontFamily: 'RedHatText, Overpass, Helvetica, Arial, sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex' },
  sidebar: { width: '240px', backgroundColor: '#151515', color: '#fff', padding: '20px' },
  logo: { fontSize: '20px', fontWeight: 'bold', marginBottom: '30px', borderBottom: '2px solid #ee0000', paddingBottom: '10px' },
  navItem: { padding: '12px 10px', cursor: 'pointer', borderRadius: '4px', marginBottom: '5px', transition: '0.2s' },
  activeNav: { backgroundColor: '#ee0000', color: '#fff' },
  main: { flex: 1, padding: '30px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', backgroundColor: '#fff', padding: '20px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' },
  card: { backgroundColor: '#fff', padding: '20px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderTop: '4px solid #0066cc' },
  cardTitle: { fontSize: '14px', color: '#6a6e73', marginBottom: '10px', textTransform: 'uppercase' },
  cardValue: { fontSize: '28px', fontWeight: 'bold', color: '#151515' },
  tableContainer: { backgroundColor: '#fff', padding: '20px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '12px', borderBottom: '2px solid #d2d2d2', color: '#151515', fontWeight: '600' },
  td: { padding: '12px', borderBottom: '1px solid #d2d2d2', color: '#6a6e73' },
  statusBadge: { padding: '4px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }
};

export default function App() {
  const [logisticsData, setLogisticsData] = useState([]);
  const [metrics, setMetrics] = useState({ totalShipments: 0, activeRegions: 4, revenue: '$1.2M', compliance: '99.4%' });

  useEffect(() => {
    setLogisticsData([
      { id: 'TRK-9821', origin: 'Shanghái (CN)', destination: 'Rotterdam (NL)', status: 'En Tránsito', client: 'Global Tech Corp' },
      { id: 'TRK-3412', origin: 'Veracruz (MX)', destination: 'Houston (US)', status: 'Entregado', client: 'MexiFoods SA' },
      { id: 'TRK-0983', origin: 'Hamburgo (DE)', destination: 'Bogotá (CO)', status: 'Aduana', client: 'EuroParts Ltda' },
      { id: 'TRK-5541', origin: 'Tokio (JP)', destination: 'Los Ángeles (US)', status: 'Retrasado', client: 'Nippon Electronics' },
    ]);
    setMetrics({ totalShipments: 1420, activeRegions: 6, revenue: '$3.45M', compliance: '98.7%' });
  }, []);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Entregado': return { ...styles.statusBadge, backgroundColor: '#e7f4e4', color: '#1e4620' };
      case 'En Tránsito': return { ...styles.statusBadge, backgroundColor: '#e7f1fa', color: '#004085' };
      case 'Aduana': return { ...styles.statusBadge, backgroundColor: '#fff3cd', color: '#856404' };
      default: return { ...styles.statusBadge, backgroundColor: '#f8d7da', color: '#721c24' };
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.logo}>Red Hat ERP Global</div>
        <div style={{...styles.navItem, ...styles.activeNav}}>📦 Logística Global</div>
        <div style={styles.navItem}>📊 Finanzas Internacionales</div>
        <div style={styles.navItem}>🏭 Cadena de Suministro</div>
        <div style={styles.navItem}>⚙️ Configuración del Clúster</div>
      </div>

      <div style={styles.main}>
        <div style={styles.header}>
          <h2>Consola de Control ERP Multiregión</h2>
          <div><strong>Entorno:</strong> Red Hat OpenShift Cluster</div>
        </div>

        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Envíos Totales (Mes)</div>
            <div style={styles.cardValue}>{metrics.totalShipments}</div>
          </div>
          <div style={{...styles.card, borderTopColor: '#2b9af3'}}>
            <div style={styles.cardTitle}>Regiones Activas</div>
            <div style={styles.cardValue}>{metrics.activeRegions}</div>
          </div>
          <div style={{...styles.card, borderTopColor: '#3e8635'}}>
            <div style={styles.cardTitle}>Facturación Global</div>
            <div style={styles.cardValue}>{metrics.revenue}</div>
          </div>
          <div style={{...styles.card, borderTopColor: '#f0ab00'}}>
            <div style={styles.cardTitle}>Cumplimiento SLA</div>
            <div style={styles.cardValue}>{metrics.compliance}</div>
          </div>
        </div>

        <div style={styles.tableContainer}>
          <h3 style={{marginBottom: '20px'}}>Monitoreo de Envíos Internacionales</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID Tracking</th>
                <th style={styles.th}>Origen</th>
                <th style={styles.th}>Destino</th>
                <th style={styles.th}>Cliente</th>
                <th style={styles.th}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {logisticsData.map((row) => (
                <tr key={row.id}>
                  <td style={styles.td}><strong>{row.id}</strong></td>
                  <td style={styles.td}>{row.origin}</td>
                  <td style={styles.td}>{row.destination}</td>
                  <td style={styles.td}>{row.client}</td>
                  <td style={styles.td}>
                    <span style={getStatusStyle(row.status)}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
