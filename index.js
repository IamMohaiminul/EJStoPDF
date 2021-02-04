let express = require("express");
let ejs = require("ejs");
let puppeteer = require("puppeteer");

let app = express();
app.set("view engine", "ejs");
const FILE_NAME = "sample";

// here define all the variables
const DATA = {};

// render the ejs template
app.get("/", function (req, res) {
  res.render(FILE_NAME, DATA);
});

// download the pdf based on ejs template
app.get("/download", async function (req, res) {
  const renderedData = await ejs.renderFile(`views/${FILE_NAME}.ejs`, DATA, {
    async: true,
  });

  try {
    // launch puppeteer to generate pdf file
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(renderedData);
    const pdfFile = await page.pdf({ format: "A4" });
    res.writeHead(200, {
      "Content-Disposition": `attachment; filename="${FILE_NAME}.pdf"`,
      "Content-Type": "application/pdf",
    });

    const download = Buffer.from(pdfFile, "base64");
    res.end(download);
  } catch (ex) {
    console.log(ex);
  }
});

app.listen(3001, "localhost", () => {
  console.log("server is running on http://localhost:3001");
});
