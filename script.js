/* Set the time format
  Ref: https://github.com/d3/d3-time-format */
const parseDate = d3.timeParse("%d/%m/%Y");
const parseTime = d3.timeParse("%H:%M");

/* Load the dataset and formatting variables
  Ref: https://www.d3indepth.com/requests/ */
const loadCSV = d3.csv("./data_to_viz.csv", d => {
  return {
    year: +d.year,
    date: parseDate(d.date),
    time: parseTime(d.time),
    longitude: +d.longitude,
    latitude: +d.latitude  
  };
});

const loadGB = d3.json("https://cdn.jsdelivr.net/gh/ONSvisual/topojson_boundaries@master/geogGBregion.json?short_path=6bd9372"); 

const controls = d3.select("#bar")
  .append("div")
  .attr("class", "controls");

const playPauseButton = controls.append("button")
  .attr("type", "button")
  .text("Pause");

let slider = null;

const width = 1400;
const height = 670;

const mapWidth = 700;
const mapHeight = height;

const chartX = 700;
const chartY = 50;
const chartWidth = width / 2.7;
const chartHeight = height / 2.7;

const chartMargin = { top: 20, right: 20, bottom: 30, left: 40 };
const innerChartWidth = chartWidth - chartMargin.left - chartMargin.right;
const innerChartHeight = chartHeight - chartMargin.top - chartMargin.bottom;

const hourChartY = chartY + chartHeight + 80;
const hourChartWidth = chartWidth;
const hourChartHeight = chartHeight;

const hourMargin = { top: 20, right: 20, bottom: 30, left: 40 };
const innerHourWidth = hourChartWidth - hourMargin.left - hourMargin.right;
const innerHourHeight = hourChartHeight - hourMargin.top - hourMargin.bottom;

const svg = d3.select("#bar")
  .append("svg")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .style("width", "100%")
  .style("height", "auto")
  .style("border", "1px solid #cbd0e2ff");

const mapLayer = svg.append("g")
  .attr("class", "map-layer");

const accidentsLayer = svg.append("g")
  .attr("class", "accidents-layer");

const timelineLayer = svg.append("g")
  .attr("class", "timeline-layer")
  .attr("transform", `translate(${chartX},${chartY})`);

timelineLayer.append("text")
  .attr("x", chartMargin.left + innerChartWidth / 2)
  .attr("y", -5)
  .attr("text-anchor", "middle")
  .attr("font-size", 12)
  .attr("font-weight", "bold")
  .attr("fill", "#333333")
  .text("Number of fatal collisions by year")

const tlInner = timelineLayer.append("g")
  .attr("transform", `translate(${chartMargin.left},${chartMargin.top})`);

const hourLayer = svg.append("g")
  .attr("class", "hour-layer")
  .attr("transform", `translate(${chartX},${hourChartY})`);

hourLayer.append("text")
  .attr("x", hourMargin.left + innerHourWidth / 2)
  .attr("y", -5)
  .attr("text-anchor", "middle")
  .attr("font-size", 12)
  .attr("font-weight", "bold")
  .attr("fill", "#333333")
  .text("Hourly distribution within year");

const hourInner = hourLayer.append("g")
  .attr("transform", `translate(${hourMargin.left},${hourMargin.top})`);

const yearLabel = svg.append("text")
  .attr("x", 10)
  .attr("y", 25)
  .attr("font-size", 16)
  .attr("fill", "#000000ff")
  .text("");

const countLabel = svg.append("text")
  .attr("x", 10)
  .attr("y", 50)
  .attr("font-size", 16)
  .attr("fill", "#000000ff")
  .text("");

let xTL;
let yTL;
let lineGenerator;
let timelineMarker;

let xHour;
let yHour;
let hourBars;
let yHourAxis;
let hours;

Promise.all([loadCSV, loadGB])
  .then(([data, gb]) => {

    console.log(data);

    const regionsGeoJSON = topojson.feature(gb, gb.objects.GBregion);

    const projection = d3.geoMercator()
      .fitSize([mapWidth, mapHeight], regionsGeoJSON);

    const path = d3.geoPath().projection(projection);

    mapLayer.append("g")
      .selectAll("path")
      .data(regionsGeoJSON.features)
      .join("path")
        .attr("d", path)
        .attr("fill", "#b9cce5ff");

    const borders = topojson.mesh(
      gb,
      gb.objects.GBregion,
      (a, b) => a !== b
    );

    mapLayer.append("path")
      .datum(borders)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 0.15)
      .attr("d", path);

    const years = Array.from(
      new Set(data.map(d => d.year))
    ).sort((a, b) => d3.ascending(a, b));

    const yearCountsMap = d3.rollup(
      data,
      v => v.length,
      d => d.year
    );

    const yearSeries = years.map(year => ({
      year: year,
      count: yearCountsMap.get(year) || 0
    }));

    slider = controls.append("input")
      .attr("type", "range")
      .attr("min", 0)
      .attr("max", years.length - 1)
      .attr("step", 1)
      .attr("value", 0);

    const sliderLabel = controls.append("span")
  .attr("class", "slider-label")
  .text(" ");

    xTL = d3.scaleLinear()
      .domain(d3.extent(yearSeries, d => d.year))
      .range([0, innerChartWidth]);

    yTL = d3.scaleLinear()
      .domain([0, d3.max(yearSeries, d => d.count)])
      .nice()
      .range([innerChartHeight, 0]);

    lineGenerator = d3.line()
      .x(d => xTL(d.year))
      .y(d => yTL(d.count))
      .curve(d3.curveMonotoneX);

    const xAxis = d3.axisBottom(xTL)
      .ticks(5)
      .tickFormat(d3.format("d"));

    const yAxis = d3.axisLeft(yTL)
      .ticks(4);

    tlInner.append("g")
      .attr("transform", `translate(0,${innerChartHeight})`)
      .call(xAxis)
      .selectAll("text")
        .attr("font-size", 10);

    tlInner.append("g")
      .call(yAxis)
      .selectAll("text")
        .attr("font-size", 10);

    tlInner.append("path")
      .datum(yearSeries)
      .attr("fill", "none")
      .attr("stroke", "#bbbbbb")
      .attr("stroke-width", 1)
      .attr("d", lineGenerator);

    timelineMarker = tlInner.append("circle")
      .attr("r", 3)
      .attr("fill", "#fb1e1eff");

    tlInner.append("text")
      .attr("x", innerChartWidth / 2)
      .attr("y", innerChartHeight + 30)
      .attr("text-anchor", "middle")
      .attr("font-size", 12)
      .text("Year");

    tlInner.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerChartHeight / 2)
      .attr("y", -48)
      .attr("text-anchor", "middle")
      .attr("font-size", 12)
      .text("Fatalities");

    hours = d3.range(0, 24);

    xHour = d3.scaleBand()
      .domain(hours)
      .range([0, innerHourWidth])
      .padding(0.1);

    yHour = d3.scaleLinear()
      .domain([0, 1])
      .range([innerHourHeight, 0]);

    const xHourAxis = d3.axisBottom(xHour)
      .tickValues([0, 4, 8, 12, 16, 20, 23]);

    yHourAxis = d3.axisLeft(yHour)
      .ticks(4);

    hourInner.append("g")
      .attr("transform", `translate(0,${innerHourHeight})`)
      .call(xHourAxis)
      .selectAll("text")
        .attr("font-size", 10);

    hourInner.append("g")
      .attr("class", "y-hour-axis")
      .call(yHourAxis)
      .selectAll("text")
        .attr("font-size", 10);

    hourInner.append("text")
      .attr("x", innerHourWidth / 2)
      .attr("y", innerHourHeight + 30)
      .attr("text-anchor", "middle")
      .attr("font-size", 12)
      .text("Hour of day");

    hourInner.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHourHeight / 2)
      .attr("y", -48)
      .attr("text-anchor", "middle")
      .attr("font-size", 12)
      .text("Fatalities");

    hourBars = hourInner.selectAll("rect")
      .data(hours)
      .enter()
      .append("rect")
        .attr("x", h => xHour(h))
        .attr("width", xHour.bandwidth())
        .attr("y", innerHourHeight)
        .attr("height", 0)
        .attr("fill", "#f54545cd")
        .attr("fill-opacity", 0.5);

    function updateYear(year) {
      const yearData = data.filter(d => d.year === year);
      const accidentsCount = yearData.length;

      yearLabel.text(`Year: ${year}`);
      countLabel.text(`Fatalities: ${accidentsCount}`);

      accidentsLayer.selectAll("circle").remove();

      accidentsLayer.selectAll("circle")
        .data(yearData)
        .enter()
        .append("circle")
          .attr("cx", d => projection([d.longitude, d.latitude])[0])
          .attr("cy", d => projection([d.longitude, d.latitude])[1])
          .attr("r", 0)
          .attr("fill", "#fb1e1eff")
          .attr("fill-opacity", 0.4)
        .transition()
          .duration(300)
          .attr("r", 1.3);

      const currentPoint = yearSeries.find(d => d.year === year);
      if (currentPoint) {
        timelineMarker
          .attr("cx", xTL(currentPoint.year))
          .attr("cy", yTL(currentPoint.count));
      }

      const yearWithTime = yearData.filter(d => d.time);
      const hourCountsMap = d3.rollup(
        yearWithTime,
        v => v.length,
        d => d.time.getHours()
      );

      const maxHourForYear = d3.max(hours, h => hourCountsMap.get(h) || 0) || 1;

      yHour.domain([0, maxHourForYear]).nice();

      hourInner.select(".y-hour-axis")
        .transition()
        .duration(300)
        .call(yHourAxis);

      hourBars
        .transition()
        .duration(300)
        .attr("y", h => {
          const c = hourCountsMap.get(h) || 0;
          return yHour(c);
        })
        .attr("height", h => {
          const c = hourCountsMap.get(h) || 0;
          return innerHourHeight - yHour(c);
        });
    }

    let yearIndex = 0;
    const delay = 1000;
    let isPlaying = true;
    let timerId = null;

    function goToYearIndex(index, fromUser) {
      if (index < 0) index = 0;
      if (index >= years.length) index = years.length - 1;

      yearIndex = index;
      const year = years[yearIndex];
      updateYear(year);

      if (!fromUser && slider) {
        slider.property("value", yearIndex);
      }
    }

    function scheduleNext() {
      if (!isPlaying) {
        return;
      }
      timerId = setTimeout(() => {
        const nextIndex = (yearIndex + 1) % years.length;
        goToYearIndex(nextIndex, false);
        scheduleNext();
      }, delay);
    }

    goToYearIndex(0, false);
    scheduleNext();

    playPauseButton.on("click", () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        playPauseButton.text("Pause");
        scheduleNext();
      } else {
        playPauseButton.text("Play");
        if (timerId !== null) {
          clearTimeout(timerId);
          timerId = null;
        }
      }
    });

    slider.on("input", event => {
      const index = +event.target.value;

      if (isPlaying) {
        isPlaying = false;
        playPauseButton.text("Play");
        if (timerId !== null) {
          clearTimeout(timerId);
          timerId = null;
        }
      }

      goToYearIndex(index, true);
    });
  });
