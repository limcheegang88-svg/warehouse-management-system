export const warehouses = ['北部仓', '东南仓', '深圳仓'];

export const productsSeed = [
  {
    id: 1,
    sku: 'SKU-1001',
    name: 'Industrial Cable',
    category: 'Electrical',
    warehouse: '北部仓',
    location: 'A-01-02',
    stock: 120,
    minStock: 25,
    unitPrice: 28,
  },
  {
    id: 2,
    sku: 'SKU-1002',
    name: 'Safety Gloves',
    category: 'Safety',
    warehouse: '北部仓',
    location: 'B-03-04',
    stock: 48,
    minStock: 30,
    unitPrice: 12,
  },
  {
    id: 3,
    sku: 'SKU-1003',
    name: 'Plastic Box',
    category: 'Packaging',
    warehouse: '东南仓',
    location: 'C-02-01',
    stock: 72,
    minStock: 40,
    unitPrice: 18,
  },
  {
    id: 4,
    sku: 'SKU-1004',
    name: 'Hydraulic Pump',
    category: 'Mechanical',
    warehouse: '深圳仓',
    location: 'D-04-03',
    stock: 19,
    minStock: 20,
    unitPrice: 240,
  },
  {
    id: 5,
    sku: 'SKU-1005',
    name: 'Fastener Kit',
    category: 'Hardware',
    warehouse: '深圳仓',
    location: 'E-01-05',
    stock: 88,
    minStock: 35,
    unitPrice: 26,
  },
  {
    id: 6,
    sku: 'SKU-1006',
    name: 'Label Roll',
    category: 'Packaging',
    warehouse: '东南仓',
    location: 'A-07-02',
    stock: 34,
    minStock: 30,
    unitPrice: 16,
  },
];

export const inboundSeed = [
  { id: 1, date: '2026-10-01', sku: 'SKU-1001', quantity: 40, warehouse: '北部仓', supplier: 'Sunline Supply' },
  { id: 2, date: '2026-10-02', sku: 'SKU-1003', quantity: 22, warehouse: '东南仓', supplier: 'Boxing Group' },
  { id: 3, date: '2026-10-03', sku: 'SKU-1005', quantity: 18, warehouse: '深圳仓', supplier: 'Connect Tech' },
];

export const outboundSeed = [
  { id: 1, date: '2026-10-01', sku: 'SKU-1002', quantity: 14, warehouse: '北部仓', customer: 'Alpha Works' },
  { id: 2, date: '2026-10-02', sku: 'SKU-1004', quantity: 7, warehouse: '深圳仓', customer: 'Zenith Tools' },
  { id: 3, date: '2026-10-04', sku: 'SKU-1006', quantity: 10, warehouse: '东南仓', customer: 'LogiBase' },
];

export const stockTakeSeed = [
  { id: 1, date: '2026-10-04', sku: 'SKU-1004', before: 25, after: 19, variance: -6 },
  { id: 2, date: '2026-10-05', sku: 'SKU-1001', before: 132, after: 120, variance: -12 },
];
