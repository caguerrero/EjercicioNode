const fs = require("fs");
const http = require("http");
const axios = require('axios').default;
const urlproveedores = "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json";
const urlclientes = "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json";

const getFileContent= (callback)=>{
    fs.readFile("index.html", (err, data)=>{
        if (err) throw err;
        callback(data.toString());
    });
}
http
  .createServer((req, res) => {
    getFileContent((data)=>{
        
        res.end(data);
    })
  })
  .listen(8000);

let proveedores = axios.get(urlproveedores)
.then(function (response) {
  // handle success
  console.log(response);
})
.catch(function (error) {
  // handle error
  console.log(error);
})
.then(function () {
  // always executed
});

let clientes = axios.get(urlclientes)
.then(function (response) {
  // handle success
  console.log(response);
})
.catch(function (error) {
  // handle error
  console.log(error);
})
.then(function () {
  // always executed
});