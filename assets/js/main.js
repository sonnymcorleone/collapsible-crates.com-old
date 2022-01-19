const company_name = "joinplastic";
const to_email = "inquiry@joinplastic.com";
let remote_ip="";
const remote_ip_url="https://api.db-ip.com/v2/free/self";
const inquiry_handle_base_url="https://api.50d.top";
const inquiry_handle_app_name = '/DEMO_APP';
const inquiry_handle_inquiry_url = '/inquiry/new';
const inquiry_handle_email_url = '/email/templateEmail';
const inquiry_api_success_code = 0;



// Automatic Slideshow - change image every 4 seconds
let myIndex = 0;
let mySliderTimeout= null;
let mySliders = document.getElementsByClassName("mySlides");
carousel();

function plusDivs(num) {
  clearTimeout(mySliderTimeout)

  console.log(myIndex,"first")
  myIndex+=num;
  myIndex+=-1;
  console.log(myIndex,"second")
  if(myIndex <= -1){
    myIndex = mySliders.length -1
  }
  carousel()
}

function carousel() {
  let i;
  
  for (i = 0; i < mySliders.length; i++) {
    mySliders[i].style.display = "none";
  }
  myIndex++;
  if (myIndex > mySliders.length) { myIndex = 1 }
  mySliders[myIndex - 1].style.display = "block";
  mySliderTimeout = setTimeout(carousel, 24000);
}

// Used to toggle the menu on small screens when clicking on the menu button
function myFunction() {
  var x = document.getElementById("navDemo");
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
  } else {
    x.className = x.className.replace(" w3-show", "");
  }
}

// When the user clicks anywhere outside of the modal, close it
var modal = document.getElementById('ticketModal');
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


// customize function when page loaded
function ready(callback){
  // in case the document is already rendered
  if (document.readyState!='loading') callback();
  // modern browsers
  else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
  // IE <= 8
  else document.attachEvent('onreadystatechange', function(){
      if (document.readyState=='complete') callback();
  });
}




function showMessageByID(id){
  let alertWrapper = document.getElementById(id);
  alertWrapper.style.display="block";

  setTimeout(() => {
    alertWrapper.style.display="none";
  }, 2000)
}


function validateEmail(email){
  let re = /\S+@\S+\.\S+/;
  return re.test(email);
}


function closeInquireForm(){
  document.getElementById('inquiryModal').style.display='none'

  let name = document.getElementById('name');
  let email = document.getElementById('email');
  let product_model = document.getElementById('product_model');
  let product_quantity = document.getElementById('product_quantity');
  let message = document.getElementById('message');
  name.value="";
  email.value="";
  product_model.value="";
  product_quantity.value="";
  message.value="";

}





function getClientIp(){

  axios.get(remote_ip_url)
    .then(res => {
      if(res && res.data && res.data.ipAddress){
        remote_ip=res.data.ipAddress;
      }
    })
}

function handleInquiry(){

  let postData = {}
  let name = document.getElementById('name');
  let alertContent = document.getElementById('alertContent');

  if(!name.value){
    alertContent.innerHTML = `Name is required`
    name.focus()
    showMessageByID("alertWrapper")
    return
  }

  postData.name = name.value;

  let email = document.getElementById('email');
  if(!email.value){
    alertContent.innerHTML = `Email is required`
    email.focus()
    showMessageByID("alertWrapper")
    return
  }else if(!validateEmail(email.value)){
    alertContent.innerHTML = `Wrong email format`
    email.focus()
    showMessageByID("alertWrapper")
    return
  }
  postData.email = email.value;

  let product_model = document.getElementById('product_model');

  // 可以不输入 product model, 可能客户需要自定义产品
  // if(!product_model.value){
  //   alertContent.innerHTML = `Product model is required`
  //   product_model.focus()
  //   showMessageByID("alertWrapper")
  //   return
  // }
  postData.product_model = product_model.value;

  let product_quantity = document.getElementById('product_quantity');
  if(!product_quantity.value){
    alertContent.innerHTML = `Product quantity is required`
    product_quantity.focus()
    showMessageByID("alertWrapper")
    return
  }
  postData.product_quantity = product_quantity.value;

  let message = document.getElementById('message');
  postData.message = message.value;
  postData.company_name = company_name;
  postData.to_email = to_email;
  postData.remote_ip = remote_ip;
  postData.from_url = window.location.href;

  console.log(postData)

  let sendingInquiry = document.getElementById("sendingInquiry")
  sendingInquiry.style.display="inline-block"


  axios({
    url: `${inquiry_handle_base_url}${inquiry_handle_app_name}${inquiry_handle_email_url}`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify(postData)
  })
  .then((res) => {
    if(res.data && res.data.code === inquiry_api_success_code){

      let successContent = document.getElementById("successContent");
      successContent.innerHTML="send inquiry successfully"
      showMessageByID("successWrapper")
      closeInquireForm()
      console.log(`send email successfully to ${to_email}`)
    }else{
      alert(res.data.msg)
    }
    
  })
  .catch(error => {
    alert(error)
  })
  .finally(()=>{
    sendingInquiry.style.display="none"
  });

  axios({
    url: `${inquiry_handle_base_url}${inquiry_handle_app_name}${inquiry_handle_inquiry_url}`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify(postData)
  })
  .then((res) => {
    if(res.data && res.data.code === inquiry_api_success_code){
      console.log(`saved in handle inquiry database`)
    }else{
      console.error(res.data.msg)
    }
    
  })
  .catch(error => console.log(error));
}


function openInquiryModal(e){

  let model = e.target.dataset.model || "";
  let product_model = document.getElementById("product_model");
  product_model.value = model
  document.getElementById('inquiryModal').style.display='block'
}

function Pagination() {
  const prevButtons = document.querySelectorAll('.button-prev.folding-list');
  const nextButtons = document.querySelectorAll('.button-next.folding-list');
  const products = document.querySelectorAll(".one-product-outer-wrap");
  const paginations = document.querySelectorAll(".pagination-wrap")
  let pageLength = 0;
  let currentPage = 1;
  let productsPerPage = document.getElementById("productsPerPage").getAttribute("value");
  if(productsPerPage){
    productsPerPage = Number(productsPerPage)
  }

  let prevPage = function () {
    if(currentPage <= 1){
      return
    }
    currentPage = currentPage - 1;
    changePage(currentPage)
  }

  let nextPage = function () {
    if(currentPage >= pageLength){
      return
    }
    currentPage = currentPage + 1;
    changePage(currentPage)
  }

  let addEventListeners = function() {
    prevButtons.forEach(item => {
      item.addEventListener('click', prevPage);
    })
    nextButtons.forEach(item => {
      item.addEventListener('click', nextPage);
    })

    paginations.forEach((item) => {
      let pages = item.querySelectorAll(".every-page")
      pageLength = pages.length;
      pages.forEach((item, index) => {
        item.addEventListener('click', () => { changePage.call(this, index+1) });
      })
    })
  }


  let changePage = function(page) {
    currentPage = page;
    
    let visibleStart = (page - 1 ) * productsPerPage;
    let visibleEnd = page * productsPerPage;

    products.forEach((item, index) => {
      if(index >= visibleStart && index < visibleEnd){
        item.style.display="block"
      }else{
        item.style.display="none"
      }
    })

    paginations.forEach((item) => {
      let pages = item.querySelectorAll(".every-page")
      pages.forEach((item, index) => {
        if(index === page -1){
          item.classList.add("w3-black");
        }else{
          item.classList.remove("w3-black");
        }
      })
    })

    
  }

  this.init = function(){
    changePage(1);
    // pageNumbers();
    // selectedPage();
    // clickPage();
    addEventListeners();
  }

}

ready(function(){
  // send inquiry function
  let sendInquiry = document.getElementById("sendInquiry");
  sendInquiry.addEventListener("click", handleInquiry)

  // open inquiry model event
  let openInquiries = document.querySelectorAll(".inquiry-btn");
  for (let i = 0; i < openInquiries.length; i++) {
    openInquiries[i].addEventListener('click', openInquiryModal);
  }

  getClientIp()

  let lazyLoadInstance = new LazyLoad({
    // Your custom settings go here
  });
  let pagination = new Pagination();
  pagination.init();
  
});