import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadBus, fetchBusData } from '../redux/BusSlice';
import { BusSearchmethod } from '../redux/BusSearchSlice';
import swal from 'sweetalert';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

/* ─── Shared portal positioner ──────────────────────────────────────────── */
const Portal = ({ triggerRef, open, minWidth, children }) => {
  const [style, setStyle] = useState({});

  const reposition = () => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setStyle({
      position : 'fixed',
      top      : r.bottom + 8,
      left     : r.left,
      minWidth : minWidth || r.width,
      zIndex   : 9999,
    });
  };

  useEffect(() => {
    if (!open) return;
    reposition();
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    return () => {
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;
  return ReactDOM.createPortal(<div style={style}>{children}</div>, document.body);
};

/* ─── Station Dropdown ───────────────────────────────────────────────────── */
const StationDropdown = ({ value, onChange, stations, placeholder, label, icon, iconBg, error }) => {
  const [open, setOpen]           = useState(false);
  const [query, setQuery]         = useState('');
  const [highlighted, setHl]      = useState(0);
  const triggerRef  = useRef(null);
  const containerRef= useRef(null);
  const inputRef    = useRef(null);
  const listRef     = useRef(null);

  const filtered = query.trim()
    ? stations.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : stations;

  useEffect(() => {
    const h = (e) => {
      if (containerRef.current?.contains(e.target)) return;
      if (e.target.closest('[data-station-panel]')) return;
      setOpen(false); setQuery('');
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => { setHl(0); }, [query]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.querySelector(`[data-idx="${highlighted}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [highlighted]);

  const open_ = () => { setOpen(true); setQuery(''); setTimeout(() => inputRef.current?.focus(), 30); };
  const close_ = () => { setOpen(false); setQuery(''); };
  const select = (s) => { onChange(s); close_(); };
  const clearVal = (e) => { e.stopPropagation(); onChange(''); close_(); };

  const onKey = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHl(h => Math.min(h+1, filtered.length-1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHl(h => Math.max(h-1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (filtered[highlighted]) select(filtered[highlighted]); }
    else if (e.key === 'Escape') close_();
  };

  return (
    <div ref={containerRef} className="relative flex-1 min-w-0">
      <button
        ref={triggerRef} type="button"
        onClick={open ? close_ : open_}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left
          ${open ? 'bg-primary-50 ring-2 ring-primary-400 ring-inset' : 'hover:bg-surface-50'}
          ${error && !open ? 'ring-2 ring-red-400 ring-inset' : ''}`}
      >
        <div className={`flex-shrink-0 w-9 h-9 rounded-full ${iconBg} flex items-center justify-center`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-0.5">{label}</p>
          {value
            ? <p className="text-sm font-bold text-surface-900 truncate">{value}</p>
            : <p className="text-sm font-medium text-surface-400 truncate">{placeholder}</p>}
          {error && !open && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
        </div>
        <div className="flex-shrink-0 flex items-center gap-1">
          {value && (
            <span role="button" tabIndex={-1} onMouseDown={clearVal}
              className="w-5 h-5 rounded-full bg-surface-200 hover:bg-red-100 flex items-center justify-center text-surface-400 hover:text-red-500 transition-colors">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </span>
          )}
          <svg className={`w-4 h-4 text-surface-400 transition-transform duration-200 ${open ? 'rotate-180':''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </button>

      <Portal triggerRef={triggerRef} open={open}>
        <div data-station-panel="true" className="bg-white rounded-2xl border border-surface-200 overflow-hidden"
          style={{ boxShadow:'0 20px 60px -10px rgba(0,0,0,0.22),0 4px 16px -4px rgba(0,0,0,0.10)' }}>
          {/* search */}
          <div className="p-3 border-b border-surface-100">
            <div className="flex items-center gap-2 px-3 py-2 bg-surface-50 rounded-xl">
              <svg className="w-4 h-4 text-surface-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input ref={inputRef} type="text" value={query}
                onChange={e => setQuery(e.target.value)} onKeyDown={onKey}
                placeholder={`Search ${label.toLowerCase()} station…`}
                className="flex-1 bg-transparent text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none"/>
              {query && (
                <button type="button" onMouseDown={() => setQuery('')} className="text-surface-400 hover:text-surface-600">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
          {/* list */}
          <ul ref={listRef} className="max-h-52 overflow-y-auto py-1.5" role="listbox">
            {filtered.length > 0 ? filtered.map((station, idx) => {
              const isSel = station === value;
              const isHl  = idx === highlighted;
              const lq = query.toLowerCase();
              const ls = station.toLowerCase();
              const mi = lq ? ls.indexOf(lq) : -1;
              return (
                <li key={station} data-idx={idx} role="option" aria-selected={isSel}
                  onMouseEnter={() => setHl(idx)} onMouseDown={() => select(station)}
                  className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors duration-75
                    ${isHl || isSel ? 'bg-primary-50' : 'hover:bg-surface-50'}`}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isSel ? 'bg-primary-500':'bg-surface-300'}`}/>
                  <span className="text-sm flex-1 min-w-0 truncate">
                    {mi !== -1 && query ? (
                      <>
                        <span className="text-surface-500">{station.slice(0,mi)}</span>
                        <span className="font-bold text-primary-700">{station.slice(mi, mi+query.length)}</span>
                        <span className="text-surface-500">{station.slice(mi+query.length)}</span>
                      </>
                    ) : (
                      <span className={isSel ? 'font-semibold text-primary-700':'text-surface-700'}>{station}</span>
                    )}
                  </span>
                  {isSel && (
                    <svg className="w-4 h-4 text-primary-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  )}
                </li>
              );
            }) : (
              <li className="px-4 py-8 text-center">
                <svg className="w-8 h-8 text-surface-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p className="text-sm text-surface-400">No stations match <strong>"{query}"</strong></p>
              </li>
            )}
          </ul>
          {/* hints */}
          <div className="px-4 py-2 border-t border-surface-100 bg-surface-50 flex items-center gap-3">
            {[['↑↓','navigate'],['↵','select'],['Esc','close']].map(([k,h]) => (
              <span key={k} className="flex items-center gap-1 text-xs text-surface-400">
                <kbd className="px-1.5 py-0.5 bg-white border border-surface-200 rounded font-mono text-xs">{k}</kbd>{h}
              </span>
            ))}
          </div>
        </div>
      </Portal>
    </div>
  );
};

/* ─── Calendar Picker ────────────────────────────────────────────────────── */
const CalendarPicker = ({ value, onChange, error }) => {
  const [open, setOpen]       = useState(false);
  const [viewYear, setVY]     = useState(() => value ? parseInt(value.split('-')[0]) : new Date().getFullYear());
  const [viewMonth, setVM]    = useState(() => value ? parseInt(value.split('-')[1]) - 1 : new Date().getMonth());
  const [mode, setMode]       = useState('day'); // 'day' | 'month' | 'year'
  const triggerRef  = useRef(null);
  const containerRef= useRef(null);

  const today    = new Date(); today.setHours(0,0,0,0);
  const todayStr = today.toISOString().split('T')[0];

  // parse selected (kept for potential future use)
  // eslint-disable-next-line no-unused-vars
  const selDate = value ? new Date(value + 'T00:00:00') : null;

  // sync view when value changes externally
  useEffect(() => {
    if (value) {
      setVY(parseInt(value.split('-')[0]));
      setVM(parseInt(value.split('-')[1]) - 1);
    }
  }, [value]);

  // close on outside click
  useEffect(() => {
    const h = (e) => {
      if (containerRef.current?.contains(e.target)) return;
      if (e.target.closest('[data-cal-panel]')) return;
      setOpen(false); setMode('day');
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const open_ = () => { setOpen(true); setMode('day'); };
  const close_ = () => { setOpen(false); setMode('day'); };

  /* ── helpers ── */
  const daysInMonth = (y, m) => new Date(y, m+1, 0).getDate();
  const firstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const toStr = (y, m, d) => {
    const mm = String(m+1).padStart(2,'0');
    const dd = String(d).padStart(2,'0');
    return `${y}-${mm}-${dd}`;
  };

  const isPast = (y, m, d) => {
    const t = new Date(y, m, d); t.setHours(0,0,0,0);
    return t < today;
  };

  const isSelected = (y, m, d) => value === toStr(y, m, d);
  const isToday    = (y, m, d) => todayStr === toStr(y, m, d);

  const selectDay = (d) => {
    if (isPast(viewYear, viewMonth, d)) return;
    onChange(toStr(viewYear, viewMonth, d));
    close_();
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setVM(11); setVY(y => y-1); }
    else setVM(m => m-1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setVM(0); setVY(y => y+1); }
    else setVM(m => m+1);
  };

  /* ── display label ── */
  const displayLabel = value
    ? new Date(value + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
    : null;

  /* ── year range for year picker ── */
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  /* ── build calendar grid ── */
  const totalDays  = daysInMonth(viewYear, viewMonth);
  const startDay   = firstDayOfMonth(viewYear, viewMonth);
  const cells      = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div ref={containerRef} className="flex-shrink-0 lg:w-48">
      {/* Trigger */}
      <button
        ref={triggerRef} type="button" onClick={open ? close_ : open_}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left
          ${open ? 'bg-primary-50 ring-2 ring-primary-400 ring-inset' : 'hover:bg-surface-50'}
          ${error && !open ? 'ring-2 ring-red-400 ring-inset' : ''}`}
      >
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-0.5">Date</p>
          {displayLabel
            ? <p className="text-sm font-bold text-surface-900 truncate">{displayLabel}</p>
            : <p className="text-sm font-medium text-surface-400">Pick a date</p>}
          {error && !open && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
        </div>
        {value && (
          <span role="button" tabIndex={-1}
            onMouseDown={e => { e.stopPropagation(); onChange(''); }}
            className="w-5 h-5 rounded-full bg-surface-200 hover:bg-red-100 flex items-center justify-center text-surface-400 hover:text-red-500 transition-colors flex-shrink-0">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </span>
        )}
      </button>

      {/* Calendar portal */}
      <Portal triggerRef={triggerRef} open={open} minWidth={300}>
        <div data-cal-panel="true" className="bg-white rounded-2xl border border-surface-200 overflow-hidden select-none"
          style={{ width:300, boxShadow:'0 20px 60px -10px rgba(0,0,0,0.22),0 4px 16px -4px rgba(0,0,0,0.10)' }}>

          {/* ── Header ── */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-4 pt-4 pb-5">
            <p className="text-xs font-semibold text-primary-200 uppercase tracking-wider mb-1">Travel Date</p>
            {displayLabel
              ? <p className="text-xl font-bold text-white">{displayLabel}</p>
              : <p className="text-xl font-bold text-primary-200">Select a date</p>}
          </div>

          {/* ── Day view ── */}
          {mode === 'day' && (
            <div className="p-3">
              {/* Month / Year nav */}
              <div className="flex items-center justify-between mb-3">
                <button type="button" onMouseDown={prevMonth}
                  className="w-8 h-8 rounded-lg hover:bg-surface-100 flex items-center justify-center text-surface-500 hover:text-surface-800 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>

                <div className="flex items-center gap-1">
                  <button type="button" onMouseDown={() => setMode('month')}
                    className="px-2 py-1 rounded-lg text-sm font-bold text-surface-800 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                    {MONTHS[viewMonth]}
                  </button>
                  <button type="button" onMouseDown={() => setMode('year')}
                    className="px-2 py-1 rounded-lg text-sm font-bold text-surface-800 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                    {viewYear}
                  </button>
                </div>

                <button type="button" onMouseDown={nextMonth}
                  className="w-8 h-8 rounded-lg hover:bg-surface-100 flex items-center justify-center text-surface-500 hover:text-surface-800 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>

              {/* Day-of-week headers */}
              <div className="grid grid-cols-7 mb-1">
                {DAYS.map(d => (
                  <div key={d} className="text-center text-xs font-semibold text-surface-400 py-1">{d}</div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-y-0.5">
                {cells.map((day, i) => {
                  if (!day) return <div key={`e-${i}`}/>;
                  const past = isPast(viewYear, viewMonth, day);
                  const sel  = isSelected(viewYear, viewMonth, day);
                  const tod  = isToday(viewYear, viewMonth, day);
                  return (
                    <button key={day} type="button" onMouseDown={() => selectDay(day)}
                      disabled={past}
                      className={`
                        h-9 w-full rounded-lg text-sm font-medium transition-all duration-100
                        ${past  ? 'text-surface-300 cursor-not-allowed' : ''}
                        ${!past && !sel ? 'text-surface-700 hover:bg-primary-50 hover:text-primary-700' : ''}
                        ${tod && !sel   ? 'ring-2 ring-primary-300 ring-inset text-primary-700 font-bold' : ''}
                        ${sel           ? 'bg-primary-600 text-white font-bold shadow-sm hover:bg-primary-700' : ''}
                      `}>
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* Today shortcut */}
              <div className="mt-3 pt-3 border-t border-surface-100 flex justify-between items-center">
                <button type="button" onMouseDown={() => { onChange(todayStr); close_(); }}
                  className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                  Today
                </button>
                {value && (
                  <button type="button" onMouseDown={() => onChange('')}
                    className="text-xs text-surface-400 hover:text-red-500 transition-colors">
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── Month picker ── */}
          {mode === 'month' && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-surface-800">Select Month</p>
                <button type="button" onMouseDown={() => setMode('day')}
                  className="text-xs text-primary-600 hover:text-primary-700 font-semibold">Back</button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {MONTHS.map((m, idx) => (
                  <button key={m} type="button"
                    onMouseDown={() => { setVM(idx); setMode('day'); }}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all duration-100
                      ${idx === viewMonth
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'bg-surface-50 text-surface-700 hover:bg-primary-50 hover:text-primary-700'}`}>
                    {m.slice(0,3)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Year picker ── */}
          {mode === 'year' && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-surface-800">Select Year</p>
                <button type="button" onMouseDown={() => setMode('day')}
                  className="text-xs text-primary-600 hover:text-primary-700 font-semibold">Back</button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {years.map(y => (
                  <button key={y} type="button"
                    onMouseDown={() => { setVY(y); setMode('day'); }}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all duration-100
                      ${y === viewYear
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'bg-surface-50 text-surface-700 hover:bg-primary-50 hover:text-primary-700'}`}>
                    {y}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Portal>
    </div>
  );
};

/* ─── Main Searching Component ───────────────────────────────────────────── */
const Searching = () => {
  const src  = useSelector(s => s.BusSearch.src);
  const dist = useSelector(s => s.BusSearch.dist);
  const date = useSelector(s => s.BusSearch.date);
  const { station } = useSelector(s => s.Bus);
  const [disabled, setDisabled] = useState(false);
  const [errors, setErrors]     = useState({ src:'', dist:'', date:'' });
  const dispatch = useDispatch();

  const validate = () => {
    const e = { src:'', dist:'', date:'' };
    let ok = true;
    if (!src)  { e.src  = 'Select a source';      ok = false; }
    if (!dist) { e.dist = 'Select a destination'; ok = false; }
    if (!date) { e.date = 'Pick a date';           ok = false; }
    setErrors(e);
    return ok;
  };

  const findBus = () => {
    if (src && dist && src === dist) { swal('Source and Destination cannot be the same'); return; }
    if (!validate()) return;
    setDisabled(true);
    dispatch(fetchBusData({ src, dist }));
    setDisabled(false);
  };

  const clearSearch = () => {
    dispatch(BusSearchmethod.clearsearch());
    dispatch(loadBus());
    setErrors({ src:'', dist:'', date:'' });
  };

  const swap = () => {
    dispatch(BusSearchmethod.Addsrc(dist));
    dispatch(BusSearchmethod.adddist(src));
  };

  return (
    <div className="relative bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 pt-10 pb-16 px-4 sm:px-6 lg:px-8">
      {/* blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full"/>
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full"/>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">Find Your Bus</h1>
          <p className="text-primary-200 text-sm sm:text-base">Search from hundreds of routes across the country</p>
        </div>

        <form onSubmit={e => { e.preventDefault(); findBus(); }}
          className="bg-white rounded-2xl shadow-2xl p-2 sm:p-3">
          <div className="flex flex-col lg:flex-row gap-1">

            {/* From */}
            <StationDropdown
              value={src}
              onChange={v => { dispatch(BusSearchmethod.Addsrc(v)); setErrors(p => ({...p, src:''})); }}
              stations={station} placeholder="Where are you from?"
              label="From" iconBg="bg-green-100" error={errors.src}
              icon={
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              }
            />

            {/* Swap desktop */}
            <div className="hidden lg:flex items-center justify-center flex-shrink-0 px-1">
              <div className="relative">
                <div className="w-px h-14 bg-surface-200"/>
                <button type="button" onClick={swap} title="Swap stations"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-2 border-surface-200 hover:border-primary-400 hover:bg-primary-50 flex items-center justify-center text-surface-500 hover:text-primary-600 transition-all duration-150 shadow-sm">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Swap mobile */}
            <div className="lg:hidden flex justify-center py-1">
              <button type="button" onClick={swap}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-100 hover:bg-primary-50 text-xs font-medium text-surface-600 hover:text-primary-600 transition-all duration-150">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
                </svg>
                Swap
              </button>
            </div>

            {/* To */}
            <StationDropdown
              value={dist}
              onChange={v => { dispatch(BusSearchmethod.adddist(v)); setErrors(p => ({...p, dist:''})); }}
              stations={station} placeholder="Where are you going?"
              label="To" iconBg="bg-red-100" error={errors.dist}
              icon={
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                </svg>
              }
            />

            {/* Divider */}
            <div className="hidden lg:flex items-center flex-shrink-0 px-1">
              <div className="w-px h-14 bg-surface-200"/>
            </div>

            {/* Calendar */}
            <CalendarPicker
              value={date}
              onChange={v => { dispatch(BusSearchmethod.addate(v)); setErrors(p => ({...p, date:''})); }}
              error={errors.date}
            />

            {/* Search */}
            <div className="flex-shrink-0 flex items-stretch p-1">
              <button type="submit" disabled={disabled}
                className="w-full lg:w-auto px-6 py-3 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <span className="lg:hidden xl:inline">Search</span>
              </button>
            </div>
          </div>
        </form>

        {/* Bottom bar */}
        <div className="flex items-center justify-between mt-4 px-1">
          <div className="flex items-center gap-4">
            {[{icon:'🛡️',text:'Safe & Verified'},{icon:'⚡',text:'Instant Booking'},{icon:'💳',text:'No Hidden Fees'}].map(item => (
              <span key={item.text} className="hidden sm:flex items-center gap-1.5 text-xs text-primary-200">
                <span>{item.icon}</span>{item.text}
              </span>
            ))}
          </div>
          {(src || dist || date) && (
            <button type="button" onClick={clearSearch}
              className="flex items-center gap-1.5 text-xs text-primary-200 hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Clear search
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Searching;
