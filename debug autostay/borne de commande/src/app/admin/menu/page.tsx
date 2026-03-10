'use client'

import { useState, useEffect } from 'react'

interface Category {
  id: string
  slug: string
  name: string
  nameFr: string
  nameEn: string
  nameDe: string
  icon: string
  sortOrder: number
  active: boolean
}

interface Product {
  id: string
  slug: string
  name: string
  description: string
  price: number
  priceWithFrites: number | null
  hasProteinChoice: boolean
  veganAvailable: boolean
  isNew: boolean
  isGourmet: boolean
  hasSupplements: boolean
  hasSauceChoice: boolean
  includesFrites: boolean
  active: boolean
  sortOrder: number
  category: string
}

interface Supplement {
  id: string
  slug: string
  name: string
  price: number
  active: boolean
}

interface Sauce {
  id: string
  slug: string
  name: string
  price: number
  active: boolean
}

type Tab = 'products' | 'categories' | 'supplements' | 'sauces'

const emptyProduct = {
  name: '', slug: '', description: '', price: 0, priceWithFrites: null as number | null,
  category: 'burgers', hasProteinChoice: false, veganAvailable: false, isNew: false,
  isGourmet: false, hasSupplements: false, hasSauceChoice: false, includesFrites: false,
}

const emptyCategory = {
  name: '', slug: '', nameFr: '', nameEn: '', nameDe: '', icon: '', sortOrder: 0,
}

const emptySupplement = { name: '', slug: '', price: 0 }
const emptySauce = { name: '', slug: '', price: 0 }

export default function AdminMenu() {
  const [tab, setTab] = useState<Tab>('products')
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [supplements, setSupplements] = useState<Supplement[]>([])
  const [sauces, setSauces] = useState<Sauce[]>([])
  const [filterCategory, setFilterCategory] = useState('')
  const [message, setMessage] = useState('')

  // Modal states
  const [editingProduct, setEditingProduct] = useState<any | null>(null)
  const [editingCategory, setEditingCategory] = useState<any | null>(null)
  const [editingSupplement, setEditingSupplement] = useState<any | null>(null)
  const [editingSauce, setEditingSauce] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)

  const reload = () => {
    fetch('/api/admin/menu')
      .then((r) => r.json())
      .then((data) => {
        setCategories(data.categories)
        setProducts(data.products)
        setSupplements(data.supplements)
        setSauces(data.sauces)
      })
      .catch(console.error)
  }

  useEffect(() => { reload() }, [])

  const showMessage = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const api = async (url: string, method: string, body?: any) => {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      ...(body && { body: JSON.stringify(body) }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erreur serveur' }))
      throw new Error(err.error || 'Erreur')
    }
    return res.json()
  }

  // ─── Products ───
  const saveProduct = async () => {
    if (!editingProduct) return
    setSaving(true)
    try {
      if (editingProduct.id) {
        await api(`/api/admin/products/${editingProduct.id}`, 'PATCH', editingProduct)
      } else {
        await api('/api/admin/products', 'POST', editingProduct)
      }
      reload()
      setEditingProduct(null)
      showMessage(editingProduct.id ? 'Produit modifie' : 'Produit cree')
    } catch (e: any) {
      showMessage(e.message)
    } finally { setSaving(false) }
  }

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Supprimer "${name}" ?`)) return
    try {
      await api(`/api/admin/products/${id}`, 'DELETE')
      reload()
      showMessage('Produit supprime')
    } catch (e: any) { showMessage(e.message) }
  }

  const toggleProduct = async (product: Product) => {
    try {
      await api(`/api/admin/products/${product.id}`, 'PATCH', { active: !product.active })
      setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, active: !p.active } : p))
    } catch { showMessage('Erreur') }
  }

  // ─── Categories ───
  const saveCategory = async () => {
    if (!editingCategory) return
    setSaving(true)
    try {
      if (editingCategory.id) {
        await api(`/api/admin/categories/${editingCategory.id}`, 'PATCH', editingCategory)
      } else {
        await api('/api/admin/categories', 'POST', editingCategory)
      }
      reload()
      setEditingCategory(null)
      showMessage(editingCategory.id ? 'Categorie modifiee' : 'Categorie creee')
    } catch (e: any) { showMessage(e.message) }
    finally { setSaving(false) }
  }

  const deleteCategory = async (id: string, name: string) => {
    if (!confirm(`Supprimer la categorie "${name}" ? Les produits associes seront aussi supprimes.`)) return
    try {
      await api(`/api/admin/categories/${id}`, 'DELETE')
      reload()
      showMessage('Categorie supprimee')
    } catch (e: any) { showMessage(e.message) }
  }

  // ─── Supplements ───
  const saveSupplement = async () => {
    if (!editingSupplement) return
    setSaving(true)
    try {
      if (editingSupplement.id) {
        await api(`/api/admin/supplements/${editingSupplement.id}`, 'PATCH', editingSupplement)
      } else {
        await api('/api/admin/supplements', 'POST', editingSupplement)
      }
      reload()
      setEditingSupplement(null)
      showMessage(editingSupplement.id ? 'Supplement modifie' : 'Supplement cree')
    } catch (e: any) { showMessage(e.message) }
    finally { setSaving(false) }
  }

  const deleteSupplement = async (id: string, name: string) => {
    if (!confirm(`Supprimer "${name}" ?`)) return
    try {
      await api(`/api/admin/supplements/${id}`, 'DELETE')
      reload()
      showMessage('Supplement supprime')
    } catch (e: any) { showMessage(e.message) }
  }

  // ─── Sauces ───
  const saveSauce = async () => {
    if (!editingSauce) return
    setSaving(true)
    try {
      if (editingSauce.id) {
        await api(`/api/admin/sauces/${editingSauce.id}`, 'PATCH', editingSauce)
      } else {
        await api('/api/admin/sauces', 'POST', editingSauce)
      }
      reload()
      setEditingSauce(null)
      showMessage(editingSauce.id ? 'Sauce modifiee' : 'Sauce creee')
    } catch (e: any) { showMessage(e.message) }
    finally { setSaving(false) }
  }

  const deleteSauce = async (id: string, name: string) => {
    if (!confirm(`Supprimer "${name}" ?`)) return
    try {
      await api(`/api/admin/sauces/${id}`, 'DELETE')
      reload()
      showMessage('Sauce supprimee')
    } catch (e: any) { showMessage(e.message) }
  }

  const filteredProducts = filterCategory
    ? products.filter((p) => p.category === filterCategory)
    : products

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'products', label: 'Produits', count: products.length },
    { key: 'categories', label: 'Categories', count: categories.length },
    { key: 'supplements', label: 'Supplements', count: supplements.length },
    { key: 'sauces', label: 'Sauces', count: sauces.length },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
        <div className="flex items-center gap-3">
          {message && (
            <div className={`px-4 py-2 rounded-lg text-sm ${message.includes('Erreur') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message}</div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            if (tab === 'products') setEditingProduct({ ...emptyProduct, category: categories[0]?.slug || 'burgers' })
            else if (tab === 'categories') setEditingCategory({ ...emptyCategory })
            else if (tab === 'supplements') setEditingSupplement({ ...emptySupplement })
            else if (tab === 'sauces') setEditingSauce({ ...emptySauce })
          }}
          className="px-5 py-2 bg-fry-yellow text-fry-black rounded-lg text-sm font-bold hover:bg-fry-gold"
        >
          + Ajouter
        </button>
      </div>

      {/* ═══ PRODUCTS ═══ */}
      {tab === 'products' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white"
            >
              <option value="">Toutes les categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-100">
                <th className="px-4 py-3">Produit</th>
                <th className="px-4 py-3">Categorie</th>
                <th className="px-4 py-3">Prix</th>
                <th className="px-4 py-3">+Frites</th>
                <th className="px-4 py-3">Options</th>
                <th className="px-4 py-3">Actif</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const cat = categories.find((c) => c.slug === product.category)
                return (
                  <tr key={product.id} className={`border-b border-gray-50 hover:bg-gray-50 ${!product.active ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-sm">{product.name}</div>
                      <div className="text-xs text-gray-400">{product.description.slice(0, 40)}...</div>
                    </td>
                    <td className="px-4 py-3 text-sm">{cat ? `${cat.icon} ${cat.name}` : product.category}</td>
                    <td className="px-4 py-3 font-medium text-sm">{product.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{product.priceWithFrites ? product.priceWithFrites.toFixed(2) : '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {product.hasProteinChoice && <Badge label="Proteine" />}
                        {product.hasSupplements && <Badge label="Suppl." />}
                        {product.hasSauceChoice && <Badge label="Sauce" />}
                        {product.isNew && <Badge label="New" color="green" />}
                        {product.isGourmet && <Badge label="Gourmet" color="yellow" />}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Toggle active={product.active} onClick={() => toggleProduct(product)} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => setEditingProduct({ ...product })} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Modifier</button>
                        <button onClick={() => deleteProduct(product.id, product.name)} className="text-red-500 hover:text-red-700 text-xs font-medium">Suppr.</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ═══ CATEGORIES ═══ */}
      {tab === 'categories' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-100">
                <th className="px-4 py-3">Ordre</th>
                <th className="px-4 py-3">Categorie</th>
                <th className="px-4 py-3">FR</th>
                <th className="px-4 py-3">EN</th>
                <th className="px-4 py-3">DE</th>
                <th className="px-4 py-3">Produits</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">{cat.sortOrder}</td>
                  <td className="px-4 py-3">
                    <span className="text-lg mr-2">{cat.icon}</span>
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-xs text-gray-400 ml-2">({cat.slug})</span>
                  </td>
                  <td className="px-4 py-3 text-sm">{cat.nameFr}</td>
                  <td className="px-4 py-3 text-sm">{cat.nameEn}</td>
                  <td className="px-4 py-3 text-sm">{cat.nameDe}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{products.filter((p) => p.category === cat.slug).length}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setEditingCategory({ ...cat })} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Modifier</button>
                      <button onClick={() => deleteCategory(cat.id, cat.name)} className="text-red-500 hover:text-red-700 text-xs font-medium">Suppr.</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ═══ SUPPLEMENTS ═══ */}
      {tab === 'supplements' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-100">
                <th className="px-4 py-3">Supplement</th>
                <th className="px-4 py-3">Prix</th>
                <th className="px-4 py-3">Actif</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {supplements.map((s) => (
                <tr key={s.id} className={`border-b border-gray-50 hover:bg-gray-50 ${!s.active ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-xs text-gray-400 ml-2">({s.slug})</span>
                  </td>
                  <td className="px-4 py-3">{s.price.toFixed(2)} CHF</td>
                  <td className="px-4 py-3">
                    <Toggle active={s.active} onClick={async () => {
                      try {
                        await api(`/api/admin/supplements/${s.id}`, 'PATCH', { active: !s.active })
                        setSupplements((prev) => prev.map((x) => x.id === s.id ? { ...x, active: !x.active } : x))
                      } catch { showMessage('Erreur') }
                    }} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setEditingSupplement({ ...s })} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Modifier</button>
                      <button onClick={() => deleteSupplement(s.id, s.name)} className="text-red-500 hover:text-red-700 text-xs font-medium">Suppr.</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ═══ SAUCES ═══ */}
      {tab === 'sauces' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-100">
                <th className="px-4 py-3">Sauce</th>
                <th className="px-4 py-3">Prix</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sauces.map((s) => (
                <tr key={s.id} className={`border-b border-gray-50 hover:bg-gray-50 ${!s.active ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-xs text-gray-400 ml-2">({s.slug})</span>
                  </td>
                  <td className="px-4 py-3">{s.price.toFixed(2)} CHF</td>
                  <td className="px-4 py-3">
                    <Toggle active={s.active} onClick={async () => {
                      try {
                        await api(`/api/admin/sauces/${s.id}`, 'PATCH', { active: !s.active })
                        setSauces((prev) => prev.map((x) => x.id === s.id ? { ...x, active: !x.active } : x))
                      } catch { showMessage('Erreur') }
                    }} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setEditingSauce({ ...s })} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Modifier</button>
                      <button onClick={() => deleteSauce(s.id, s.name)} className="text-red-500 hover:text-red-700 text-xs font-medium">Suppr.</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ═══ MODALS ═══ */}

      {/* Product modal */}
      {editingProduct && (
        <Modal title={editingProduct.id ? `Modifier: ${editingProduct.name}` : 'Nouveau produit'} onClose={() => setEditingProduct(null)}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nom" value={editingProduct.name} onChange={(v) => setEditingProduct({ ...editingProduct, name: v })} />
            <Field label="Slug" value={editingProduct.slug} onChange={(v) => setEditingProduct({ ...editingProduct, slug: v })} placeholder="classique" />
            <div className="col-span-2">
              <Field label="Description" value={editingProduct.description} onChange={(v) => setEditingProduct({ ...editingProduct, description: v })} />
            </div>
            <Field label="Prix (CHF)" value={String(editingProduct.price)} onChange={(v) => setEditingProduct({ ...editingProduct, price: parseFloat(v) || 0 })} type="number" />
            <Field label="Prix avec frites (CHF)" value={editingProduct.priceWithFrites != null ? String(editingProduct.priceWithFrites) : ''} onChange={(v) => setEditingProduct({ ...editingProduct, priceWithFrites: v ? parseFloat(v) : null })} type="number" placeholder="Laisser vide si non applicable" />
            <div>
              <label className="block text-xs text-gray-500 mb-1">Categorie</label>
              <select
                value={editingProduct.category}
                onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
            <Field label="Ordre" value={String(editingProduct.sortOrder || 0)} onChange={(v) => setEditingProduct({ ...editingProduct, sortOrder: parseInt(v) || 0 })} type="number" />
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <Checkbox label="Choix proteine" checked={editingProduct.hasProteinChoice} onChange={(v) => setEditingProduct({ ...editingProduct, hasProteinChoice: v })} />
            <Checkbox label="Option vegan" checked={editingProduct.veganAvailable} onChange={(v) => setEditingProduct({ ...editingProduct, veganAvailable: v })} />
            <Checkbox label="Nouveau" checked={editingProduct.isNew} onChange={(v) => setEditingProduct({ ...editingProduct, isNew: v })} />
            <Checkbox label="Gourmet" checked={editingProduct.isGourmet} onChange={(v) => setEditingProduct({ ...editingProduct, isGourmet: v })} />
            <Checkbox label="Supplements" checked={editingProduct.hasSupplements} onChange={(v) => setEditingProduct({ ...editingProduct, hasSupplements: v })} />
            <Checkbox label="Choix sauce" checked={editingProduct.hasSauceChoice} onChange={(v) => setEditingProduct({ ...editingProduct, hasSauceChoice: v })} />
            <Checkbox label="Inclut frites" checked={editingProduct.includesFrites} onChange={(v) => setEditingProduct({ ...editingProduct, includesFrites: v })} />
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={saveProduct} disabled={saving} className="px-6 py-2 bg-fry-green text-white rounded-lg text-sm font-medium hover:bg-fry-darkgreen disabled:opacity-50">
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            <button onClick={() => setEditingProduct(null)} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">Annuler</button>
          </div>
        </Modal>
      )}

      {/* Category modal */}
      {editingCategory && (
        <Modal title={editingCategory.id ? `Modifier: ${editingCategory.name}` : 'Nouvelle categorie'} onClose={() => setEditingCategory(null)}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nom" value={editingCategory.name} onChange={(v) => setEditingCategory({ ...editingCategory, name: v })} />
            <Field label="Slug" value={editingCategory.slug} onChange={(v) => setEditingCategory({ ...editingCategory, slug: v })} placeholder="burgers-speciaux" />
            <Field label="Nom FR" value={editingCategory.nameFr} onChange={(v) => setEditingCategory({ ...editingCategory, nameFr: v })} />
            <Field label="Nom EN" value={editingCategory.nameEn} onChange={(v) => setEditingCategory({ ...editingCategory, nameEn: v })} />
            <Field label="Nom DE" value={editingCategory.nameDe} onChange={(v) => setEditingCategory({ ...editingCategory, nameDe: v })} />
            <Field label="Icone (emoji)" value={editingCategory.icon} onChange={(v) => setEditingCategory({ ...editingCategory, icon: v })} placeholder="🍔" />
            <Field label="Ordre" value={String(editingCategory.sortOrder)} onChange={(v) => setEditingCategory({ ...editingCategory, sortOrder: parseInt(v) || 0 })} type="number" />
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={saveCategory} disabled={saving} className="px-6 py-2 bg-fry-green text-white rounded-lg text-sm font-medium hover:bg-fry-darkgreen disabled:opacity-50">
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            <button onClick={() => setEditingCategory(null)} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">Annuler</button>
          </div>
        </Modal>
      )}

      {/* Supplement modal */}
      {editingSupplement && (
        <Modal title={editingSupplement.id ? `Modifier: ${editingSupplement.name}` : 'Nouveau supplement'} onClose={() => setEditingSupplement(null)}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nom" value={editingSupplement.name} onChange={(v) => setEditingSupplement({ ...editingSupplement, name: v })} />
            <Field label="Slug" value={editingSupplement.slug} onChange={(v) => setEditingSupplement({ ...editingSupplement, slug: v })} placeholder="cheddar" />
            <Field label="Prix (CHF)" value={String(editingSupplement.price)} onChange={(v) => setEditingSupplement({ ...editingSupplement, price: parseFloat(v) || 0 })} type="number" />
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={saveSupplement} disabled={saving} className="px-6 py-2 bg-fry-green text-white rounded-lg text-sm font-medium hover:bg-fry-darkgreen disabled:opacity-50">
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            <button onClick={() => setEditingSupplement(null)} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">Annuler</button>
          </div>
        </Modal>
      )}

      {/* Sauce modal */}
      {editingSauce && (
        <Modal title={editingSauce.id ? `Modifier: ${editingSauce.name}` : 'Nouvelle sauce'} onClose={() => setEditingSauce(null)}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nom" value={editingSauce.name} onChange={(v) => setEditingSauce({ ...editingSauce, name: v })} />
            <Field label="Slug" value={editingSauce.slug} onChange={(v) => setEditingSauce({ ...editingSauce, slug: v })} placeholder="cocktail" />
            <Field label="Prix (CHF)" value={String(editingSauce.price)} onChange={(v) => setEditingSauce({ ...editingSauce, price: parseFloat(v) || 0 })} type="number" />
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={saveSauce} disabled={saving} className="px-6 py-2 bg-fry-green text-white rounded-lg text-sm font-medium hover:bg-fry-darkgreen disabled:opacity-50">
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            <button onClick={() => setEditingSauce(null)} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">Annuler</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── Reusable components ───

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">x</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input
        type={type}
        step={type === 'number' ? '0.01' : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fry-yellow"
      />
    </div>
  )
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 rounded border-gray-300" />
      {label}
    </label>
  )
}

function Toggle({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-12 h-6 rounded-full transition-colors ${active ? 'bg-green-500' : 'bg-gray-300'}`}>
      <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${active ? 'translate-x-6' : 'translate-x-0.5'}`} />
    </button>
  )
}

function Badge({ label, color = 'gray' }: { label: string; color?: string }) {
  const colors: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-600',
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
  }
  return <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${colors[color]}`}>{label}</span>
}
