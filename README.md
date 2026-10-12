# Mi Negocio Claro

Un sistema simple para que un dueño de pyme (restorán, minimarket o negocio de
servicios) entienda, sin tecnicismos, dos cosas: cuánto tiene que vender para
no perder plata, y qué tan seguro está su negocio si las ventas bajan.

## Cómo funciona

1. Al entrar, eliges qué tipo de negocio tienes. El sistema carga números de
   ejemplo de ese rubro para que veas todo funcionando de inmediato.
2. En "Gestionar costos" puedes editar o borrar esos costos de ejemplo, y
   agregar los tuyos.
3. En "Panel" ves el resumen: cuánto tienes que vender, cuánto te queda libre
   por venta, tu ganancia estimada del mes, y un puntaje del 1 al 10 de qué
   tan sano está tu negocio.

## Cómo correrlo

```
npm install
npm run dev
```

## Estructura de carpetas

- `src/core` — las fórmulas (punto de equilibrio, colchón de seguridad).
- `src/data` — números de ejemplo por tipo de negocio.
- `src/store` — dónde vive la información mientras usas la app.
- `src/components` — tarjetas, gráficos, indicadores y controles reutilizables.
- `src/modules` — un espacio por tipo de negocio, para lógica futura propia de cada rubro.
- `src/views` — las dos pantallas principales (Panel y Gestionar costos).
