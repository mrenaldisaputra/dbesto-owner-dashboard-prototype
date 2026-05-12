# DBESTO Group Owner Dashboard Prototype

Prototype dashboard management pusat / owner dashboard untuk grup F&B/franchise nasional dengan sekitar 1.300 outlet.

## Stack

- React
- Tailwind CSS
- Recharts
- Mock data internal di `src/App.jsx`
- Tanpa backend, database, login, atau API integration

## Cara Menjalankan

```bash
npm install
npm run dev
```

Buka URL localhost yang muncul dari Vite.

## Struktur

```text
src/App.jsx       # Satu file React utama berisi UI, komponen, mock data, dan halaman dashboard
src/main.jsx      # Entry point React
src/index.css     # Tailwind directives
```

## Halaman Prototype

1. Executive Summary
2. Sales & Revenue
3. Outlet Performance
4. Stockist & Warehouse
5. Production & Cold Storage
6. Logistics Delivery
7. Finance & Settlement
8. Profit Sharing
9. Early Warning & Anti-Leakage

## Catatan Mockup

Semua data masih dummy dan dibuat untuk kebutuhan presentasi. Tombol action seperti export report, create audit task, open case, dan reconcile belum tersambung ke backend.
