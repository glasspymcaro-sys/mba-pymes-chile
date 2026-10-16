---
name: threejs-pbr-architect
description: Arquitecto de graficos 3D con Three.js, React Three Fiber y Drei. Reemplaza figuras geometricas basicas o genericas por ensamblajes multi-pieza tipo CAD, materiales fisicos PBR realistas, shaders matematicos e iluminacion de estudio optimizada para produccion.
---

# Three.js & React Three Fiber PBR Architect

Cuando la aplicacion incluya escenas 3D, Canvas WebGL o visualizaciones interactivas, queda terminantemente prohibido usar primitivas crudas sueltas (como una esfera o un cubo basico girando).

## 1. Reglas de Geometria Compuesta (Cero Figuras Genericas)

1. **Ensamblajes Multi-Pieza:**
   - Toda entidad 3D principal debe ser un `<group>` compuesto por al menos **3 a 5 sub-elementos coordinados**: nucleo estructural, anillos o marcos biselados (`RoundedBox` de `@react-three/drei`), grilla de referencia espacial, y nodos o conectores orbitales.
2. **InstancedMesh para Escala y Detalle:**
   - Si necesitas mostrar matrices de datos, terrenos o nubes de nodos, utiliza `<instancedMesh>` para renderizar cientos de micro-elementos con **1 solo draw call** a 60 FPS constantes.
3. **Geometria Biselada:**
   - Nunca uses `<boxGeometry />` con bordes infinitamente filosos que se ven falsos bajo la luz. Usa `<RoundedBox radius={0.06} smoothness={4}>` para que los bordes capturen reflejos especulares reales.

## 2. Materiales Fisicos de Estudio (PBR Standard)

Reemplaza `<meshStandardMaterial />` basicos por `<meshPhysicalMaterial />` con parametros del mundo real:

- **Acero Anodizado Oscuro (Chasis):**
  ```tsx
  <meshPhysicalMaterial
    color="#18181b"
    metalness={0.85}
    roughness={0.22}
    clearcoat={0.4}
    clearcoatRoughness={0.15}
    reflectivity={0.9}
  />
  ```
- **Cristal Acrilico / Lente Tecnica (Transmision):**
  ```tsx
  <meshPhysicalMaterial
    color="#e4e4e7"
    transmission={0.92}
    opacity={1}
    metalness={0.05}
    roughness={0.08}
    ior={1.52}
    thickness={1.2}
    attenuationColor="#a1a1aa"
    attenuationDistance={2.5}
  />
  ```
- **Acento Tecnico (Wireframe CAD Sutil):**
  Superpon una malla secundaria con `scale={1.002}` y `<meshBasicMaterial color="#10b981" wireframe transparent opacity={0.12} />` para dar acabado de ingenieria de precision.

## 3. Iluminacion, Rendimiento y Limpieza de Memoria

- **Configuracion de `<Canvas>` para Movil y Desktop:**
  Usa siempre `dpr={[1, 1.75]}` y `gl={{ antialias: true, powerPreference: 'high-performance' }}`.
- **Iluminacion de 3 Puntos:**
  Combina una `directionalLight` principal calida/blanca, una `spotLight` de recorte (Rim Light) en angulo opuesto y `<Environment preset="city" />` con intensidad controlada (`environmentIntensity={0.4}`).
- **Animacion Suave Basada en Delta:**
  Dentro de `useFrame((state, delta) => ...)`, usa interpolacion amortiguada (`THREE.MathUtils.damp`) en lugar de incrementos fijos para que el movimiento sea sedoso en monitores de 60Hz, 120Hz o 144Hz.
- **Suspense Fallback:** Envuelve la escena 3D en un `<Suspense>` con un placeholder tecnico SVG para que la pagina cargue instantaneamente sin bloquear el hilo principal.
