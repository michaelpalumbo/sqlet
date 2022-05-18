console.clear();

function wait(ms, data) {
  return new Promise( resolve => setTimeout(resolve.bind(this, data), ms) );
}

/** 
 * These will be run in series, because we call
 * a function and immediately wait for each result, 
 * so this will finish in 1s.
 */
async function series() {
  return {
    result1: await wait(500, 'seriesTask1'),
    result2: await wait(500, 'seriesTask2'),
  }
}

/** 
 * While here we call the functions first,
 * then wait for the result later, so 
 * this will finish in 500ms.
 */
async function parallel() {
  const task1 = wait(500, 'parallelTask1');
  const task2 = wait(500, 'parallelTask2');

  return {
    result1: await task1,
    result2: await task2,
  }
}

async function taskRunner(fn, label) {
//   const startTime = performance.now();
  console.log(`Task ${label} starting...`);
  let result = await fn();
  console.log(result)
//   console.log(`Task ${label} finished in ${ Number.parseInt(performance.now() - startTime) } miliseconds with,`, result);
}

// void taskRunner(series, 'series');
void taskRunner(parallel, 'parallel');