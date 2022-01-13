const fs = require('fs')
const minify = require('html-minifier').minify;
const Handlebars = require("handlebars");

// 源文件
let filePath = "./assets/data/folding-crates.json";

// 清洗过后的文件
let outPutFile = "./assets/data/cleaned-folding-crates.json";
let outPutHtmlFile = "./assets/data/cleaned-folding-crates.html";

let cdnDomain = "d3mel6hyuleyuo.cloudfront.net";
let originalDomain = "strapi90m.s3.us-west-1.amazonaws.com";
let mediumPrex = "medium_";
let smallPrex = "small_";


// 要删除的属性
let fields_to_remove = [
  "_id",
  "createdAt",
  "updatedAt",
  "__v",
  "website",
  "website_product_category",
  "product_category",
  "videos",
  "all_attributes_&_source",
  "all_attributes_&_images",
  "all_attributes_&_raw_product_data"
]


try {
  const jsonString = fs.readFileSync(filePath);
  let products = JSON.parse(jsonString);
  let html = `<div class="w3-row-padding w3-padding-32">`

  products.forEach(product => {


    fields_to_remove.forEach(i => {
      delete product[i]
    })

    if(product.images){
      let regex = new RegExp(`${originalDomain}/`,"g");
      product.images = product.images.replace(regex, `${cdnDomain}/${mediumPrex}`)
    }

    let imageArr = product.images.split(",")

    let firstImage = imageArr[0]

    html+=`
      <div class="w3-third w3-margin-bottom">
          <img src=${firstImage} alt=${product.short_title} style="width:100%" class="w3-hover-opacity">
          <div class="w3-container w3-white">
              <h4>${product.short_title}</h4>
              <button class="w3-button w3-black w3-margin-bottom inquiry-btn" onclick="document.getElementById('inquiryModal').style.display='block'">Inquiry</button>
          </div>
      </div>
      `
    
  })

  html+=`</div>`

  html = minify(html)


  const template = Handlebars.compile("Name: {{name}}");

  fs.writeFile(outPutFile, JSON.stringify(products), err => {
    if (err) console.log("Error writing file:", err);
  });

  console.log(html)
  fs.writeFile(outPutHtmlFile, html, err => {
    if (err) console.log("Error writing html file:", err);
  });

} catch (err) {
  console.log(err);
  return;
}






