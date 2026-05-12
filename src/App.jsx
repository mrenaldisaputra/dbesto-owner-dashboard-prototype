import React, { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const dbestoLogo = "/assets/logodbesto.png";

/**
 * DBESTO Group Owner Dashboard Prototype
 * Stack: React + Tailwind CSS + Recharts
 * Usage: paste this file into src/App.jsx in a Vite React app.
 */

const BRAND_COLORS = {
  "d'besto chicken n burger": "#ed1c24",
  "d'chicken": "#ffdf00",
  "d'roasting": "#f5a800",
  "Lazatto chicken n burger": "#b70611",
  "d'Sruput": "#11100e",
  "d'bakso": "#756f67",
};

const CHART = {
  primary: "#ed1c24",
  primaryDark: "#b70611",
  accent: "#ffdf00",
  accentDark: "#f5a800",
  ink: "#11100e",
  neutral: "#d8cfbd",
  slate: "#756f67",
  grid: "#f1dfb1",
  success: "#16834a",
};

const PIE_COLORS = [CHART.primary, CHART.accent, CHART.ink, CHART.accentDark, CHART.primaryDark, CHART.slate];
const STATUS_COLORS = [CHART.success, CHART.accentDark, CHART.primary, CHART.ink];

function getNodeText(node) {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join(" ").trim();
  if (React.isValidElement(node)) return getNodeText(node.props.children);
  return "Aksi";
}

function showDemoToast({ title = "Aksi diproses", message, tone = "info" } = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("dbesto:toast", {
      detail: {
        title,
        message: message || "Fitur ini masih mode prototype. Simulasi berhasil ditampilkan, backend belum tersambung.",
        tone,
      },
    })
  );
}

function showFilterToast(label, value) {
  showDemoToast({
    title: "Filter diperbarui",
    message: `${label}: ${value}. Data dashboard sudah menyesuaikan data demo.`,
    tone: "success",
  });
}

const brands = [
  "d'besto chicken n burger",
  "d'chicken",
  "d'roasting",
  "Lazatto chicken n burger",
  "d'Sruput",
  "d'bakso",
];

const areas = ["Barat", "Tengah", "Timur"];

const ownershipSchemes = [
  "Full Company",
  "Full Franchisee",
  "Company + Investor",
  "Group + Non-Group",
  "Company + Investor + Operator",
];

const paymentMethods = [
  { name: "Cash", value: 4350000000, tx: 152000 },
  { name: "QRIS", value: 5150000000, tx: 182000 },
  { name: "EDC", value: 2820000000, tx: 74000 },
  { name: "e-Wallet", value: 1880000000, tx: 61000 },
  { name: "Transfer", value: 680000000, tx: 9000 },
];

const salesTrend7d = [
  { date: "6 Mei", gross: 1780000000, net: 1640000000, trx: 58200 },
  { date: "7 Mei", gross: 1845000000, net: 1712000000, trx: 60500 },
  { date: "8 Mei", gross: 1910000000, net: 1773000000, trx: 62100 },
  { date: "9 Mei", gross: 2245000000, net: 2080000000, trx: 72300 },
  { date: "10 Mei", gross: 2430000000, net: 2255000000, trx: 78100 },
  { date: "11 Mei", gross: 1990000000, net: 1847000000, trx: 65700 },
  { date: "12 Mei", gross: 2075000000, net: 1930000000, trx: 68200 },
];

const revenueTrend12m = [
  { month: "Jun '25", revenue: 41200000000, netProfit: 4480000000 },
  { month: "Jul '25", revenue: 42900000000, netProfit: 4720000000 },
  { month: "Agu '25", revenue: 43800000000, netProfit: 4860000000 },
  { month: "Sep '25", revenue: 44600000000, netProfit: 4920000000 },
  { month: "Okt '25", revenue: 46100000000, netProfit: 5180000000 },
  { month: "Nov '25", revenue: 47200000000, netProfit: 5360000000 },
  { month: "Des '25", revenue: 51100000000, netProfit: 6040000000 },
  { month: "Jan '26", revenue: 49300000000, netProfit: 5620000000 },
  { month: "Feb '26", revenue: 48500000000, netProfit: 5430000000 },
  { month: "Mar '26", revenue: 52200000000, netProfit: 6340000000 },
  { month: "Apr '26", revenue: 53800000000, netProfit: 6570000000 },
  { month: "Mei '26", revenue: 55800000000, netProfit: 6840000000 },
];

const brandSales = [
  { brand: "d'besto", sales: 17900000000, outlets: 520, margin: 39.4 },
  { brand: "d'chicken", sales: 11100000000, outlets: 265, margin: 36.8 },
  { brand: "Lazatto", sales: 9700000000, outlets: 220, margin: 35.9 },
  { brand: "d'roasting", sales: 6200000000, outlets: 115, margin: 42.1 },
  { brand: "d'Sruput", sales: 4200000000, outlets: 95, margin: 48.7 },
  { brand: "d'bakso", sales: 6900000000, outlets: 85, margin: 41.3 },
];

const areaSales = [
  { area: "Barat", sales: 37700000000, outlets: 795, sla: 92.7 },
  { area: "Tengah", sales: 9400000000, outlets: 225, sla: 93.1 },
  { area: "Timur", sales: 11600000000, outlets: 280, sla: 91.7 },
];

const menuSales = [
  { menu: "Paket Geprek 1", qty: 186000, sales: 4650000000 },
  { menu: "Paket Original 2", qty: 151000, sales: 3926000000 },
  { menu: "Burger Chicken Cheese", qty: 98000, sales: 2352000000 },
  { menu: "Ayam Roasting Rice", qty: 71000, sales: 2130000000 },
  { menu: "Lazatto Combo Hemat", qty: 85000, sales: 2040000000 },
  { menu: "Es Teh Jumbo d'Sruput", qty: 206000, sales: 1854000000 },
  { menu: "Bakso Urat Komplit", qty: 59000, sales: 1711000000 },
  { menu: "French Fries Large", qty: 76000, sales: 1140000000 },
  { menu: "Saus Sambal Sachet", qty: 240000, sales: 480000000 },
  { menu: "Add-on Cheese", qty: 47000, sales: 423000000 },
];

const outlets = [
  {
    id: "OUT-001",
    name: "d'besto Rawamangun",
    brand: "d'besto chicken n burger",
    area: "Barat",
    ownership: "Full Company",
    active: true,
    status: "Healthy",
    dailySales: 31750000,
    monthlySales: 875000000,
    target: 820000000,
    grossMargin: 0.394,
    netProfit: 112000000,
    cashVariance: 250000,
    stockVariance: 0.7,
    waste: 1.9,
    refund: 0.2,
    void: 0.1,
    transactions: 1120,
    avgBasket: 28350,
    closing: "Closed",
    settlement: "Settled",
    riskScore: 18,
  },
  {
    id: "OUT-002",
    name: "d'besto Kelapa Gading",
    brand: "d'besto chicken n burger",
    area: "Barat",
    ownership: "Company + Investor",
    active: true,
    status: "Attention",
    dailySales: 28400000,
    monthlySales: 742000000,
    target: 790000000,
    grossMargin: 0.365,
    netProfit: 66000000,
    cashVariance: -1450000,
    stockVariance: 2.4,
    waste: 3.6,
    refund: 0.6,
    void: 0.5,
    transactions: 980,
    avgBasket: 28980,
    closing: "Closed",
    settlement: "Pending",
    riskScore: 49,
  },
  {
    id: "OUT-003",
    name: "d'chicken Jatiwaringin",
    brand: "d'chicken",
    area: "Barat",
    ownership: "Full Franchisee",
    active: true,
    status: "Healthy",
    dailySales: 22100000,
    monthlySales: 615000000,
    target: 585000000,
    grossMargin: 0.371,
    netProfit: 72000000,
    cashVariance: 0,
    stockVariance: 0.9,
    waste: 2.1,
    refund: 0.2,
    void: 0.2,
    transactions: 810,
    avgBasket: 27280,
    closing: "Closed",
    settlement: "Settled",
    riskScore: 24,
  },
  {
    id: "OUT-004",
    name: "Lazatto Karawang Barat",
    brand: "Lazatto chicken n burger",
    area: "Barat",
    ownership: "Group + Non-Group",
    active: true,
    status: "High Risk",
    dailySales: 16200000,
    monthlySales: 458000000,
    target: 620000000,
    grossMargin: 0.312,
    netProfit: -18500000,
    cashVariance: -6900000,
    stockVariance: 6.8,
    waste: 5.9,
    refund: 1.8,
    void: 1.4,
    transactions: 610,
    avgBasket: 26560,
    closing: "Late",
    settlement: "Overdue",
    riskScore: 79,
  },
  {
    id: "OUT-005",
    name: "d'roasting Tembalang",
    brand: "d'roasting",
    area: "Tengah",
    ownership: "Full Franchisee",
    active: true,
    status: "Healthy",
    dailySales: 19800000,
    monthlySales: 548000000,
    target: 520000000,
    grossMargin: 0.421,
    netProfit: 76000000,
    cashVariance: 160000,
    stockVariance: 0.6,
    waste: 1.5,
    refund: 0.1,
    void: 0.1,
    transactions: 540,
    avgBasket: 36670,
    closing: "Closed",
    settlement: "Settled",
    riskScore: 16,
  },
  {
    id: "OUT-006",
    name: "d'Sruput Surabaya Rungkut",
    brand: "d'Sruput",
    area: "Timur",
    ownership: "Company + Investor + Operator",
    active: true,
    status: "Attention",
    dailySales: 11900000,
    monthlySales: 326000000,
    target: 345000000,
    grossMargin: 0.486,
    netProfit: 31000000,
    cashVariance: -760000,
    stockVariance: 2.1,
    waste: 3.2,
    refund: 0.5,
    void: 0.4,
    transactions: 880,
    avgBasket: 13520,
    closing: "Closed",
    settlement: "Pending",
    riskScore: 43,
  },
  {
    id: "OUT-007",
    name: "d'bakso Bekasi Timur",
    brand: "d'bakso",
    area: "Barat",
    ownership: "Full Company",
    active: true,
    status: "Audit Required",
    dailySales: 13700000,
    monthlySales: 371000000,
    target: 510000000,
    grossMargin: 0.337,
    netProfit: -22800000,
    cashVariance: -3200000,
    stockVariance: 8.3,
    waste: 7.1,
    refund: 1.3,
    void: 1.1,
    transactions: 470,
    avgBasket: 29150,
    closing: "Late",
    settlement: "Overdue",
    riskScore: 87,
  },
  {
    id: "OUT-008",
    name: "d'besto Cikarang Selatan",
    brand: "d'besto chicken n burger",
    area: "Barat",
    ownership: "Company + Investor",
    active: true,
    status: "High Risk",
    dailySales: 18500000,
    monthlySales: 505000000,
    target: 680000000,
    grossMargin: 0.329,
    netProfit: -8900000,
    cashVariance: -5100000,
    stockVariance: 5.7,
    waste: 5.2,
    refund: 1.1,
    void: 1.0,
    transactions: 690,
    avgBasket: 26810,
    closing: "Open",
    settlement: "Overdue",
    riskScore: 76,
  },
  {
    id: "OUT-009",
    name: "Lazatto Cikampek",
    brand: "Lazatto chicken n burger",
    area: "Barat",
    ownership: "Full Franchisee",
    active: true,
    status: "Healthy",
    dailySales: 20400000,
    monthlySales: 579000000,
    target: 560000000,
    grossMargin: 0.359,
    netProfit: 61000000,
    cashVariance: 120000,
    stockVariance: 1.1,
    waste: 2.2,
    refund: 0.2,
    void: 0.2,
    transactions: 760,
    avgBasket: 26840,
    closing: "Closed",
    settlement: "Settled",
    riskScore: 28,
  },
  {
    id: "OUT-010",
    name: "d'chicken Banyumanik",
    brand: "d'chicken",
    area: "Tengah",
    ownership: "Group + Non-Group",
    active: true,
    status: "Attention",
    dailySales: 16700000,
    monthlySales: 442000000,
    target: 480000000,
    grossMargin: 0.354,
    netProfit: 36500000,
    cashVariance: -980000,
    stockVariance: 2.6,
    waste: 3.4,
    refund: 0.7,
    void: 0.5,
    transactions: 620,
    avgBasket: 26930,
    closing: "Closed",
    settlement: "Pending",
    riskScore: 52,
  },
  {
    id: "OUT-011",
    name: "d'besto Kenjeran",
    brand: "d'besto chicken n burger",
    area: "Timur",
    ownership: "Full Company",
    active: true,
    status: "Healthy",
    dailySales: 25600000,
    monthlySales: 716000000,
    target: 700000000,
    grossMargin: 0.382,
    netProfit: 84500000,
    cashVariance: 190000,
    stockVariance: 0.8,
    waste: 2.0,
    refund: 0.2,
    void: 0.2,
    transactions: 950,
    avgBasket: 26950,
    closing: "Closed",
    settlement: "Settled",
    riskScore: 21,
  },
  {
    id: "OUT-012",
    name: "d'roasting Tebet",
    brand: "d'roasting",
    area: "Barat",
    ownership: "Company + Investor",
    active: true,
    status: "Healthy",
    dailySales: 24500000,
    monthlySales: 690000000,
    target: 650000000,
    grossMargin: 0.432,
    netProfit: 102000000,
    cashVariance: 0,
    stockVariance: 0.5,
    waste: 1.4,
    refund: 0.1,
    void: 0.1,
    transactions: 640,
    avgBasket: 38280,
    closing: "Closed",
    settlement: "Settled",
    riskScore: 15,
  },
  {
    id: "OUT-013",
    name: "d'Sruput Karawang Timur",
    brand: "d'Sruput",
    area: "Barat",
    ownership: "Full Franchisee",
    active: true,
    status: "High Risk",
    dailySales: 8300000,
    monthlySales: 224000000,
    target: 310000000,
    grossMargin: 0.421,
    netProfit: -6100000,
    cashVariance: -1850000,
    stockVariance: 5.2,
    waste: 6.0,
    refund: 1.0,
    void: 0.9,
    transactions: 650,
    avgBasket: 12770,
    closing: "Late",
    settlement: "Overdue",
    riskScore: 73,
  },
  {
    id: "OUT-014",
    name: "d'bakso Manyar",
    brand: "d'bakso",
    area: "Timur",
    ownership: "Company + Investor + Operator",
    active: true,
    status: "Attention",
    dailySales: 15400000,
    monthlySales: 415000000,
    target: 430000000,
    grossMargin: 0.397,
    netProfit: 36500000,
    cashVariance: -670000,
    stockVariance: 2.8,
    waste: 3.5,
    refund: 0.4,
    void: 0.4,
    transactions: 530,
    avgBasket: 29060,
    closing: "Closed",
    settlement: "Pending",
    riskScore: 46,
  },
  {
    id: "OUT-015",
    name: "d'besto Pondok Gede",
    brand: "d'besto chicken n burger",
    area: "Barat",
    ownership: "Full Company",
    active: true,
    status: "Healthy",
    dailySales: 29800000,
    monthlySales: 812000000,
    target: 780000000,
    grossMargin: 0.388,
    netProfit: 98000000,
    cashVariance: 220000,
    stockVariance: 0.9,
    waste: 1.8,
    refund: 0.2,
    void: 0.2,
    transactions: 1080,
    avgBasket: 27590,
    closing: "Closed",
    settlement: "Settled",
    riskScore: 19,
  },
  {
    id: "OUT-016",
    name: "Lazatto Ungaran",
    brand: "Lazatto chicken n burger",
    area: "Tengah",
    ownership: "Full Franchisee",
    active: false,
    status: "Attention",
    dailySales: 0,
    monthlySales: 126000000,
    target: 420000000,
    grossMargin: 0.318,
    netProfit: -18500000,
    cashVariance: 0,
    stockVariance: 1.8,
    waste: 4.1,
    refund: 0.2,
    void: 0.1,
    transactions: 0,
    avgBasket: 0,
    closing: "Nonaktif",
    settlement: "Hold",
    riskScore: 58,
  },
  {
    id: "OUT-017",
    name: "d'chicken Grogol",
    brand: "d'chicken",
    area: "Barat",
    ownership: "Company + Investor + Operator",
    active: true,
    status: "Audit Required",
    dailySales: 15100000,
    monthlySales: 398000000,
    target: 570000000,
    grossMargin: 0.321,
    netProfit: -12400000,
    cashVariance: -4400000,
    stockVariance: 9.2,
    waste: 6.8,
    refund: 1.5,
    void: 1.7,
    transactions: 590,
    avgBasket: 25590,
    closing: "Open",
    settlement: "Overdue",
    riskScore: 91,
  },
  {
    id: "OUT-018",
    name: "d'besto Rungkut Industri",
    brand: "d'besto chicken n burger",
    area: "Timur",
    ownership: "Full Company",
    active: true,
    status: "High Risk",
    dailySales: 17600000,
    monthlySales: 486000000,
    target: 640000000,
    grossMargin: 0.333,
    netProfit: -7300000,
    cashVariance: -2600000,
    stockVariance: 4.9,
    waste: 5.5,
    refund: 1.1,
    void: 0.8,
    transactions: 680,
    avgBasket: 25880,
    closing: "Late",
    settlement: "Pending",
    riskScore: 71,
  },
  {
    id: "OUT-019",
    name: "d'bakso Telukjambe",
    brand: "d'bakso",
    area: "Barat",
    ownership: "Group + Non-Group",
    active: true,
    status: "Healthy",
    dailySales: 18100000,
    monthlySales: 502000000,
    target: 490000000,
    grossMargin: 0.413,
    netProfit: 59000000,
    cashVariance: 90000,
    stockVariance: 1.0,
    waste: 2.0,
    refund: 0.2,
    void: 0.1,
    transactions: 610,
    avgBasket: 29670,
    closing: "Closed",
    settlement: "Settled",
    riskScore: 23,
  },
  {
    id: "OUT-020",
    name: "d'Sruput Simpang Lima",
    brand: "d'Sruput",
    area: "Tengah",
    ownership: "Full Franchisee",
    active: true,
    status: "Healthy",
    dailySales: 14300000,
    monthlySales: 392000000,
    target: 370000000,
    grossMargin: 0.503,
    netProfit: 51500000,
    cashVariance: 60000,
    stockVariance: 0.8,
    waste: 1.9,
    refund: 0.1,
    void: 0.1,
    transactions: 1040,
    avgBasket: 13750,
    closing: "Closed",
    settlement: "Settled",
    riskScore: 20,
  },
];

const stockists = [
  {
    id: "STK-01",
    name: "Stockist Jakarta Cakung",
    area: "Barat",
    health: "Healthy",
    frozenChicken: 24800,
    meat: 7200,
    sausage: 5200,
    seasoning: 3300,
    sauce: 6100,
    packaging: 182000,
    criticalItems: 1,
    expiryAlerts: 3,
    stockIn: 18400,
    stockOut: 17650,
    variance: 0.8,
    returnQty: 230,
    damaged: 65,
    opnameStatus: "Completed",
  },
  {
    id: "STK-02",
    name: "Stockist Bekasi Jatiasih",
    area: "Barat",
    health: "Attention",
    frozenChicken: 15800,
    meat: 5200,
    sausage: 3600,
    seasoning: 2400,
    sauce: 4200,
    packaging: 131000,
    criticalItems: 4,
    expiryAlerts: 8,
    stockIn: 12100,
    stockOut: 13250,
    variance: 2.7,
    returnQty: 410,
    damaged: 180,
    opnameStatus: "In Progress",
  },
  {
    id: "STK-03",
    name: "Stockist Karawang Barat",
    area: "Barat",
    health: "High Risk",
    frozenChicken: 9100,
    meat: 2900,
    sausage: 1400,
    seasoning: 1250,
    sauce: 2100,
    packaging: 72000,
    criticalItems: 9,
    expiryAlerts: 12,
    stockIn: 7400,
    stockOut: 8920,
    variance: 5.6,
    returnQty: 620,
    damaged: 310,
    opnameStatus: "Overdue",
  },
  {
    id: "STK-04",
    name: "Stockist Semarang Genuk",
    area: "Tengah",
    health: "Healthy",
    frozenChicken: 17600,
    meat: 4800,
    sausage: 2800,
    seasoning: 2700,
    sauce: 3900,
    packaging: 118000,
    criticalItems: 2,
    expiryAlerts: 4,
    stockIn: 10900,
    stockOut: 10300,
    variance: 1.1,
    returnQty: 170,
    damaged: 75,
    opnameStatus: "Completed",
  },
  {
    id: "STK-05",
    name: "Stockist Surabaya Waru",
    area: "Timur",
    health: "Attention",
    frozenChicken: 18900,
    meat: 5300,
    sausage: 3200,
    seasoning: 2600,
    sauce: 4600,
    packaging: 146000,
    criticalItems: 5,
    expiryAlerts: 7,
    stockIn: 13400,
    stockOut: 14120,
    variance: 2.9,
    returnQty: 370,
    damaged: 145,
    opnameStatus: "In Progress",
  },
];

const stockVarianceRows = [
  { stockist: "Karawang Barat", item: "Ayam frozen 9-cut", system: 9100, physical: 8585, variance: -515, loss: 16480000, status: "High Risk" },
  { stockist: "Bekasi Jatiasih", item: "Saus sambal sachet", system: 4200, physical: 4075, variance: -125, loss: 3250000, status: "Attention" },
  { stockist: "Surabaya Waru", item: "Packaging burger", system: 146000, physical: 143950, variance: -2050, loss: 2870000, status: "Attention" },
  { stockist: "Jakarta Cakung", item: "Bumbu crispy", system: 3300, physical: 3274, variance: -26, loss: 780000, status: "Healthy" },
  { stockist: "Semarang Genuk", item: "Daging bakso", system: 4800, physical: 4756, variance: -44, loss: 2640000, status: "Healthy" },
];

const expiryAlerts = [
  { stockist: "Karawang Barat", item: "Sosis jumbo", qty: 420, expiredIn: "3 hari", action: "Push promo / transfer wilayah", status: "High" },
  { stockist: "Bekasi Jatiasih", item: "Saus keju", qty: 280, expiredIn: "5 hari", action: "Prioritaskan DO outlet high traffic", status: "Medium" },
  { stockist: "Surabaya Waru", item: "Bumbu roasting", qty: 190, expiredIn: "6 hari", action: "QC ulang + rotate stock", status: "Medium" },
  { stockist: "Jakarta Cakung", item: "Packaging cup 16oz", qty: 9000, expiredIn: "12 hari", action: "Normal rotate", status: "Low" },
];

const productionHouses = [
  {
    id: "PRD-01",
    name: "Rumah Produksi Barat",
    area: "Barat",
    status: "Healthy",
    plannedProduction: 38500,
    actualProduction: 37980,
    yieldStandard: 94.5,
    actualYield: 93.9,
    yieldVariance: -0.6,
    rejectProduct: 320,
    qcFail: 42,
    waste: 1.7,
    costPerKg: 23800,
    coldStorageCapacity: 78,
    temperature: -18.4,
    batchStatus: "Released",
    readyToShip: 21400,
  },
  {
    id: "PRD-02",
    name: "Rumah Produksi Tengah",
    area: "Tengah",
    status: "Attention",
    plannedProduction: 31200,
    actualProduction: 29680,
    yieldStandard: 94.2,
    actualYield: 91.6,
    yieldVariance: -2.6,
    rejectProduct: 690,
    qcFail: 88,
    waste: 3.4,
    costPerKg: 25100,
    coldStorageCapacity: 91,
    temperature: -16.8,
    batchStatus: "QC Hold",
    readyToShip: 14800,
  },
  {
    id: "PRD-03",
    name: "Rumah Produksi Timur",
    area: "Timur",
    status: "High Risk",
    plannedProduction: 24600,
    actualProduction: 22100,
    yieldStandard: 93.8,
    actualYield: 89.4,
    yieldVariance: -4.4,
    rejectProduct: 980,
    qcFail: 135,
    waste: 5.2,
    costPerKg: 26900,
    coldStorageCapacity: 96,
    temperature: -14.9,
    batchStatus: "Hold",
    readyToShip: 7200,
  },
];

const productionPlanRows = productionHouses.map((p) => ({
  name: p.area,
  planned: p.plannedProduction,
  actual: p.actualProduction,
}));

const deliveryStats = {
  totalDO: 8420,
  inProgress: 690,
  completed: 7430,
  onTimeDelivery: 92.1,
  inFullDelivery: 95.4,
  deliveryDispute: 83,
  shortItems: 128,
  damagedItems: 47,
  costPerDelivery: 186000,
  costPerKg: 1240,
};

const deliveryStatus = [
  { name: "Completed", value: 7430 },
  { name: "In Progress", value: 690 },
  { name: "Dispute", value: 83 },
  { name: "Delayed", value: 217 },
];

const slaTrend = [
  { day: "Sen", onTime: 91.2, inFull: 95.1 },
  { day: "Sel", onTime: 92.7, inFull: 95.6 },
  { day: "Rab", onTime: 93.4, inFull: 96.2 },
  { day: "Kam", onTime: 92.3, inFull: 95.7 },
  { day: "Jum", onTime: 90.8, inFull: 94.6 },
  { day: "Sab", onTime: 89.5, inFull: 93.8 },
  { day: "Min", onTime: 94.2, inFull: 96.4 },
];

const routePerformance = [
  { route: "Jakarta Timur - Bekasi", do: 1240, onTime: 94.8, inFull: 97.2, disputes: 8, costPerKg: 1100, driver: "Team A" },
  { route: "Bekasi - Cikarang", do: 970, onTime: 91.5, inFull: 94.6, disputes: 14, costPerKg: 1260, driver: "Team B" },
  { route: "Karawang - Cikampek", do: 680, onTime: 86.2, inFull: 91.7, disputes: 22, costPerKg: 1510, driver: "Team C" },
  { route: "Semarang Kota - Ungaran", do: 890, onTime: 93.1, inFull: 96.1, disputes: 9, costPerKg: 1190, driver: "Team D" },
  { route: "Surabaya - Waru - Rungkut", do: 1040, onTime: 90.4, inFull: 94.2, disputes: 19, costPerKg: 1320, driver: "Team E" },
];

const deliveryDisputes = [
  { route: "Karawang - Cikampek", outlet: "Lazatto Karawang Barat", issue: "DO ayam 9-cut kurang 48 kg", loss: 1536000, status: "Investigating" },
  { route: "Surabaya - Waru", outlet: "d'besto Rungkut Industri", issue: "POD belum diunggah > 18 jam", loss: 0, status: "Open" },
  { route: "Bekasi - Cikarang", outlet: "d'besto Cikarang Selatan", issue: "Packaging rusak 24 karton", loss: 3360000, status: "Escalated" },
];

const financeSummary = {
  posRevenue: 55800000000,
  physicalCash: 4329000000,
  cashVariance: -32600000,
  qrisEdcWalletSettlement: 18190000000,
  settlementPending: 2140000000,
  settlementOverdue: 620000000,
  franchiseReceivable: 3860000000,
  apSupplier: 6140000000,
  bankReconciled: 96.4,
  pnlOutlet: 6840000000,
  pnlBrand: 7120000000,
  pnlCompany: 6480000000,
};

const settlementStatus = [
  { name: "Settled", value: 78 },
  { name: "Pending", value: 14 },
  { name: "Overdue", value: 6 },
  { name: "Hold", value: 2 },
];

const arAging = [
  { bucket: "0-7 hari", value: 890000000 },
  { bucket: "8-14 hari", value: 760000000 },
  { bucket: "15-30 hari", value: 910000000 },
  { bucket: ">30 hari", value: 1300000000 },
];

const cashVarianceRows = [
  { outlet: "d'chicken Grogol", area: "Barat", posCash: 48600000, physical: 44200000, variance: -4400000, status: "Audit Required" },
  { outlet: "Lazatto Karawang Barat", area: "Barat", posCash: 39200000, physical: 32300000, variance: -6900000, status: "High Risk" },
  { outlet: "d'bakso Bekasi Timur", area: "Barat", posCash: 34400000, physical: 31200000, variance: -3200000, status: "High Risk" },
  { outlet: "d'besto Cikarang Selatan", area: "Barat", posCash: 42100000, physical: 37000000, variance: -5100000, status: "High Risk" },
  { outlet: "d'Sruput Surabaya Rungkut", area: "Timur", posCash: 18600000, physical: 17840000, variance: -760000, status: "Attention" },
];

const lossMakingOutlets = outlets.filter((outlet) => outlet.netProfit < 0);

const marginDropAlerts = [
  { outlet: "Lazatto Karawang Barat", marginLastMonth: 36.8, marginThisMonth: 31.2, estimatedImpact: 25600000, action: "Audit COGS + promo approval" },
  { outlet: "d'chicken Grogol", marginLastMonth: 37.4, marginThisMonth: 32.1, estimatedImpact: 21100000, action: "Review void/refund + stock usage" },
  { outlet: "d'bakso Bekasi Timur", marginLastMonth: 39.6, marginThisMonth: 33.7, estimatedImpact: 19800000, action: "Stock opname mendadak" },
];

const investorNames = [
  "PT Dbest Berkah Abadi",
  "H. Rachmat Santoso",
  "CV Mitra Boga Nusantara",
  "Ibu Amelia Putri",
  "PT Karya Rasa Sejahtera",
  "Bapak Faisal Anwar",
  "Koperasi Karyawan DBESTO",
  "PT Sumber Rezeki Food",
  "Bapak Hendra Gunawan",
  "Ibu Novita Lestari",
];

const rawProfitRows = [
  { outletName: "d'besto Kelapa Gading", brand: "d'besto chicken n burger", area: "Barat", ownershipScheme: "Company + Investor", investorName: investorNames[1], companyShare: 0.55, investorShare: 0.35, franchiseeShare: 0, operatorShare: 0.1, capitalContribution: 950000000, grossSales: 742000000, netSales: 691000000, cogs: 439000000, opex: 110000000, royalty: 20730000, managementFee: 13820000, payoutStatus: "Pending" },
  { outletName: "d'roasting Tebet", brand: "d'roasting", area: "Barat", ownershipScheme: "Company + Investor", investorName: investorNames[3], companyShare: 0.5, investorShare: 0.4, franchiseeShare: 0, operatorShare: 0.1, capitalContribution: 720000000, grossSales: 690000000, netSales: 648000000, cogs: 368000000, opex: 96500000, royalty: 19440000, managementFee: 12960000, payoutStatus: "Paid" },
  { outletName: "d'chicken Jatiwaringin", brand: "d'chicken", area: "Barat", ownershipScheme: "Full Franchisee", investorName: investorNames[2], companyShare: 0.1, investorShare: 0, franchiseeShare: 0.8, operatorShare: 0.1, capitalContribution: 520000000, grossSales: 615000000, netSales: 575000000, cogs: 360000000, opex: 89000000, royalty: 17250000, managementFee: 11500000, payoutStatus: "Paid" },
  { outletName: "d'besto Cikarang Selatan", brand: "d'besto chicken n burger", area: "Barat", ownershipScheme: "Company + Investor", investorName: investorNames[4], companyShare: 0.6, investorShare: 0.3, franchiseeShare: 0, operatorShare: 0.1, capitalContribution: 880000000, grossSales: 505000000, netSales: 468000000, cogs: 314000000, opex: 137000000, royalty: 14040000, managementFee: 9360000, payoutStatus: "Hold" },
  { outletName: "Lazatto Cikampek", brand: "Lazatto chicken n burger", area: "Barat", ownershipScheme: "Full Franchisee", investorName: investorNames[5], companyShare: 0.08, investorShare: 0, franchiseeShare: 0.82, operatorShare: 0.1, capitalContribution: 485000000, grossSales: 579000000, netSales: 541000000, cogs: 347000000, opex: 81000000, royalty: 16230000, managementFee: 10820000, payoutStatus: "Paid" },
  { outletName: "Lazatto Karawang Barat", brand: "Lazatto chicken n burger", area: "Barat", ownershipScheme: "Group + Non-Group", investorName: investorNames[7], companyShare: 0.35, investorShare: 0.35, franchiseeShare: 0.2, operatorShare: 0.1, capitalContribution: 640000000, grossSales: 458000000, netSales: 426000000, cogs: 293000000, opex: 130000000, royalty: 12780000, managementFee: 8520000, payoutStatus: "Hold" },
  { outletName: "d'roasting Tembalang", brand: "d'roasting", area: "Tengah", ownershipScheme: "Full Franchisee", investorName: investorNames[8], companyShare: 0.08, investorShare: 0, franchiseeShare: 0.82, operatorShare: 0.1, capitalContribution: 510000000, grossSales: 548000000, netSales: 512000000, cogs: 296000000, opex: 86500000, royalty: 15360000, managementFee: 10240000, payoutStatus: "Paid" },
  { outletName: "d'Sruput Simpang Lima", brand: "d'Sruput", area: "Tengah", ownershipScheme: "Full Franchisee", investorName: investorNames[9], companyShare: 0.08, investorShare: 0, franchiseeShare: 0.82, operatorShare: 0.1, capitalContribution: 260000000, grossSales: 392000000, netSales: 370000000, cogs: 184000000, opex: 80500000, royalty: 11100000, managementFee: 7400000, payoutStatus: "Pending" },
  { outletName: "d'besto Kenjeran", brand: "d'besto chicken n burger", area: "Timur", ownershipScheme: "Full Company", investorName: investorNames[0], companyShare: 0.9, investorShare: 0, franchiseeShare: 0, operatorShare: 0.1, capitalContribution: 860000000, grossSales: 716000000, netSales: 668000000, cogs: 413000000, opex: 113000000, royalty: 20040000, managementFee: 13360000, payoutStatus: "Paid" },
  { outletName: "d'bakso Manyar", brand: "d'bakso", area: "Timur", ownershipScheme: "Company + Investor + Operator", investorName: investorNames[6], companyShare: 0.45, investorShare: 0.35, franchiseeShare: 0, operatorShare: 0.2, capitalContribution: 560000000, grossSales: 415000000, netSales: 392000000, cogs: 236000000, opex: 72000000, royalty: 11760000, managementFee: 7840000, payoutStatus: "Pending" },
];

const profitSharingRows = rawProfitRows.map((row) => {
  const grossProfit = row.netSales - row.cogs;
  const netProfit = grossProfit - row.opex - row.royalty - row.managementFee;
  const distributableProfit = netProfit > 0 ? netProfit * 0.9 : 0;
  return {
    ...row,
    grossProfit,
    netProfit,
    distributableProfit,
    payoutCompany: distributableProfit * row.companyShare,
    payoutInvestor: distributableProfit * row.investorShare,
    payoutFranchisee: distributableProfit * row.franchiseeShare,
    payoutOperator: distributableProfit * row.operatorShare,
    retainedEarning: netProfit > 0 ? netProfit - distributableProfit : 0,
    isLoss: netProfit < 0,
    notEligible: netProfit <= 0 || row.payoutStatus === "Hold",
  };
});

const alerts = [
  { id: "ALT-001", category: "Stock Leakage", severity: "Critical", area: "Barat", entity: "Stockist Karawang Barat", issue: "Stock variance ayam frozen 5,6% setelah DO malam", estimatedLoss: 16480000, recommendedAction: "Freeze adjustment manual, lakukan stock opname dan audit CCTV loading dock", pic: "Head of Warehouse", sla: "6 jam", status: "Escalated" },
  { id: "ALT-002", category: "Cash Leakage", severity: "Critical", area: "Barat", entity: "d'chicken Grogol", issue: "Cash closing minus Rp4,4 juta dan void 1,7%", estimatedLoss: 4400000, recommendedAction: "Lock user kasir, audit shift, rekonsiliasi struk void", pic: "Internal Audit", sla: "4 jam", status: "Investigating" },
  { id: "ALT-003", category: "Production Leakage", severity: "High", area: "Timur", entity: "Rumah Produksi Timur", issue: "Yield aktual 89,4% vs standar 93,8%", estimatedLoss: 32600000, recommendedAction: "Audit input-output batch, cek trimming dan reject reason", pic: "Production Manager", sla: "12 jam", status: "Open" },
  { id: "ALT-004", category: "Logistics Leakage", severity: "High", area: "Barat", entity: "Route Karawang-Cikampek", issue: "DO ayam 9-cut kurang 48 kg di outlet", estimatedLoss: 1536000, recommendedAction: "Bandingkan surat jalan, timbangan, dan POD outlet", pic: "Logistics SPV", sla: "8 jam", status: "Investigating" },
  { id: "ALT-005", category: "Finance Leakage", severity: "High", area: "Barat", entity: "d'besto Cikarang Selatan", issue: "Settlement overdue dan rugi 2 bulan berturut-turut", estimatedLoss: 21800000, recommendedAction: "Hold profit sharing, review cash bank, aktifkan visit auditor", pic: "Finance Controller", sla: "1 hari", status: "Escalated" },
  { id: "ALT-006", category: "Cash Leakage", severity: "High", area: "Barat", entity: "Lazatto Karawang Barat", issue: "Diskon supervisor 4,2x lebih tinggi dari rata-rata area", estimatedLoss: 7600000, recommendedAction: "Review approval promo dan user supervisor", pic: "Area Manager", sla: "1 hari", status: "Open" },
  { id: "ALT-007", category: "Stock Leakage", severity: "Medium", area: "Barat", entity: "Stockist Bekasi Jatiasih", issue: "Pemakaian saus tidak sesuai sales menu sebesar 2,7%", estimatedLoss: 3250000, recommendedAction: "Cross-check recipe usage vs POS menu mix", pic: "Inventory Control", sla: "2 hari", status: "Open" },
  { id: "ALT-008", category: "Production Leakage", severity: "Medium", area: "Tengah", entity: "Rumah Produksi Tengah", issue: "QC fail meningkat menjadi 88 batch item", estimatedLoss: 8700000, recommendedAction: "Cek suhu chiller bahan masuk dan supplier lot", pic: "QC Lead", sla: "1 hari", status: "Investigating" },
  { id: "ALT-009", category: "Logistics Leakage", severity: "Medium", area: "Timur", entity: "Route Waru-Rungkut", issue: "POD belum diunggah >18 jam untuk 7 DO", estimatedLoss: 0, recommendedAction: "Suspend closing route sampai POD lengkap", pic: "Transport Admin", sla: "8 jam", status: "Open" },
  { id: "ALT-010", category: "Finance Leakage", severity: "Medium", area: "Tengah", entity: "Lazatto Ungaran", issue: "Outlet nonaktif masih memiliki AR royalty", estimatedLoss: 14300000, recommendedAction: "Set status hold dan kirim surat tagihan", pic: "AR Team", sla: "3 hari", status: "Open" },
  { id: "ALT-011", category: "Stock Leakage", severity: "High", area: "Barat", entity: "d'bakso Bekasi Timur", issue: "Stok minus daging bakso saat closing", estimatedLoss: 5800000, recommendedAction: "Audit penerimaan vs produksi bakso harian", pic: "Area Inventory", sla: "1 hari", status: "Investigating" },
  { id: "ALT-012", category: "Cash Leakage", severity: "Medium", area: "Timur", entity: "d'Sruput Surabaya Rungkut", issue: "Setoran terlambat 2 hari berturut-turut", estimatedLoss: 760000, recommendedAction: "Rekonsiliasi rekening penampung dan bukti setor", pic: "Finance Area", sla: "1 hari", status: "Open" },
  { id: "ALT-013", category: "Production Leakage", severity: "Low", area: "Barat", entity: "Rumah Produksi Barat", issue: "Reject produk naik 0,4% dari standar", estimatedLoss: 1250000, recommendedAction: "Monitor batch berikutnya", pic: "QC Barat", sla: "3 hari", status: "Open" },
  { id: "ALT-014", category: "Logistics Leakage", severity: "High", area: "Barat", entity: "Route Bekasi-Cikarang", issue: "Packaging rusak 24 karton saat diterima outlet", estimatedLoss: 3360000, recommendedAction: "Klaim driver/vendor dan periksa loading SOP", pic: "Logistics Manager", sla: "1 hari", status: "Escalated" },
  { id: "ALT-015", category: "Finance Leakage", severity: "High", area: "Barat", entity: "Lazatto Karawang Barat", issue: "Margin turun 5,6 poin vs bulan lalu", estimatedLoss: 25600000, recommendedAction: "Audit promo, COGS, dan spoilage", pic: "Business Analyst", sla: "2 hari", status: "Open" },
  { id: "ALT-016", category: "Stock Leakage", severity: "Medium", area: "Timur", entity: "Stockist Surabaya Waru", issue: "Retur outlet naik 37% minggu ini", estimatedLoss: 4200000, recommendedAction: "Review kualitas pengiriman dan handling frozen", pic: "Warehouse SPV", sla: "2 hari", status: "Open" },
  { id: "ALT-017", category: "Cash Leakage", severity: "Low", area: "Tengah", entity: "d'chicken Banyumanik", issue: "Refund kasir melewati baseline 0,7%", estimatedLoss: 860000, recommendedAction: "Reminder approval refund dan cek CCTV shift malam", pic: "Outlet SPV", sla: "3 hari", status: "Resolved" },
  { id: "ALT-018", category: "Production Leakage", severity: "Medium", area: "Timur", entity: "Rumah Produksi Timur", issue: "Waste produksi 5,2% melewati toleransi", estimatedLoss: 9200000, recommendedAction: "Cek trimming SOP dan kualitas bahan supplier", pic: "Plant Head", sla: "1 hari", status: "Investigating" },
  { id: "ALT-019", category: "Logistics Leakage", severity: "Low", area: "Barat", entity: "Route Jakarta Timur-Bekasi", issue: "3 DO terlambat karena waiting time outlet", estimatedLoss: 0, recommendedAction: "Perbaiki jadwal unloading outlet", pic: "Route Planner", sla: "3 hari", status: "Resolved" },
  { id: "ALT-020", category: "Finance Leakage", severity: "Critical", area: "Barat", entity: "d'bakso Bekasi Timur", issue: "Outlet rugi, cash variance, dan stock variance tinggi bersamaan", estimatedLoss: 31300000, recommendedAction: "Audit terpadu outlet, hold order non-critical, review operator", pic: "Owner Office", sla: "6 jam", status: "Escalated" },
];

const menuItems = [
  { id: "executive", label: "Executive Summary", short: "Exec" },
  { id: "sales", label: "Sales & Revenue", short: "Sales" },
  { id: "outlet", label: "Outlet Performance", short: "Outlet" },
  { id: "stockist", label: "Stockist & Warehouse", short: "Stock" },
  { id: "production", label: "Production & Cold Storage", short: "Prod" },
  { id: "logistics", label: "Logistics Delivery", short: "Log" },
  { id: "finance", label: "Finance & Settlement", short: "Fin" },
  { id: "profit", label: "Profit Sharing", short: "Profit" },
  { id: "warning", label: "Early Warning & Anti-Leakage", short: "Risk" },
];

function formatRp(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatShortRp(value) {
  const abs = Math.abs(value || 0);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1000000000) {
    return `${sign}Rp ${(abs / 1000000000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} M`;
  }
  if (abs >= 1000000) {
    return `${sign}Rp ${(abs / 1000000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`;
  }
  return `${sign}${formatRp(abs)}`;
}

function formatNumber(value) {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(value || 0);
}

function formatPct(value, digits = 1) {
  return `${Number(value || 0).toLocaleString("id-ID", { maximumFractionDigits: digits })}%`;
}

function formatRatio(value, digits = 1) {
  return `${((value || 0) * 100).toLocaleString("id-ID", { maximumFractionDigits: digits })}%`;
}

function sum(rows, key) {
  return rows.reduce((total, row) => total + (Number(row[key]) || 0), 0);
}

const dateRangeConfig = {
  "Hari Ini": {
    periodLabel: "Hari ini",
    vsLabel: "vs kemarin",
    transactionDays: 1,
    getGross: (rows) => sum(rows, "dailySales"),
    trend: [
      { date: "07:00", weight: 0.04 },
      { date: "09:00", weight: 0.08 },
      { date: "11:00", weight: 0.16 },
      { date: "13:00", weight: 0.24 },
      { date: "15:00", weight: 0.2 },
      { date: "17:00", weight: 0.18 },
      { date: "20:00", weight: 0.1 },
    ],
  },
  "7 Hari Terakhir": {
    periodLabel: "7 hari terakhir",
    vsLabel: "vs 7 hari sebelumnya",
    transactionDays: 7,
    getGross: (rows) => sum(rows, "dailySales") * 7.04,
    trend: salesTrend7d.map((day) => ({ date: day.date, weight: day.gross / sum(salesTrend7d, "gross") })),
  },
  "Bulan Ini": {
    periodLabel: "Bulan ini",
    vsLabel: "vs Apr",
    transactionDays: 26,
    getGross: (rows) => sum(rows, "monthlySales"),
    trend: [
      { date: "Minggu 1", weight: 0.2 },
      { date: "Minggu 2", weight: 0.23 },
      { date: "Minggu 3", weight: 0.25 },
      { date: "Minggu 4", weight: 0.21 },
      { date: "MTD", weight: 0.11 },
    ],
  },
  "Q2 2026": {
    periodLabel: "Q2 2026",
    vsLabel: "vs Q1 2026",
    transactionDays: 78,
    getGross: (rows) => sum(rows, "monthlySales") * 3.08,
    trend: [
      { date: "Apr '26", weight: 0.31 },
      { date: "Mei '26", weight: 0.34 },
      { date: "Jun Est.", weight: 0.35 },
    ],
  },
};

function shortBrandName(brand) {
  if (brand.includes("d'besto")) return "d'besto";
  if (brand.includes("Lazatto")) return "Lazatto";
  return brand;
}

function getDateRangeConfig(dateRange) {
  return dateRangeConfig[dateRange] || dateRangeConfig["Bulan Ini"];
}

function getPeriodGross(outlet, dateRange) {
  if (dateRange === "Hari Ini") return outlet.dailySales;
  if (dateRange === "7 Hari Terakhir") return outlet.dailySales * 7.04;
  if (dateRange === "Q2 2026") return outlet.monthlySales * 3.08;
  return outlet.monthlySales;
}

function getScopeLabel(filters) {
  const parts = [filters.dateRange];
  if (filters.area !== "Semua Wilayah") parts.push(`Wilayah ${filters.area}`);
  if (filters.brand !== "Semua Brand") parts.push(shortBrandName(filters.brand));
  if (filters.search.trim()) parts.push(`"${filters.search.trim()}"`);
  return parts.join(" · ");
}

function filterRowsByDashboardScope(rows, filters) {
  const q = filters.search.toLowerCase().trim();
  return rows.filter((row) => {
    const matchArea = filters.area === "Semua Wilayah" || row.area === filters.area;
    const matchBrand = !row.brand || filters.brand === "Semua Brand" || row.brand === filters.brand;
    const searchable = `${row.name || ""} ${row.outletName || ""} ${row.entity || ""} ${row.issue || ""} ${row.category || ""} ${row.area || ""} ${row.brand || ""} ${row.id || ""}`.toLowerCase();
    const matchSearch = !q || searchable.includes(q);
    return matchArea && matchBrand && matchSearch;
  });
}

function buildBrandSummary(rows, dateRange) {
  const grouped = brands.map((brand) => {
    const brandRows = rows.filter((outlet) => outlet.brand === brand);
    const sales = brandRows.reduce((total, outlet) => total + getPeriodGross(outlet, dateRange), 0);
    return {
      brand: shortBrandName(brand),
      sales,
      outlets: brandRows.length,
      margin: brandRows.length ? sum(brandRows, "grossMargin") / brandRows.length * 100 : 0,
    };
  }).filter((row) => row.sales > 0 || row.outlets > 0);

  return grouped.length ? grouped : [{ brand: "Tidak ada data", sales: 0, outlets: 0, margin: 0 }];
}

function buildAreaSummary(rows, dateRange) {
  const grouped = areas.map((area) => {
    const areaRows = rows.filter((outlet) => outlet.area === area);
    const baseSla = areaSales.find((item) => item.area === area)?.sla || deliveryStats.onTimeDelivery;
    const riskPenalty = areaRows.filter((outlet) => ["High Risk", "Audit Required"].includes(outlet.status)).length * 0.45;
    return {
      area,
      sales: areaRows.reduce((total, outlet) => total + getPeriodGross(outlet, dateRange), 0),
      outlets: areaRows.length,
      sla: Math.max(84, baseSla - riskPenalty),
    };
  }).filter((row) => row.sales > 0 || row.outlets > 0);

  return grouped.length ? grouped : [{ area: "Tidak ada data", sales: 0, outlets: 0, sla: 0 }];
}

function buildTrendSummary(rows, dateRange, grossSales, netSales) {
  const config = getDateRangeConfig(dateRange);
  const totalWeight = config.trend.reduce((total, point) => total + point.weight, 0) || 1;
  const transactionBase = sum(rows, "transactions") * config.transactionDays;

  return config.trend.map((point, index) => {
    const normalizedWeight = point.weight / totalWeight;
    const swing = 0.95 + ((index % 3) * 0.035);
    return {
      date: point.date,
      gross: Math.round(grossSales * normalizedWeight * swing),
      net: Math.round(netSales * normalizedWeight * swing),
      trx: Math.round(transactionBase * normalizedWeight * swing),
    };
  });
}

function buildExecutiveSummary(rows, filters) {
  const config = getDateRangeConfig(filters.dateRange);
  const activeRows = rows.filter((outlet) => outlet.active);
  const areaData = buildAreaSummary(rows, filters.dateRange);
  const ownershipData = ownershipSchemes
    .map((scheme) => ({ name: scheme, value: rows.filter((outlet) => outlet.ownership === scheme).length }))
    .filter((row) => row.value > 0);
  const nationalShare = rows.length / Math.max(outlets.length, 1);
  const activeNationalShare = activeRows.length / Math.max(outlets.filter((outlet) => outlet.active).length, 1);
  const nationalOutlets = Math.round(1300 * nationalShare);
  const activeOutlets = Math.round(1284 * activeNationalShare);
  const periodGross = config.getGross(rows);
  const netSales = periodGross * 0.922;
  const avgMargin = rows.length ? sum(rows, "grossMargin") / rows.length : 0;
  const grossProfit = periodGross * avgMargin;
  const periodScale = periodGross / Math.max(sum(outlets, "monthlySales"), 1);
  const netProfit = rows.reduce((total, outlet) => total + outlet.netProfit * (getPeriodGross(outlet, filters.dateRange) / Math.max(outlet.monthlySales || outlet.dailySales || 1, 1)), 0);
  const filteredProfitRows = filterRowsByDashboardScope(profitSharingRows, filters);
  const filteredAlerts = filterRowsByDashboardScope(alerts, { ...filters, brand: "Semua Brand" });
  const openHighAlerts = filteredAlerts.filter((alert) => ["Critical", "High"].includes(alert.severity) && alert.status !== "Resolved");
  const escalatedAlerts = filteredAlerts.filter((alert) => alert.status === "Escalated").length;
  const deliverySla = areaData.reduce((total, area) => total + area.sla, 0) / Math.max(areaData.length, 1);
  const growthBase = 3.4 + rows.length * 0.18 + (filters.dateRange === "Q2 2026" ? 2.6 : filters.dateRange === "Hari Ini" ? -1.1 : 0);

  const topOutlets = [...rows]
    .map((outlet) => ({ ...outlet, periodSales: getPeriodGross(outlet, filters.dateRange) }))
    .sort((a, b) => b.periodSales - a.periodSales)
    .slice(0, 10);

  const bottomOutlets = [...rows].sort((a, b) => b.riskScore - a.riskScore).slice(0, 10);

  return {
    scopeLabel: getScopeLabel(filters),
    periodLabel: config.periodLabel,
    vsLabel: config.vsLabel,
    activeOutlets,
    inactiveOutlets: Math.max(nationalOutlets - activeOutlets, 0),
    sampleActive: activeRows.length,
    sampleTotal: rows.length,
    todayRevenue: sum(activeRows, "dailySales"),
    monthRevenue: periodGross,
    grossProfit,
    netProfit,
    cogsRatio: 100 - (avgMargin * 100),
    wasteRatio: sum(activeRows, "waste") / Math.max(activeRows.length, 1),
    stockVarianceRatio: sum(activeRows, "stockVariance") / Math.max(activeRows.length, 1),
    settlementPending: rows.filter((outlet) => outlet.settlement !== "Settled").reduce((total, outlet) => total + Math.abs(outlet.cashVariance) + 32000000, 0),
    franchiseReceivable: Math.round(financeSummary.franchiseReceivable * Math.max(periodScale, 0)),
    deliverySLA: deliverySla || 0,
    profitSharingPayable: filteredProfitRows.filter((row) => row.payoutStatus === "Pending").reduce((total, row) => total + row.distributableProfit * Math.max(periodScale, 0.08), 0),
    highRiskAlerts: openHighAlerts.length,
    escalatedAlerts,
    growthLabel: `${growthBase >= 0 ? "+" : ""}${growthBase.toLocaleString("id-ID", { maximumFractionDigits: 1 })}%`,
    topOutlets,
    bottomOutlets,
    trendData: buildTrendSummary(rows, filters.dateRange, periodGross, netSales),
    brandData: buildBrandSummary(rows, filters.dateRange),
    areaData,
    ownershipData: ownershipData.length ? ownershipData : [{ name: "Tidak ada data", value: 1 }],
    priorityAlerts: filteredAlerts
      .sort((a, b) => ({ Critical: 4, High: 3, Medium: 2, Low: 1 }[b.severity] - { Critical: 4, High: 3, Medium: 2, Low: 1 }[a.severity]))
      .slice(0, 6),
  };
}

function getStatusStyle(status) {
  const styles = {
    Healthy: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Attention: "bg-amber-50 text-amber-700 ring-amber-200",
    "High Risk": "bg-red-50 text-red-700 ring-red-200",
    "Audit Required": "bg-violet-50 text-violet-700 ring-violet-200",
    Critical: "bg-slate-900 text-white ring-slate-900",
    High: "bg-red-50 text-red-700 ring-red-200",
    Medium: "bg-amber-50 text-amber-700 ring-amber-200",
    Low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Pending: "bg-amber-50 text-amber-700 ring-amber-200",
    Hold: "bg-red-50 text-red-700 ring-red-200",
    Settled: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Overdue: "bg-red-50 text-red-700 ring-red-200",
    Open: "bg-blue-50 text-blue-700 ring-blue-200",
    Investigating: "bg-amber-50 text-amber-700 ring-amber-200",
    Resolved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Escalated: "bg-violet-50 text-violet-700 ring-violet-200",
    Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    "In Progress": "bg-blue-50 text-blue-700 ring-blue-200",
    Closed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Late: "bg-red-50 text-red-700 ring-red-200",
    Nonaktif: "bg-slate-100 text-slate-600 ring-slate-200",
  };
  return styles[status] || "bg-slate-50 text-slate-700 ring-slate-200";
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getStatusStyle(status)}`}>
      {status}
    </span>
  );
}

function KpiCard({ title, value, subtitle, delta, tone = "default", action }) {
  const toneClass = {
    default: "border-slate-200 bg-white",
    good: "border-emerald-200 bg-emerald-50/50",
    warn: "border-amber-200 bg-amber-50/50",
    danger: "border-red-200 bg-red-50/50",
    dark: "border-slate-800 bg-slate-900 text-white",
  }[tone];

  const deltaClass = delta?.startsWith("-") ? "text-red-600" : "text-emerald-600";

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${toneClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wide ${tone === "dark" ? "text-slate-300" : "text-slate-500"}`}>{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 text-sm">
        {subtitle ? <span className={tone === "dark" ? "text-slate-300" : "text-slate-500"}>{subtitle}</span> : <span />}
        {delta ? <span className={`font-semibold ${tone === "dark" ? "text-emerald-300" : deltaClass}`}>{delta}</span> : null}
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children, action, className = "" }) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

function DataTable({ columns, rows, emptyText = "Tidak ada data", onRowClick }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={`whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500 ${column.className || ""}`}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr
                  key={row.id || row.outletName || row.name || row.route || index}
                  onClick={() => onRowClick?.(row)}
                  className={`${onRowClick ? "cursor-pointer hover:bg-blue-50/50" : "hover:bg-slate-50/80"}`}
                >
                  {columns.map((column) => (
                    <td key={column.key} className={`whitespace-nowrap px-4 py-3 text-slate-700 ${column.cellClassName || ""}`}>
                      {column.render ? column.render(row, index) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ToastHost() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const timers = [];
    const handleToast = (event) => {
      const id = `${Date.now()}-${Math.random()}`;
      const toast = {
        id,
        tone: event.detail?.tone || "info",
        title: event.detail?.title || "Aksi diproses",
        message: event.detail?.message || "Fitur ini masih mode prototype.",
      };
      setToasts((current) => [toast, ...current].slice(0, 4));
      timers.push(window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== id));
      }, 3600));
    };

    window.addEventListener("dbesto:toast", handleToast);
    return () => {
      window.removeEventListener("dbesto:toast", handleToast);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="dbesto-toast-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={`dbesto-toast dbesto-toast-${toast.tone}`} role="status">
          <div>
            <p className="dbesto-toast-title">{toast.title}</p>
            <p className="dbesto-toast-message">{toast.message}</p>
          </div>
          <button
            type="button"
            className="dbesto-toast-close"
            aria-label="Tutup notifikasi"
            onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
          >
            x
          </button>
        </div>
      ))}
    </div>
  );
}

function Button({ children, variant = "primary", className = "", onClick, demoMessage, type = "button", ...props }) {
  const variants = {
    primary: "dbesto-btn-primary",
    secondary: "dbesto-btn-secondary",
    danger: "dbesto-btn-danger",
    soft: "dbesto-btn-soft",
  };
  const label = getNodeText(children);
  const handleClick = (event) => {
    if (onClick) {
      onClick(event);
      return;
    }

    showDemoToast({
      title: `${label} diproses`,
      message: demoMessage,
      tone: variant === "danger" ? "warning" : "info",
    });
  };

  return (
    <button type={type} onClick={handleClick} className={`dbesto-btn rounded-xl px-3 py-2 text-sm font-semibold transition ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="dbesto-sidebar sticky top-0 hidden h-screen w-72 shrink-0 border-r text-white lg:block">
      <div className="flex h-full flex-col">
        <div className="dbesto-sidebar-brand border-b border-white/10 p-6">
          <div>
            <img src={dbestoLogo} alt="d'Besto Jagonyo Rasa" className="dbesto-logo" />
            <div>
              <p className="mt-3 text-sm font-bold text-white">Owner Command Center</p>
              <p className="text-xs text-slate-400">Dashboard Group & Operasional</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const active = activePage === item.id;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  active ? "dbesto-nav-active shadow-sm" : "dbesto-nav-idle"
                }`}
              >
                <span>{item.label}</span>
                {item.id === "warning" ? <span className="dbesto-count-badge rounded-full px-2 py-0.5 text-xs text-white">20</span> : null}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="dbesto-focus-card rounded-2xl p-4">
            <p className="text-sm font-bold">Focus Hari Ini</p>
            <p className="mt-1 text-xs leading-5 text-slate-300">Audit outlet rugi, stock variance Barat, settlement overdue Barat.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function MobileNav({ activePage, setActivePage }) {
  return (
    <div className="dbesto-mobile-nav border-b px-4 py-3 lg:hidden">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <img src={dbestoLogo} alt="d'Besto Jagonyo Rasa" className="dbesto-mobile-logo" />
          <div className="min-w-0">
            <p className="text-sm font-black text-slate-950">Owner Command Center</p>
            <p className="text-xs text-slate-500">Dashboard Group</p>
          </div>
        </div>
        <StatusBadge status="Live Mock" />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {menuItems.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`shrink-0 rounded-xl px-3 py-2 text-xs font-bold ${activePage === item.id ? "dbesto-mobile-tab-active" : "dbesto-mobile-tab-idle"}`}
          >
            {item.short}
          </button>
        ))}
      </div>
    </div>
  );
}

function Header({ title, filters, setFilters, highRiskCount, onOpenAlerts }) {
  return (
    <header className="dbesto-header sticky top-0 z-20 border-b px-4 py-4 backdrop-blur xl:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-950">{title}</h1>
            <span className="dbesto-live-chip rounded-full px-2.5 py-1 text-xs font-bold ring-1">Mock Live</span>
          </div>
          <p className="mt-1 text-sm text-slate-500">Periode presentasi: 1-12 Mei 2026 · 1.300 outlet nasional</p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <select
            value={filters.dateRange}
            onChange={(event) => {
              const value = event.target.value;
              setFilters((prev) => ({ ...prev, dateRange: value }));
              showFilterToast("Periode", value);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-blue-400"
          >
            <option>Hari Ini</option>
            <option>7 Hari Terakhir</option>
            <option>Bulan Ini</option>
            <option>Q2 2026</option>
          </select>
          <select
            value={filters.area}
            onChange={(event) => {
              const value = event.target.value;
              setFilters((prev) => ({ ...prev, area: value }));
              showFilterToast("Wilayah", value);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-blue-400"
          >
            <option>Semua Wilayah</option>
            {areas.map((area) => <option key={area}>{area}</option>)}
          </select>
          <select
            value={filters.brand}
            onChange={(event) => {
              const value = event.target.value;
              setFilters((prev) => ({ ...prev, brand: value }));
              showFilterToast("Brand", value);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-blue-400"
          >
            <option>Semua Brand</option>
            {brands.map((brand) => <option key={brand}>{brand}</option>)}
          </select>
          <input
            value={filters.search}
            onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
            placeholder="Cari outlet / wilayah..."
            className="min-w-[220px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-blue-400"
          />
          <button type="button" onClick={onOpenAlerts} className="dbesto-alert-button relative rounded-xl px-3 py-2 text-sm font-bold text-white">
            Alerts
            <span className="dbesto-count-badge absolute -right-2 -top-2 rounded-full px-1.5 py-0.5 text-[10px] font-black text-white">{highRiskCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function AlertCard({ alert }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={alert.severity} />
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{alert.category}</span>
          </div>
          <h4 className="mt-3 font-bold text-slate-950">{alert.issue}</h4>
          <p className="mt-1 text-sm text-slate-500">{alert.area} · {alert.entity}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase text-slate-400">Est. Loss</p>
          <p className="mt-1 font-black text-red-600">{formatShortRp(alert.estimatedLoss)}</p>
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
        <span className="font-bold text-slate-800">Action:</span> {alert.recommendedAction}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <span>PIC: <b className="text-slate-700">{alert.pic}</b></span>
        <span>SLA: <b className="text-slate-700">{alert.sla}</b></span>
        <StatusBadge status={alert.status} />
      </div>
    </div>
  );
}

function MetricStrip({ items }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <KpiCard key={item.title} {...item} />
      ))}
    </div>
  );
}

function PageSection({ title, subtitle, action, children }) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-950">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

function ExecutiveSummary({ filteredOutlets, summary, setActivePage }) {
  const trendData = summary.trendData || [];
  const brandData = summary.brandData || [];
  const areaData = summary.areaData || [];
  const ownershipData = summary.ownershipData || [{ name: "Tidak ada data", value: 1 }];
  const priorityAlerts = summary.priorityAlerts || [];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Scope data aktif</p>
        <p className="mt-1 text-sm font-semibold text-slate-900">{summary.scopeLabel}</p>
        <p className="mt-1 text-xs text-slate-500">
          Sample berubah: {summary.sampleTotal} outlet dummy, {summary.sampleActive} aktif. Angka nasional diekstrapolasi dari scope filter ini.
        </p>
      </div>

      <MetricStrip
        items={[
          { title: "Total Outlet Aktif", value: formatNumber(summary.activeOutlets), subtitle: `${summary.sampleActive}/${summary.sampleTotal} outlet sample aktif`, delta: "Scope nasional", tone: "good" },
          { title: "Outlet Nonaktif", value: formatNumber(summary.inactiveOutlets), subtitle: "Estimasi dari filter", delta: summary.inactiveOutlets > 0 ? "Perlu review" : "Tidak ada", tone: summary.inactiveOutlets > 0 ? "warn" : "good" },
          { title: "Omzet Hari Ini", value: formatShortRp(summary.todayRevenue), subtitle: "POS gross sales aktif", delta: summary.vsLabel },
          { title: `Omzet ${summary.periodLabel}`, value: formatShortRp(summary.monthRevenue), subtitle: "Gross sales sesuai filter", delta: summary.growthLabel },
          { title: "Growth Scope", value: summary.growthLabel, subtitle: summary.vsLabel, delta: `${summary.sampleTotal} outlet sample` },
          { title: "Gross Profit", value: formatShortRp(summary.grossProfit), subtitle: "Estimasi GP scope", delta: summary.growthLabel },
          { title: "Net Profit", value: formatShortRp(summary.netProfit), subtitle: "Profit outlet terfilter", delta: summary.netProfit < 0 ? "Rugi" : "Profit", tone: summary.netProfit < 0 ? "danger" : "good" },
          { title: "COGS Ratio", value: formatPct(summary.cogsRatio), subtitle: "Dari margin outlet", delta: summary.cogsRatio <= 62 ? "Di target" : "Di atas target", tone: summary.cogsRatio <= 62 ? "good" : "warn" },
          { title: "Waste Ratio", value: formatPct(summary.wasteRatio), subtitle: "Avg outlet aktif", delta: summary.wasteRatio > 3 ? "Perlu kontrol" : "Normal", tone: summary.wasteRatio > 3 ? "warn" : "good" },
          { title: "Stock Variance Ratio", value: formatPct(summary.stockVarianceRatio), subtitle: "Avg outlet aktif", delta: summary.stockVarianceRatio > 3 ? "Audit" : "Normal", tone: summary.stockVarianceRatio > 3 ? "danger" : "good" },
          { title: "Cash Settlement Pending", value: formatShortRp(summary.settlementPending), subtitle: "Pending + overdue scope", delta: summary.settlementPending > 0 ? "Rekonsiliasi" : "Clear", tone: summary.settlementPending > 0 ? "warn" : "good" },
          { title: "Piutang Franchisee", value: formatShortRp(summary.franchiseReceivable), subtitle: "AR sesuai scope", delta: summary.periodLabel, tone: "warn" },
          { title: "Delivery SLA", value: formatPct(summary.deliverySLA), subtitle: "Weighted wilayah", delta: summary.deliverySLA >= 93 ? "Stabil" : "Perlu follow-up", tone: summary.deliverySLA >= 93 ? "good" : "warn" },
          { title: "Profit Sharing Payable", value: formatShortRp(summary.profitSharingPayable), subtitle: "Pending payout scope", delta: summary.periodLabel },
          { title: "High Risk Alert", value: summary.highRiskAlerts, subtitle: "Critical + High open", delta: `${summary.escalatedAlerts} escalated`, tone: "dark" },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title={`Trend Omzet ${summary.periodLabel}`} subtitle={`Gross vs net sales untuk ${summary.scopeLabel}`}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={formatShortRp} tickLine={false} axisLine={false} width={80} />
              <Tooltip formatter={(value) => formatRp(value)} />
              <Legend />
              <Line type="monotone" dataKey="gross" name="Gross Sales" stroke={CHART.primary} strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="net" name="Net Sales" stroke={CHART.accentDark} strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Omzet per Brand" subtitle="Kontribusi gross sales bulan ini">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={brandData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="brand" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={formatShortRp} tickLine={false} axisLine={false} width={80} />
              <Tooltip formatter={(value) => formatRp(value)} />
              <Bar dataKey="sales" name="Sales" radius={[10, 10, 0, 0]} fill={CHART.primary} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Omzet per Wilayah" subtitle="Wilayah operasional nasional DBESTO Group">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={areaData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="area" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={formatShortRp} tickLine={false} axisLine={false} width={80} />
              <Tooltip formatter={(value) => (typeof value === "number" ? formatRp(value) : value)} />
              <Bar dataKey="sales" name="Sales" radius={[10, 10, 0, 0]} fill={CHART.accentDark} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Skema Kepemilikan Outlet" subtitle="Distribusi ownership pada outlet sample">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={ownershipData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={104} paddingAngle={2}>
                {ownershipData.map((entry, index) => (
                  <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} outlet`, name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <PageSection title="Top 10 Outlet Terbaik" subtitle={`Ranking berdasarkan omzet ${summary.periodLabel}`} action={<Button variant="secondary">Drill-down wilayah</Button>}>
          <DataTable
            rows={summary.topOutlets}
            columns={[
              { key: "rank", label: "#", render: (_, index) => index + 1 },
              { key: "name", label: "Outlet", render: (row) => <div><p className="font-bold text-slate-900">{row.name}</p><p className="text-xs text-slate-500">{row.area} · {row.brand}</p></div> },
              { key: "periodSales", label: "Omzet", render: (row) => formatShortRp(row.periodSales) },
              { key: "grossMargin", label: "GM", render: (row) => formatRatio(row.grossMargin) },
              { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
            ]}
          />
        </PageSection>

        <PageSection title="Bottom 10 Outlet Bermasalah" subtitle="Prioritas visit/audit berdasarkan risk score" action={<Button variant="danger">Buat Audit Plan</Button>}>
          <DataTable
            rows={summary.bottomOutlets}
            columns={[
              { key: "rank", label: "#", render: (_, index) => index + 1 },
              { key: "name", label: "Outlet", render: (row) => <div><p className="font-bold text-slate-900">{row.name}</p><p className="text-xs text-slate-500">{row.area} · {row.brand}</p></div> },
              { key: "riskScore", label: "Risk", render: (row) => <span className="font-black text-red-600">{row.riskScore}</span> },
              { key: "stockVariance", label: "Stock Var", render: (row) => formatPct(row.stockVariance) },
              { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
            ]}
          />
        </PageSection>
      </div>

      <PageSection
        title="Alert Prioritas Owner"
        subtitle="Critical/high issue yang membutuhkan keputusan cepat"
        action={
          <Button
            variant="soft"
            onClick={() => {
              setActivePage("warning");
              showDemoToast({
                title: "Early Warning dibuka",
                message: "Semua alert prioritas owner ditampilkan di halaman Early Warning.",
                tone: "warning",
              });
            }}
          >
            Lihat semua alert
          </Button>
        }
      >
        <div className="grid gap-4 xl:grid-cols-3">
          {priorityAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)}
        </div>
      </PageSection>
    </div>
  );
}

function SalesRevenue({ filteredOutlets }) {
  const [paymentFilter, setPaymentFilter] = useState("Semua Payment");
  const salesByOutlet = [...filteredOutlets].sort((a, b) => b.monthlySales - a.monthlySales).slice(0, 10);
  const grossSales = sum(filteredOutlets, "monthlySales");
  const netSales = grossSales * 0.922;
  const transactions = sum(filteredOutlets, "transactions") * 26;
  const discountUsage = grossSales * 0.031;
  const refund = grossSales * 0.006;
  const voidAmount = grossSales * 0.004;

  const visiblePayments = paymentFilter === "Semua Payment" ? paymentMethods : paymentMethods.filter((payment) => payment.name === paymentFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-black text-slate-950">Filter Sales</h2>
          <p className="text-sm text-slate-500">Tanggal, brand, wilayah, outlet, payment method, dan ownership scheme.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={paymentFilter}
            onChange={(event) => {
              const value = event.target.value;
              setPaymentFilter(value);
              showFilterToast("Payment method", value);
            }}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold"
          >
            <option>Semua Payment</option>
            {paymentMethods.map((payment) => <option key={payment.name}>{payment.name}</option>)}
          </select>
          <Button variant="secondary">Apply Filter</Button>
          <Button>Export Sales</Button>
        </div>
      </div>

      <MetricStrip
        items={[
          { title: "Gross Sales", value: formatShortRp(grossSales), subtitle: "Sebelum diskon/refund", delta: "+8,6%" },
          { title: "Net Sales", value: formatShortRp(netSales), subtitle: "Setelah discount/refund", delta: "+7,9%", tone: "good" },
          { title: "Total Transaction", value: formatNumber(transactions), subtitle: "Estimasi transaksi MTD", delta: "+6,1%" },
          { title: "Average Transaction Value", value: formatShortRp(netSales / Math.max(transactions, 1)), subtitle: "ATV outlet sample", delta: "+1,5%" },
          { title: "Discount Usage", value: formatShortRp(discountUsage), subtitle: "3,1% gross sales", delta: "+0,3 poin", tone: "warn" },
          { title: "Refund", value: formatShortRp(refund), subtitle: "0,6% gross sales", delta: "+0,1 poin", tone: "warn" },
          { title: "Void Transaction", value: formatShortRp(voidAmount), subtitle: "0,4% gross sales", delta: "+0,1 poin" },
          { title: "Sales per Outlet Avg", value: formatShortRp(grossSales / Math.max(filteredOutlets.length, 1)), subtitle: "Monthly avg sample", delta: "+4,8%" },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Trend Omzet Harian" subtitle="Gross sales, net sales, dan transaksi harian">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesTrend7d}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" tickFormatter={formatShortRp} tickLine={false} axisLine={false} width={80} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={formatNumber} tickLine={false} axisLine={false} width={70} />
              <Tooltip formatter={(value, name) => (name === "trx" ? formatNumber(value) : formatRp(value))} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="gross" name="Gross" stroke={CHART.primary} strokeWidth={3} dot={false} />
              <Line yAxisId="left" type="monotone" dataKey="net" name="Net" stroke={CHART.accentDark} strokeWidth={3} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="trx" name="trx" stroke={CHART.ink} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Sales by Payment Method" subtitle="Komposisi metode pembayaran">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={visiblePayments} dataKey="value" nameKey="name" innerRadius={60} outerRadius={105} paddingAngle={2}>
                {visiblePayments.map((entry, index) => <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value, name) => [formatRp(value), name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Sales by Brand" subtitle="Brand contribution dan margin">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={brandSales}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="brand" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={formatShortRp} tickLine={false} axisLine={false} width={80} />
              <Tooltip formatter={(value) => formatRp(value)} />
              <Bar dataKey="sales" name="Sales" fill={CHART.primary} radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Sales by Wilayah" subtitle="Revenue wilayah dan SLA distribusi">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={areaSales}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="area" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={formatShortRp} tickLine={false} axisLine={false} width={80} />
              <Tooltip formatter={(value) => (typeof value === "number" ? formatRp(value) : value)} />
              <Bar dataKey="sales" name="Sales" fill={CHART.accentDark} radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <PageSection title="Top Menu" subtitle="Sales per menu dan quantity">
          <DataTable
            rows={menuSales}
            columns={[
              { key: "menu", label: "Menu", render: (row) => <span className="font-bold text-slate-900">{row.menu}</span> },
              { key: "qty", label: "Qty", render: (row) => formatNumber(row.qty) },
              { key: "sales", label: "Sales", render: (row) => formatShortRp(row.sales) },
            ]}
          />
        </PageSection>
        <PageSection title="Top Outlet" subtitle="Sales per outlet dari filter aktif" action={<Button variant="secondary">View Detail</Button>}>
          <DataTable
            rows={salesByOutlet}
            columns={[
              { key: "name", label: "Outlet", render: (row) => <div><p className="font-bold text-slate-900">{row.name}</p><p className="text-xs text-slate-500">{row.area} · {row.ownership}</p></div> },
              { key: "monthlySales", label: "Sales", render: (row) => formatShortRp(row.monthlySales) },
              { key: "transactions", label: "Trx/Day", render: (row) => formatNumber(row.transactions) },
              { key: "avgBasket", label: "ATV", render: (row) => formatShortRp(row.avgBasket) },
            ]}
          />
        </PageSection>
      </div>
    </div>
  );
}

function OutletPerformance({ filteredOutlets }) {
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const riskCounts = {
    healthy: filteredOutlets.filter((outlet) => outlet.status === "Healthy").length,
    attention: filteredOutlets.filter((outlet) => outlet.status === "Attention").length,
    highRisk: filteredOutlets.filter((outlet) => outlet.status === "High Risk").length,
    audit: filteredOutlets.filter((outlet) => outlet.status === "Audit Required").length,
  };
  const avgRisk = filteredOutlets.reduce((total, outlet) => total + outlet.riskScore, 0) / Math.max(filteredOutlets.length, 1);

  return (
    <div className="space-y-6">
      <MetricStrip
        items={[
          { title: "Healthy Outlet", value: riskCounts.healthy, subtitle: "Operasi normal", delta: "+2", tone: "good" },
          { title: "Attention", value: riskCounts.attention, subtitle: "Perlu coaching", delta: "+1", tone: "warn" },
          { title: "High Risk", value: riskCounts.highRisk, subtitle: "Prioritas visit", delta: "+3", tone: "danger" },
          { title: "Audit Required", value: riskCounts.audit, subtitle: "Audit terpadu", delta: "+2", tone: "dark" },
          { title: "Avg Risk Score", value: avgRisk.toFixed(0), subtitle: "Skala 0-100", delta: "+4 poin", tone: avgRisk > 55 ? "warn" : "good" },
          { title: "Cash Variance", value: formatShortRp(sum(filteredOutlets, "cashVariance")), subtitle: "Akumulasi sample", delta: "Perlu cek" },
          { title: "Avg Stock Variance", value: formatPct(sum(filteredOutlets, "stockVariance") / Math.max(filteredOutlets.length, 1)), subtitle: "Target ≤ 1,5%", delta: "+0,7 poin", tone: "warn" },
          { title: "Avg Waste", value: formatPct(sum(filteredOutlets, "waste") / Math.max(filteredOutlets.length, 1)), subtitle: "Target ≤ 3%", delta: "+0,4 poin", tone: "warn" },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <ChartCard title="Risk Status Outlet" subtitle="Healthy, attention, high risk, audit" className="xl:col-span-1">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={[
                  { name: "Healthy", value: riskCounts.healthy },
                  { name: "Attention", value: riskCounts.attention },
                  { name: "High Risk", value: riskCounts.highRisk },
                  { name: "Audit Required", value: riskCounts.audit },
                ]}
                dataKey="value"
                nameKey="name"
                outerRadius={95}
                innerRadius={55}
              >
                {STATUS_COLORS.map((color) => <Cell key={color} fill={color} />)}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} outlet`, name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Target vs Actual Outlet" subtitle="Monthly sales dibanding target" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={filteredOutlets.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="id" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={formatShortRp} tickLine={false} axisLine={false} width={80} />
              <Tooltip formatter={(value) => formatRp(value)} />
              <Legend />
              <Bar dataKey="target" name="Target" fill={CHART.neutral} radius={[8, 8, 0, 0]} />
              <Bar dataKey="monthlySales" name="Actual" fill={CHART.primary} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <PageSection title="Outlet Risk Table" subtitle="Klik View Detail untuk drill-down outlet" action={<Button>Buat Route Visit</Button>}>
        <OutletRiskTable rows={filteredOutlets} onView={setSelectedOutlet} />
      </PageSection>

      {selectedOutlet ? <OutletDetailModal outlet={selectedOutlet} onClose={() => setSelectedOutlet(null)} /> : null}
    </div>
  );
}

function OutletRiskTable({ rows, onView }) {
  return (
    <DataTable
      rows={[...rows].sort((a, b) => b.riskScore - a.riskScore)}
      columns={[
        { key: "name", label: "Outlet", render: (row) => <div><p className="font-bold text-slate-900">{row.name}</p><p className="text-xs text-slate-500">{row.id} · {row.area} · {row.brand}</p></div> },
        { key: "ownership", label: "Ownership" },
        { key: "dailySales", label: "Omzet Harian", render: (row) => formatShortRp(row.dailySales) },
        { key: "monthlySales", label: "Omzet Bulanan", render: (row) => formatShortRp(row.monthlySales) },
        { key: "target", label: "Target vs Actual", render: (row) => <span>{formatPct((row.monthlySales / Math.max(row.target, 1)) * 100)}</span> },
        { key: "grossMargin", label: "GM", render: (row) => formatRatio(row.grossMargin) },
        { key: "netProfit", label: "Net Profit", render: (row) => <span className={row.netProfit < 0 ? "font-bold text-red-600" : "font-bold text-emerald-600"}>{formatShortRp(row.netProfit)}</span> },
        { key: "cashVariance", label: "Cash Var", render: (row) => formatShortRp(row.cashVariance) },
        { key: "stockVariance", label: "Stock Var", render: (row) => formatPct(row.stockVariance) },
        { key: "waste", label: "Waste", render: (row) => formatPct(row.waste) },
        { key: "refund", label: "Refund", render: (row) => formatPct(row.refund) },
        { key: "void", label: "Void", render: (row) => formatPct(row.void) },
        { key: "transactions", label: "Trx", render: (row) => formatNumber(row.transactions) },
        { key: "avgBasket", label: "Avg Basket", render: (row) => formatShortRp(row.avgBasket) },
        { key: "closing", label: "Closing", render: (row) => <StatusBadge status={row.closing} /> },
        { key: "settlement", label: "Settlement", render: (row) => <StatusBadge status={row.settlement} /> },
        { key: "riskScore", label: "Risk", render: (row) => <span className="font-black text-slate-900">{row.riskScore}</span> },
        { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
        { key: "action", label: "Action", render: (row) => <Button variant="secondary" onClick={(event) => { event.stopPropagation(); onView(row); }}>View Detail</Button> },
      ]}
    />
  );
}

function OutletDetailModal({ outlet, onClose }) {
  const miniTrend = salesTrend7d.map((day, index) => ({ ...day, sales: Math.round(outlet.dailySales * (0.82 + index * 0.045)) }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-200 bg-white p-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-black text-slate-950">{outlet.name}</h3>
              <StatusBadge status={outlet.status} />
            </div>
            <p className="mt-1 text-sm text-slate-500">{outlet.id} · {outlet.area} · {outlet.brand} · {outlet.ownership}</p>
          </div>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
        <div className="space-y-5 p-5">
          <MetricStrip
            items={[
              { title: "Omzet Hari Ini", value: formatShortRp(outlet.dailySales), subtitle: "POS gross", delta: outlet.dailySales > 0 ? "+2,3%" : "Nonaktif" },
              { title: "Omzet Bulanan", value: formatShortRp(outlet.monthlySales), subtitle: `Target ${formatShortRp(outlet.target)}`, delta: formatPct((outlet.monthlySales / Math.max(outlet.target, 1)) * 100) },
              { title: "Gross Margin", value: formatRatio(outlet.grossMargin), subtitle: "Target min 36%", delta: outlet.grossMargin < 0.35 ? "Di bawah target" : "OK", tone: outlet.grossMargin < 0.35 ? "warn" : "good" },
              { title: "Net Profit", value: formatShortRp(outlet.netProfit), subtitle: "MTD", delta: outlet.netProfit < 0 ? "Rugi" : "Profit", tone: outlet.netProfit < 0 ? "danger" : "good" },
              { title: "Cash Variance", value: formatShortRp(outlet.cashVariance), subtitle: "Closing kas", delta: Math.abs(outlet.cashVariance) > 1000000 ? "Audit" : "Normal", tone: Math.abs(outlet.cashVariance) > 1000000 ? "danger" : "good" },
              { title: "Stock Variance", value: formatPct(outlet.stockVariance), subtitle: "Target ≤ 1,5%", delta: outlet.stockVariance > 3 ? "High" : "Normal", tone: outlet.stockVariance > 3 ? "danger" : "good" },
              { title: "Waste", value: formatPct(outlet.waste), subtitle: "Target ≤ 3%", delta: outlet.waste > 3 ? "High" : "Normal", tone: outlet.waste > 3 ? "warn" : "good" },
              { title: "Risk Score", value: outlet.riskScore, subtitle: "0 rendah - 100 tinggi", delta: outlet.status, tone: outlet.riskScore > 70 ? "dark" : outlet.riskScore > 45 ? "warn" : "good" },
            ]}
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard title="Drill-down Omzet 7 Hari" subtitle="Trend outlet terpilih">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={miniTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={formatShortRp} tickLine={false} axisLine={false} width={80} />
                  <Tooltip formatter={(value) => formatRp(value)} />
                  <Line type="monotone" dataKey="sales" name="Outlet Sales" stroke={CHART.primary} strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Leakage Snapshot" subtitle="Cash, stock, waste, refund, void">
              <div className="space-y-4">
                {[
                  { label: "Cash Variance", value: Math.min(Math.abs(outlet.cashVariance) / 7000000, 1) * 100, text: formatShortRp(outlet.cashVariance) },
                  { label: "Stock Variance", value: Math.min(outlet.stockVariance / 10, 1) * 100, text: formatPct(outlet.stockVariance) },
                  { label: "Waste", value: Math.min(outlet.waste / 8, 1) * 100, text: formatPct(outlet.waste) },
                  { label: "Refund", value: Math.min(outlet.refund / 2, 1) * 100, text: formatPct(outlet.refund) },
                  { label: "Void", value: Math.min(outlet.void / 2, 1) * 100, text: formatPct(outlet.void) },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-semibold text-slate-700">{metric.label}</span>
                      <span className="font-bold text-slate-900">{metric.text}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className={`h-2 rounded-full ${metric.value > 65 ? "bg-red-500" : metric.value > 35 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${metric.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button>Buat Audit Task</Button>
            <Button variant="secondary">Lihat Transaksi POS</Button>
            <Button variant="secondary">Lihat Stock Card</Button>
            <Button variant="secondary">Lihat Settlement</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StockistWarehouse() {
  const criticalStock = sum(stockists, "criticalItems");
  const totalExpiry = sum(stockists, "expiryAlerts");
  const avgVariance = sum(stockists, "variance") / stockists.length;

  return (
    <div className="space-y-6">
      <MetricStrip
        items={[
          { title: "Stok Ayam Frozen", value: `${formatNumber(sum(stockists, "frozenChicken"))} kg`, subtitle: "Across stockist", delta: "+4,2%" },
          { title: "Stok Daging", value: `${formatNumber(sum(stockists, "meat"))} kg`, subtitle: "Daging/bakso", delta: "+1,8%" },
          { title: "Stok Sosis", value: `${formatNumber(sum(stockists, "sausage"))} kg`, subtitle: "Frozen item", delta: "-2,1%", tone: "warn" },
          { title: "Stok Bumbu", value: `${formatNumber(sum(stockists, "seasoning"))} kg`, subtitle: "Crispy/roasting", delta: "+3,6%" },
          { title: "Stok Saus", value: `${formatNumber(sum(stockists, "sauce"))} karton`, subtitle: "Sachet & bulk", delta: "-1,4%" },
          { title: "Packaging", value: formatNumber(sum(stockists, "packaging")), subtitle: "Cup, box, bag", delta: "+2,4%" },
          { title: "Stok Kritis", value: criticalStock, subtitle: "Item di bawah ROP", delta: "+6 item", tone: "danger" },
          { title: "Expiry Alert", value: totalExpiry, subtitle: "Expired ≤ 14 hari", delta: "+5 item", tone: "warn" },
          { title: "Stock In", value: `${formatNumber(sum(stockists, "stockIn"))} kg`, subtitle: "Minggu ini", delta: "+8,4%" },
          { title: "Stock Out", value: `${formatNumber(sum(stockists, "stockOut"))} kg`, subtitle: "DO outlet", delta: "+9,1%" },
          { title: "Stock Variance", value: formatPct(avgVariance), subtitle: "Avg stockist", delta: "+0,9 poin", tone: "warn" },
          { title: "Retur / Rusak", value: `${formatNumber(sum(stockists, "returnQty"))} / ${formatNumber(sum(stockists, "damaged"))}`, subtitle: "Kg / unit mixed", delta: "+11%", tone: "warn" },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-5">
        {stockists.map((stockist) => <StockistHealthCard key={stockist.id} stockist={stockist} />)}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Stock Level by Stockist" subtitle="Frozen chicken, meat, sausage, bumbu, saus">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={stockists}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="area" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={formatNumber} tickLine={false} axisLine={false} width={80} />
              <Tooltip formatter={(value) => formatNumber(value)} />
              <Legend />
              <Bar dataKey="frozenChicken" name="Ayam" stackId="a" fill={CHART.primary} />
              <Bar dataKey="meat" name="Daging" stackId="a" fill={CHART.accentDark} />
              <Bar dataKey="sausage" name="Sosis" stackId="a" fill={CHART.accent} />
              <Bar dataKey="seasoning" name="Bumbu" stackId="a" fill={CHART.primaryDark} />
              <Bar dataKey="sauce" name="Saus" stackId="a" fill={CHART.slate} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Critical Stock Alert" subtitle="Stok kritis dan expiry alert per stockist">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={stockists}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="area" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="criticalItems" name="Stok Kritis" fill={CHART.primary} radius={[8, 8, 0, 0]} />
              <Bar dataKey="expiryAlerts" name="Expiry Alert" fill={CHART.accent} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <PageSection title="Stock Variance Table" subtitle="Selisih sistem vs fisik yang perlu ditindaklanjuti" action={<Button>Generate Opname Task</Button>}>
          <DataTable
            rows={stockVarianceRows}
            columns={[
              { key: "stockist", label: "Stockist" },
              { key: "item", label: "Item", render: (row) => <span className="font-bold text-slate-900">{row.item}</span> },
              { key: "system", label: "System", render: (row) => formatNumber(row.system) },
              { key: "physical", label: "Physical", render: (row) => formatNumber(row.physical) },
              { key: "variance", label: "Variance", render: (row) => <span className="font-bold text-red-600">{formatNumber(row.variance)}</span> },
              { key: "loss", label: "Loss", render: (row) => formatShortRp(row.loss) },
              { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
            ]}
          />
        </PageSection>
        <PageSection title="Expiry Alert List" subtitle="Item FEFO yang harus segera diputar" action={<Button variant="secondary">Buat Transfer Stock</Button>}>
          <DataTable
            rows={expiryAlerts}
            columns={[
              { key: "stockist", label: "Stockist" },
              { key: "item", label: "Item", render: (row) => <span className="font-bold text-slate-900">{row.item}</span> },
              { key: "qty", label: "Qty", render: (row) => formatNumber(row.qty) },
              { key: "expiredIn", label: "Expired" },
              { key: "action", label: "Action" },
              { key: "status", label: "Severity", render: (row) => <StatusBadge status={row.status} /> },
            ]}
          />
        </PageSection>
      </div>
    </div>
  );
}

function StockistHealthCard({ stockist }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-slate-400">{stockist.id}</p>
          <h3 className="mt-1 font-black text-slate-950">{stockist.area}</h3>
          <p className="text-xs text-slate-500">{stockist.name}</p>
        </div>
        <StatusBadge status={stockist.health} />
      </div>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between"><span className="text-slate-500">Ayam frozen</span><b>{formatNumber(stockist.frozenChicken)} kg</b></div>
        <div className="flex justify-between"><span className="text-slate-500">Critical</span><b className="text-red-600">{stockist.criticalItems}</b></div>
        <div className="flex justify-between"><span className="text-slate-500">Expiry</span><b className="text-amber-600">{stockist.expiryAlerts}</b></div>
        <div className="flex justify-between"><span className="text-slate-500">Variance</span><b>{formatPct(stockist.variance)}</b></div>
        <div className="flex justify-between"><span className="text-slate-500">Opname</span><StatusBadge status={stockist.opnameStatus} /></div>
      </div>
    </div>
  );
}

function ProductionColdStorage() {
  const planned = sum(productionHouses, "plannedProduction");
  const actual = sum(productionHouses, "actualProduction");
  const avgYield = sum(productionHouses, "actualYield") / productionHouses.length;
  const avgYieldStd = sum(productionHouses, "yieldStandard") / productionHouses.length;
  const qcFailRows = productionHouses.map((p) => ({ entity: p.name, area: p.area, qcFail: p.qcFail, reject: p.rejectProduct, waste: p.waste, batch: p.batchStatus, status: p.status }));

  return (
    <div className="space-y-6">
      <MetricStrip
        items={[
          { title: "Planned Production", value: `${formatNumber(planned)} kg`, subtitle: "Harian nasional", delta: "+5,1%" },
          { title: "Actual Production", value: `${formatNumber(actual)} kg`, subtitle: "Output aktual", delta: formatPct((actual / planned) * 100) },
          { title: "Yield Standard", value: formatPct(avgYieldStd), subtitle: "Weighted avg", delta: "Benchmark" },
          { title: "Actual Yield", value: formatPct(avgYield), subtitle: "Avg produksi", delta: formatPct(avgYield - avgYieldStd), tone: avgYield < avgYieldStd - 1 ? "warn" : "good" },
          { title: "Yield Variance", value: formatPct(avgYield - avgYieldStd), subtitle: "Selisih vs standar", delta: "Perlu audit", tone: "warn" },
          { title: "Reject Product", value: `${formatNumber(sum(productionHouses, "rejectProduct"))} kg`, subtitle: "Reject hari ini", delta: "+8,7%", tone: "warn" },
          { title: "QC Fail", value: formatNumber(sum(productionHouses, "qcFail")), subtitle: "Batch/item", delta: "+12", tone: "danger" },
          { title: "Waste Produksi", value: formatPct(sum(productionHouses, "waste") / productionHouses.length), subtitle: "Target ≤ 3%", delta: "+1,4 poin", tone: "warn" },
          { title: "Cost per Kg", value: formatShortRp(sum(productionHouses, "costPerKg") / productionHouses.length), subtitle: "Avg produksi", delta: "+3,2%", tone: "warn" },
          { title: "Cold Storage Capacity", value: formatPct(sum(productionHouses, "coldStorageCapacity") / productionHouses.length), subtitle: "Avg utilization", delta: "+6,8 poin", tone: "warn" },
          { title: "Temp Alert", value: "2 site", subtitle: "Di atas threshold", delta: "Tengah, Timur", tone: "danger" },
          { title: "Produk Siap Kirim", value: `${formatNumber(sum(productionHouses, "readyToShip"))} kg`, subtitle: "Released/available", delta: "Siap DO" },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        {productionHouses.map((house) => <ProductionHealthCard key={house.id} house={house} />)}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Production Plan vs Actual" subtitle="Kg produksi per rumah produksi">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productionPlanRows}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={formatNumber} tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => `${formatNumber(value)} kg`} />
              <Legend />
              <Bar dataKey="planned" name="Planned" fill={CHART.neutral} radius={[8, 8, 0, 0]} />
              <Bar dataKey="actual" name="Actual" fill={CHART.primary} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Yield Variance Chart" subtitle="Actual yield vs standard">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productionHouses}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="area" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={false} domain={[85, 96]} />
              <Tooltip formatter={(value) => formatPct(value)} />
              <Legend />
              <Bar dataKey="yieldStandard" name="Standard" fill={CHART.neutral} radius={[8, 8, 0, 0]} />
              <Bar dataKey="actualYield" name="Actual" fill={CHART.accentDark} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <PageSection title="QC Fail List" subtitle="Batch status, reject, dan waste produksi" action={<Button>Review Batch</Button>}>
          <DataTable
            rows={qcFailRows}
            columns={[
              { key: "entity", label: "Production House", render: (row) => <span className="font-bold text-slate-900">{row.entity}</span> },
              { key: "area", label: "Wilayah" },
              { key: "qcFail", label: "QC Fail", render: (row) => formatNumber(row.qcFail) },
              { key: "reject", label: "Reject", render: (row) => `${formatNumber(row.reject)} kg` },
              { key: "waste", label: "Waste", render: (row) => formatPct(row.waste) },
              { key: "batch", label: "Batch", render: (row) => <StatusBadge status={row.batch} /> },
              { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
            ]}
          />
        </PageSection>
        <PageSection title="Temperature Alert" subtitle="Cold storage yang melewati batas suhu" action={<Button variant="danger">Escalate Maintenance</Button>}>
          <div className="grid gap-4">
            {productionHouses.map((house) => (
              <div key={house.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-black text-slate-950">{house.name}</p>
                    <p className="text-sm text-slate-500">Capacity {formatPct(house.coldStorageCapacity)} · Ready {formatNumber(house.readyToShip)} kg</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-black ${house.temperature > -16 ? "text-red-600" : "text-emerald-600"}`}>{house.temperature}°C</p>
                    <StatusBadge status={house.temperature > -16 ? "High Risk" : house.temperature > -17 ? "Attention" : "Healthy"} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PageSection>
      </div>
    </div>
  );
}

function ProductionHealthCard({ house }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-slate-400">{house.id}</p>
          <h3 className="mt-1 text-lg font-black text-slate-950">{house.area}</h3>
          <p className="text-sm text-slate-500">{house.name}</p>
        </div>
        <StatusBadge status={house.status} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500">Actual</p><b>{formatNumber(house.actualProduction)} kg</b></div>
        <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500">Yield</p><b>{formatPct(house.actualYield)}</b></div>
        <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500">QC Fail</p><b className="text-red-600">{house.qcFail}</b></div>
        <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500">Temp</p><b>{house.temperature}°C</b></div>
      </div>
    </div>
  );
}

function LogisticsDelivery() {
  return (
    <div className="space-y-6">
      <MetricStrip
        items={[
          { title: "Total Delivery Order", value: formatNumber(deliveryStats.totalDO), subtitle: "Bulan ini", delta: "+7,4%" },
          { title: "In Progress", value: formatNumber(deliveryStats.inProgress), subtitle: "Sedang jalan", delta: "690 DO" },
          { title: "Completed", value: formatNumber(deliveryStats.completed), subtitle: "Selesai POD", delta: "+6,8%", tone: "good" },
          { title: "On-time Delivery", value: formatPct(deliveryStats.onTimeDelivery), subtitle: "Target ≥ 95%", delta: "-2,9 poin", tone: "warn" },
          { title: "In-full Delivery", value: formatPct(deliveryStats.inFullDelivery), subtitle: "Target ≥ 97%", delta: "-1,6 poin", tone: "warn" },
          { title: "Delivery Dispute", value: deliveryStats.deliveryDispute, subtitle: "Open + investigating", delta: "+18", tone: "danger" },
          { title: "Barang Kurang", value: formatNumber(deliveryStats.shortItems), subtitle: "Line item shortage", delta: "+21" },
          { title: "Barang Rusak", value: formatNumber(deliveryStats.damagedItems), subtitle: "Line item damage", delta: "+9", tone: "warn" },
          { title: "Cost per Delivery", value: formatShortRp(deliveryStats.costPerDelivery), subtitle: "Avg route cost", delta: "+3,3%" },
          { title: "Cost per Kg", value: formatShortRp(deliveryStats.costPerKg), subtitle: "Logistics cost", delta: "+4,1%", tone: "warn" },
          { title: "Driver Performance", value: "91/100", subtitle: "Avg score", delta: "-2 poin" },
          { title: "Route Risk", value: "2 route", subtitle: "Barat, Timur", delta: "Audit route", tone: "danger" },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <LogisticsSLACard title="On-time SLA" value={deliveryStats.onTimeDelivery} target={95} />
        <LogisticsSLACard title="In-full SLA" value={deliveryStats.inFullDelivery} target={97} />
        <LogisticsSLACard title="Dispute Rate" value={(deliveryStats.deliveryDispute / deliveryStats.totalDO) * 100} target={0.5} inverse />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Delivery Status Chart" subtitle="Status DO nasional">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={deliveryStatus} dataKey="value" nameKey="name" innerRadius={60} outerRadius={105} paddingAngle={2}>
                {deliveryStatus.map((entry, index) => <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value, name) => [`${formatNumber(value)} DO`, name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="SLA Trend" subtitle="On-time dan in-full 7 hari">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={slaTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={false} domain={[85, 100]} />
              <Tooltip formatter={(value) => formatPct(value)} />
              <Legend />
              <Line type="monotone" dataKey="onTime" name="On-time" stroke={CHART.primary} strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="inFull" name="In-full" stroke={CHART.accentDark} strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <PageSection title="Route Performance Table" subtitle="Driver, route, DO, SLA, dispute, cost" action={<Button>Optimize Route</Button>}>
          <DataTable
            rows={routePerformance}
            columns={[
              { key: "route", label: "Route", render: (row) => <span className="font-bold text-slate-900">{row.route}</span> },
              { key: "driver", label: "Driver" },
              { key: "do", label: "DO", render: (row) => formatNumber(row.do) },
              { key: "onTime", label: "On-time", render: (row) => formatPct(row.onTime) },
              { key: "inFull", label: "In-full", render: (row) => formatPct(row.inFull) },
              { key: "disputes", label: "Dispute", render: (row) => <span className={row.disputes > 15 ? "font-bold text-red-600" : "font-bold text-slate-700"}>{row.disputes}</span> },
              { key: "costPerKg", label: "Cost/Kg", render: (row) => formatShortRp(row.costPerKg) },
            ]}
          />
        </PageSection>
        <PageSection title="Dispute Alert List" subtitle="Barang kurang, rusak, POD belum ada" action={<Button variant="danger">Escalate Dispute</Button>}>
          <DataTable
            rows={deliveryDisputes}
            columns={[
              { key: "route", label: "Route" },
              { key: "outlet", label: "Outlet", render: (row) => <span className="font-bold text-slate-900">{row.outlet}</span> },
              { key: "issue", label: "Issue" },
              { key: "loss", label: "Loss", render: (row) => formatShortRp(row.loss) },
              { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
            ]}
          />
        </PageSection>
      </div>
    </div>
  );
}

function LogisticsSLACard({ title, value, target, inverse = false }) {
  const healthy = inverse ? value <= target : value >= target;
  const percent = inverse ? Math.min((value / target) * 100, 100) : Math.min((value / 100) * 100, 100);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold uppercase text-slate-400">{title}</p>
          <p className={`mt-2 text-3xl font-black ${healthy ? "text-emerald-600" : "text-red-600"}`}>{formatPct(value)}</p>
        </div>
        <StatusBadge status={healthy ? "Healthy" : "Attention"} />
      </div>
      <div className="mt-4 h-2 rounded-full bg-slate-100">
        <div className={`h-2 rounded-full ${healthy ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-3 text-sm text-slate-500">Target {formatPct(target)}</p>
    </div>
  );
}

function FinanceSettlement() {
  return (
    <div className="space-y-6">
      <MetricStrip
        items={[
          { title: "Omzet POS", value: formatShortRp(financeSummary.posRevenue), subtitle: "Gross sales MTD", delta: "+8,6%" },
          { title: "Kas Fisik", value: formatShortRp(financeSummary.physicalCash), subtitle: "Cash collected", delta: "+3,2%" },
          { title: "Cash Variance", value: formatShortRp(financeSummary.cashVariance), subtitle: "Minus harus direkonsiliasi", delta: "+Rp11,2 jt", tone: "danger" },
          { title: "QRIS/EDC/e-wallet", value: formatShortRp(financeSummary.qrisEdcWalletSettlement), subtitle: "Settlement channel", delta: "+9,4%" },
          { title: "Settlement Pending", value: formatShortRp(financeSummary.settlementPending), subtitle: "Belum clear bank", delta: "+12,5%", tone: "warn" },
          { title: "Settlement Overdue", value: formatShortRp(financeSummary.settlementOverdue), subtitle: "> 2 hari", delta: "+18%", tone: "danger" },
          { title: "Piutang Franchisee", value: formatShortRp(financeSummary.franchiseReceivable), subtitle: "Royalty + bahan", delta: "+4,8%", tone: "warn" },
          { title: "AP Supplier", value: formatShortRp(financeSummary.apSupplier), subtitle: "Payable berjalan", delta: "Normal" },
          { title: "Bank Reconciliation", value: formatPct(financeSummary.bankReconciled), subtitle: "Matched transaction", delta: "+1,2 poin", tone: "good" },
          { title: "P&L Outlet", value: formatShortRp(financeSummary.pnlOutlet), subtitle: "Net profit outlet", delta: "+5,2%" },
          { title: "P&L Brand", value: formatShortRp(financeSummary.pnlBrand), subtitle: "Brand contribution", delta: "+6,1%" },
          { title: "P&L Company", value: formatShortRp(financeSummary.pnlCompany), subtitle: "After HO allocation", delta: "+4,9%" },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-4">
        {settlementStatus.map((item) => <FinanceSettlementCard key={item.name} item={item} />)}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Settlement Status" subtitle="Proporsi outlet settlement">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={settlementStatus} dataKey="value" nameKey="name" innerRadius={60} outerRadius={105} paddingAngle={2}>
                {settlementStatus.map((entry, index) => <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value}%`, name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="AR Aging Chart" subtitle="Piutang franchisee berdasarkan umur">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={arAging}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="bucket" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={formatShortRp} tickLine={false} axisLine={false} width={80} />
              <Tooltip formatter={(value) => formatRp(value)} />
              <Bar dataKey="value" name="AR" fill={CHART.ink} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <PageSection title="Cash Variance Table" subtitle="Perbedaan POS cash vs fisik" action={<Button>Start Reconciliation</Button>}>
          <DataTable
            rows={cashVarianceRows}
            columns={[
              { key: "outlet", label: "Outlet", render: (row) => <span className="font-bold text-slate-900">{row.outlet}</span> },
              { key: "area", label: "Wilayah" },
              { key: "posCash", label: "POS Cash", render: (row) => formatShortRp(row.posCash) },
              { key: "physical", label: "Kas Fisik", render: (row) => formatShortRp(row.physical) },
              { key: "variance", label: "Variance", render: (row) => <span className="font-bold text-red-600">{formatShortRp(row.variance)}</span> },
              { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
            ]}
          />
        </PageSection>
        <PageSection title="Outlet Rugi List" subtitle="Outlet dengan net profit negatif" action={<Button variant="danger">Hold Payout</Button>}>
          <DataTable
            rows={lossMakingOutlets}
            columns={[
              { key: "name", label: "Outlet", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
              { key: "area", label: "Wilayah" },
              { key: "monthlySales", label: "Omzet", render: (row) => formatShortRp(row.monthlySales) },
              { key: "netProfit", label: "Net Profit", render: (row) => <span className="font-bold text-red-600">{formatShortRp(row.netProfit)}</span> },
              { key: "riskScore", label: "Risk", render: (row) => row.riskScore },
              { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
            ]}
          />
        </PageSection>
      </div>

      <PageSection title="Margin Drop Alert" subtitle="Outlet dengan penurunan margin material" action={<Button variant="secondary">Download P&L</Button>}>
        <DataTable
          rows={marginDropAlerts}
          columns={[
            { key: "outlet", label: "Outlet", render: (row) => <span className="font-bold text-slate-900">{row.outlet}</span> },
            { key: "marginLastMonth", label: "Margin Apr", render: (row) => formatPct(row.marginLastMonth) },
            { key: "marginThisMonth", label: "Margin Mei", render: (row) => <span className="font-bold text-red-600">{formatPct(row.marginThisMonth)}</span> },
            { key: "estimatedImpact", label: "Impact", render: (row) => formatShortRp(row.estimatedImpact) },
            { key: "action", label: "Recommended Action" },
          ]}
        />
      </PageSection>
    </div>
  );
}

function FinanceSettlementCard({ item }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-500">{item.name}</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{item.value}%</p>
        </div>
        <StatusBadge status={item.name} />
      </div>
      <div className="mt-4 h-2 rounded-full bg-slate-100">
        <div className={`h-2 rounded-full ${item.name === "Overdue" || item.name === "Hold" ? "bg-red-500" : item.name === "Pending" ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${item.value}%` }} />
      </div>
    </div>
  );
}

function ProfitSharing() {
  const defaultSim = { netSales: 650000000, cogsRatio: 61, opex: 95000000, royalty: 3, managementFee: 2, companyShare: 50, investorShare: 35, franchiseeShare: 0, operatorShare: 15 };
  const [sim, setSim] = useState(defaultSim);
  const [investorFilter, setInvestorFilter] = useState("Semua Investor");

  const rows = investorFilter === "Semua Investor" ? profitSharingRows : profitSharingRows.filter((row) => row.investorName === investorFilter);
  const simCogs = sim.netSales * (sim.cogsRatio / 100);
  const simGrossProfit = sim.netSales - simCogs;
  const simRoyalty = sim.netSales * (sim.royalty / 100);
  const simManagementFee = sim.netSales * (sim.managementFee / 100);
  const simNetProfit = simGrossProfit - sim.opex - simRoyalty - simManagementFee;
  const simDistributable = simNetProfit > 0 ? simNetProfit * 0.9 : 0;
  const shareTotal = sim.companyShare + sim.investorShare + sim.franchiseeShare + sim.operatorShare;

  return (
    <div className="space-y-6">
      <MetricStrip
        items={[
          { title: "Total Net Sales", value: formatShortRp(sum(rows, "netSales")), subtitle: "Outlet profit sharing", delta: "+6,8%" },
          { title: "Distributable Profit", value: formatShortRp(sum(rows, "distributableProfit")), subtitle: "Setelah retained earning", delta: "+5,7%", tone: "good" },
          { title: "Payout Company", value: formatShortRp(sum(rows, "payoutCompany")), subtitle: "Hak perusahaan", delta: "+4,2%" },
          { title: "Payout Investor", value: formatShortRp(sum(rows, "payoutInvestor")), subtitle: "Hak investor", delta: "+7,1%" },
          { title: "Payout Franchisee", value: formatShortRp(sum(rows, "payoutFranchisee")), subtitle: "Hak franchisee", delta: "+5,4%" },
          { title: "Payout Operator", value: formatShortRp(sum(rows, "payoutOperator")), subtitle: "Hak operator", delta: "+3,8%" },
          { title: "Pending Payable", value: formatShortRp(rows.filter((row) => row.payoutStatus === "Pending").reduce((total, row) => total + row.distributableProfit, 0)), subtitle: "Belum dibayar", delta: "+3 outlet", tone: "warn" },
          { title: "Hold / Not Eligible", value: rows.filter((row) => row.notEligible).length, subtitle: "Rugi atau hold", delta: "Perlu approval", tone: "danger" },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <ChartCard title="Payout Composition" subtitle="Company, investor, franchisee, operator" className="xl:col-span-1">
          <ResponsiveContainer width="100%" height={285}>
            <PieChart>
              <Pie
                data={[
                  { name: "Company", value: sum(rows, "payoutCompany") },
                  { name: "Investor", value: sum(rows, "payoutInvestor") },
                  { name: "Franchisee", value: sum(rows, "payoutFranchisee") },
                  { name: "Operator", value: sum(rows, "payoutOperator") },
                ]}
                dataKey="value"
                nameKey="name"
                innerRadius={58}
                outerRadius={100}
                paddingAngle={2}
              >
                {PIE_COLORS.slice(0, 4).map((color) => <Cell key={color} fill={color} />)}
              </Pie>
              <Tooltip formatter={(value, name) => [formatRp(value), name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Simulasi Profit Sharing"
          subtitle="Hitung cepat payout outlet baru / outlet existing"
          className="xl:col-span-2"
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setSim(defaultSim);
                showDemoToast({
                  title: "Simulasi direset",
                  message: "Input profit sharing kembali ke template awal.",
                  tone: "success",
                });
              }}
            >
              Reset Simulasi
            </Button>
          }
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { key: "netSales", label: "Net Sales", type: "currency" },
                { key: "cogsRatio", label: "COGS Ratio %" },
                { key: "opex", label: "Opex", type: "currency" },
                { key: "royalty", label: "Royalty %" },
                { key: "managementFee", label: "Management Fee %" },
                { key: "companyShare", label: "Company Share %" },
                { key: "investorShare", label: "Investor Share %" },
                { key: "franchiseeShare", label: "Franchisee Share %" },
                { key: "operatorShare", label: "Operator Share %" },
              ].map((field) => (
                <label key={field.key} className="text-sm">
                  <span className="font-bold text-slate-600">{field.label}</span>
                  <input
                    type="number"
                    value={sim[field.key]}
                    onChange={(event) => setSim((prev) => ({ ...prev, [field.key]: Number(event.target.value) }))}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold outline-none focus:border-blue-400"
                  />
                </label>
              ))}
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-black text-slate-950">Hasil Simulasi</h4>
                <StatusBadge status={shareTotal === 100 ? "Healthy" : "Attention"} />
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span>COGS</span><b>{formatShortRp(simCogs)}</b></div>
                <div className="flex justify-between"><span>Gross Profit</span><b>{formatShortRp(simGrossProfit)}</b></div>
                <div className="flex justify-between"><span>Royalty</span><b>{formatShortRp(simRoyalty)}</b></div>
                <div className="flex justify-between"><span>Management Fee</span><b>{formatShortRp(simManagementFee)}</b></div>
                <div className="border-t border-slate-200 pt-3 flex justify-between"><span>Net Profit</span><b className={simNetProfit < 0 ? "text-red-600" : "text-emerald-600"}>{formatShortRp(simNetProfit)}</b></div>
                <div className="flex justify-between"><span>Distributable Profit</span><b>{formatShortRp(simDistributable)}</b></div>
                <div className="grid grid-cols-2 gap-2 pt-3">
                  <div className="rounded-xl bg-white p-3"><p className="text-slate-500">Company</p><b>{formatShortRp(simDistributable * (sim.companyShare / 100))}</b></div>
                  <div className="rounded-xl bg-white p-3"><p className="text-slate-500">Investor</p><b>{formatShortRp(simDistributable * (sim.investorShare / 100))}</b></div>
                  <div className="rounded-xl bg-white p-3"><p className="text-slate-500">Franchisee</p><b>{formatShortRp(simDistributable * (sim.franchiseeShare / 100))}</b></div>
                  <div className="rounded-xl bg-white p-3"><p className="text-slate-500">Operator</p><b>{formatShortRp(simDistributable * (sim.operatorShare / 100))}</b></div>
                </div>
                {shareTotal !== 100 ? <p className="rounded-xl bg-amber-50 p-3 font-semibold text-amber-700">Total share saat ini {shareTotal}%. Harus 100% sebelum disimpan.</p> : null}
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      <PageSection
        title="Profit Sharing Table"
        subtitle="Transparansi payout berdasarkan outlet, investor, kontribusi modal, dan status pembayaran"
        action={
          <div className="flex flex-wrap gap-2">
            <select
              value={investorFilter}
              onChange={(event) => {
                const value = event.target.value;
                setInvestorFilter(value);
                showFilterToast("Investor", value);
              }}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold"
            >
              <option>Semua Investor</option>
              {investorNames.map((name) => <option key={name}>{name}</option>)}
            </select>
            <Button>Export Report</Button>
          </div>
        }
      >
        <ProfitSharingTable rows={rows} />
      </PageSection>
    </div>
  );
}

function ProfitSharingTable({ rows }) {
  return (
    <DataTable
      rows={rows}
      columns={[
        { key: "outletName", label: "Outlet", render: (row) => <div><p className="font-bold text-slate-900">{row.outletName}</p><p className="text-xs text-slate-500">{row.area} · {row.brand}</p></div> },
        { key: "ownershipScheme", label: "Ownership" },
        { key: "investorName", label: "Investor" },
        { key: "companyShare", label: "Company", render: (row) => formatRatio(row.companyShare) },
        { key: "investorShare", label: "Investor", render: (row) => formatRatio(row.investorShare) },
        { key: "franchiseeShare", label: "Franchisee", render: (row) => formatRatio(row.franchiseeShare) },
        { key: "operatorShare", label: "Operator", render: (row) => formatRatio(row.operatorShare) },
        { key: "capitalContribution", label: "Capital", render: (row) => formatShortRp(row.capitalContribution) },
        { key: "grossSales", label: "Gross Sales", render: (row) => formatShortRp(row.grossSales) },
        { key: "netSales", label: "Net Sales", render: (row) => formatShortRp(row.netSales) },
        { key: "cogs", label: "COGS", render: (row) => formatShortRp(row.cogs) },
        { key: "grossProfit", label: "Gross Profit", render: (row) => formatShortRp(row.grossProfit) },
        { key: "opex", label: "Opex", render: (row) => formatShortRp(row.opex) },
        { key: "royalty", label: "Royalty", render: (row) => formatShortRp(row.royalty) },
        { key: "managementFee", label: "Mgmt Fee", render: (row) => formatShortRp(row.managementFee) },
        { key: "netProfit", label: "Net Profit", render: (row) => <span className={row.netProfit < 0 ? "font-bold text-red-600" : "font-bold text-emerald-600"}>{formatShortRp(row.netProfit)}</span> },
        { key: "distributableProfit", label: "Distributable", render: (row) => formatShortRp(row.distributableProfit) },
        { key: "payoutCompany", label: "Payout Company", render: (row) => formatShortRp(row.payoutCompany) },
        { key: "payoutInvestor", label: "Payout Investor", render: (row) => formatShortRp(row.payoutInvestor) },
        { key: "payoutFranchisee", label: "Payout Franchisee", render: (row) => formatShortRp(row.payoutFranchisee) },
        { key: "payoutOperator", label: "Payout Operator", render: (row) => formatShortRp(row.payoutOperator) },
        { key: "retainedEarning", label: "Retained", render: (row) => formatShortRp(row.retainedEarning) },
        { key: "flags", label: "Flags", render: (row) => <div className="flex gap-1">{row.isLoss ? <StatusBadge status="Rugi" /> : null}{row.notEligible ? <StatusBadge status="Hold" /> : <StatusBadge status="Healthy" />}</div> },
        { key: "payoutStatus", label: "Payout", render: (row) => <StatusBadge status={row.payoutStatus} /> },
      ]}
    />
  );
}

function EarlyWarning() {
  const [severity, setSeverity] = useState("Semua Severity");
  const [category, setCategory] = useState("Semua Kategori");
  const visibleAlerts = alerts.filter((alert) => (severity === "Semua Severity" || alert.severity === severity) && (category === "Semua Kategori" || alert.category === category));
  const categoryCounts = ["Stock Leakage", "Cash Leakage", "Production Leakage", "Logistics Leakage", "Finance Leakage"].map((cat) => ({ category: cat.replace(" Leakage", ""), count: alerts.filter((alert) => alert.category === cat).length, loss: alerts.filter((alert) => alert.category === cat).reduce((total, alert) => total + alert.estimatedLoss, 0) }));
  const totalLoss = visibleAlerts.reduce((total, alert) => total + alert.estimatedLoss, 0);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-black text-slate-950">Early Warning & Anti-Leakage Center</h2>
            <p className="text-sm text-slate-500">Stock, cash, production, logistics, dan finance leakage dalam satu prioritas.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={severity}
              onChange={(event) => {
                const value = event.target.value;
                setSeverity(value);
                showFilterToast("Severity", value);
              }}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold"
            >
              <option>Semua Severity</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <select
              value={category}
              onChange={(event) => {
                const value = event.target.value;
                setCategory(value);
                showFilterToast("Kategori alert", value);
              }}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold"
            >
              <option>Semua Kategori</option>
              <option>Stock Leakage</option>
              <option>Cash Leakage</option>
              <option>Production Leakage</option>
              <option>Logistics Leakage</option>
              <option>Finance Leakage</option>
            </select>
            <Button variant="danger">Create War Room</Button>
          </div>
        </div>
      </div>

      <MetricStrip
        items={[
          { title: "Total Alert", value: visibleAlerts.length, subtitle: "Berdasarkan filter", delta: `${alerts.length} all` },
          { title: "Critical", value: visibleAlerts.filter((alert) => alert.severity === "Critical").length, subtitle: "Butuh owner decision", delta: "SLA < 6 jam", tone: "dark" },
          { title: "High", value: visibleAlerts.filter((alert) => alert.severity === "High").length, subtitle: "Audit prioritas", delta: "SLA 1 hari", tone: "danger" },
          { title: "Estimated Loss", value: formatShortRp(totalLoss), subtitle: "Potensi kerugian", delta: "+14% vs minggu lalu", tone: "danger" },
          { title: "Open", value: visibleAlerts.filter((alert) => alert.status === "Open").length, subtitle: "Belum ditangani", delta: "Assign PIC" },
          { title: "Investigating", value: visibleAlerts.filter((alert) => alert.status === "Investigating").length, subtitle: "Dalam proses", delta: "Monitor SLA" },
          { title: "Escalated", value: visibleAlerts.filter((alert) => alert.status === "Escalated").length, subtitle: "Butuh keputusan", delta: "Owner Office", tone: "warn" },
          { title: "Resolved", value: visibleAlerts.filter((alert) => alert.status === "Resolved").length, subtitle: "Selesai", delta: "Closed" },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Alert by Category" subtitle="Jumlah alert per kategori leakage">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryCounts}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="category" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="count" name="Alert" fill={CHART.primary} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Estimated Loss by Category" subtitle="Potensi kerugian yang perlu dicegah">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryCounts}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="category" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={formatShortRp} tickLine={false} axisLine={false} width={80} />
              <Tooltip formatter={(value) => formatRp(value)} />
              <Bar dataKey="loss" name="Estimated Loss" fill={CHART.ink} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <PageSection title="Prioritized Alert Cards" subtitle="Alert paling penting untuk owner dan auditor" action={<Button>Assign Bulk PIC</Button>}>
        <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
          {visibleAlerts.slice(0, 9).map((alert) => <AlertCard key={alert.id} alert={alert} />)}
        </div>
      </PageSection>

      <PageSection title="Anti-Leakage Alert Table" subtitle="Severity, area, entity, issue, loss, action, PIC, SLA, status">
        <DataTable
          rows={visibleAlerts}
          columns={[
            { key: "id", label: "ID", render: (row) => <span className="font-bold text-slate-900">{row.id}</span> },
            { key: "severity", label: "Severity", render: (row) => <StatusBadge status={row.severity} /> },
            { key: "category", label: "Category" },
            { key: "area", label: "Wilayah" },
            { key: "entity", label: "Entity", render: (row) => <span className="font-bold text-slate-900">{row.entity}</span> },
            { key: "issue", label: "Issue" },
            { key: "estimatedLoss", label: "Est. Loss", render: (row) => formatShortRp(row.estimatedLoss) },
            { key: "recommendedAction", label: "Recommended Action" },
            { key: "pic", label: "PIC" },
            { key: "sla", label: "SLA" },
            { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
            { key: "action", label: "Action", render: () => <Button variant="secondary">Open Case</Button> },
          ]}
        />
      </PageSection>
    </div>
  );
}

function AppShell() {
  const [activePage, setActivePage] = useState("executive");
  const [filters, setFilters] = useState({ dateRange: "Bulan Ini", area: "Semua Wilayah", brand: "Semua Brand", search: "" });

  const filteredOutlets = useMemo(() => {
    return outlets.filter((outlet) => {
      const matchArea = filters.area === "Semua Wilayah" || outlet.area === filters.area;
      const matchBrand = filters.brand === "Semua Brand" || outlet.brand === filters.brand;
      const q = filters.search.toLowerCase().trim();
      const matchSearch = !q || outlet.name.toLowerCase().includes(q) || outlet.area.toLowerCase().includes(q) || outlet.brand.toLowerCase().includes(q) || outlet.id.toLowerCase().includes(q);
      return matchArea && matchBrand && matchSearch;
    });
  }, [filters]);

  const summary = useMemo(() => buildExecutiveSummary(filteredOutlets, filters), [filteredOutlets, filters]);

  const pageTitle = menuItems.find((item) => item.id === activePage)?.label || "Executive Summary";
  const handleOpenAlerts = () => {
    setActivePage("warning");
    showDemoToast({
      title: "Early Warning dibuka",
      message: `${summary.highRiskAlerts} alert critical/high ditampilkan untuk follow-up owner.`,
      tone: "warning",
    });
  };

  const renderPage = () => {
    switch (activePage) {
      case "executive":
        return <ExecutiveSummary filteredOutlets={filteredOutlets} summary={summary} setActivePage={setActivePage} />;
      case "sales":
        return <SalesRevenue filteredOutlets={filteredOutlets} />;
      case "outlet":
        return <OutletPerformance filteredOutlets={filteredOutlets} />;
      case "stockist":
        return <StockistWarehouse />;
      case "production":
        return <ProductionColdStorage />;
      case "logistics":
        return <LogisticsDelivery />;
      case "finance":
        return <FinanceSettlement />;
      case "profit":
        return <ProfitSharing />;
      case "warning":
        return <EarlyWarning />;
      default:
        return <ExecutiveSummary filteredOutlets={filteredOutlets} summary={summary} setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="dbesto-app min-h-screen text-slate-900">
      <ToastHost />
      <MobileNav activePage={activePage} setActivePage={setActivePage} />
      <div className="flex">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <main className="min-w-0 flex-1">
          <Header title={pageTitle} filters={filters} setFilters={setFilters} highRiskCount={summary.highRiskAlerts} onOpenAlerts={handleOpenAlerts} />
          <div className="px-4 py-6 xl:px-8">
            {renderPage()}
            <footer className="dbesto-footer mt-8 rounded-2xl border p-4 text-sm text-slate-500 shadow-sm">
              Prototype UI owner dashboard DBESTO Group · data dummy internal · tanpa backend, database, login, atau API integration.
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return <AppShell />;
}
