import { readJSON, writeJSON } from 'https://deno.land/x/flat/mod.ts'

// The filename is the first invocation argument
const filename = Deno.args[0] // Same name as downloaded_filename
const text = Deno.readTextFile(filename);

const doc = new DOMParser().parseFromString(text, "text/html")!;

const script = doc.querySelector("script")!;

const scriptLines = script.split("\n");

const stores = scriptLines.filter(line => line.includes("StoreCodeName"))

console.log(stores)

const write = Deno.writeTextFile("./stores.json", JSON.stringify(stores)); 