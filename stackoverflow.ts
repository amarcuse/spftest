import * as fs from 'node:fs';

const sleep = t => new Promise(rs => setTimeout(rs, t))

// read domains.csv and put lines into an array
const domains:string[] = fs.readFileSync('500.csv', 'utf8').split('\n')
const iterator = domains.entries()

// const results = [] || Array(someLength)

async function doWork (workerIterator, i) {
  for (let [index, item] of workerIterator) {
    await sleep(1000)
    console.log(`Worker#${i}: ${index},${item}`)

    // in case you need to store the results in order
    // results[index] = item + item

    // or if the order dose not mather
    // results.push(item + item)
  }
}

const workers = Array(50).fill(iterator).map(doWork)
//    ^--- starts two workers sharing the same iterator

Promise.allSettled(workers).then(console.log.bind(null, 'done'))