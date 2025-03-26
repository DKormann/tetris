export {}

const container = document.createElement("canvas")

const s = 50
const x = 8
const y = 14

container.width = x * s
container.height = y * s
document.body.appendChild(container)

const context = container.getContext("2d")!

function line(x1: number, y1: number, x2: number, y2: number){
  context.strokeStyle = "gray"
  context.beginPath()
  context.moveTo(x1, y1)
  context.lineTo(x2, y2)
  context.stroke()
}

for (let i = 1; i < x; i += 1)line(i*s, 0, i*s, y*s)
for (let i = 1; i < y; i += 1)line(0, i*s, x*s, i*s)

let pieces = [
  [[0, 0, 0, 0],[1, 1, 1, 1],],
  [[1, 1, 0, 0],[1, 1, 0, 0],],
  [[1, 1, 0, 0],[0, 1, 1, 0],],
  [[1, 1, 1, 0],[0, 0, 1, 0],],
  [[0, 1, 0, 0],[1, 1, 1, 0],],
  [[1, 0, 0, 0],[1, 1, 1, 0],],
  [[0, 1, 1, 0],[1, 1, 0, 0]],
]

pieces = pieces.map(p=>[...p, [0,0,0,0],[0,0,0,0]])

type Pos = {x: number, y: number}
let piece = pieces[0]
let pos = {x: 0, y: -1}

function getPieceTile(){
  return piece.map((row, i) => row.map((cell, j) => cell ? [{x: pos.x + j, y: pos.y + i}] : [])).flat(2)
}


const world = Array.from({length: y}, () => Array.from({length: x}, () => 0))

function draw(tiles: Pos[]){tiles.map(tile=>world[tile.y][tile.x] = 1)}
function clear(tiles: Pos[]){tiles.map(tile=>world[tile.y][tile.x] = 0)}
function check(tiles: Pos[]){return tiles.every(tile =>
  tile.y < y && tile.x >= 0 && tile.x < x && tile.y >= 0 && !world[tile.y][tile.x]
)}

function view(){
  const pct = getPieceTile()
  world.map((row, y) => 
    row.map((cell, x) => {
      context.fillStyle = cell ? "blue" :
      !pct.every(tile => tile.x !== x || tile.y !== y) ? "red" : "white"
      context.fillRect(x * s + 1, y * s + 1, s-2, s-2)

    })
  )
}

function update(){
  if (!move(0, 1)){
    draw(getPieceTile())
    pos = {x: 0, y: 0}
    piece = pieces[Math.floor(Math.random() * pieces.length)]
    if (!check(getPieceTile())) {
      clearInterval(loopid)
      alert("Game Over")
    }
    console.log(piece);
    
  }
  
  for (let y = 0; y < world.length; y += 1){
    if (world[y].every(cell => cell === 1)){
      world.splice(y, 1)
      world.unshift(Array.from({length: x}, () => 0))
    }
  }
  view()
}

function move(x:number, y:number){
  clear(getPieceTile())
  pos.y += y
  pos.x += x
  let res = check(getPieceTile())
  if (!res) {
    pos.y -= y
    pos.x -= x
  }
  // draw(getPieceTile())
  return res
}

const loopid =  setInterval(update, 400)

function rotate(){
  const prev = piece
  clear(getPieceTile())
  piece = piece[0].map((_, i) => piece.map(row => row[i])).reverse()
  if (!check(getPieceTile())) piece = prev
  // draw(getPieceTile())
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") move(1, 0)
  if (e.key === "ArrowLeft") move(-1, 0)
  if (e.key === "ArrowDown") move(0, 1)
  if (e.key === " " || e.key === "ArrowUp") rotate()
  view()

})

