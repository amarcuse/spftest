#!/usr/bin/env deno run --allow-net --allow-read spf.ts

async function getSPF(domain: string):Promise<string|null> {
  try {
    const txt = await Deno.resolveDns(domain, "TXT", { nameServer: { ipAddr: "8.8.8.8", port: 53 }, timeout: 5000 });
    if (txt.length === 0) {
      // never happens
      //console.log(`No TXTs`, domain);
      return null;
    }

    for (const row of txt) {
      for (const col of row) {
        if (col.startsWith("v=spf1")) {
          return col;
        }
      }
    }

    //console.log(`No SPF TXT`, domain, txt);
    return null;
  } catch (err) {
    // usually "Not Found"
    //console.log(`Error getting SPF`, domain, err);
    return null;
  }
}

async function main() {
  const domains = Deno.readTextFileSync('domains.csv').split('\n');
  const iterator = domains.entries();

  async function doWork(workerIterator, i) {
    for (let [index, item] of workerIterator) {

      const spf = await getSPF(item);
      //console.log(`Worker#${i}: ${index},${item},${spf ? spf : 'no spf'}`);
      if (spf) {
        console.log(spf);
      }
    }
  }

  const workers = Array(50).fill(iterator).map(doWork);
  await Promise.all(workers);
  console.log('done');
}

main();