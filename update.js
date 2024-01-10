try {
  var { existsSync, writeFileSync, removeSync, mkdirSync, copySync, readdirSync, createWriteStream } = require("fs-extra"),
    axios = require("axios"),
    extract = require("extract-zip"),
    exec = require('child_process').exec;
} catch {
  return console.error("[!] Currently, you haven't installed the required packages for updating. Run 'npm install --save fs-extra axios extract-zip child_process' in your CMD/terminal.");
}

try {
  var configValue = require("./config.json");
  console.log("Found the config file.");
} catch (error) {
  if (error) return console.log("Bot config file not found!");
}

(async () => {
  try {
    console.log("====== PLEASE DO NOT CLOSE THIS CMD/TERMINAL UNTIL THE UPDATE IS COMPLETE ======");
    await backup(configValue);
    await clone();
    await clean();
    await unzip();
    await install();
    await modules();
    await finish(configValue);
  } catch (e) {
    console.log(e);
  }
})();

async function backup(configValue) {
  console.log('-> Removing old backup');
  removeSync(process.cwd() + '/GK');
  console.log('-> Backing up data');
  mkdirSync(process.cwd() + '/GK');
  mkdirSync(process.cwd() + "/GK/main");
  if (existsSync('./modules')) copySync('./modules', './GK/modules');
  if (existsSync(`./${configValue.APPSTATEPATH}`)) copySync(`./${configValue.APPSTATEPATH}`, `./GK/${configValue.APPSTATEPATH}`);
  if (existsSync('./config.json')) copySync('./config.json', './GK/config.json');
  if (existsSync(`./includes/${configValue.DATABASE.sqlite.storage}`)) copySync(`./includes/${configValue.DATABASE.sqlite.storage}`, `./GK/${configValue.DATABASE.sqlite.storage}`);
}

async function clean() {
  console.log('-> Removing old version');
  readdirSync('.').forEach(item => {
    if (item != 'GK') removeSync(item);
  });
}

async function clone() {
  console.log('-> Downloading the new update');
  const response = await axios({
    method: 'GET',
    url: "https://github.com/KhangGia1810/SenBot/archive/refs/heads/main.zip",
    responseType: "stream"
  });

  const writer = createWriteStream("./GK/main.zip");

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', (e) => reject('[!] Unable to download the update [!] ' + e));
  });
}

function unzip() {
  console.log('-> Unzipping the new update');
  return extract("./GK/main.zip", { dir: process.cwd() + "/GK/main" }, (error) => {
    console.log(error);
    if (error) throw new Error(error);
    else return;
  });
}

function install() {
  console.log('-> Installing the new update');
  copySync(process.cwd() + '/GK/main/SenBot-main/', './');
  return;
}

function modules() {
  return new Promise(function (resolve, reject) {
    console.log('-> Installing modules');
    let child = exec('npm install');
    child.stdout.on('end', resolve);
    child.stderr.on('data', data => {
      if (data.toLowerCase().includes('error')) {
        console.error('[!] An error occurred. Please create a post and submit the updateError.log file in the Issues section on Github [!]');
        data = data.replace(/\r?\n|\r/g, '');
        writeFileSync('updateError.log', data);
        console.log("[!] Stopped installing modules due to an error. Users must install modules manually. Proceeding with the final steps [!]");
        resolve();
      }
    });
  });
}

async function finish(configValue) {
  console.log('-> Completion');
  if (existsSync(`./GK/${configValue.APPSTATEPATH}`)) copySync(`./GK/${configValue.APPSTATEPATH}`, `./${configValue.APPSTATEPATH}`);
  if (existsSync(`./GK/${configValue.DATABASE.sqlite.storage}`)) copySync(`./GK/${configValue.DATABASE.sqlite.storage}`, `./includes/${configValue.DATABASE.sqlite.storage}`);
  if (existsSync("./GK/newVersion")) removeSync("./GK/newVersion");
  console.log('>> Update complete <<');
  console.log('>> ALL IMPORTANT DATA HAS BEEN BACKED UP TO THE "GK" FOLDER <<');
  return process.exit(0);
}
