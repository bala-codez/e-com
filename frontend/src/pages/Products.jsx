import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { FiFilter, FiX } from "react-icons/fi";
import api from "../api";
import ProductCard from "../components/ProductCard";
import "./Products.css";

const SORTS = [
  { value: "rating",     label: "Top Rated" },
  { value: "newest",     label: "Newest" },
  { value: "price_asc",  label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [total,      setTotal]      = useState(0);
  const [pages,      setPages]      = useState(1);
  const [loading,    setLoading]    = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const category = params.get("category") || "";
  const search   = params.get("search")   || "";
  const sort     = params.get("sort")     || "rating";
  const page     = parseInt(params.get("page") || "1");

  const set = (k, v) => {
    const n = new URLSearchParams(params);
    if (v) n.set(k, v); else n.delete(k);
    n.delete("page");
    setParams(n);
  };

  useEffect(() => {
    api.get("/products/categories").then(r => setCategories(r.data)).catch(() => {});
  }, []);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const q = new URLSearchParams({ sort, page, limit: 12 });
    if (category) q.set("category", category);
    if (search)   q.set("search",   search);
    api.get(`/products?${q}`)
      .then(r => { setProducts(r.data?.products ?? []); setTotal(r.data?.total ?? 0); setPages(r.data?.pages ?? 1); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, search, sort, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <div className="products-page page-enter">
      {/* Header */}
      <div className="prod-header container">
        <div>
          <h1>
            {search ? `Results for "${search}"` : category
              ? categories.find(c => c.slug === category)?.name || "Products"
              : "All Products"
            }
          </h1>
          <p className="prod-count">{total} items</p>
        </div>
        <div className="prod-toolbar">
          <select value={sort} onChange={e => set("sort", e.target.value)} className="sort-select">
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <button className="btn btn-outline btn-sm filter-btn" onClick={() => setFilterOpen(o => !o)}>
            <FiFilter size={14} /> Filters
          </button>
        </div>
      </div>

      {/* Active filters */}
      {(category || search) && (
        <div className="active-filters container">
          {category && (
            <span className="filter-chip">
              {categories.find(c => c.slug === category)?.name}
              <button onClick={() => set("category", "")}><FiX size={12}/></button>
            </span>
          )}
          {search && (
            <span className="filter-chip">
              "{search}"
              <button onClick={() => set("search", "")}><FiX size={12}/></button>
            </span>
          )}
        </div>
      )}

      <div className="prod-layout container">
        {/* Sidebar */}
        <aside className={`sidebar ${filterOpen ? "open" : ""}`}>
          <h3>Categories</h3>
          <ul className="cat-list">
            <li>
              <button
                className={!category ? "active" : ""}
                onClick={() => set("category", "")}
              >All Products</button>
            </li>
            {categories.map(c => (
              <li key={c.id}>
                <button
                  className={category === c.slug ? "active" : ""}
                  onClick={() => set("category", c.slug)}
                >{c.name}</button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Grid */}
        <main>
          {loading ? (
            <div className="spinner" />
          ) : products.length === 0 ? (
            <div className="empty-state">
              <p>No products found.</p>
              <button className="btn btn-outline" onClick={() => setParams({})}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>

              {pages > 1 && (
                <div className="pagination">
                  {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      className={`page-btn ${p === page ? "active" : ""}`}
                      onClick={() => { const n = new URLSearchParams(params); n.set("page", p); setParams(n); }}
                    >{p}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
