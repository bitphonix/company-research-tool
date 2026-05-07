import React from 'react';
import type { Financials, Person, ReportSections } from '../types';

interface SectionCardProps {
  title: string;
  sectionKey: keyof ReportSections;
  content: any;
  isLoading?: boolean;
}

export function SectionCard({ title, sectionKey, content, isLoading }: SectionCardProps) {
  if (isLoading) {
    return (
      <div className="double-bezel mb-8 animate-slide-up">
        <div className="double-bezel-inner p-8">
          <h3 className="font-display text-xl font-semibold text-black mb-6">{title}</h3>
          <div className="space-y-4">
            <div className="h-4 skeleton-shimmer rounded-full w-full"></div>
            <div className="h-4 skeleton-shimmer rounded-full w-5/6"></div>
            <div className="h-4 skeleton-shimmer rounded-full w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!content) return null;

  let renderedContent: React.ReactNode = null;

  if (sectionKey === 'overview') {
    renderedContent = (
      <p className="text-black/70 text-base leading-relaxed max-w-[65ch]">
        {content as string}
      </p>
    );
  } else if (sectionKey === 'key_people') {
    const people = content as Person[];
    if (people.length === 0) {
      renderedContent = <p className="text-black/40 italic text-sm">No key people identified.</p>;
    } else {
      renderedContent = (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {people.map((p, i) => (
            <li key={i} className="flex items-center gap-4 bg-black/[0.02] p-4 rounded-2xl border border-black/5 hover:-translate-y-0.5 transition-transform duration-500 ease-out">
              <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                <span className="text-black/50 font-display font-semibold text-sm">
                  {p.name.charAt(0)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-black text-sm">{p.name}</span>
                <span className="text-xs text-black/50 font-mono mt-0.5">{p.title}</span>
              </div>
            </li>
          ))}
        </ul>
      );
    }
  } else if (sectionKey === 'financials') {
    const fin = content as Financials;
    const formatFin = (val: string | null) => val || <span className="text-black/30 italic">Unknown</span>;
    renderedContent = (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Revenue', val: fin.revenue, highlight: false },
          { label: 'Employees', val: fin.employee_count, highlight: false },
          { label: 'Market Cap', val: fin.market_cap, highlight: false },
          { label: 'Growth (YoY)', val: fin.yoy_growth, highlight: true }
        ].map((stat, i) => (
          <div key={i} className="flex flex-col p-5 bg-black/[0.02] rounded-2xl border border-black/5">
            <span className="text-[10px] text-black/40 uppercase tracking-[0.15em] font-medium mb-2">{stat.label}</span>
            <span className={`font-mono font-medium text-lg ${stat.highlight && stat.val ? 'text-blue-600' : 'text-black'}`}>
              {formatFin(stat.val)}
            </span>
          </div>
        ))}
      </div>
    );
  } else if (sectionKey === 'news' || sectionKey === 'risks') {
    const items = content as string[];
    if (items.length === 0) {
      renderedContent = <p className="text-black/40 italic text-sm">No specific {sectionKey} identified.</p>;
    } else {
      renderedContent = (
        <ul className="space-y-4">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-4 group">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-black/20 group-hover:bg-blue-600 transition-colors duration-300 shrink-0"></span>
              <span className="text-black/70 text-base leading-relaxed max-w-[65ch] group-hover:text-black transition-colors duration-300">{item}</span>
            </li>
          ))}
        </ul>
      );
    }
  }

  return (
    <div className="double-bezel mb-8 animate-slide-up group">
      <div className="double-bezel-inner p-8 transition-colors duration-500 group-hover:bg-white/80">
        <h3 className="font-display text-2xl font-semibold text-black tracking-tight mb-6">{title}</h3>
        <div>{renderedContent}</div>
      </div>
    </div>
  );
}
