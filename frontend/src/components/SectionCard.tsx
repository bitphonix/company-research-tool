import React from 'react';
import type { Financials, Person, ReportSections } from '../types';

interface SectionCardProps {
  title: string;
  sectionKey: keyof ReportSections;
  content: any;
  isLoading?: boolean;
  isActive?: boolean;
}

export function SectionCard({ title, sectionKey, content, isLoading, isActive }: SectionCardProps) {
  // Active state — this section is currently being researched
  if (isLoading && isActive) {
    return (
      <div className="bg-white border border-black/5 border-l-[3px] border-l-blue-600 rounded-r-lg mb-8 overflow-hidden shadow-[0_4px_20px_-8px_rgba(37,99,235,0.15)]">
        <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between">
          <h3 className="font-display text-lg text-black">{title}</h3>
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </div>
            <span className="text-xs font-mono text-blue-600 font-medium">Researching...</span>
          </div>
        </div>
        <div className="p-6">
          <div className="animate-shimmer h-4 rounded w-3/4 mb-3"></div>
          <div className="animate-shimmer h-4 rounded w-1/2 mb-3"></div>
          <div className="animate-shimmer h-4 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  // Waiting state — queued, not yet started
  if (isLoading && !isActive) {
    return (
      <div className="bg-white border border-black/5 border-l-[3px] border-l-black/10 rounded-r-lg mb-8 overflow-hidden opacity-40">
        <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between">
          <h3 className="font-display text-lg text-black/50">{title}</h3>
          <span className="text-xs font-mono text-black/30">Pending</span>
        </div>
        <div className="p-6">
          <div className="h-4 bg-black/5 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-black/5 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!content) return null;

  let renderedContent: React.ReactNode = null;

  if (sectionKey === 'overview') {
    renderedContent = (
      <p className="text-[#1A1A1A] text-[15px] leading-relaxed">
        {content as string}
      </p>
    );
  } else if (sectionKey === 'key_people') {
    const people = content as Person[];
    if (people.length === 0) {
      renderedContent = <p className="text-black/40 text-sm italic">No key people identified.</p>;
    } else {
      renderedContent = (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {people.map((p, i) => (
            <li key={i} className="flex flex-col bg-black/[0.02] p-4 rounded-lg border border-black/5">
              <span className="font-medium text-black text-sm">{p.name}</span>
              <span className="text-xs text-black/40 font-mono mt-1">{p.title}</span>
            </li>
          ))}
        </ul>
      );
    }
  } else if (sectionKey === 'financials') {
    const fin = content as Financials;
    const formatFin = (val: string | null) =>
      val || <span className="text-black/30 italic text-base">Unknown</span>;
    renderedContent = (
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col">
          <span className="text-[10px] text-black/40 uppercase tracking-widest font-mono mb-1">Revenue</span>
          <span className="font-mono font-medium text-xl text-black">{formatFin(fin.revenue)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-black/40 uppercase tracking-widest font-mono mb-1">Employees</span>
          <span className="font-mono font-medium text-xl text-black">{formatFin(fin.employee_count)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-black/40 uppercase tracking-widest font-mono mb-1">Market Cap</span>
          <span className="font-mono font-medium text-xl text-black">{formatFin(fin.market_cap)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-black/40 uppercase tracking-widest font-mono mb-1">Growth (YoY)</span>
          <span className="font-mono font-medium text-xl text-green-600">{formatFin(fin.yoy_growth)}</span>
        </div>
      </div>
    );
  } else if (sectionKey === 'news' || sectionKey === 'risks') {
    const items = content as string[];
    if (items.length === 0) {
      renderedContent = (
        <p className="text-black/40 text-sm italic">No specific {sectionKey} identified.</p>
      );
    } else {
      renderedContent = (
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-blue-600 mt-1 text-xs shrink-0">●</span>
              <span className="text-black/80 text-sm leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );
    }
  }

  return (
    <div className="bg-white border border-black/5 border-l-[3px] border-l-black rounded-r-lg mb-8 overflow-hidden animate-slide-up">
      <div className="px-6 py-4 border-b border-black/5">
        <h3 className="font-display text-lg text-black">{title}</h3>
      </div>
      <div className="p-6">{renderedContent}</div>
    </div>
  );
}