let express = require("express");
let ejs = require("ejs");
let puppeteer = require("puppeteer");

let app = express();
app.set("view engine", "ejs");
const FILE_NAME = "TRANSACT-417";

// here define all the variables
const DATA = {
  bopNo: "202102/0006",
  inspectionId: "12345",
  appointmentDate: "01/01/2021",
  inspectionDate: "01/01/2021",
  purchasePrice: "10000",
  bidPrice: "15000",
  handlingFee: "200",
  commission: "1000",
  qrCode: "512048_ODO-CR",
  owner: {
    name: "Owner Name",
    ic: "940101102345",
    address: "Jalan Hulubalang 37A, Taman Millennium Sentosa, Klang",
    phoneNo: "0120101010",
    email: "testing@test.com",
    position: "", // empty string
  },
  oePic: {
    name: "Operation Executive",
    ic: "", // empty string
    email: "oepic@carsome.com",
    position: "", // empty string,
  },
  car: {
    details: "Bufori MK II No Variant",
    year: "1994",
    engine: "1.8",
    transmission: "Auto",
    colour: "Silver",
    engineNo: "12345",
    chassisNo: "12345",
    licensePlate: "WWW 1000",
  },
  sa: {
    name: "SA Name",
    ic: "901010101234",
    phoneNo: "0121010101",
    email: "SAemail@testing.com",
    dealership: {
      name: "Dealer Ship Name",
      address: "Jalan Hulubalang 37A, Taman Millennium Sentosa, Klang",
    },
    bankName: "Maybank Sdn Bhd",
    beneficiaryName: "SA Name",
    accountNo: "A0213123",
  },
};

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
