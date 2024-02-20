let dataH = document.getElementById("data-input");
let nameH = document.getElementById("name-query")
let methodH = document.getElementById("method-input");
let urlH = document.getElementById("url-input");
let pathH = document.getElementById("path-input");
let tokenH = document.getElementById("token-input");
let peticiones = document.getElementById("peticiones-saved")
let show = document.getElementById("show")
let contact = document.getElementById("contact")
let responseEmpty = document.getElementById("response-empty")
let responseLoader = document.getElementById("response-loader")
let responseContainer = document.getElementById("response-container")
let peticiones_input=document.getElementById("peticion-input")
let response_id=document.getElementById("response-id")
let descriptionH=document.getElementById("description-input")
//option recibe un objeto que puede tener token, method, entre otras cosas
const startLoading = () => {
responseContainer.innerHTML = "";
responseEmpty.classList.add('none');
responseLoader.classList.remove('none');
response_id.classList.add('response-background');
}
const resetLoading = () => {
responseEmpty.classList.remove('none');
}
const endLoader = () => {
let peticiones=document.getElementById("peticiones-saved")
let show= document.getElementById("show")
let contact=document.getElementById("contact")

// Funcion principal, option recibe un objeto que puede tener token, method, entre otras cosas

responseLoader.classList.add('none');

}
const send_http_axios=(data,option)=>{
console.log(data);
axios({
    method: option.method,
    url: `${option.url}/${option.path}`,
    data: data,
    headers: {
     "Authorization": option.token,
  },
  })
    .then(response => {
      // Manejo de la respuesta exitosa
      
      if(!option.data.visit && !option.data.message){
        const data = new JSONFormatter(response.data)
        document.getElementById("response-container").appendChild(data.render());
      }
    })
    .finally(() => { endLoader()})
    .catch(error => {
      console.log(error.response)
      const data = new JSONFormatter(error.response.data)
        document.getElementById("response-container").appendChild(data.render());
      //document.getElementById("response-container").textContent = JSON.stringify(error.response.data, null, 2);
      // Manejo del error
     
      Swal.fire({
          icon: 'error',
          title: 'Tu peticion fallo',
          showConfirmButton: false,
          timer: 1500,
          confirmButtonColor: '#0d6efd',
        })
    });
  }
//Funcion que se encarga de enviar la peticion realizada en el front
let sendRequest = () => {
startLoading()
let data = dataH.value;
let method = methodH.value;
let url = urlH.value;
let path = pathH.value;
let token = tokenH.value;

let fileInput = document.getElementById('file-input');
let file = fileInput.files[0];
if (file) {
let fileData = new FormData();
fileData.append('file', file);
fileData.append('data', data);

let option = {
  method: method,
  url: url.replace(/\/$/, ''),
  path: path.replace(/^\//, ''),
  data: fileData,
  token: token
};

send_http_axios(fileData, option);
} else {
let data = dataH.value;
if (data){
let option = {
  method: method,
  url: url.replace(/\/$/, ''),
  path: path.replace(/^\//, ''),
  data: JSON.parse(data),
  token: token
};
send_http_axios(option.data, option);
}else{
let data = dataH.value;
let option = {
  method: method,
  url: url.replace(/\/$/, ''),
  path: path.replace(/^\//, ''),
  data: data,
  token: token
};
send_http_axios(option.data, option);
}
}
};

//Funcion para compartir trabajon actual
const findSharequery=()=>{

let datos= window.location.search
if(datos !== ""){

let dato2= new URLSearchParams(datos)
  
   dataH.value=dato2.get("data");
   methodH.value=dato2.get("method");
   urlH.value=dato2.get("url");
   pathH.value=dato2.get("path");
   tokenH.value=dato2.get("token");
   nameH.value=dato2.get("name")
}
}

const Sharequery=()=>{
let datos=window.location.href
  
  let data = dataH.value;
  let method = methodH.value;
  let url = urlH.value;
  let path = pathH.value;
  let token = tokenH.value;
  let name = nameH.value
  let compartir=`${datos}?method=${method}&url=${url}&path=${path}&name=${encodeURIComponent(name)}&token=${token}&data=${encodeURIComponent(data)}&page=1&limit=10`
  navigator.clipboard.writeText(compartir)
  return Swal.fire({
    icon: 'success',
    title: 'Peticion copiada en portapapeles',
    showConfirmButton: false,
    timer: 1500,
    confirmButtonColor: '#0d6efd',
  })
}

const getJsonFile = async() => {
const dato=await fetch("./endpointApi.json")
return await dato.json()
};



const itemLoad = () => {
const peticionesInput = document.getElementById('peticion-input');
const selectedOption = peticionesInput.options[peticionesInput.selectedIndex];
const selectedData = JSON.parse(selectedOption.getAttribute('data'));


dataH.value = JSON.stringify(selectedData.data).replace(/\\/g, '').replace(/^"|"$/g, '')
methodH.value = selectedData.methods[0].toLowerCase()
urlH.value = window.location.href.replace(/\/[^\/]+\/[^\/]+\/?$/, "/")
pathH.value = selectedData.path
descriptionH.value= selectedData.description
tokenH.value = ""
nameH.value=selectedData.path.split("/")[1]
console.log(window.location.href.replace(/\/[^\/]+\/[^\/]+\/?$/, "/"));
}

// Ejemplo de uso con async/await
const fetchData = async () => {
try {
  const jsonData = await getJsonFile();
  const peticionesInput = document.getElementById('peticion-input');
  peticionesInput.addEventListener('change', itemLoad); // Agregar el evento onchange

  jsonData.forEach(element => {
    peticionesInput.innerHTML += `
      <option value=${element.path} data='${JSON.stringify(element)}' selected>${element.path}</option>
    `;
  });
} catch (error) {
  console.error(error);
}
}

const saveQuery=async()=>{
let datos= await getJsonFile()
let datos2= datos.filter(datos=> datos.path == pathH.value)

datos2[0].description=descriptionH.value
datos2[0].data=dataH.value
let option = {
  method: "post",
  url: "http://localhost:3000",
  path:"saveQuery",
  data: JSON.stringify(datos2[0]),
};
send_http_axios(datos2,option)
}
fetchData();

const jsonFormatter = (rawData) =>{
  const data = new JSONFormatter(rawData);
  return data.render();
}

const initialDataform=async()=>{
  let datos= await getJsonFile()
  methodH.value = datos[0].methods[0].toLowerCase()
  urlH.value = datos[0].url
  pathH.value = datos[0].path
  tokenH.value = datos[0].tokenH ? datos[0].tokenH : "";
  nameH.value=datos[0].path.split("/")[1]
}

initialDataform()