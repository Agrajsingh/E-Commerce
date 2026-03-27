import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../lib/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Food', 'Other'];

export default function ProductCatalogPage() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.get('search') || '');
  const [category, setCategory] = useState(params.get('category') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.set('search', search);
      if (category) q.set('category', category);
      if (minPrice) q.set('minPrice', minPrice);
      if (maxPrice) q.set('maxPrice', maxPrice);
      q.set('page', page);
      const { data } = await api.get(`/products?${q}`);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } finally { setLoading(false); }
  }, [search, category, minPrice, maxPrice, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const clearFilters = () => { setSearch(''); setCategory(''); setMinPrice(''); setMaxPrice(''); setPage(1); };

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold mb-6">All Products <span className="text-gray-400 font-normal text-lg">({total})</span></h1>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters sidebar */}
        <aside className="lg:w-64 shrink-0">
          <div className="card sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2"><SlidersHorizontal size={16}/> Filters</h3>
              <button onClick={clearFilters} className="text-xs text-primary-600 hover:underline flex items-center gap-1"><X size={12}/> Clear</button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="label">Search</label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-2.5 text-gray-400"/>
                  <input className="input pl-8 text-sm" placeholder="Search products..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}/>
                </div>
              </div>
              <div>
                <label className="label">Category</label>
                <select className="input text-sm" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
                  <option value="">All Categories</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Price Range (₹)</label>
                <div className="flex gap-2">
                  <input className="input text-sm" type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)}/>
                  <input className="input text-sm" type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}/>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          {loading ? <Loader/> : products.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Search size={48} className="mx-auto mb-4 text-gray-300"/>
              <p className="text-lg font-semibold">No products found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map(p => <ProductCard key={p._id} product={p}/>)}
              </div>
              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: pages }).map((_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)}
                      className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${page === i+1 ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 hover:border-primary-400'}`}>
                      {i+1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
