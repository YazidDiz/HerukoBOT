// UptimeRobot trick for 24/7
const http = require("http");

http.createServer((_req, res) => {
  res.writeHead(200, "OK", { "Content-Type": "text/plain" });
  res.write("Thanks for using HerukoBot");
  res.end();
}).listen(process.env.PORT || 8080);

console.log("HerukoBot is starting...");

// Create a child process and handle errors
const { spawn } = require("child_process");

function HerukoBot() {
  const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "heruko.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });

  child.on("close", async (exitCode) => {
    if (exitCode === 0) return;
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.warn("HerukoBot is restarting...");
    HerukoBot();
  });

  child.on("error", (error) => {
    console.error("An error occurred: " + JSON.stringify(error));
  });
}

HerukoBot();
