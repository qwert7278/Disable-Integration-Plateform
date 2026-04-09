import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { MindMapNode } from '../types';

interface Props {
  data: MindMapNode;
}

export const MindMap: React.FC<Props> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const width = 900;
    const height = 600;
    const margin = { top: 20, right: 120, bottom: 20, left: 120 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const tree = d3.tree<MindMapNode>().size([height - margin.top - margin.bottom, width - margin.left - margin.right]);
    const root = d3.hierarchy(data);
    tree(root);

    // Links
    g.selectAll(".link")
      .data(root.links())
      .enter().append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#e2e8f0")
      .attr("stroke-width", 2)
      .attr("d", d3.linkHorizontal<any, any>()
        .x(d => d.y)
        .y(d => d.x)
      );

    // Nodes
    const node = g.selectAll(".node")
      .data(root.descendants())
      .enter().append("g")
      .attr("class", d => `node ${d.children ? "node--internal" : "node--leaf"}`)
      .attr("transform", d => `translate(${d.y},${d.x})`);

    node.append("circle")
      .attr("r", 6)
      .attr("fill", d => d.depth === 0 ? "#16a34a" : (d.depth === 1 ? "#22c55e" : "#86efac"));

    node.append("text")
      .attr("dy", ".35em")
      .attr("x", d => d.children ? -12 : 12)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .attr("font-size", d => d.depth === 0 ? "16px" : "12px")
      .attr("font-weight", d => d.depth <= 1 ? "bold" : "normal")
      .attr("fill", "#1e293b")
      .text(d => d.data.name);

    node.filter(d => !!d.data.value)
      .append("text")
      .attr("dy", "1.5em")
      .attr("x", d => d.children ? -12 : 12)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .attr("font-size", "10px")
      .attr("fill", "#64748b")
      .text(d => `(${d.data.value})`);

  }, [data]);

  return (
    <div className="w-full overflow-x-auto bg-white rounded-3xl border border-slate-100 p-4 shadow-inner">
      <svg ref={svgRef} width="900" height="600" className="mx-auto" />
    </div>
  );
};
