export {}

const container = document.createElement("canvas")

const s = 50
const x = 7
const y = 12

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
  [
    [1, 1, 1, 1],
    [0, 0, 0, 0],
  ],
  [
    [1, 1, 0, 0],
    [1, 1, 0, 0],
  ],
  [
    [1, 1, 0, 0],
    [0, 1, 1, 0],
  ],
  [
    [0, 1, 1, 0],
    [1, 1, 0, 0]
  ],
]

pieces = pieces.map(p=>[...p, [0,0,0,0],[0,0,0,0]])

type Pos = {x: number, y: number}
let piece = pieces[0]
let pos = {x: 0, y: -1}

function getPieceTile(){
  return piece.map((row, i) => row.map((cell, j) => cell ? [{x: pos.x + j, y: pos.y + i}] : [])).flat(2)
}

function draw(color:string, tiles: Pos[]){
  tiles.map(tile => {
    context.fillStyle = color
    context.fillRect(tile.x * s+1, tile.y * s+1, s - 2, s - 2)
  })

}

function check(tiles: Pos[]){
  return tiles.every(tile =>
    tile.y < y && tile.x >= 0 && tile.x < x && tile.y >= 0
  )
}

function update(){
  move(0, 1)
}

function move(x:number, y:number){
  draw("white", getPieceTile())
  pos.y += y
  pos.x += x
  if (!check(getPieceTile())) {
    pos.y -= y
    pos.x -= x
  }
  draw("blue", getPieceTile())
}

setInterval(update, 1000)

function rotate(){
  const prev = piece
  draw("white", getPieceTile())
  piece = piece[0].map((_, i) => piece.map(row => row[i])).reverse()
  if (!check(getPieceTile())) piece = prev
  draw("blue", getPieceTile())
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") move(1, 0)
  if (e.key === "ArrowLeft") move(-1, 0)
  if (e.key === "ArrowDown") move(0, 1)
  if (e.key === " " || e.key === "ArrowUp") rotate()
})

