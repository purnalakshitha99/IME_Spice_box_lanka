import { useCallback, useEffect, useState } from 'react'
import { Download, QrCode } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { formatLKR } from '../data/products'
import { api } from '../lib/api'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'

interface Dashboard {
  metrics: { totalSales: number; totalOrders: number; pendingOrders: number; completedOrders: number; customers: number; corporateOrders: number; lowStock: number; outOfStock: number; products: number }
  monthly: { month: number; sales: number; orders: number }[]
}
interface AdminOrder { _id: string; orderId: string; status: string; customerSnapshot: { name: string; email: string }; pricing: { total: number } }
interface AdminProduct { _id: string; name: string; slug: string; category: string; price: number; stock: number; images?: string[] }
const statuses = ['Order Placed', 'Payment Confirmed', 'Preparing', 'Personalizing', 'Quality Checked', 'Packed', 'Dispatched', 'Delivered', 'Cancelled']

export function AdminPage() {
  const user = useAuthStore((s) => s.user)
  const [tab, setTab] = useState<'dashboard' | 'orders' | 'products'>('dashboard')
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [qr, setQr] = useState<{ name: string; dataUrl: string } | null>(null)
  const push = useToastStore((s) => s.push)

  const load = useCallback(async () => {
    try {
      const [summary, orderData, productData] = await Promise.all([
        api<Dashboard>('/admin/dashboard'),
        api<{ orders: AdminOrder[] }>('/admin/orders'),
        api<{ products: AdminProduct[] }>('/admin/products'),
      ])
      setDashboard(summary)
      setOrders(orderData.orders)
      setProducts(productData.products)
    } catch (error) { push(error instanceof Error ? error.message : 'Admin data could not be loaded', 'error') }
  }, [push])
  useEffect(() => { if (user?.role === 'admin') void load() }, [load, user])

  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />
  const metrics = dashboard?.metrics
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm uppercase tracking-[.2em] text-forest">SpiceBox operations</p><h1 className="mt-1 font-display text-4xl text-cinnamon">Admin Dashboard</h1></div><div className="flex gap-2">{(['dashboard', 'orders', 'products'] as const).map((item) => <button key={item} onClick={() => setTab(item)} className={`rounded-full px-4 py-2 text-sm capitalize ${tab === item ? 'bg-cinnamon text-cream' : 'bg-white text-cinnamon'}`}>{item}</button>)}</div></div>
      {tab === 'dashboard' && <><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[
        ['Total sales', formatLKR(metrics?.totalSales || 0)], ['Orders', String(metrics?.totalOrders || 0)], ['Pending', String(metrics?.pendingOrders || 0)], ['Completed', String(metrics?.completedOrders || 0)], ['Customers', String(metrics?.customers || 0)], ['Corporate', String(metrics?.corporateOrders || 0)], ['Low stock', String(metrics?.lowStock || 0)], ['Products', String(metrics?.products || 0)],
      ].map(([label, value]) => <div key={label} className="rounded-2xl bg-white p-5 ring-1 ring-cinnamon/10"><p className="text-xs uppercase tracking-wider text-muted">{label}</p><p className="mt-2 font-display text-3xl text-cinnamon">{value}</p></div>)}</div><div className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-cinnamon/10"><h2 className="font-display text-2xl text-cinnamon">Monthly sales</h2><div className="mt-6 flex h-48 items-end gap-2">{dashboard?.monthly.map((month) => { const max = Math.max(...(dashboard.monthly.map((x) => x.sales)), 1); return <div key={month.month} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t bg-forest" style={{ height: `${Math.max(4, month.sales / max * 100)}%` }} /><span className="text-[10px] text-muted">{month.month}</span></div> })}</div></div></>}
      {tab === 'orders' && <div className="mt-8 overflow-x-auto rounded-2xl bg-white ring-1 ring-cinnamon/10"><table className="w-full min-w-[650px] text-left text-sm"><thead><tr className="border-b border-cinnamon/10 text-muted"><th className="p-4">Order</th><th className="p-4">Customer</th><th className="p-4">Total</th><th className="p-4">Status</th></tr></thead><tbody>{orders.map((order) => <tr key={order._id} className="border-b border-cinnamon/5"><td className="p-4 font-medium">{order.orderId}</td><td className="p-4">{order.customerSnapshot.name}<span className="block text-xs text-muted">{order.customerSnapshot.email}</span></td><td className="p-4">{formatLKR(order.pricing.total)}</td><td className="p-4"><select value={order.status} onChange={async (event) => { const status = event.target.value; try { const result = await api<{ order: AdminOrder }>(`/admin/orders/${order._id}/status`, { method: 'PATCH', json: { status } }); setOrders((all) => all.map((item) => item._id === order._id ? result.order : item)); push('Order status updated.') } catch (error) { push(error instanceof Error ? error.message : 'Update failed', 'error') } }} className="rounded-lg border border-cinnamon/15 bg-cream px-3 py-2">{statuses.map((status) => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div>}
      {tab === 'products' && <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <article key={product._id} className="rounded-2xl bg-white p-4 ring-1 ring-cinnamon/10"><img src={product.images?.[0] || '/products/gift-taste.jpg'} alt="" className="aspect-video w-full rounded-xl object-cover" /><h2 className="mt-3 font-display text-xl text-cinnamon">{product.name}</h2><p className="text-sm text-muted">{product.category} · {formatLKR(product.price)} · Stock {product.stock}</p><Button size="sm" variant="outline" className="mt-4" onClick={async () => { try { const result = await api<{ dataUrl: string }>(`/admin/products/${product._id}/qr`, { method: 'POST', json: { baseUrl: window.location.origin } }); setQr({ name: product.slug, dataUrl: result.dataUrl }) } catch (error) { push(error instanceof Error ? error.message : 'QR generation failed', 'error') } }}><QrCode className="h-4 w-4" />Generate QR</Button></article>)}</div>}
      {qr && <div className="fixed inset-0 z-[70] grid place-items-center bg-cinnamon/70 p-4" onClick={() => setQr(null)}><div className="rounded-3xl bg-cream p-6 text-center" onClick={(event) => event.stopPropagation()}><img src={qr.dataUrl} alt="Generated QR" className="mx-auto h-64 w-64" /><a href={qr.dataUrl} download={`${qr.name}-qr.png`} className="mt-5 inline-flex items-center gap-2 rounded-full bg-cinnamon px-5 py-2.5 text-sm text-cream"><Download className="h-4 w-4" />Download PNG</a></div></div>}
    </div>
  )
}
