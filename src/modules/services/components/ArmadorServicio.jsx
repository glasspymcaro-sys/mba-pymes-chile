import React, { useState } from 'react';

export default function ArmadorServicio({ recursosDisponibles = [], onGuardarServicio }) {
  const [nombreServicio, setNombreServicio] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [ventasMensuales, setVentasMensuales] = useState('');
  const [elementos, setElementos] = useState([]);

  const handleDragStart = (e, recurso) => {
    e.dataTransfer.setData('recurso', JSON.stringify(recurso));
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('recurso');
    if (data) {
      const recursoArrastrado = JSON.parse(data);
      if (!elementos.find(el => el.id === recursoArrastrado.id)) {
        setElementos([...elementos, { ...recursoArrastrado, cantidadUsada: '' }]);
      }
    }
  };

  const actualizarCantidad = (id, cantidad) => {
    setElementos(elementos.map(el =>
      el.id === id ? { ...el, cantidadUsada: cantidad } : el
    ));
  };

  const eliminarElemento = (id) => {
    setElementos(elementos.filter(el => el.id !== id));
  };

  const costoTotalServicio = elementos.reduce((total, el) => {
    const cant = Number(el.cantidadUsada) || 0;
    return total + (cant * el.costoPorUnidad);
  }, 0);

  const margenPesos = Number(precioVenta) - costoTotalServicio;
  const margenPorcentaje = precioVenta > 0 ? ((margenPesos / precioVenta) * 100).toFixed(1) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombreServicio || elementos.length === 0) {
      alert('Debes arrastrar al menos un recurso para estructurar el servicio.');
      return;
    }
    
    onGuardarServicio({
      id: `srv_${Date.now()}`,
      nombre: nombreServicio,
      precioVenta: Number(precioVenta),
      ventasMensuales: Number(ventasMensuales),
      elementos,
      costoTotal: costoTotalServicio
    });
    
    setNombreServicio('');
    setPrecioVenta('');
    setVentasMensuales('');
    setElementos([]);
  };

  return (
    <div style={{ display: 'flex', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      
      <div style={{ flex: '1', background: 'var(--color-surface, #0D131F)', padding: '20px', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: 'var(--color-foreground, #F8FAFC)' }}>Equipo y Recursos</h3>
        <p style={{ fontSize: '13px', color: 'var(--color-muted-foreground)', marginBottom: '15px' }}>Arrastra perfiles o tecnologías a tu proyecto.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '500px', overflowY: 'auto' }}>
          {recursosDisponibles.map(rec => (
            <div
              key={rec.id}
              draggable
              onDragStart={(e) => handleDragStart(e, rec)}
              style={{
                padding: '12px',
                background: 'var(--color-surface-elevated, #131A29)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                cursor: 'grab',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <strong style={{ display: 'block', fontSize: '14px', color: 'var(--color-foreground, #F8FAFC)' }}>{rec.nombre}</strong>
                <span style={{ fontSize: '12px', color: 'var(--color-muted-foreground)' }}>{rec.tipo}</span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                ${rec.costoPorUnidad.toLocaleString('es-CL')} / {rec.unidad}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: '2', background: 'var(--color-surface, #0D131F)', padding: '24px', borderRadius: '16px', boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-border)' }}>
        <h3 style={{ margin: '0 0 20px 0', color: 'var(--color-foreground, #F8FAFC)', fontSize: '18px' }}>Estructurar Nuevo Servicio</h3>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <input type="text" placeholder="Nombre del Servicio o Proyecto" value={nombreServicio} onChange={(e) => setNombreServicio(e.target.value)} style={inputStyle} required />
            <input type="number" placeholder="Precio de Venta ($)" value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)} style={inputStyle} min="1" required />
            <input type="number" placeholder="Proyectos esperados al mes" value={ventasMensuales} onChange={(e) => setVentasMensuales(e.target.value)} style={inputStyle} min="1" required />
          </div>

          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
              minHeight: '150px',
              border: '2px dashed var(--color-border-strong)',
              borderRadius: '12px',
              padding: '20px',
              backgroundColor: elementos.length > 0 ? 'var(--color-surface-elevated, #131A29)' : 'var(--color-surface, #0D131F)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginBottom: '20px',
              transition: 'all 0.2s'
            }}
          >
            {elementos.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--color-muted-foreground)', margin: 'auto' }}>
                <span style={{ fontSize: '16px', display: 'block', marginBottom: '10px' }}>Area de Planificación</span>
                Suelta el personal o los recursos aqui
              </div>
            ) : (
              elementos.map(el => (
                <div key={el.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'var(--color-surface-elevated, #131A29)', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <div style={{ flex: '1', fontSize: '14px', fontWeight: 'bold' }}>{el.nombre}</div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#7f8c8d' }}>Tiempo/Uso:</span>
                    <input 
                      type="number"
                      value={el.cantidadUsada}
                      onChange={(e) => actualizarCantidad(el.id, e.target.value)}
                      style={{ width: '80px', padding: '6px', borderRadius: '4px', border: '1px solid #d1d9e0', outline: 'none' }}
                      min="0.5"
                      step="any"
                      required
                    />
                    <span style={{ fontSize: '13px', fontWeight: 'bold', width: '60px' }}>{el.unidad}s</span>
                  </div>
                  
                  <div style={{ width: '90px', textAlign: 'right', fontSize: '14px', color: '#e74c3c', fontWeight: 'bold' }}>
                    ${(Number(el.cantidadUsada || 0) * el.costoPorUnidad).toLocaleString('es-CL')}
                  </div>
                  
                  <button type="button" onClick={() => eliminarElemento(el.id)} style={{ background: '#fdedec', border: '1px solid #e74c3c', color: '#e74c3c', cursor: 'pointer', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                    X
                  </button>
                </div>
              ))
            )}
          </div>

          <div style={{ padding: '15px', background: '#2c3e50', borderRadius: '12px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#bdc3c7' }}>Costo Directo del Proyecto</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>${costoTotalServicio.toLocaleString('es-CL')}</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#bdc3c7' }}>Margen de Contribucion</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: margenPesos > 0 ? '#2ecc71' : '#e74c3c' }}>
                ${margenPesos.toLocaleString('es-CL')} ({margenPorcentaje}%)
              </div>
            </div>
            <button type="submit" style={{ padding: '10px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              Guardar Servicio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = { flex: '1', padding: '12px', borderRadius: '8px', border: '1px solid #d1d9e0', fontSize: '14px', outline: 'none' };