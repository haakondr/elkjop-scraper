import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";


// The filename is the first invocation argument
const filename = Deno.args[0] // Same name as downloaded_filename
const text = await Deno.readTextFile(filename);

const doc = new DOMParser().parseFromString(text, "text/html")!;

const script = doc.querySelector("script")!;

const scriptLines = script.textContent.split("\n");

const stores = scriptLines.filter((line: string) => line.includes("StoreCodeName"))

console.log(stores)

const write = Deno.writeTextFile("./stores.json", JSON.stringify(stores)); 