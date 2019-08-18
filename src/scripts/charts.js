import * as d3 from 'd3';
import _get from 'lodash.get';
import _set from 'lodash.set';

// Base chart class
class Chart {

  constructor(id, config) {
    this.id = id;
    this.datasets = []
    this.svg = {}
    this.container = {}
    this.body = {
      marginTop: 25,
      marginRight: 15,
      marginBottom: 25,
      marginLeft: 35
    }
    this.axisRight = {
      type: 'scaleLinear',
      min: 'auto',
      max: 'auto',
      gridlines: {
        hidden: true,
        color: '#EFEFEF',
        width: 1
      },
      padding: 0,
      format: {}
    }
    this.axisBottom = {
      type: 'scalePoint',
      min: 'auto',
      max: 'auto',
      gridlines: {
        hidden: false,
        color: '#EFEFEF',
        width: 1
      },
      padding: 0,
      format: {}
    }
    this.axisLeft = {
      type: 'scaleLinear',
      min: 'auto',
      max: 'auto',
      gridlines: {
        hidden: false,
        color: '#EFEFEF',
        width: 1
      },
      padding: 0,
      format: {}
    }
    this.axisGroup = {}
    this.seriesGroup = {};
    this.columnGroup = {}; 
    this.barGroup = {}; 
    this.defs = {}
    this.clipPath = {}
    this.setConfig(config);

  }

  setConfig(config) {
    // Helper to map udpates
    const that = this;
    function mapUpdate(updatePath) {
      const updateValue = _get(config, updatePath);
      if (updateValue !== undefined) {
         _set(that, updatePath, updateValue);   
      }
    }

    // define what can be updated
    mapUpdate('datasets');

    // Body
    mapUpdate('body.marginTop');
    mapUpdate('body.marginRight');
    mapUpdate('body.marginBottom');
    mapUpdate('body.marginLeft');

    // axisBottom
    mapUpdate('axisBottom.padding');
    mapUpdate('axisBottom.innerPadding');
    mapUpdate('axisBottom.gridlines.hidden');
    mapUpdate('axisBottom.gridlines.color');
    mapUpdate('axisBottom.gridlines.width');
    mapUpdate('axisBottom.min');
    mapUpdate('axisBottom.max');
    
    // axisLeft
    mapUpdate('axisLeft.padding');
    mapUpdate('axisLeft.innerPadding');
    mapUpdate('axisLeft.gridlines.hidden');
    mapUpdate('axisLeft.gridlines.color');
    mapUpdate('axisLeft.gridlines.width');
    mapUpdate('axisLeft.min');
    mapUpdate('axisLeft.max');

    // axisRight
    mapUpdate('axisRight.padding');
    mapUpdate('axisRight.innerPadding');
    mapUpdate('axisRight.gridlines.hidden');
    mapUpdate('axisRight.gridlines.color');
    mapUpdate('axisRight.gridlines.width');
    mapUpdate('axisRight.min');
    mapUpdate('axisRight.max');

  }

  draw() {

    // Draw
    this.container = d3.select(this.id);
    this.container.width = this.container.node().getBoundingClientRect().width;
    this.container.height = this.container.node().getBoundingClientRect().height;

    // Create svg element
    this.svg.el = this.container.append('svg')
      .attr('class', 'chart')
      .attr('width', this.container.width)
      .attr('height', this.container.height);

    // Create dimensions for main group
    this.body.width = this.container.width - this.body.marginLeft - this.body.marginRight;
    this.body.height = this.container.height - this.body.marginTop - this.body.marginBottom;

    // Append body group
    this.body.el = this.svg.el.append('g')
      .attr('class', 'chart__body')
      .attr('transform', `translate(${this.body.marginLeft}, ${this.body.marginTop})`)

    // Append axes group
    this.axisGroup.el = this.body.el.append('g')
      .attr('class', 'chart__axes')

    // Append def for clips
    const clipId = this.id.replace('#','');
    this.defs.el = this.svg.el.append('defs');
    this.clipPath.el = this.defs.el.append('svg:clipPath')
      .attr('id', clipId)
      .append('rect')
      .attr('class', 'clip-rect')
      .attr('width', this.body.width)
      .attr('height', this.body.height)

    // Append clip path to body
    this.body.el.attr('clip-path', `url(#${clipId})`)
  }

  update(config) {
    
    this.setConfig(config);

    this.container.width = this.container.node().getBoundingClientRect().width;
    this.container.height = this.container.node().getBoundingClientRect().height;

    // Create svg element
    this.svg.el
      .attr('width', this.container.width)
      .attr('height', this.container.height);

    // Create dimensions for main group
    this.body.width = this.container.width - this.body.marginLeft - this.body.marginRight;
    this.body.height = this.container.height - this.body.marginTop - this.body.marginBottom;

    // Append body group
    this.body.el.attr('transform', `translate(${this.body.marginLeft}, ${this.body.marginTop})`)
  }

  drawLeftAxis() {
    this.axisLeft.scale = d3[this.axisLeft.type]().rangeRound([this.body.height, 0]).domain(this.axisLeft.domain);
    if (this.axisLeft.type === 'scaleBand') {this.axisLeft.scale.padding(this.axisLeft.padding)}
    this.axisLeft.constructor = d3.axisLeft(this.axisLeft.scale).tickSize(this.axisLeft.gridlines.hidden ? 0 : -this.body.width)
    this.axisLeft.el = this.axisGroup.el.selectAll('.axis__left').data(this.axisLeft.domain.length > 0 ? [this.axisLeft.domain] : []);

    let tickAdjust = 0;
    if (this.axisLeft.scale.bandwidth !== undefined) {
      const bandWidth = this.axisLeft.scale.bandwidth();
      const distanceBetweenGridlines = bandWidth / (1 - (this.axisLeft.padding || 0));
      const paddingDistance = distanceBetweenGridlines * (this.axisLeft.padding || 0);
      tickAdjust = ((bandWidth / 2) + (paddingDistance / 2)).toFixed(0);
    }

    const updateAxis = (node) => {
      const leftAxis = node.call(this.axisLeft.constructor)
      
      leftAxis.selectAll('line')
        .style('transform', `translateY(${tickAdjust}px)`)
        .style('stroke', this.axisLeft.gridlines.color)
        .style('stroke-width', this.axisLeft.gridlines.width)

      leftAxis.selectAll('text')
        .style('transform', `translateX(-4px)`)  
      
      node.selectAll('.domain')
        .style('display', 'none')
    }

    // Create new axis
    this.axisLeft.el.enter().append('g').attr('class', 'axis__left').call(updateAxis);
    this.axisLeft.el.call(updateAxis);
    this.axisLeft.el.exit().remove();
  }

  drawBottomAxis() {

    this.axisBottom.scale = d3[this.axisBottom.type]().rangeRound([0, this.body.width]).domain(this.axisBottom.domain)
    if (this.axisBottom.type === 'scaleBand') {this.axisBottom.scale.padding(this.axisBottom.padding)}
    this.axisBottom.constructor = d3.axisBottom(this.axisBottom.scale).tickSize(this.axisBottom.gridlines.hidden ? 0 : -this.body.height)
    this.axisBottom.el = this.axisGroup.el.selectAll('.axis__bottom').data(this.datasets.length > 0 ? [this.datasets] : []);   

    let tickAdjust = 0;
    if (this.axisBottom.scale.bandwidth !== undefined) {
      const bandWidth = this.axisBottom.scale.bandwidth();
      const distanceBetweenGridlines = bandWidth / (1 - (this.axisBottom.padding || 0));
      const paddingDistance = distanceBetweenGridlines * (this.axisBottom.padding || 0);
      tickAdjust = ((bandWidth / 2) + (paddingDistance / 2)).toFixed(0);
    }

    const updateAxis = (node) => {
      const bottomAxis = node.attr('transform', `translate(0, ${this.body.height})`).call(this.axisBottom.constructor)
      
      bottomAxis.selectAll('line')
        .style('transform', `translateX(${tickAdjust}px)`)
        .style('stroke', this.axisBottom.gridlines.color)
        .style('stroke-width', this.axisBottom.gridlines.width)
      
      bottomAxis.selectAll('text')
        .style('transform', `translateY(6px)`)
        //.call(this.elipsis, this.axisBottom.scale.bandwidth() - 10);
      
      node.selectAll('.domain')
        .style('display', 'none')
    }

    this.axisBottom.el.enter().append('g').attr('class', 'axis__bottom').call(updateAxis)
    this.axisBottom.el.call(updateAxis)
    this.axisBottom.el.exit().remove()
  }

  drawRightAxis() {
    this.axisRight.scale = d3[this.axisRight.type]().rangeRound([this.body.height, 0]).domain(this.axisRight.domain);
    if (this.axisRight.type === 'scaleBand') {this.axisRight.scale.padding(this.axisRight.padding)}
    this.axisRight.constructor = d3.axisRight(this.axisRight.scale).tickSize(this.axisRight.gridlines.hidden ? 0 : -this.body.width)
    this.axisRight.el = this.axisGroup.el.selectAll('.axis__right').data(this.axisRight.domain.length > 0 ? [this.axisRight.domain] : []);

    let tickAdjust = 0;
    if (this.axisRight.scale.bandwidth !== undefined) {
      const bandWidth = this.axisLeft.scale.bandwidth();
      const distanceBetweenGridlines = bandWidth / (1 - (this.axisRight.padding || 0));
      const paddingDistance = distanceBetweenGridlines * (this.axisRight.padding || 0);
      tickAdjust = ((bandWidth / 2) + (paddingDistance / 2)).toFixed(0);
    }

    const updateAxis = (node) => {
      node.attr('transform', `translate(${this.body.width}, 0)`)
        .call(this.axisRight.constructor)
        .selectAll('line')
        .style('transform', `translateY(${tickAdjust}px)`)
        .style('stroke', this.axisRight.gridlines.color)
        .style('stroke-width', this.axisRight.gridlines.width)

      node.selectAll('.domain')
        .style('display', 'none')
    }

    // Create new axis
    this.axisRight.el.enter().append('g').attr('class', 'axis__right').call(updateAxis)
    this.axisRight.el.call(updateAxis);
    this.axisRight.el.exit().remove()
  }

  elipsis(text, maxWidth_) {
    text.each(function () {
       let self = d3.select(this);
       let textLength = self.node().getComputedTextLength();
       const maxWidth = maxWidth_ || 100;

       if (textLength > maxWidth) {
          while (textLength > maxWidth) {
             const newText = self.text().slice(0, -1);
             self.text(newText);
             textLength = self.node().getComputedTextLength();
          }
          self.text(self.text() + '\u2026')
       }
    });
  }

  destroy() {
    this.svg.el.remove();
  }

}

// Line Chart
class LineChart extends Chart {

  constructor(id, config) {
    super(id, config);
    this.draw();
    this.seriesGroup.el = this.body.el.append('g').attr('class', 'chart__series')
    this.update();
  }

  createLine(dataset) {
    const that = this;
    const line = d3.line()
      .x(d => that.axisBottom.scale(d.x))
      .y(d => dataset.axis === 'right' ? that.axisRight.scale(d.y) : that.axisLeft.scale(d.y))
      .defined(d => { return d.y !== undefined})
      .curve(d3.curveCatmullRom.alpha(0.7))
    return line(dataset.values);
  }

  createArea (dataset) {
    const that = this;
    const axisName = dataset.axis === 'right' ? 'axisRight' : 'axisLeft'; 
    const min = d3.max([this[axisName].domain[0], 0]);
    const area = d3.area()
      .x(d => that.axisBottom.scale(d.x))
      .y0(() => that[axisName].scale(min))
      .y1(d => that[axisName].scale(d.y))
      .defined(d => { return d.y !== undefined})
      .curve(d3.curveCatmullRom.alpha(0.7))
    return area(dataset.values);
  }

  update(config) {

    super.update(config);

    if (this.axisBottom.type === 'scaleBand' || this.axisBottom.type === 'scalePoint') {
      const values = [];
      this.datasets.forEach(d => {d.values.forEach(r => {if (values.indexOf(r.x) === -1) {values.push(r.x)}})});
      this.axisBottom.domain = values;
    } else {
      const min = this.axisBottom.min === 'auto' ? d3.min(this.datasets.map(d => d3.min(d.values, r => r.x))) : this.axisBottom.min;
      const max = this.axisBottom.max === 'auto' ? d3.max(this.datasets.map(d => d3.max(d.values, r => r.x))) : this.axisBottom.max;
      this.axisBottom.domain = [min, max];
    }

    super.drawBottomAxis();

    const datasetsLeft = this.datasets.filter(d => d.axis === 'left');
    this.axisLeft.domain = [
      this.axisLeft.min === 'auto' ? d3.min(datasetsLeft.map(d => d3.min(d.values, r => r.y))) : this.axisLeft.min,
      this.axisLeft.max === 'auto' ? d3.max(datasetsLeft.map(d => d3.max(d.values, r => r.y))) : this.axisLeft.max
    ];
    
    super.drawLeftAxis();

    const datasetsRight = this.datasets.filter(d => d.axis === 'right');
    this.axisRight.domain = [
      this.axisRight.min === 'auto' ? d3.min(datasetsRight.map(d => d3.min(d.values, r => r.y))) : this.axisRight.min,
      this.axisRight.max === 'auto' ? d3.max(datasetsRight.map(d => d3.max(d.values, r => r.y))) : this.axisRight.max
    ];

    super.drawRightAxis();
    
    const that = this;

    // Normalize series data
    const seriesData = this.datasets.map(dataset => {
      dataset.values = this.axisBottom.domain.map(xValue => {
        const match = dataset.values.find(d => d.x === xValue) || {};
        const yValue = match.y !== undefined ? match.y : 0;
        return {x: xValue, y: yValue}
      })
      return dataset
    })

    const updateLines = (node) => {
      node.style("stroke-width", d => d.lineWidth || 2)
        .style("stroke", d => d.color || '#000')
        .style("fill", 'none')
        .attr("d", d => that.createLine(d))
    }

    const updateArea = (node) => {
      node.style("stroke-width", 3)
        .style("stroke", 'none')
        .style("fill", d => d.color)
        .style("opacity", d => d.opacity !== undefined ? d.opacity : 0.3)
        .attr("d", d => that.createArea(d))
    }

    const updateCircle = (node) => {
      node.attr("r", d => d.radius !== undefined ? d.radius : 5)
        .attr("cx", d => this.axisBottom.scale(d.x))
        .attr("cy", d => d.axis === 'right' ? this.axisRight.scale(d.y) : this.axisLeft.scale(d.y))
        .attr("fill", d => d.color)
    }

    const modelCircle = (d) => {
      return d.values.map(c => {
        return {x: c.x, y: c.y, color: d.color, radius: d.circleRadius, axis: d.axis};
      })
    }

    const series = this.seriesGroup.el.selectAll('.series__group').data(seriesData, d => d.name);
    
    const newSeries = series.enter().append("g").attr("class", "series__group")
    newSeries.selectAll(".line").data(d => [d], d => d.name).enter().append("path").attr("class", "line").call(updateLines);
    newSeries.selectAll(".area").data(d => [d], d => d.name).enter().append("path").attr("class", "area").call(updateArea);
    newSeries.selectAll(".circle").data(modelCircle, d => d.x).enter().append("circle").attr("class", "circle").call(updateCircle)
    
    series.exit().remove();

    const lines = series.selectAll(".line").data(d => [d], d => d.name);
    lines.enter().append("path").attr("class", "line").call(updateLines)
    lines.call(updateLines)
    lines.exit().remove();

    const areas = series.selectAll(".area").data(d => [d], d => d.name);
   
    areas.enter().append("path").attr("class", "area").call(updateArea);
    areas.call(updateArea);
    areas.exit().remove();
  
    const circles = series.selectAll(".circle").data(modelCircle, d => d.x)

    circles.enter().append("circle").attr("class", "circle").call(updateCircle);
    circles.call(updateCircle);
    circles.exit().remove();
    
  }
}

// Column Chart
class ColumnChart extends Chart {

  constructor(id, config) {
    super(id, config);
    this.axisBottom.type = "scaleBand"
    this.draw();
    this.columnGroup.el = this.body.el.append('g').attr('class', 'chart__columns')
    this.update();
  }

  update(config) {

    super.update(config);
    
    const values = [];
    this.datasets.forEach(d => {d.values.forEach(r => {if (values.indexOf(r.x) === -1) {values.push(r.x)}})});
    this.axisBottom.domain = values;

    super.drawBottomAxis();

    this.axisLeft.domain = [
      this.axisLeft.min === 'auto' ? d3.min(this.datasets.map(d => d3.min(d.values, r => r.y))) : this.axisLeft.min,
      this.axisLeft.max === 'auto' ? d3.max(this.datasets.map(d => d3.max(d.values, r => r.y))) : this.axisLeft.max
    ];
    
    super.drawLeftAxis();

    // Add columns
    const columnGroupData = this.axisBottom.domain.map(groupName => {
      const groupValues = [];
      this.datasets.forEach(c => {
        const value = c.values.find(d => d.x === groupName);
        if (value) {
          groupValues.push({
            x: c.name,
            y: value.y,
            color: c.color,
            axis: c.axis
          });
        }
      })
      return {
        x: groupName,
        groups: groupValues
      }
    });

    let bottomXGroupDomain = this.datasets.map(d => d.name);
    const bottomXGroupScale = d3
        .scaleBand()
        .rangeRound([0, this.axisBottom.scale.bandwidth()])
        .domain(bottomXGroupDomain)
        .padding(this.axisBottom.innerPadding || 0)

    const columnGroup = this.columnGroup.el.selectAll(".column-group").data(columnGroupData, (d) => d.x);    

    const updateColumnGroup = (node) => {
      node.attr("transform", d => "translate(" + this.axisBottom.scale(d.x) + ", 0)")
      .attr("width", this.axisBottom.scale.bandwidth())
    }

    const updateColumn = (node) => {
      node.attr('width', bottomXGroupScale.bandwidth())
      .style('fill', d => d.color)
      .attr('height', d => {
        const min = d3.max([this.axisLeft.domain[0], 0]);
        const max = d3.max([d.y, this.axisLeft.domain[0]])
        return d.y < 0 
          ? this.axisLeft.scale(max) - this.axisLeft.scale(min)
          : this.axisLeft.scale(min) - this.axisLeft.scale(max)
      })
      .attr('y', d => {
        return d.y < 0 ? this.axisLeft.scale(0) : this.axisLeft.scale(d.y)
      })
      .attr('x', d => bottomXGroupScale(d.x))
    }

    // Add new column groups
    const newColumnGroup = columnGroup.enter().append("g").attr("class", "column-group").call(updateColumnGroup);
    newColumnGroup.selectAll(".column").data(d => d.groups, k => k.x).enter()
      .append("rect")
      .attr('class', 'column')
      .call(updateColumn);

    // Update column group
    columnGroup.call(updateColumnGroup);
    columnGroup.exit().remove();

    // Update columns
    const columns = columnGroup.selectAll(".column").data(d => d.groups, k => k.x);
    columns.enter().append("rect").attr("class", "column").call(updateColumn);
    columns.call(updateColumn)
    columns.exit().remove();
  }

}

// Stacked Column Chart
class StackedColumnChart extends Chart {

  constructor(id, config) {
    super(id, config);
    this.axisBottom.type = "scaleBand"
    this.draw();
    this.columnGroup.el = this.body.el.append('g').attr('class', 'chart__columns')
    this.update();
  }

  update(config) {

    super.update(config);
    
    const values = [];
    this.datasets.forEach(d => {d.values.forEach(r => {if (values.indexOf(r.x) === -1) {values.push(r.x)}})});
    this.axisBottom.domain = values;

    super.drawBottomAxis();

    const stackedGroupData = this.axisBottom.domain.map(groupName => {
      let groupValues = this.datasets.map(dataset => {
         const values = dataset.values;
         const matched = values.find(d => d.x === groupName) || {};
         return {
            y: matched.y || 0,
            x: dataset.name,
            color: dataset.color,
            order: dataset.order || 0
         }
      });

      groupValues.sort((a,b) => {
         return a.order - b.order;
      })

      // Stack Data
      groupValues.forEach((d, i) => {
         const previousValue = groupValues[i-1] || {};
         const previousY1 = previousValue.y1 || 0;
         d.y1 = previousY1 + d.y;
         d.y0 = previousY1;
      })

      return {
         x: groupName,
         groups: groupValues,
         min: groupValues[0].y0 || 0,
         max: groupValues[groupValues.length - 1].y1 || 0,
      }
    })

    this.axisLeft.domain = [d3.min(stackedGroupData, d => d.min), d3.max(stackedGroupData, d => d.max)]
    super.drawLeftAxis();

    const updateColumnGroup = (node) => {
      node.attr("transform", d => "translate(" + this.axisBottom.scale(d.x) + ", 0)")
      .attr("width", this.axisBottom.scale.bandwidth())
    }

    const updateColumn = (node) => {
      node.attr('width', this.axisBottom.scale.bandwidth())
      .style('fill', d => d.color)
      .attr('height', d => {
        const min = d3.max([this.axisLeft.domain[0], d.y0])
        const rectHeight = this.axisLeft.scale(min) - this.axisLeft.scale(d.y1);
        return d3.max([0, rectHeight]);
      })
      .attr('y', d => {
        return this.axisLeft.scale(d.y1)
      })
      .attr('x', d => this.axisBottom.scale(d.x))
    }

    const columnGroup = this.columnGroup.el.selectAll(".column-group").data(stackedGroupData, (d) => d.x);    

    const newColumnGroup = columnGroup.enter().append("g").attr("class", "column-group").call(updateColumnGroup)
    newColumnGroup.selectAll(".column").data(d => d.groups, k => k.x).enter().append("rect").attr("class", "column").call(updateColumn)

    columnGroup.call(updateColumnGroup);
    columnGroup.exit().remove();

    // Update columns
    const columns = columnGroup.selectAll(".column").data(d => d.groups, k => k.x);
    columns.enter().append("rect").attr("class", "column").call(updateColumn);
    columns.call(updateColumn)
    columns.exit().remove();
      
  }

}

// Bar Chart
class BarChart extends Chart {

  constructor(id, config) {
    super(id, config);
    this.axisBottom.type = "scaleLinear";
    this.axisLeft.type = "scaleBand";
    this.draw();
    this.barGroup.el = this.body.el.append('g').attr('class', 'chart__bars')
    this.update();
  }

  update(config) {

    super.update(config);
    
    const values = [];
    this.datasets.forEach(d => {d.values.forEach(r => {if (values.indexOf(r.x) === -1) {values.push(r.x)}})});
    this.axisLeft.domain = values.reverse();

    super.drawLeftAxis();  

    this.axisBottom.domain = [
      this.axisBottom.min === 'auto' ? d3.min(this.datasets.map(d => d3.min(d.values, r => r.y))) : this.axisBottom.min,
      this.axisBottom.max === 'auto' ? d3.max(this.datasets.map(d => d3.max(d.values, r => r.y))) : this.axisBottom.max
    ];

    super.drawBottomAxis();
    
    // Add columns
    const barGroupData = this.axisLeft.domain.map(groupName => {
      const groupValues = [];
      this.datasets.forEach(c => {
        const value = c.values.find(d => d.x === groupName);
        if (value) {
          groupValues.push({
            x: c.name,
            y: value.y,
            color: c.color,
            axis: c.axis
          });
        }
      })
      return {
        x: groupName,
        groups: groupValues
      }
    });

    let axisLeftGroupDomain = this.datasets.map(d => d.name);
    const axisLeftGroupScale = d3
      .scaleBand()
      .rangeRound([0, this.axisLeft.scale.bandwidth()])
      .domain(axisLeftGroupDomain)
      .padding(this.axisLeft.innerPadding || 0)

    const updateBarGroup = (node) => {
      node.attr("transform", d => "translate(0, " + this.axisLeft.scale(d.x) + ")")
      .attr("height", this.axisLeft.scale.bandwidth())
    }

    const updateBar = (node) => {
      node.style('fill', d => d.color)
      .attr('height', axisLeftGroupScale.bandwidth())
      .attr('width', d => {
        const min = d3.max([this.axisBottom.domain[0], 0]);
        return d.x < 0 
            ? this.axisBottom.scale(min) - this.axisBottom.scale(d.y)
            : this.axisBottom.scale(d.y) - this.axisBottom.scale(min)
      })
      .attr('x', () => {
        const min = d3.max([this.axisBottom.domain[0], 0]);
        return this.axisBottom.scale(min)
      })
      .attr('y', d => axisLeftGroupScale(d.x))
    }

    const barGroup = this.barGroup.el.selectAll(".bar-group").data(barGroupData, (d) => d.x);    

    const newBarGroup = barGroup.enter().append("g").attr("class", "bar-group").call(updateBarGroup)
    newBarGroup.selectAll(".bar").data(d => d.groups, k => k.x).enter().append("rect").attr('class', 'bar').call(updateBar)
      
    // Update groups
    barGroup.call(updateBarGroup)
    barGroup.exit().remove()

    // Update columns
    const bars = barGroup.selectAll(".bar").data(d => d.groups, k => k.x);
    bars.enter().append("rect").attr("class", "column").call(updateBar);
    bars.call(updateBar)
    bars.exit().remove();
  }

}

// Bar Chart
class StackedBarChart extends Chart {

  constructor(id, config) {
    super(id, config);
    this.axisBottom.type = "scaleLinear";
    this.axisLeft.type = "scaleBand";
    this.draw();
    this.barGroup.el = this.body.el.append('g').attr('class', 'chart__bars')
    this.update();
  }

  update(config) {

    super.update(config);
    
    const values = [];
    this.datasets.forEach(d => {d.values.forEach(r => {if (values.indexOf(r.x) === -1) {values.push(r.x)}})});
    this.axisLeft.domain = values.reverse();
    super.drawLeftAxis();

    const stackedGroupData = this.axisLeft.domain.map(groupName => {
      let groupValues = this.datasets.map(dataset => {
         const values = dataset.values;
         const matched = values.find(d => d.x === groupName) || {};
         return {
            x: dataset.name,
            y: matched.y || 0,
            color: dataset.color,
            order: dataset.order || 0
         }
      });

      groupValues.sort((a,b) => {
         return a.order - b.order;
      })

      // Stack Data
      groupValues.forEach((d, i) => {
         const previousValue = groupValues[i-1] || {};
         const previousY1 = previousValue.y1 || 0;
         d.y1 = previousY1 + d.y;
         d.y0 = previousY1;
      })

      return {
         x: groupName,
         groups: groupValues,
         min: groupValues[0].y0 || 0,
         max: groupValues[groupValues.length - 1].y1 || 0,
      }
    })

    this.axisBottom.domain = [d3.min(stackedGroupData, d => d.min), d3.max(stackedGroupData, d => d.max)]
    super.drawBottomAxis();
    
    const updateBarGroup = (node) => {
      node.attr("transform", d => "translate(0, " + this.axisLeft.scale(d.x) + ")")
        .attr("height", this.axisLeft.scale.bandwidth()) 
    }

    const updateBar = (node) => {
      node.style('fill', d => d.color)
        .attr('height', this.axisLeft.scale.bandwidth())
        .attr('width', d => {
          const min = d3.max([this.axisBottom.domain[0], d.y0])
          const rectHeight = this.axisBottom.scale(d.y1) - this.axisBottom.scale(min);
          return d3.max([0, rectHeight]);
        })
        .attr('x', d => {
          return this.axisBottom.scale(d.y0)
        })
        .attr('y', d => this.axisLeft.scale(d.x))
    }

    const barGroup = this.barGroup.el.selectAll(".bar-group").data(stackedGroupData, (d) => d.x);
    const newBarGroup = barGroup.enter().append("g").attr("class", "bar-group").call(updateBarGroup)
    
    newBarGroup.selectAll(".bar").data(d => d.groups, k => k.x).enter()
      .append("rect")
      .attr("class", "bar")
      .call(updateBar)

    barGroup.call(updateBarGroup);
    barGroup.exit().remove();

    // Update bars
    const bars = barGroup.selectAll(".bar").data(d => d.groups, k => k.x);
    bars.enter().append("rect").attr("class", "column").call(updateBar);
    bars.call(updateBar)
    bars.exit().remove();
  }

}

export {
  LineChart,
  ColumnChart,
  StackedColumnChart,
  BarChart,
  StackedBarChart
}