onmessage = function (message) {
    console.log("Worker started, message: ",message.data);
    const start = Date.now();
let sum = 0;
    for (let index = 0; index < 10000000000; index++) {
        sum += index;
        
    }
    const end = Date.now();
    console.log("Worker finished in (ms): ",end-start);
    postMessage(sum);
}