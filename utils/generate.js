const fs = require('fs')
const minify = require('html-minifier').minify;

const Handlebars = require("handlebars");
const layout = fs.readFileSync(`./layouts/main.hbs`).toString()
const header = fs.readFileSync(`./partials/header.hbs`).toString()
const footer = fs.readFileSync(`./partials/footer.hbs`).toString()
const products = fs.readFileSync(`./partials/products.hbs`).toString()
Handlebars.registerPartial("header", header);
Handlebars.registerPartial("footer", footer);
Handlebars.registerPartial("products", products);


const mmToInch = 0.03937;
const kgToLbs = 2.2046;
const literToGallon = 0.2642;

let cdnDomain = "d3mel6hyuleyuo.cloudfront.net";
let originalDomain = "strapi90m.s3.us-west-1.amazonaws.com";
let mediumPrex = "medium_";
let smallPrex = "small_";

// 导出文件位置
let outPutHtml = `./index.html`;
// 页面级数据
const pageData = require("../assets/data/page-data.json")

// 产品数据
const productsData = require("../assets/data/folding-crates.json")
productsData.forEach(product => {

  // if(product.images){
  //   let regex = new RegExp(`${originalDomain}/`,"g");
  //   product.images = product.images.replace(regex, `${cdnDomain}/${smallPrex}`)
  // }


  let regex = new RegExp(`${originalDomain}/`,"g");
  let firstImageObj = product.images_arr[0]
  let firstImage='';

  if(firstImageObj){
    firstImage=firstImageObj.url;
    if(firstImageObj.width < 500){
      firstImage = firstImage.replace(regex, `${cdnDomain}/`)
    }else{
      firstImage = firstImage.replace(regex, `${cdnDomain}/${smallPrex}`)
    }
  }
  
  
  // let firstImage = `./assets/images/aa.png`
  

  product.firstImage = firstImage;

  product.external_long = product['all_attributes_&_external_long'];
  product.external_long_inch = (product.external_long * mmToInch).toFixed(2);

  product.external_width = product['all_attributes_&_external_width'];
  product.external_width_inch = (product.external_width * mmToInch).toFixed(2);

  product.external_height = product['all_attributes_&_external_height'];
  product.external_height_inch = (product.external_height * mmToInch).toFixed(2);

  product.internal_long = product['all_attributes_&_internal_long'];
  product.internal_long_inch = (product.internal_long * mmToInch).toFixed(2);

  product.internal_width = product['all_attributes_&_internal_width'];
  product.internal_width_inch = (product.internal_width * mmToInch).toFixed(2);

  product.internal_height = product['all_attributes_&_internal_height'];
  product.internal_height_inch = (product.internal_height * mmToInch).toFixed(2);

  product.weight = product['all_attributes_&_weight'];
  product.weight_lbs = (product.weight * kgToLbs).toFixed(2);

  product.volumn = product['all_attributes_&_volumn'];
  product.volumn_gallon = (product.volumn * literToGallon).toFixed(2);
  
})

pageData.products = productsData;

const template = Handlebars.compile(layout);

let htmlStr = template(pageData);
htmlStr = minify(htmlStr)

fs.writeFile(outPutHtml, htmlStr, function (err) {
  if (err) throw err;
  console.log('html Saved!');
});