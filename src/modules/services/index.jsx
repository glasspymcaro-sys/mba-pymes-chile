import PanelFlujoCaja from '../../components/cashflow/PanelFlujoCaja';
// Renderizar: <PanelFlujoCaja tipoNegocio="services" />
import React, { useState } from 'react';
import GestionServiciosPanel from './GestionServiciosPanel.jsx';
import GestionCostosVariablesRest from '../restaurant/GestionCostosVariablesRest.jsx'; 
import GestionCostosFijosRest from '../restaurant/GestionCostosFijosRest.jsx'; 
import { useAppState } from '../../store/appState.jsx';

export default function ModuloServicios() {
  const { 
    recursos: recursosGlobales, 
    servicios: serviciosGlobales, 
    costosVariables: costosVariablesGlobales,
    costosFijos: costosFijosGlobales 
  } = useAppState();

  const [servicios, setServicios] = useState(serviciosGlobales || []);
  const [costosVariables, setCostosVariables] = useState(costosVariablesGlobales || []);
  const [costosFijos, setCostosFijos] = useState(costosFijosGlobales || []);

  const recursos = recursosGlobales || [];

  const handleGuardarServicio = (nuevoServ) => setServicios([...servicios, nuevoServ]);
  
  // Reutilizamos la logica de Costos Variables/Fijos ya construida
  const handleGuardarCostoVariable = (nuevoCosto) => setCostosVariables([...costosVariables, nuevoCosto]);
  const handleEliminarCostoVariable = (id) => setCostosVariables(costosVariables.filter(cv => cv.id !== id));
  
  const handleGuardarCostoFijo = (nuevoCosto) => setCostosFijos([...costosFijos, nuevoCosto]);
  const handleEliminarCostoFijo = (id) => setCostosFijos(costosFijos.filter(cf => cf.id !== id));

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'var(--font-base, sans-serif)' }}>
      
      <div style={{ marginBottom: '50px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', color: '#1a252f', marginBottom: '10px', fontWeight: '900', letterSpacing: '-0.5px' }}>
          Gestión de Agencia y Servicios Profesionales
        </h2>
        <p style={{ color: '#5c6c7b', fontSize: '16px', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6' }}>
          Mide la rentabilidad real de tus proyectos calculando el costo de las Horas Hombre (HH) y los gastos directos asociados a cada cliente.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
        
        <GestionServiciosPanel 
          recursos={recursos}
          servicios={servicios}
          onGuardarServicio={handleGuardarServicio}
        />

        <hr style={{ border: 'none', borderTop: '2px dashed #d1d9e0', margin: '0' }} />

        <GestionCostosVariablesRest 
          costosVariables={costosVariables}
          onGuardarCostoVariable={handleGuardarCostoVariable}
          onEliminarCostoVariable={handleEliminarCostoVariable}
        />

        <hr style={{ border: 'none', borderTop: '2px dashed #d1d9e0', margin: '0' }} />

        <GestionCostosFijosRest 
          costosFijos={costosFijos}
          onGuardarCostoFijo={handleGuardarCostoFijo}
          onEliminarCostoFijo={handleEliminarCostoFijo}
        />

      </div>
    </div>
  );
}