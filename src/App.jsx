import { useMemo, useState } from 'react';
import { inboundSeed, outboundSeed, productsSeed, stockTakeSeed, warehouses } from './data';

const NAV_ITEMS = ['dashboard', 'inventory', 'inbound', 'outbound', 'stocktake', 'reports'];

const formatMoney = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedWarehouse, setSelectedWarehouse] = useState('北部仓');
  const [products, setProducts] = useState(productsSeed);
  const [inboundHistory, setInboundHistory] = useState(inboundSeed);
  const [outboundHistory, setOutboundHistory] = useState(outboundSeed);
  const [stockTakeHistory, setStockTakeHistory] = useState(stockTakeSeed);
  const [auditLog, setAuditLog] = useState([
    '2026-10-08 09:15 - Warehouse manager approved stock reconciliation.',
    '2026-10-08 08:45 - System synced stock for North Warehouse.',
    '2026-10-07 17:30 - Inbound order for SKU-1001 completed.',
  ]);

  const [inboundForm, setInboundForm] = useState({ sku: 'SKU-1001', quantity: 25, supplier: 'New Supplier Co.' });
  const [outboundForm, setOutboundForm] = useState({ sku: 'SKU-1003', quantity: 10, customer: 'Contoso Logistics' });
  const [stockTakeForm, setStockTakeForm] = useState({ sku: 'SKU-1004', count: 18, note: 'Cycle count review' });

  const filteredProducts = useMemo(() => {
    if (selectedWarehouse === 'all') return products;
    return products.filter((product) => product.warehouse === selectedWarehouse);
  }, [products, selectedWarehouse]);

  const totalStockUnits = products.reduce((total, product) => total + product.stock, 0);
  const totalInventoryValue = products.reduce((total, product) => total + product.stock * product.unitPrice, 0);
  const lowStockProducts = products.filter((product) => product.stock <= product.minStock).length;
  const outboundTotal = outboundHistory.reduce((total, item) => total + item.quantity, 0);
  const inboundTotal = inboundHistory.reduce((total, item) => total + item.quantity, 0);

  const handleInbound = (event) => {
    event.preventDefault();
    const targetProduct = products.find((product) => product.sku === inboundForm.sku);
    if (!targetProduct) return;

    const quantity = Number(inboundForm.quantity);
    if (!quantity || quantity <= 0) return;

    setProducts((current) =>
      current.map((product) =>
        product.sku === inboundForm.sku ? { ...product, stock: product.stock + quantity } : product
      )
    );

    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      sku: inboundForm.sku,
      quantity,
      warehouse: targetProduct.warehouse,
      supplier: inboundForm.supplier,
    };

    setInboundHistory((current) => [newEntry, ...current]);
    setAuditLog((current) => [`${new Date().toLocaleString()} - Inbound stock updated for ${inboundForm.sku}.`, ...current]);
    setInboundForm({ ...inboundForm, quantity: 25 });
  };

  const handleOutbound = (event) => {
    event.preventDefault();
    const targetProduct = products.find((product) => product.sku === outboundForm.sku);
    if (!targetProduct) return;

    const quantity = Number(outboundForm.quantity);
    if (!quantity || quantity <= 0 || quantity > targetProduct.stock) return;

    setProducts((current) =>
      current.map((product) =>
        product.sku === outboundForm.sku ? { ...product, stock: product.stock - quantity } : product
      )
    );

    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      sku: outboundForm.sku,
      quantity,
      warehouse: targetProduct.warehouse,
      customer: outboundForm.customer,
    };

    setOutboundHistory((current) => [newEntry, ...current]);
    setAuditLog((current) => [`${new Date().toLocaleString()} - Outbound stock updated for ${outboundForm.sku}.`, ...current]);
    setOutboundForm({ ...outboundForm, quantity: 10 });
  };

  const handleStockTake = (event) => {
    event.preventDefault();
    const targetProduct = products.find((product) => product.sku === stockTakeForm.sku);
    if (!targetProduct) return;

    const count = Number(stockTakeForm.count);
    const variance = count - targetProduct.stock;
    setProducts((current) =>
      current.map((product) =>
        product.sku === stockTakeForm.sku ? { ...product, stock: count } : product
      )
    );

    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      sku: stockTakeForm.sku,
      before: targetProduct.stock,
      after: count,
      variance,
    };

    setStockTakeHistory((current) => [newEntry, ...current]);
    setAuditLog((current) => [`${new Date().toLocaleString()} - Stock take updated for ${stockTakeForm.sku}.`, ...current]);
    setStockTakeForm({ ...stockTakeForm, count: targetProduct.stock });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">W</div>
          <div>
            <p className="eyebrow">Enterprise</p>
            <h1>Warehouse</h1>
          </div>
        </div>

        <nav className="nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              className={item === activePage ? 'nav-button active' : 'nav-button'}
              onClick={() => setActivePage(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="side-panel">
          <p className="small-label">Warehouse filter</p>
          <select value={selectedWarehouse} onChange={(event) => setSelectedWarehouse(event.target.value)}>
            <option value="all">All warehouses</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse} value={warehouse}>{warehouse}</option>
            ))}
          </select>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Operations overview</p>
            <h2>Warehouse Management System</h2>
          </div>
          <button className="primary-button">Export report</button>
        </header>

        {activePage === 'dashboard' && (
          <section className="content-grid">
            <div className="stats-grid">
              <div className="stat-card accent-blue">
                <span>Total inventory</span>
                <strong>{totalStockUnits}</strong>
                <small>Units</small>
              </div>
              <div className="stat-card accent-green">
                <span>Inventory value</span>
                <strong>{formatMoney(totalInventoryValue)}</strong>
                <small>Estimated value</small>
              </div>
              <div className="stat-card accent-orange">
                <span>Low stock</span>
                <strong>{lowStockProducts}</strong>
                <small>Items</small>
              </div>
              <div className="stat-card accent-purple">
                <span>Monthly flow</span>
                <strong>{inboundTotal - outboundTotal}</strong>
                <small>Net units</small>
              </div>
            </div>

            <div className="panel-row">
              <div className="panel">
                <div className="panel-header">
                  <h3>Inventory status</h3>
                </div>
                <div className="mini-chart">
                  {products.map((product) => (
                    <div key={product.id} className="chart-row">
                      <span>{product.sku}</span>
                      <div className="chart-track">
                        <div className="chart-fill" style={{ width: `${Math.min(product.stock / 150 * 100, 100)}%` }} />
                      </div>
                      <strong>{product.stock}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <h3>Audit log</h3>
                </div>
                <ul className="log-list">
                  {auditLog.map((entry, index) => (
                    <li key={`${entry}-${index}`}>{entry}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {activePage === 'inventory' && (
          <section className="panel">
            <div className="panel-header">
              <h3>Inventory list</h3>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Item</th>
                    <th>Warehouse</th>
                    <th>Location</th>
                    <th>Stock</th>
                    <th>Min</th>
                    <th>Unit price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.sku}</td>
                      <td>{product.name}</td>
                      <td>{product.warehouse}</td>
                      <td>{product.location}</td>
                      <td>{product.stock}</td>
                      <td>{product.minStock}</td>
                      <td>{formatMoney(product.unitPrice)}</td>
                      <td>
                        <span className={product.stock <= product.minStock ? 'status critical' : 'status ok'}>
                          {product.stock <= product.minStock ? 'Low stock' : 'Healthy'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activePage === 'inbound' && (
          <section className="panel form-panel">
            <div className="panel-header">
              <h3>Inbound stock</h3>
            </div>
            <form onSubmit={handleInbound} className="form-grid">
              <label>
                SKU
                <select value={inboundForm.sku} onChange={(event) => setInboundForm({ ...inboundForm, sku: event.target.value })}>
                  {products.map((product) => (
                    <option key={product.id} value={product.sku}>{product.sku}</option>
                  ))}
                </select>
              </label>
              <label>
                Quantity
                <input
                  type="number"
                  min="1"
                  value={inboundForm.quantity}
                  onChange={(event) => setInboundForm({ ...inboundForm, quantity: event.target.value })}
                />
              </label>
              <label>
                Supplier
                <input
                  type="text"
                  value={inboundForm.supplier}
                  onChange={(event) => setInboundForm({ ...inboundForm, supplier: event.target.value })}
                />
              </label>
              <button type="submit" className="primary-button">Confirm inbound</button>
            </form>
            <div className="history-block">
              <h4>Recent inbound</h4>
              <ul>
                {inboundHistory.map((entry) => (
                  <li key={entry.id}>{entry.date} - {entry.sku} +{entry.quantity} ({entry.warehouse})</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {activePage === 'outbound' && (
          <section className="panel form-panel">
            <div className="panel-header">
              <h3>Outbound stock</h3>
            </div>
            <form onSubmit={handleOutbound} className="form-grid">
              <label>
                SKU
                <select value={outboundForm.sku} onChange={(event) => setOutboundForm({ ...outboundForm, sku: event.target.value })}>
                  {products.map((product) => (
                    <option key={product.id} value={product.sku}>{product.sku}</option>
                  ))}
                </select>
              </label>
              <label>
                Quantity
                <input
                  type="number"
                  min="1"
                  value={outboundForm.quantity}
                  onChange={(event) => setOutboundForm({ ...outboundForm, quantity: event.target.value })}
                />
              </label>
              <label>
                Customer
                <input
                  type="text"
                  value={outboundForm.customer}
                  onChange={(event) => setOutboundForm({ ...outboundForm, customer: event.target.value })}
                />
              </label>
              <button type="submit" className="primary-button">Confirm outbound</button>
            </form>
            <div className="history-block">
              <h4>Recent outbound</h4>
              <ul>
                {outboundHistory.map((entry) => (
                  <li key={entry.id}>{entry.date} - {entry.sku} -{entry.quantity} ({entry.customer})</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {activePage === 'stocktake' && (
          <section className="panel form-panel">
            <div className="panel-header">
              <h3>Stock take</h3>
            </div>
            <form onSubmit={handleStockTake} className="form-grid">
              <label>
                SKU
                <select value={stockTakeForm.sku} onChange={(event) => setStockTakeForm({ ...stockTakeForm, sku: event.target.value })}>
                  {products.map((product) => (
                    <option key={product.id} value={product.sku}>{product.sku}</option>
                  ))}
                </select>
              </label>
              <label>
                Counted quantity
                <input
                  type="number"
                  min="0"
                  value={stockTakeForm.count}
                  onChange={(event) => setStockTakeForm({ ...stockTakeForm, count: event.target.value })}
                />
              </label>
              <label>
                Note
                <input
                  type="text"
                  value={stockTakeForm.note}
                  onChange={(event) => setStockTakeForm({ ...stockTakeForm, note: event.target.value })}
                />
              </label>
              <button type="submit" className="primary-button">Record stock take</button>
            </form>
            <div className="history-block">
              <h4>Recent stock take</h4>
              <ul>
                {stockTakeHistory.map((entry) => (
                  <li key={entry.id}>{entry.date} - {entry.sku}: {entry.before} → {entry.after} ({entry.variance >= 0 ? '+' : ''}{entry.variance})</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {activePage === 'reports' && (
          <section className="content-grid">
            <div className="panel">
              <div className="panel-header">
                <h3>Inbound vs outbound</h3>
              </div>
              <div className="report-box">
                <div>
                  <span>Inbound</span>
                  <strong>{inboundTotal} units</strong>
                </div>
                <div>
                  <span>Outbound</span>
                  <strong>{outboundTotal} units</strong>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>Warehouse summary</h3>
              </div>
              <div className="summary-list">
                {warehouses.map((warehouse) => {
                  const items = products.filter((product) => product.warehouse === warehouse);
                  const total = items.reduce((sum, item) => sum + item.stock, 0);
                  return (
                    <div key={warehouse} className="summary-row">
                      <span>{warehouse}</span>
                      <strong>{total}</strong>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
