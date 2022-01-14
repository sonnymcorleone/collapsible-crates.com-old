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
var myIndex = 0;
carousel();

function carousel() {
  var i;
  var x = document.getElementsByClassName("mySlides");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  myIndex++;
  if (myIndex > x.length) { myIndex = 1 }
  x[myIndex - 1].style.display = "block";
  setTimeout(carousel, 4000);
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

  if(!product_model.value){
    alertContent.innerHTML = `Product model is required`
    product_model.focus()
    showMessageByID("alertWrapper")
    return
  }
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

  let model = e.target.dataset.model;
  let product_model = document.getElementById("product_model");
  product_model.value = model
  document.getElementById('inquiryModal').style.display='block'
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
  
});