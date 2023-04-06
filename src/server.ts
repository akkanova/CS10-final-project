import { readFileSync } from 'fs';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { join } from 'path';

const handlers = new Map<string, Handler>();
const host = process.argv[2] ?? "127.0.0.1";
const port = 8080;

(() => {
  const server = createServer((req, res) => {
    const hander = route(req);
    hander.process(req, res);
  });

  server.listen(port, host);
  console.log("Listening to :", "http://" + host + ":" + port);
})();

function route(req: IncomingMessage) {
  let hander = handlers.get(req.url);
  if (!hander) {
    hander = createHandler(req);
    handlers.set(req.url, hander);
  }
  return hander;
}

function createHandler(req: IncomingMessage) {
  const path = join(__dirname, ".." + req.url);

  try {
    const file = readFileSync(path);
    return new Handler((_, res) => {
      res.writeHead(200, { "Content-Type": handleFileType(req.url) });
      res.write(file);
      res.end();
    });
  } catch {
    return new Handler((_, res) => {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.write("No route registered for " + req.url);
      res.end();
    });
  }
}

function handleFileType(url: string) {
  const ext = url.substring(url.lastIndexOf(".") + 1);
  // For more extension take a look at this :https://stackoverflow.com/questions/4576483/how-to-get-the-content-type-of-a-file-at-runtime
  switch (ext) {
    case "css":
      return "text/css";
    case "gif":
      return "image/gif";
    case "htm":
      return "text/html";
    case "html":
      return "text/html";
    case "jpeg":
      return "image/jpeg";
    case "jpg":
      return "image/jpeg";
    case "js":
      return "application/x-javascript";
    case "png":
      return "image/png";
    default:
      return "text/plain";
  }
}

class Handler {
  constructor(private readonly callback: (req: IncomingMessage, res: ServerResponse) => any) {}
  public process = (req: IncomingMessage, res: ServerResponse) => this.callback(req, res);
}

handlers.set(
  "/",
  new Handler((_, res) => {
    res.writeHead(302, { Location: "/public/homepage.html" });
    res.write("Redirecting you..");
    res.end();
  })
);
