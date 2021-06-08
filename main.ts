import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { SmtpClient } from "https://deno.land/x/smtp/mod.ts";


// The filename is the first invocation argument
const filename = Deno.args[0] // Same name as downloaded_filename
const text = await Deno.readTextFile(filename);

const doc = new DOMParser().parseFromString(text, "text/html")!;

const script = doc.querySelector("script")!;

const scriptLines = script.textContent.split("\n");

const stores = scriptLines.filter((line: string) => line.includes("StoreCodeName"))

console.log(stores)

const previous = await Deno.readTextFile("./stores.json");
const previousResult = JSON.parse(previous);

if(stores != previousResult) {
    const email = Deno.env.get("EMAIL_USERNAME");
    const recepient = Deno.env.get("EMAIL_RECEPIENT");

    const client = new SmtpClient();


    await client.connectTLS({
        hostname: "smtp.gmail.com",
        port: 465,
        username: email || "",
        password: Deno.env.get("EMAIL_PASSWORD"),
      });

      await client.send({
        from: email || "",
        to: recepient || "",
        subject: "OMG NEW TV!!",
        content: `${stores}`,
      });
      
      await client.close();
      
}



const write = Deno.writeTextFile("./stores.json", JSON.stringify(stores)); 