const fs = require('fs')

if(process.argv.length !== 3) throw "Usage: processlog.js FILE"
const fileName = process.argv[2]
const fileContent = fs.readFileSync(fileName, 'utf8')
const fileLines = fileContent.split(/\r?\n/)

const files = {}
const ordered = []
const output = []

files[1] = { fd: 1, name: 'STDOUT', writes: [] }
//ordered.push(files[1])
files[2] = { fd: 2, name: 'STDERR', writes: [] }
//ordered.push(files[2])

fileLines.forEach((l)=>{
  if(l==='')
    return
  m = l.match(/^([0-9]+) open "(.*)"$/)
  if(m) {
    const fd = m[1]
    const name = m[2]
    //console.log({fd, name})
    files[fd] = { fd, name, writes: [] }
    ordered.push(files[fd])
    return
  }
  m = l.match(/^([0-9]+) write ([0-9]+) /)
  if(m) {
    const fd = m[1]
    const size = m[2]
    //console.log({fd, size})
    if(!(fd in files)) throw `Found write for fd that was not open before: ${fd}`
    files[fd].writes.push(size)
    return
  }
  output.push(l)
})
console.log({ordered, output})

// Statistics
s_nowrites = 0
s_nowrites_files = []
s_onewrite = 0
s_onewrite_files = []
s_morewrites = 0
ordered.forEach((o)=>{
  if(o.writes.length === 0){
    s_nowrites_files.push(o.name)
    s_nowrites++
  } else if(o.writes.length === 1){
    s_onewrite_files.push(o.name)
    s_onewrite++
  } else {
    s_morewrites++
  }
})
console.log(`Total number of files: ${ordered.length}`)
console.log(`Files not written to: ${s_nowrites}`)
console.log(`Files with exactly one write: ${s_onewrite}`)
console.log(`Files with more writes: ${s_morewrites}`)

s_zero = 0
s_aligned = 0
s_aligned_files = []
s_unaligned = 0
s_unaligned_files = []
ordered.forEach((o)=>{
  if(o.writes.length <= 1) return

  for(var i = 0; i < o.writes.length; i++){
    if(o.writes[i] === 0) {
      s_zero++
      return
    }
  }

  for(var i = 0; i < o.writes.length - 1; i++){
    size = o.writes[i]
    if(size & (size-1)){
      s_unaligned_files.push(o.name)
      s_unaligned++
      return
    }
  }
  s_aligned_files.push(o.name)
  s_aligned++
})
console.log(`Files with more writes, one is zero: ${s_zero}`)
console.log(`Files with more writes, only the last unaligned: ${s_aligned}`)
console.log(`Files with more writes, unaligned: ${s_unaligned}`)

fs.writeFileSync(`${fileName}_nowrites`, s_nowrites_files.join('\n'));
fs.writeFileSync(`${fileName}_onewrite`, s_onewrite_files.join('\n'));
fs.writeFileSync(`${fileName}_aligned`, s_aligned_files.join('\n'));
fs.writeFileSync(`${fileName}_unaligned`, s_unaligned_files.join('\n'));

