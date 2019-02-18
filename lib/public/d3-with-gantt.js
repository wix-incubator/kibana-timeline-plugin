import d3 from 'd3'

d3.gantt = function () {
  let margin, x, y, xAxis, yAxis, timeDomainStart, timeDomainEnd, width, height, taskTypes
  const tickFormat = "%S.%L"

  let keyFunction = function (d) {
    return d.startDate + d.taskName + d.endDate
  }

  let rectTransform = function (d) {
    return "translate(" + x(d.startDate) + "," + y(d.taskName) + ")"
  }

  let initTimeDomain = function (tasks) {
    if (tasks === undefined || tasks.length < 1) {
      timeDomainStart = d3.time.day.offset(new Date(), -3)
      timeDomainEnd = d3.time.hour.offset(new Date(), +3)
      return
    }
    tasks.sort(function (a, b) {
      return a.endDate - b.endDate
    })
    timeDomainEnd = tasks[tasks.length - 1].endDate
    tasks.sort(function (a, b) {
      return a.startDate - b.startDate
    })
    timeDomainStart = tasks[0].startDate
  }

  let initAxis = function () {
    x = d3.time.scale().domain([timeDomainStart, timeDomainEnd]).range([0, width]).clamp(true)
    y = d3.scale.ordinal().domain(taskTypes).rangeRoundBands([0, height - margin.top - margin.bottom], .1)
    xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true).tickSize(8).tickPadding(8)
    yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0)
  }

  let durationDisplay = duration_sec => {
    const duration = parseFloat(duration_sec)
    if(duration > 0.005) {
      return `[${duration.toFixed(4)} s]`
    }
    return ''
}

  function gantt(tasks, element) {
    initTimeDomain(tasks)
    initAxis()

    let svg = d3.select(element)
      .append("svg")
      .attr("class", "chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("class", "gantt-chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")

    const rec = svg.selectAll(".chart").data(tasks, keyFunction).enter()
    rec.append("rect")
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("stroke", "black")
      .attr("fill", function (d) {
        if (d.color == null) {
          return "#ff00e6"
        }
        return d.color
      })
      .attr("y", 0)
      .attr("transform", rectTransform)
      .attr("height", function () {
        return y.rangeBand()
      })
      .attr("width", function (d) {
        const w = (x(d.endDate) - x(d.startDate))
        if (w < 1) {
          return 1
        }
        return w
      })
      .append("title").text(d => `${d.taskName}: ${durationDisplay(d.duration_sec)}`)
    rec.append("text")
      .attr('dy', 12)
      .attr('dx', 2)
      .attr("transform", rectTransform)
      .text((d) => durationDisplay(d.duration_sec))

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
      .transition()
      .call(xAxis)

    svg.append("g").attr("class", "y axis").transition().call(yAxis)

    svg.selectAll('g.y.axis g text').each(function (d) {
      const el = d3.select(this);
      const words = d.split(' ');
      el.text('');

      for (let i = 0; i < words.length; i++) {
        const tspan = el.append('tspan').text(words[i]);
        if (i > 0) {
          tspan.attr('x', -2).attr('dy', '15');
        }
      }
    })
    return gantt

  }

  gantt.margin = function (value) {
    if (!arguments.length)
      return margin
    margin = value
    return gantt
  }

  gantt.timeDomain = function (value) {
    if (!arguments.length)
      return [timeDomainStart, timeDomainEnd]
    timeDomainStart = +value[0], timeDomainEnd = +value[1]
    return gantt
  }

  gantt.taskTypes = function (value) {
    if (!arguments.length)
      return taskTypes
    taskTypes = value
    return gantt
  }

  gantt.width = function (value) {
    if (!arguments.length)
      return width
    width = +value
    return gantt
  }

  gantt.height = function (value) {
    if (!arguments.length)
      return height
    height = +value
    return gantt
  }

  return gantt
}

export const d3WithGantt = d3