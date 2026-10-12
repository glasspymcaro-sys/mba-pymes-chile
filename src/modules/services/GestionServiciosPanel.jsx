import React from 'react';
import ArmadorServicio from './components/ArmadorServicio.jsx';

export default function GestionServiciosPanel({ recursos, servicios, onGuardarServicio }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      <div>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 5px 0', color: '#2c3e50', fontSize: '20px' }}>Cotizador y Estructuración de Proyectos</h3>
          <p style={{ color: '#7f8c8d', fontSize: '14px', margin: 0 }}>
            Asigna las horas de tu equipo para determinar el costo real operativo y proyectar márgenes correctos.
          </p>
        </div>
        
        <ArmadorServicio 
          recursosDisponibles={recursos} 
          onGuardarServicio={onGuardarServicio} 
        />
      </div>

      {servicios.length > 0 && (
        <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '16px', border: '1px solid #e4ecf3' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#1a252f', fontSize: '20px' }}>
            Portafolio de Servicios Activos ({servicios.length})
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {servicios.map(srv => {
              const margenPorcentaje = srv.precioVenta > 0 
                ? (((srv.precioVenta - srv.costoTotal) / srv.precioVenta) * 100).toFixed(1) 
                : 0;

              return (
                <div key={srv.id} style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #ecf0f1' }}>
                  <h4 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#2c3e50', borderBottom: '2px solid #f4f7f9', paddingBottom: '10px' }}>
                    {srv.nombre}
                  </h4>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                    <span style={{ color: '#7f8c8d' }}>Costo Directo HH:</span>
                    <strong style={{ color: '#e74c3c' }}>${srv.costoTotal.toLocaleString('es-CL')}</strong>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                    <span style={{ color: '#7f8c8d' }}>Fee Cobrado (Precio):</span>
                    <strong style={{ color: '#1a252f' }}>${srv.precioVenta.toLocaleString('es-CL')}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                    <span style={{ color: '#7f8c8d' }}>Proyectos/Mes Estimados:</span>
                    <strong style={{ color: '#3498db' }}>{srv.ventasMensuales}</strong>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #ecf0f1', fontSize: '14.5px' }}>
                    <span style={{ color: '#5c6c7b', fontWeight: 'bold' }}>Margen Bruto:</span>
                    <strong style={{ color: margenPorcentaje >= 0 ? '#2ecc71' : '#e74c3c', fontSize: '16px' }}>
                      {margenPorcentaje}%
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}