import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { DimensionScore } from '../types';
import { Activity, Utensils, Smartphone, Briefcase, Home, Users } from 'lucide-react';

const iconMap: Record<string, any> = {
  Activity,
  Utensils,
  Smartphone,
  Briefcase,
  Home,
  Users,
};

interface Props {
  data: DimensionScore[];
}

export const RadarChart: React.FC<Props> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 600;
    const height = 600;
    const margin = 120;
    const radius = Math.min(width, height) / 2 - margin;
    const levels = 5;
    const total = data.length;
    const angleSlice = (Math.PI * 2) / total;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Draw circular grid and scale labels
    for (let j = 0; j < levels; j++) {
      const levelRadius = (radius / levels) * (j + 1);
      g.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', levelRadius)
        .attr('fill', 'none')
        .attr('stroke', '#f1f5f9')
        .attr('stroke-width', '1px');

      // Scale labels (0-5)
      g.append('text')
        .attr('x', 5)
        .attr('y', -levelRadius)
        .attr('dy', '0.4em')
        .style('font-size', '10px')
        .style('fill', '#94a3b8')
        .style('font-weight', 'bold')
        .text(j + 1);
    }

    // Draw axes
    const axis = g.selectAll('.axis').data(data).enter().append('g').attr('class', 'axis');

    axis
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (d, i) => radius * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y2', (d, i) => radius * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', '2px');

    // Radar area and points...
    const radarLine = d3
      .lineRadial<DimensionScore>()
      .radius(d => (d.score / d.fullMark) * radius)
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    g.append('path')
      .datum(data)
      .attr('d', radarLine)
      .attr('fill', 'rgba(225, 29, 72, 0.2)')
      .attr('stroke', '#e11d48')
      .attr('stroke-width', '3px');

    g.selectAll('.radarCircle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'radarCircle')
      .attr('r', 4)
      .attr('cx', (d, i) => (d.score / d.fullMark) * radius * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('cy', (d, i) => (d.score / d.fullMark) * radius * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('fill', '#e11d48');

  }, [data]);

  const width = 600;
  const height = 600;
  const margin = 120;
  const radius = Math.min(width, height) / 2 - margin;
  const angleSlice = (Math.PI * 2) / data.length;

  return (
    <div className="relative flex justify-center items-center bg-white rounded-3xl p-4 border border-slate-100 shadow-sm overflow-visible min-h-[650px] w-full">
      <div className="relative w-full max-w-[600px] aspect-square">
        <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible" />
        
        {data.map((d, i) => {
          const x = (radius + 85) * Math.cos(angleSlice * i - Math.PI / 2);
          const y = (radius + 85) * Math.sin(angleSlice * i - Math.PI / 2);
          const Icon = iconMap[d.icon || 'Activity'];
          
          // Determine text alignment based on position
          const isRight = x > 20;
          const isLeft = x < -20;
          const isTop = y < -20;
          const isBottom = y > 20;

          return (
            <div
              key={d.name}
              className="absolute flex items-center gap-2 p-2 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:scale-105 z-10"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: `translate(${isLeft ? '-100%' : isRight ? '0%' : '-50%'}, ${isTop ? '-100%' : isBottom ? '0%' : '-50%'})`,
                width: '180px'
              }}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                i % 2 === 0 ? 'bg-amber-50 text-amber-600' : 'bg-brand-50 text-brand-600'
              }`}>
                {Icon && <Icon className="w-5 h-5" />}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-black text-slate-900 truncate">
                  {d.name}
                </span>
                <span className="text-[9px] font-bold text-slate-500 leading-tight line-clamp-2">
                  {d.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
