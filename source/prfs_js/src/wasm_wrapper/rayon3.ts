import * as Comlink from "comlink";

async function init() {
  console.log("init()");

  const handlers = await (
    Comlink.wrap(
      new Worker(new URL("./wasm_worker.js", import.meta.url), {
        type: "module"
      })
    ) as any
  ).handlers;

  console.log("init() 22", handlers);

  if (!handlers) {
    console.log("handlers not found");
    return;
  }

  console.log("init() 22", handlers);

  let b = await handlers.multiThread();
  console.log(111, b);

  // let prfs = handler.prfs;
  // console.log("prfsWasm init()", prfs);
  // console.log("prfsWasm f()", await handler.f());

  // let a = await prfs.poseidonHash3([0]);
  // console.log("a 123", a);

  return {
    a: 3
    // b: prfs
  };
}

export default init;
