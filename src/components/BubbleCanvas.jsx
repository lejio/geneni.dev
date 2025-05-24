import { useEffect, useRef } from "react";
import * as d3 from "d3";

const languageColors = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  HTML: "#e34c26",
  TypeScript: "#2b7489",
  SCSS: "#c6538c",
  Cython: "#fedcba",
  Astro: "#ff5d01",
  "C++": "#f34b7d",
  CSS: "#563d7c",
  PowerShell: "#012456",
  Swift: "#ffac45",
  C: "#555555",
  Shell: "#89e051",
  Java: "#b07219",
  Ruby: "#701516",
  Lua: "#000080",
  Nix: "#7e7eff",
  Batchfile: "#C1F12E",
};

export default function BubbleCanvas({ languages }) {
  console.log(languages);
  const svgRef = useRef(null);
  const simulationRef = useRef(null);
  if (!languages || languages.length === 0) return null;

  useEffect(() => {
    const svgEl = svgRef.current;
    const { width, height } = svgEl.getBoundingClientRect();

    const maxCanvasWidth = 1920;
    const maxCanvasHeight = 1080;

    const effectiveWidth = Math.min(width, maxCanvasWidth);
    const effectiveHeight = Math.min(height, maxCanvasHeight);

    const minRadius = Math.min(effectiveWidth, effectiveHeight) * 0.05; // ~3%
    const maxRadius = Math.min(effectiveWidth, effectiveHeight) * 0.2; // ~10%

    const rScale = d3
      .scaleSqrt()
      .domain([0, d3.max(languages, (d) => d.value)])
      .range([minRadius, maxRadius]);

    // const rScale = d3
    //   .scaleSqrt()
    //   .domain([0, d3.max(languages, (d) => d.value)])
    //   .range([50, 150]);

    const allNodes = languages.map((d) => {
      const r = rScale(d.value);
      return {
        ...d,
        r,
        x: Math.random() * (width - 2 * r) + r,
        y: Math.random() * (height - 2 * r) + r,
        vx: 0,
        vy: 0,
      };
    });

    let activeNodes = [];

    const svg = d3.select(svgEl).attr("width", width).attr("height", height);
    const container = svg.append("g");

    const circles = container
      .selectAll("circle")
      .data(activeNodes, (d) => d.name);
    const labels = container.selectAll("text").data(activeNodes, (d) => d.name);

    const simulation = d3
      .forceSimulation(activeNodes)
      .force("slow", d3.forceManyBody().strength(0))
      .force(
        "collision",
        d3.forceCollide().radius((d) => d.r + 2)
      )
      .velocityDecay(0.02)
      .alphaDecay(0)
      .on("tick", () => {
        repelFromTextZone(simulation.alpha());
        repelFromEdges(simulation.alpha());

        svg
          .selectAll("circle")
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y);
        svg
          .selectAll("text")
          .attr("x", (d) => d.x)
          .attr("y", (d) => d.y + 4);
      });

    simulationRef.current = simulation;

    // Repel box in the center
    const repelBox = {
      x: width / 2 - 150,
      y: height / 2 - 100,
      width: 300,
      height: 120,
    };

    function repelFromTextZone(alpha) {
      for (const node of activeNodes) {
        const { x, y, r } = node;

        const insideX =
          x + r > repelBox.x && x - r < repelBox.x + repelBox.width;
        const insideY =
          y + r > repelBox.y && y - r < repelBox.y + repelBox.height;

        if (insideX && insideY) {
          const centerX = repelBox.x + repelBox.width / 2;
          const centerY = repelBox.y + repelBox.height / 2;

          const dx = x - centerX;
          const dy = y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          const strength = 5 * alpha;

          node.vx += (dx / dist) * strength;
          node.vy += (dy / dist) * strength;
        }
      }
    }

    function repelFromEdges(alpha) {
      const margin = 20;
      const strength = 5 * alpha;

      for (const node of activeNodes) {
        if (node.x - node.r < margin) node.vx += strength;
        if (node.x + node.r > width - margin) node.vx -= strength;
        if (node.y - node.r < margin) node.vy += strength;
        if (node.y + node.r > height - margin) node.vy -= strength;
      }
    }

    // Stream bubbles in one by one
    let index = 0;
    const interval = setInterval(() => {
      if (index >= allNodes.length) {
        clearInterval(interval);
        return;
      }

      const node = allNodes[index];
      activeNodes.push(node);
      simulation.nodes(activeNodes);

      container
        .append("circle")
        .data([node])
        .join("circle")
        .attr("r", node.r)
        .attr("fill", languageColors[node.name] || "rgba(100, 200, 255, 0.7)")
        .attr("stroke", languageColors[node.name] || "rgba(100, 200, 255, 0.7)")
        .attr("stroke-width", 1.5);

      container
        .append("text")
        .data([node])
        .join("text")
        .text(node.name)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "white")
        .style("pointer-events", "none");

      simulation.alpha(0.5).restart();
      index++;
    }, 100); // Adjust speed here

    // Mouse repel interaction
    svg.on("mousemove", function (event) {
      const [x, y] = d3.pointer(event);

      let minDist = Infinity;
      let closestNode = null;

      for (const node of activeNodes) {
        const dx = node.x - x;
        const dy = node.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < minDist && dist < node.r + 10) {
          minDist = dist;
          closestNode = node;
        }
      }

      if (closestNode) {
        const angle = Math.atan2(closestNode.y - y, closestNode.x - x);
        const repelStrength = 1;

        closestNode.vx += Math.cos(angle) * repelStrength;
        closestNode.vy += Math.sin(angle) * repelStrength;

        simulation.alphaTarget(0.05);
        setTimeout(() => simulation.alphaTarget(0), 300);
      }
    });

    const resize = () => {
      const { width, height } = svgEl.getBoundingClientRect();
      svg.attr("width", width).attr("height", height);
      simulation.alpha(0.5).restart();
    };

    window.addEventListener("resize", resize);
    return () => {
      simulation.stop();
      window.removeEventListener("resize", resize);
    };
  }, [languages]);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    />
  );
}
