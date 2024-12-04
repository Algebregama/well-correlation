import * as d3 from 'd3';
import type { WellData, PaperSize, WellLogConfig, Formation } from '../types/well';
import { generateRandomColor, getDarkerShade } from './colorGenerator';

const config: WellLogConfig = {
  lineThickness: 1.5,
  lineColor: '#000000',
  containerStroke: '#333333',
  containerFill: '#ffffff',
  formationOpacity: 0.3,
  formationStrokeWidth: 1
};

export const createWellVisualization = (wells: WellData[], paperSize: PaperSize) => {
  const margin = { top: 60, right: 50, bottom: 60, left: 50 };
  const width = paperSize.width - margin.left - margin.right;
  const height = paperSize.height - margin.top - margin.bottom;

  const svg = d3.select('body')
    .append('svg')
    .attr('width', paperSize.width)
    .attr('height', paperSize.height);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const xScale = d3.scaleLinear()
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .range([height, 0]);

  const wellWidth = 40;
  const wellSpacing = 20;
  const wellsPerRow = Math.floor(width / (wellWidth + wellSpacing));

  const formationPolygons = g.append('g');

  wells.forEach((well, index) => {
    const x = (index % wellsPerRow) * (wellWidth + wellSpacing);
    const y = Math.floor(index / wellsPerRow) * (height / Math.ceil(wells.length / wellsPerRow));

    // Draw well rectangle
    g.append('rect')
      .attr('x', x)
      .attr('y', y)
      .attr('width', wellWidth)
      .attr('height', height)
      .attr('fill', config.containerFill)
      .attr('stroke', config.containerStroke)
      .attr('stroke-width', 1);

    // Draw gamma ray line
    const grLine = d3.line()
      .x((d, i) => x + (wellWidth * (well.gr[i] - Math.min(...well.gr)) / (Math.max(...well.gr) - Math.min(...well.gr))))
      .y((d, i) => y + height * (1 - (well.depth[i] - well.start) / (well.stop - well.start)));

    g.append('path')
      .attr('d', grLine(well.depth.map((_, i) => well.gr[i])))
      .attr('fill', 'none')
      .attr('stroke', config.lineColor)
      .attr('stroke-width', config.lineThickness);

    // Draw formations
    well.formations.forEach((formation, formationIndex) => {
      const formationColor = formation.color || generateRandomColor();
      const formationTopY = y + height * (1 - (formation.topDepth - well.start) / (well.stop - well.start));
      const formationBottomY = formationTopY + height * (formation.thickness / (well.stop - well.start));

      formationPolygons.append('polygon')
        .attr('points', `
          ${x}, ${formationTopY}
          ${x + wellWidth}, ${formationTopY}
          ${x + wellWidth + (formationIndex * (wellWidth + wellSpacing))}, ${formationTopY}
          ${x + wellWidth + ((formationIndex + 1) * (wellWidth + wellSpacing))}, ${formationTopY}
          ${x + wellWidth + ((formationIndex + 1) * (wellWidth + wellSpacing))}, ${formationBottomY}
${x + wellWidth + (formationIndex * (wellWidth + wellSpacing))}, ${formationBottomY}
          ${x}, ${formationBottomY}
        `)
        .attr('fill', formationColor)
        .attr('fill-opacity', config.formationOpacity)
        .attr('stroke', getDarkerShade(formationColor))
        .attr('stroke-width', config.formationStrokeWidth)
        .append('title')
        .text(`${formation.name || `Formation ${formationIndex}`}`);
    });
  });

  // Add x-axis label
  g.append('text')
    .attr('x', width / 2)
    .attr('y', height + margin.bottom - 10)
    .style('text-anchor', 'middle')
    .text('Gamma Ray (API)');

  // Add y-axis label
  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -margin.left + 20)
    .style('text-anchor', 'middle')
    .text('Depth (m)');

  return svg.node();
};
