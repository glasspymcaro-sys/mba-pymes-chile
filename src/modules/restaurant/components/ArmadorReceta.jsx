import React, { useState } from 'react';

export default function ArmadorReceta({
  insumosDisponibles = [],
  onGuardarReceta,
}) {
  const [nombreReceta, setNombreReceta] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [ventasEstimadas, setVentasEstimadas] = useState('');
  const [ingredientes, setIngredientes] = useState([]);

  const handleDragStart = (e, insumo) => {
    e.dataTransfer.setData('insumo', JSON.stringify(insumo));
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    const insumoData = e.dataTransfer.getData('insumo');

    if (insumoData) {
      const insumoArrastrado = JSON.parse(insumoData);
      if (!ingredientes.find((ing) => ing.id === insumoArrastrado.id)) {
        setIngredientes([
          ...ingredientes,
          { ...insumoArrastrado, cantidadUsada: '' },
        ]);
      }
    }
  };

  const actualizarCantidad = (id, cantidad) => {
    setIngredientes(
      ingredientes.map((ing) =>
        ing.id === id ? { ...ing, cantidadUsada: cantidad } : ing
      )
    );
  };

  const eliminarIngrediente = (id) => {
    setIngredientes(ingredientes.filter((ing) => ing.id !== id));
  };

  const costoTotalReceta = ingredientes.reduce((total, ing) => {
    const cant = Number(ing.cantidadUsada) || 0;
    return total + cant * ing.costoPorUnidad;
  }, 0);

  const margenPesos = Number(precioVenta) - costoTotalReceta;
  const margenPorcentaje =
    precioVenta > 0 ? ((margenPesos / precioVenta) * 100).toFixed(1) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombreReceta || ingredientes.length === 0) {
      alert('Debes arrastrar al menos un insumo para crear una receta.');
      return;
    }

    onGuardarReceta({
      id: `rec_${Date.now()}`,
      nombre: nombreReceta,
      precioVenta: Number(precioVenta),
      ventasEstimadas: Number(ventasEstimadas),
      ingredientes,
      costoTotal: costoTotalReceta,
    });

    setNombreReceta('');
    setPrecioVenta('');
    setVentasEstimadas('');
    setIngredientes([]);
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '24px',
        maxWidth: '1000px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          flex: '1',
          background: 'var(--color-surface, #0D131F)',
          padding: '20px',
          borderRadius: '16px',
          border: '1px solid var(--color-border)',
        }}
      >
        <h3
          style={{ margin: '0 0 15px 0', fontSize: '16px', color: 'var(--color-foreground, #F8FAFC)' }}
        >
          Despensa (Insumos)
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--color-muted-foreground)', marginBottom: '15px' }}>
          Arrastra los ingredientes hacia tu receta.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {insumosDisponibles.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#e74c3c' }}>
              No hay insumos. Crea uno primero.
            </p>
          ) : (
            insumosDisponibles.map((insumo) => (
              <div
                key={insumo.id}
                draggable
                onDragStart={(e) => handleDragStart(e, insumo)}
                style={{
                  padding: '12px',
                  background: 'var(--color-surface-elevated, #131A29)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  cursor: 'grab',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      color: 'var(--color-foreground, #F8FAFC)',
                    }}
                  >
                    {insumo.nombre}
                  </strong>
                  <span style={{ fontSize: '12px', color: 'var(--color-muted-foreground)' }}>
                    {insumo.proveedor}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 'bold',
                    color: 'var(--color-primary)',
                  }}
                >
                  ${insumo.costoPorUnidad} / {insumo.unidad}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div
        style={{
          flex: '2',
          background: 'var(--color-surface, #0D131F)',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid var(--color-border)',
        }}
      >
        <h3
          style={{ margin: '0 0 20px 0', color: 'var(--color-foreground, #F8FAFC)', fontSize: '18px' }}
        >
          Armar Nueva Receta
        </h3>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '15px',
              marginBottom: '20px',
            }}
          >
            <input
              type="text"
              placeholder="Nombre del Plato"
              value={nombreReceta}
              onChange={(e) => setNombreReceta(e.target.value)}
              style={inputStyle}
              required
            />
            <input
              type="number"
              placeholder="Precio Venta ($)"
              value={precioVenta}
              onChange={(e) => setPrecioVenta(e.target.value)}
              style={inputStyle}
              min="1"
              required
            />
            <input
              type="number"
              placeholder="Ventas al mes"
              value={ventasEstimadas}
              onChange={(e) => setVentasEstimadas(e.target.value)}
              style={inputStyle}
              min="1"
              required
            />
          </div>

          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
              minHeight: '150px',
              border: '2px dashed #bdc3c7',
              borderRadius: '12px',
              padding: '20px',
              backgroundColor: ingredientes.length > 0 ? '#f8fafc' : '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginBottom: '20px',
            }}
          >
            {ingredientes.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  color: '#95a5a6',
                  margin: 'auto',
                }}
              >
                <span
                  style={{
                    fontSize: '16px',
                    display: 'block',
                    marginBottom: '10px',
                  }}
                >
                  Area de ensamble
                </span>
                Suelta tus insumos aqui
              </div>
            ) : (
              ingredientes.map((ing) => (
                <div
                  key={ing.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    background: 'var(--color-surface-elevated, #131A29)',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div
                    style={{ flex: '1', fontSize: '14px', fontWeight: 'bold' }}
                  >
                    {ing.nombre}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span style={{ fontSize: '13px', color: '#7f8c8d' }}>
                      Uso:
                    </span>
                    <input
                      type="number"
                      value={ing.cantidadUsada}
                      onChange={(e) =>
                        actualizarCantidad(ing.id, e.target.value)
                      }
                      style={{
                        width: '80px',
                        padding: '6px',
                        borderRadius: '4px',
                        border: '1px solid #d1d9e0',
                        outline: 'none',
                      }}
                      min="0.001"
                      step="any"
                      required
                    />
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 'bold',
                        width: '25px',
                      }}
                    >
                      {ing.unidad}
                    </span>
                  </div>

                  <div
                    style={{
                      width: '80px',
                      textAlign: 'right',
                      fontSize: '14px',
                      color: '#e74c3c',
                      fontWeight: 'bold',
                    }}
                  >
                    $
                    {(
                      Number(ing.cantidadUsada || 0) * ing.costoPorUnidad
                    ).toLocaleString('es-CL')}
                  </div>

                  <button
                    type="button"
                    onClick={() => eliminarIngrediente(ing.id)}
                    style={{
                      background: '#fdedec',
                      border: '1px solid #e74c3c',
                      color: '#e74c3c',
                      cursor: 'pointer',
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                    }}
                  >
                    X
                  </button>
                </div>
              ))
            )}
          </div>

          <div
            style={{
              padding: '15px',
              background: '#2c3e50',
              borderRadius: '12px',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '13px', color: '#bdc3c7' }}>
                Costo de Receta
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                ${costoTotalReceta.toLocaleString('es-CL')}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#bdc3c7' }}>
                Margen de Contribucion
              </div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: margenPesos > 0 ? '#2ecc71' : '#e74c3c',
                }}
              >
                ${margenPesos.toLocaleString('es-CL')} ({margenPorcentaje}%)
              </div>
            </div>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                background: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Guardar Mezcla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  flex: '1',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #d1d9e0',
  fontSize: '14px',
  outline: 'none',
};
