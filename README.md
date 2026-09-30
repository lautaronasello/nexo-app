# 💳 NEXO Merchant Console

> **Consola de Administración Financiera y Gestión de Cobros para Comercios**  
> Desarrollada con **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS** y **Clean Architecture**, conectada a la API transaccional de **NEXO** (NestJS + Prisma + BullMQ).

---

## 📌 ¿Qué es NEXO Merchant?

**NEXO Merchant Console** es una plataforma web fintech diseñada para que comercios y puntos de venta gestionen de manera centralizada sus cobros, concilien operaciones multicanal, auditen retenciones impositivas y comisiones, y monitoreen en tiempo real el ciclo de vida de sus fondos (desde el cobro en el POS/QR hasta la acreditación neta en cuenta).

---

## 🎯 ¿Para qué sirve y qué problemas resuelve?

En el ecosistema de pagos y cobros, los comercios suelen enfrentarse a falta de transparencia en las comisiones de pasarelas, fechas inciertas de cobro y dificultades para conciliar impuestos:

1. **Claridad y Previsibilidad Financiera**: Permite conocer con exactitud cuánto dinero se acreditará realmente y en qué fecha exacta, desglosando la comisión de la pasarela y el IVA (21%).
2. **Control Multicomercio**: Conmutación y registro instantáneo entre distintas sucursales o razones sociales (con validación de CUIT y balances independientes).
3. **Simulación de Costos de Cobro**: Calculadora interactiva que cotiza al instante el costo de cobrar con Débito, Crédito (1 o 3 cuotas) o QR antes de procesar el pago.
4. **Acreditación Inmediata vs. Programada**: Flexibilidad para adelantar fondos en cuotas asumiendo una penalidad financiera o esperar la fecha de acreditación estándar.
5. **Auditoría e Idempotencia**: Historial completo con claves de idempotencia para evitar cobros duplicados y trazabilidad punto a punto entre cada transacción y su respectiva liquidación.

---

## ✨ Características Principales

## IMPORTANTE - Repositorio backend:

- URL: https://github.com/lautaronasello/nexo-api

### 1. Panel de Control y Balances en Tiempo Real

- **Balance Disponible**: Fondos listos para retiro o ya acreditados.
- **Balance Pendiente**: Montos de ventas en proceso de liquidación según los plazos de cada medio de pago.
- **Conmutador de Comercios**: Selector global persistido en `localStorage` con actualización reactiva en todos los módulos.
- **Alta de Nuevos Comercios**: Modal para dar de alta comercios con Razón Social, CUIT y Correo Electrónico.

### 2. Simulador y Cotizador de Liquidaciones (`Fee Calculator`)

- Cálculo determinístico en frontend y sincronizado con backend (`POST /settlements/calculate-preview`).
- Desglose transparente:
  - **Monto Bruto**
  - **Comisión de Plataforma**
  - **IVA (21%) sobre comisiones**
  - **Monto Neto Final a Acreditar**
  - **Fecha y Hora Estimada de Acreditación**
- Interruptor para **Liquidación Inmediata con Penalidad** en planes de cuotas.

### 3. Emulador de Cobros (POS / QR)

- Generación de transacciones con **claves de idempotencia únicas** (`UUID v4`).
- Validación en tiempo real con `react-hook-form` y `zod`.
- Selección de medios de pago con feedback inmediato de aprobación o rechazo.

### 4. Historial Detallado de Transacciones

- Tabla paginada con filtrado dinámico por medio de pago y estado (`APPROVED`, `PENDING`, `REJECTED`).
- Identificadores de transacción y vinculación directa con su liquidación (`SET-XXXX`).

### 5. Auditoría de Liquidaciones y Pagos Programados

- Monitoreo de desembolsos futuros organizados por fecha programada.
- Resumen acumulado de comisiones retenidas e IVA total aplicado.
- Estados de liquidación (`COMPLETED`, `PENDING`).

---

## 📊 Reglas de Liquidación y Tarifas Soportadas

| Medio de Pago         | Código     | Comisión Base | Plazo de Acreditación | Opción Anticipada / Inmediata             |
| :-------------------- | :--------- | :------------ | :-------------------- | :---------------------------------------- |
| **Código QR**         | `QR`       | **0.6%**      | Inmediato (0 hs)      | Incluida                                  |
| **Tarjeta de Débito** | `DEBIT`    | **0.8%**      | 24 Horas Hábiles      | N/A                                       |
| **Crédito 1 Pago**    | `CREDIT_1` | **1.8%**      | 48 Horas Hábiles      | N/A                                       |
| **Crédito 3 Cuotas**  | `CREDIT_3` | **6.5%**      | 10 Días Hábiles       | **8.5%** (6.5% base + 2% penalidad, 0 hs) |

> ℹ️ **Cálculo Fiscal:** Se aplica el **21% de IVA** sobre la comisión calculada.  
> `Deducción Total = Comisión + (Comisión × 0.21)`  
> `Monto Neto = Monto Bruto - Deducción Total`

---

## 🏗️ Arquitectura del Software

El proyecto sigue los principios de **Clean Architecture**, dividiendo la aplicación en capas desacopladas para máxima mantenibilidad y facilidad de testing:

```
src/
├── domain/                    # Capa de Dominio (Entidades puras y contratos)
│   ├── entities/              # Merchant, Transaction, Settlement
│   └── repositories/          # Interfaces (IMerchantRepository, etc.)
│
├── application/               # Capa de Aplicación (Casos de uso y hooks de React)
│   └── hooks/                 # useTransactions, useSettlements, useMerchantBalance
│
├── infrastructure/            # Capa de Infraestructura (Adaptadores externos y APIs)
│   ├── api/                   # Cliente Axios centralizado con interceptores
│   └── repositories/          # Implementaciones HTTP de los repositorios
│
└── presentation/              # Capa de Presentación (UI y React Components)
    ├── components/            # UI components, layout, dashboard, modales
    └── providers/             # React Query Provider, Merchant Provider Context
```

---

## 🛠️ Stack Tecnológico

- **Framework Web**: [Next.js](https://nextjs.org/) (App Router, Server Components y Client Components)
- **Biblioteca UI**: [React](https://react.dev/)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/) (tipado estricto)
- **Gestión de Estado Asíncrono & Cache**: [TanStack Query v5](https://tanstack.com/query)
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconografía**: [Lucide React](https://lucide.dev/)
- **Formularios & Validación**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Cliente HTTP**: [Axios](https://axios-http.com/)

---

## 🚀 Puesta en Marcha

### Prerrequisitos

- **Node.js** >= 18.17.0
- **npm** o **yarn** / **pnpm**
- Backend NEXO API activo (localmente o en la nube)

### 1. Clonar el repositorio e instalar dependencias

```bash
git clone <URL_DEL_REPOSITORIO>
cd nexo/app
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto (o utiliza el provisto en `.env.local.example`):

```env
# URL de la API NEXO (ejemplo con Render o backend local)
NEXT_PUBLIC_API_URL=(URL DE LA API CON RENDER U OTRO SERVIDOR)
```

### 3. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### 4. Compilación para Producción

```bash
npm run build
npm start
```

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.
