import * as d3 from 'd3';
import type { WellData, PaperSize, WellLogConfig, Formation } from '../types/well';
import { generateRandomColor, getDarkerShade } from './colorGenerator';

const config: WellLogConfig = {
  lineThickness: 1.5,
  lineColor: '#000000',
  containerStroke: '#333333',
  containerFill: '#ffffff',
  rectFill: 'transparent',
  formationOpacity: 0.3,
  formationStrokeWidth: 1
};

export const createWellVisualization = (wells: WellData[], paperSize: PaperSize) => {
  const margin = { top: 40, right: 50, bottom: 60, left: 80 };
  const svgWidth = paperSize.width;
  const svgHeight = paperSize.height;
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  const wellWidth = 40; // Largeur de chaque puits
  const spacing = 80; // Espacement entre les puits
  const startX = 100; // Point de départ horizontal

  const svg = d3.create('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .style('background', config.containerFill);

  // Ajout du titre
  svg.append('text')
    .attr('x', svgWidth / 2)
    .attr('y', margin.top / 2)
    .attr('text-anchor', 'middle')
    .attr('font-size', '16px')
    .attr('font-weight', 'bold')
    .text('Well-to-Well Correlation Visualization');

  // Ajouter les labels des axes
  svg.append('text')
    .attr('x', margin.left / 3)
    .attr('y', svgHeight / 2)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('transform', `rotate(-90, ${margin.left / 3}, ${svgHeight / 2})`)
    .text('Depth (m)');

  svg.append('text')
    .attr('x', svgWidth / 2)
    .attr('y', svgHeight - margin.bottom / 3)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .text('Gamma Ray (GR)');

  // Dessin des puits
  wells.forEach((well, i) => {
    const x = startX + i * (wellWidth + spacing);
    const y = margin.top;

    // Rectangle pour chaque puits
    svg.append('rect')
      .attr('x', x)
      .attr('y', y)
      .attr('width', wellWidth)
      .attr('height', height)
      .attr('fill', config.containerFill)
      .attr('stroke', config.containerStroke);

    // Tracer les courbes GR
    const scaleX = d3.scaleLinear()
      .domain([0, d3.max(well.gr) || 150])
      .range([x, x + wellWidth]);

    const scaleY = d3.scaleLinear()
      .domain([well.start, well.stop])
      .range([y, y + height]);

    const line = d3.line<number>()
      .x((d, idx) => scaleX(well.gr[idx]))
      .y((_, idx) => scaleY(well.depth[idx]))
      .curve(d3.curveLinear);

    svg.append('path')
      .datum(well.gr)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', config.lineColor)
      .attr('stroke-width', config.lineThickness);
  });

  // Dessin des formations entre les puits
  wells[0].formations.forEach((formation, formationIndex) => {
  const polygonPoints: [number, number][] = [];
  
  // Points supérieurs horizontaux (formation top)
  wells.forEach((well, wellIndex) => {
    const xStart = startX + wellIndex * (wellWidth + spacing); // Position du rectangle
    const yTop = margin.top + (formation.topDepth - well.start) * (height / (well.stop - well.start)); // Profondeur en haut
    polygonPoints.push([xStart, yTop]); // Point gauche du rectangle
    polygonPoints.push([xStart + wellWidth, yTop]); // Point droit du rectangle
  });

  // Points inférieurs horizontaux (formation bottom)
  wells.slice().reverse().forEach((well, wellIndex) => {
    const xStart = startX + (wells.length - 1 - wellIndex) * (wellWidth + spacing); // Position du rectangle
    const yBottom = margin.top + ((formation.topDepth + formation.thickness) - well.start) * (height / (well.stop - well.start)); // Profondeur en bas
    polygonPoints.push([xStart + wellWidth, yBottom]); // Point droit du rectangle
    polygonPoints.push([xStart, yBottom]); // Point gauche du rectangle
  });

    // Dessin du polygone
    const x1 = polygonPoints[0][0]
    const y1 = polygonPoints[0][1]
    svg.append('polygon')
    
    .attr('points', polygonPoints.map(([x, y]) => `${x},${y}`).join(' '))
    .attr('fill', formation.color || generateRandomColor())
    .attr('opacity', config.formationOpacity)
    .attr('stroke', config.containerStroke)
    .attr('stroke-width', config.formationStrokeWidth);
     // Ajout du titre
  svg.append('text')
    .attr('x', x1 - 20)
    .attr('y', y1+30)
    .attr('text-anchor', 'end')
    .attr('font-size', '14px')
    .attr('font-weight', 'bold')
    .text(formation.name);
});
// Ajout de la légende pour les formations
const legendX = svgWidth - margin.right + 20; // Position X de la légende
const legendY = margin.top; // Position Y de départ de la légende
const legendSpacing = 20; // Espacement entre les éléments de la légende

const legend = svg.append('g')
  .attr('class', 'legend');

// Ajout des entrées de la légende
wells[0].formations.forEach((formation, index) => {
  const legendEntryY = legendY + index * legendSpacing;

  // Carré coloré
  legend.append('rect')
    .attr('x', legendX-70)
    .attr('y', legendEntryY)
    .attr('width', 12)
    .attr('height', 12)
    .attr('fill', formation.color || generateRandomColor())
    .attr('stroke', config.containerStroke)
    .attr('stroke-width', 0.5);

  // Texte du nom de la formation
  legend.append('text')
    .attr('x', legendX -30) // Position après le carré
    .attr('y', legendEntryY + 10) // Centrer avec le carré
    .attr('font-size', '12px')
    .attr('font-family', 'Arial, sans-serif')
    .text(formation.name || `Formation ${index + 1}`);
});

  return svg.node();
};

