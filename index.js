const fs = require("fs");
const http = require("http");
const axios = require("axios").default;

const urlproveedores =
  "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json";
const urlclientes =
  "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json";

const getFileContent = (callback) => {
  fs.readFile("index.html", (err, data) => {
    if (err) throw err;
    callback(data.toString());
  });
};

async function peticionAxios(url) {
  const response = await axios.get(url);
  return response.data;
}

function replaceContents(file, replacement, cb) {
  fs.readFile(replacement, (err, contents) => {
    if (err) return cb(err);
    fs.writeFile(file, contents, cb);
  });
}

http
  .createServer(function (req, res) {
    let body = "";
    let i = 0;
    if (req.url === "/api/proveedores") {
      replaceContents("index.html","template.html",(err)=>{
        if (err) throw err;
      });
      const head = `
      <h1 style="text-align:center;">Listado de proveedores</h1>
      <thead>
        <th>ID</th>
        <th>Nombre</th>
        <th>Contacto</th>
      </tr>
      </thead>
      <tbody>`;
      const end = "</tbody>";
      let idsProveedores = [];
      let companiaProveedores = [];
      let contactosProveedores = [];
      peticionAxios(urlproveedores).then((response) => {
        idsProveedores = response.map((res) => res.idproveedor);
        companiaProveedores = response.map((res) => res.nombrecompania);
        contactosProveedores = response.map((res) => res.nombrecontacto);
        while (i < idsProveedores.length) {
          body += `<tr>
              <td>${idsProveedores[i]}</td>
              <td>${companiaProveedores[i]}</td>
              <td>${contactosProveedores[i]}</td>
            </tr>`;
          i++;
        }
        getFileContent((data) => {
          res.end(data.replace(/{{replace}}/g, head + body + end));
        });
      });
    } else if (req.url === "/api/clientes") {
      replaceContents("index.html","template.html",(err)=>{
        if (err) throw err;
      });
      const head = `
      <h1 style="text-align:center;">Listado de clientes</h1>
      <thead>
        <th>ID</th>
        <th>Nombre</th>
        <th>Contacto</th>
      </tr>
      </thead>
      <tbody>`;
      const end = "</tbody>";
      let idsClientes = [];
      let companiaClientes = [];
      let contactosClientes = [];
      peticionAxios(urlclientes).then((response) => {
        idsClientes = response.map((res) => res.idCliente);
        companiaClientes = response.map((res) => res.NombreCompania);
        contactosClientes = response.map((res) => res.NombreContacto);
        while (i < idsClientes.length) {
          body += `<tr>
              <td>${idsClientes[i]}</td>
              <td>${companiaClientes[i]}</td>
              <td>${contactosClientes[i]}</td>
            </tr>`;
          i++;
        }
        getFileContent((data) => {
          res.end(data.replace(/{{replace}}/g, head + body + end));
        });
      });
    }
  })
  .listen(8081);