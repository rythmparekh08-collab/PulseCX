import React from 'react';
import { SentimentType } from '../types';

interface SentimentIndicatorProps {
  sentiment: SentimentType;
  intent?: string;
  confidence?: number;
  compact?: boolean;
}

export const SentimentIndicator: React.FC<SentimentIndicatorProps> = ({
  sentiment,
  intent,
  confidence = 94,
  compact = false
}) => {
  const getBadgeStyle = () => {
    switch (sentiment) {
      case 'Positive':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          emoji: '😊',
          label: 'Customer Sentiment: Positive'
        };
      case 'High Intent':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          dot: 'bg-purple-500',
          emoji: '🎯',
          label: 'High Purchase Intent'
        };
      case 'Inquiring':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
          emoji: '🔍',
          label: 'Product Exploration'
        };
      case 'Frustrated':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          emoji: '⚠️',
          label: 'Friction Detected'
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          emoji: '💬',
          label: 'Neutral Sentiment'
        };
    }
  };

  const style = getBadgeStyle();

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${style.bg} transition-all`}>
        <span className={`w-2 h-2 rounded-full ${style.dot} animate-pulse`}></span>
        <span>{style.emoji}</span>
        <span className="font-semibold">{sentiment}</span>
        {intent && <span className="opacity-75">• {intent}</span>}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs ${style.bg}`}>
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${style.dot} animate-pulse`}></span>
        <span className="text-base">{style.emoji}</span>
        <div>
          <span className="font-semibold tracking-wide uppercase text-[10px] block opacity-80">CX Telemetry</span>
          <span className="font-medium">{style.label}</span>
        </div>
      </div>
      <div className="text-right">
        {intent && <div className="text-[11px] font-semibold opacity-90">{intent}</div>}
        <div className="text-[10px] opacity-70">Confidence: {confidence}%</div>
      </div>
    </div>
  );
};
