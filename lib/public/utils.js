const {d3WithGantt: d3} = require('./d3-with-gantt')

export function showGantt($vis, element, measures, data) {
  const tasksWithColors = data.map(task => {
    task.color = getRandomColor()
    return task
  })

  console.log({tasksWithColors})

  const taskNames = tasksWithColors.map(x => x.taskName).filter((elem, pos, result) => result.indexOf(elem) == pos)
  const gantt = d3.gantt(tasksWithColors).taskTypes(taskNames).margin(measures.margin).width(measures.width).height(measures.height)
  gantt(tasksWithColors, element)

  console.log('done')
}

function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
