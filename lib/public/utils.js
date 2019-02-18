const {d3WithGantt: d3} = require('./d3-with-gantt')

const serviceColors = {}

export function showGantt($vis, element, measures, data) {
  const tasksWithColors = data.sort((t1,t2) => t1.startDate-t2.startDate).map(task => {
    task.color = getTaskColor(task)
    return task
  })

  const taskNames = tasksWithColors.map(x => x.taskName).filter((elem, pos, result) => result.indexOf(elem) == pos)
  const gantt = d3.gantt(tasksWithColors).taskTypes(taskNames).margin(measures.margin).width(measures.width).height(measures.height)
  gantt(tasksWithColors, element)

  console.log('done')
}

function getTaskColor(task) {
  const s = task.service || '_'
  if (!serviceColors[s]) {
    serviceColors[s] = getRandomColor()
  }
  return serviceColors[s]
}

function getRandomColor() {
  let letters = '6789ABCDE'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)]
  }
  return color
}
