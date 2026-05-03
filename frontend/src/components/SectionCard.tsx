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
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6 opacity-50">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Pending
          </span>
        </div>
        <div className="p-5">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!content) return null;

  let renderedContent: React.ReactNode = null;

  if (sectionKey === 'overview') {
    renderedContent = <p className="text-gray-700 leading-relaxed text-sm">{content as string}</p>;
  } else if (sectionKey === 'key_people') {
    const people = content as Person[];
    if (people.length === 0) {
      renderedContent = <p className="text-gray-500 italic text-sm">No key people identified.</p>;
    } else {
      renderedContent = (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {people.map((p, i) => (
            <li key={i} className="flex flex-col bg-gray-50 p-3 rounded-md border border-gray-100">
              <span className="font-medium text-gray-900 text-sm">{p.name}</span>
              <span className="text-xs text-gray-500">{p.title}</span>
            </li>
          ))}
        </ul>
      );
    }
  } else if (sectionKey === 'financials') {
    const fin = content as Financials;
    const formatFin = (val: string | null) => val || <span className="text-gray-400 italic">Unknown</span>;
    renderedContent = (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Revenue</span>
          <span className="font-medium text-gray-900">{formatFin(fin.revenue)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Employees</span>
          <span className="font-medium text-gray-900">{formatFin(fin.employee_count)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Market Cap</span>
          <span className="font-medium text-gray-900">{formatFin(fin.market_cap)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Growth (YoY)</span>
          <span className="font-medium text-green-600">{formatFin(fin.yoy_growth)}</span>
        </div>
      </div>
    );
  } else if (sectionKey === 'news' || sectionKey === 'risks') {
    const items = content as string[];
    if (items.length === 0) {
      renderedContent = <p className="text-gray-500 italic text-sm">No specific {sectionKey} identified.</p>;
    } else {
      renderedContent = (
        <ul className="list-disc pl-5 space-y-2">
          {items.map((item, i) => (
            <li key={i} className="text-sm text-gray-700">{item}</li>
          ))}
        </ul>
      );
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="p-5">{renderedContent}</div>
    </div>
  );
}
