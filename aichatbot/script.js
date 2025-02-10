let prompt=document.querySelector("#prompt");
let submit=document.querySelector("#submit");
let chatContainer=document.querySelector(".chat-container");
let imagebtn=document.querySelector("#image");
let imageinput=document.querySelector("#image input");
let image=document.querySelector("#image img");
const Api_Url="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDhyi0A2K4gdh_BFHMvxt7R8ZU8mPw7Wyg"
let user={
  message:null,
  file:{
    mime_type:null,
          data:null
  }
}
async function generateResponse(aiChatbox){

  let text=aiChatbox.querySelector(".ai-chat-area")
  let RequestOption={
    method:"POST",
    headers:{'Content-Type': 'application/json'},
    body:JSON.stringify({
     "contents": [{
      "parts":[{"text": user.message},(user.file.data?[{"inline_data":user.file}]:[])

      ]
    }]
   
    })

  }
  try{
    let response=await fetch(Api_Url,RequestOption);
    let data=await response.json();
   let apiResponse=data.candidates[0].content.parts[0].text.replace(/*\*\*(.*?)\*\*/generateResponse,"$1").trim();
  text.innerHTML=apiResponse;

  }catch(error){
   console.log(error);
  }finally{
    chatContainer.scrollTo({top:chatContainer.scrollHeight,behaviour:"smooth"})
    image.src=`image.png`
    image.classList.remove("choose")
    user.file={}
  }
  


}
function createChatBox(html,classes){
let div=document.createElement("div")
div.innerHTML=html;
div.classList.add(classes);
return div;
}
function handlechatResponse(userMessage){
  user.message=userMessage;
  let html=`<img src="userimage.png" alt="" id="userimage" width="8%">
<div class="user-chat-area">
${user.message}
${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="choose" />` :""}
</div>`
prompt.value="";
let userChatBox=createChatBox(html,"user-chatbox")
chatContainer.appendChild(userChatBox);
chatContainer.scrollTo({top:chatContainer.scrollHeight,behaviour:"smooth"})
setTimeout(()=>{
let html=`<img src="aiimage.jpg" alt="" id="aiimage" width="10%">
      <div class="ai-chat-area">
       <img src="loading.gif" alt="" class="load" width="50px">
      </div>`
      let aiChatBox=createChatBox(html,"ai-chatbox")
      chatContainer.appendChild(aiChatBox);
      generateResponse(aiChatBox);
},600)
}  
prompt.addEventListener("keydown",(e)=>{
  if(e.key=="Enter"){
   handlechatResponse(prompt.value);

  }
  
  
})
submit.addEventListener("click",()=>{
  handlechatResponse(prompt.value);
})
imageinput.addEventListener("change",()=>{
  const file=imageinput.files[0];
  if(!file)
    return;
  let reader=new FileReader();
  reader.onload=(e)=>{
    let base64string=e.target.result.split(",")[1];
    user.file={
      mime_type:file.type,
            data:base64string
    }
    image.src=`data:${user.file.mime_type};base64,${user.file.data}`
    image.classList.add("choose")
  }
  
  reader.readAsDataURL(file)
})
imagebtn.addEventListener("click",()=>{
  imageinput.click();
})