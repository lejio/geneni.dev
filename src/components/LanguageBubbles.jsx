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

const languages = [
  { name: "Python", value: 16739530 },
  { name: "JavaScript", value: 1083881 },
  { name: "HTML", value: 761872 },
  { name: "TypeScript", value: 375234 },
  { name: "SCSS", value: 267805 },
  { name: "Cython", value: 122376 },
  { name: "Astro", value: 71188 },
  { name: "C++", value: 48490 },
  { name: "CSS", value: 40227 },
  { name: "PowerShell", value: 17867 },
  { name: "Swift", value: 9093 },
  { name: "C", value: 7083 },
  { name: "Shell", value: 6820 },
  { name: "Java", value: 3891 },
  { name: "Ruby", value: 1938 },
  { name: "Lua", value: 701 },
  { name: "Nix", value: 382 },
  { name: "Batchfile", value: 89 },
];

export default function LanguageBubbles() {
  const svgRef = useRef(null);
  let tickCount = 0;


  useEffect(() => {
    const svgEl = svgRef.current;
    const { width, height } = svgEl.getBoundingClientRect();

    const rScale = d3
      .scaleSqrt()
      .domain([0, d3.max(languages, (d) => d.value)])
      .range([50, 150]);

    const nodes = languages.map((d) => {
      const r = rScale(d.value);
      return {
        ...d,
        r,
        x: Math.random() * (width - 2 * r) + r,
        y: Math.random() * (height - 2 * r) + r,
        vx: (Math.random() - 0.5) * 2, // between -1 and 1
        vy: (Math.random() - 0.5) * 2,
      };
    });

    const svg = d3.select(svgEl).attr("width", width).attr("height", height);
    const container = svg.append("g");

    const circles = container
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", (d) => d.r)
      .attr("fill", (d) => languageColors[d.name] || "rgba(100, 200, 255, 0.7)")
      .attr("stroke", "#222")
      .attr("stroke-width", 1.5);

    const labels = container
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .text((d) => d.name)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "white")
      .style("pointer-events", "none");

    // Define repel box based on your text layout
    const repelBox = {
      x: width / 2 - 150,
      y: height / 2 - 100,
      width: 300,
      height: 120,
    };

    // Custom repel force for text area
    function repelFromTextZone(alpha) {
      for (const node of nodes) {
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

    function applyIdleMovement(alpha, tickCount) {
      const frequency = 0.02; // how fast the oscillation happens
      const amplitude = 0.2;  // how strong the idle drift is
    
      for (const node of nodes) {
        // Create gentle sinusoidal motion
        node.vx += Math.sin(tickCount * frequency + node.r) * amplitude * alpha;
        node.vy += Math.cos(tickCount * frequency + node.r) * amplitude * alpha;
      }
    }    

    function repelFromEdges(alpha) {
      for (const node of nodes) {
        const margin = 20; // extra spacing from edge
        const strength = 5 * alpha;
    
        // Left edge
        if (node.x - node.r < margin) {
          node.vx += strength;
        }
    
        // Right edge
        if (node.x + node.r > width - margin) {
          node.vx -= strength;
        }
    
        // Top edge
        if (node.y - node.r < margin) {
          node.vy += strength;
        }
    
        // Bottom edge
        if (node.y + node.r > height - margin) {
          node.vy -= strength;
        }
      }
    }    

    const simulation = d3
      .forceSimulation(nodes)
      // .force("charge", d3.forceManyBody().strength(-10))
      .force("slow", d3.forceManyBody().strength(0)); // just friction-like effect
    simulation
      .velocityDecay(0.2) // lower = longer movement; default is 0.4
      .alphaDecay(0)
      // .force(
      //   "x",
      //   d3
      //     .forceX()
      //     .strength(0.03)
      //     .x((d) => d.x)
      // )
      // .force(
      //   "y",
      //   d3
      //     .forceY()
      //     .strength(0.03)
      //     .y((d) => d.y)
      // )
      .force(
        "collision",
        d3.forceCollide().radius((d) => d.r + 2)
      )

      .on("tick", () => {
        tickCount++;

        repelFromTextZone(simulation.alpha());
        repelFromEdges(simulation.alpha());
        applyIdleMovement(simulation.alpha(), tickCount);


        circles.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
        labels.attr("x", (d) => d.x).attr("y", (d) => d.y + 4);
      });

    // svg.on("mousemove", function (event) {
    //   const [x, y] = d3.pointer(event);

    //   let minDist = Infinity;
    //   let closestNode = null;

    //   for (const node of nodes) {
    //     const dx = node.x - x;
    //     const dy = node.y - y;
    //     const dist = Math.sqrt(dx * dx + dy * dy);

    //     if (dist < minDist && dist < node.r + 10) {
    //       minDist = dist;
    //       closestNode = node;
    //     }
    //   }

    //   if (closestNode) {
    //     const angle = Math.atan2(closestNode.y - y, closestNode.x - x);
    //     const repelStrength = 1;

    //     closestNode.vx += Math.cos(angle) * repelStrength;
    //     closestNode.vy += Math.sin(angle) * repelStrength;

    //     // simulation.alpha(0.2).restart();
    //   }
    // });
    svg.on("mousemove", function (event) {
      const [x, y] = d3.pointer(event);

      let minDist = Infinity;
      let closestNode = null;

      for (const node of nodes) {
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

        simulation.alphaTarget(0.05); // gentle nudge
        setTimeout(() => simulation.alphaTarget(0), 300); // reset after a bit
      }
    });

    const resize = () => {
      const { width, height } = svgEl.getBoundingClientRect();
      svg.attr("width", width).attr("height", height);
      simulation.force(
        "x",
        d3
          .forceX()
          .strength(0.03)
          .x((d) => d.x)
      );
      simulation.force(
        "y",
        d3
          .forceY()
          .strength(0.03)
          .y((d) => d.y)
      );
      simulation.alpha(0.5).restart();
    };

    window.addEventListener("resize", resize);
    return () => {
      simulation.stop();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    />
  );
}
