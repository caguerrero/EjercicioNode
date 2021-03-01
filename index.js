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

function replaceContents(file, replacement, cb) {
  fs.readFile(replacement, (err, contents) => {
    if (err) return cb(err);
    fs.writeFile(file, contents, cb);
  });
}

http
  .createServer(function (req, res) {
    if (req.url === "/api/proveedores") {
      replaceContents("index.html", "template.html", (err) => {
        if (err) throw err;
      });
      process("proveedores");
      getFileContent((data) => {
        res.end(data);
      });
    } else if (req.url === "/api/clientes") {
      replaceContents("index.html", "template.html", (err) => {
        if (err) throw err;
      });
      process("clientes");
      getFileContent((data) => {
        res.end(data);
      });
    }
    //end the response
  })
  .listen(8081); //the server object listens on port 8080

let idsProveedores = [];
let companiaProveedores = [];
let contactosProveedores = [];
axios
.get(urlproveedores)
.then((response) => {
  // handle success
  console.log(response.data);
  idsProveedores = response.data.map((res) => res.idproveedor);
  companiaProveedores = response.data.map((res) => res.nombrecompania);
  contactosProveedores = response.data.map((res) => res.nombrecontacto);
})



let idsClientes = [];
let companiaClientes = [];
let contactosClientes = [];
axios
.get(urlclientes)
.then((response) => {
  // handle success
  console.log(response.data);
  idsClientes = response.data.map((res) => res.idCliente);
  companiaClientes = response.data.map((res) => res.NombreCompania);
  contactosClientes = response.data.map((res) => res.NombreContacto);
})

function process(name) {
  const head = `
    <h1 style="text-align:center;">Listado de ${name}</h1>
    <thead>
    <tr>
      <th>ID</th>
      <th>Nombre</th>
      <th>Contacto</th>
    </tr>
    </thead>
    <tbody>`;
  const end = "</tbody>";
  let body = "";
  let i = 0;
  if (name === "proveedores"){
    while (i < idsProveedores.length) {
      body += `<tr>
          <td>${idsProveedores[i]}</td>
          <td>${companiaProveedores[i]}</td>
          <td>${contactosProveedores[i]}</td>
        </tr>`;
      i++;
    }
    fs.readFile("index.html", (err, data) => {
      if (err) throw err;
      let dataS = data.toString();
      let resultB = dataS.replace(/{{replace}}/g, head + body + end);
      fs.writeFile("index.html", resultB, (err) => {
        if (err) throw err;
      });
    }); 
  } else if (name==="clientes"){
    while (i < idsClientes.length) {
      body += `<tr>
          <td>${idsClientes[i]}</td>
          <td>${companiaClientes[i]}</td>
          <td>${contactosClientes[i]}</td>
        </tr>`;
      i++;
    }
    fs.readFile("index.html", (err, data) => {
      if (err) throw err;
      let dataS = data.toString();
      let resultB = dataS.replace(/{{replace}}/g, head + body + end);
      fs.writeFile("index.html", resultB, (err) => {
        if (err) throw err;
      });
    }); 
  }
}

/*
fs.readFile("index.html", (err, data) => {
  if (err) throw err;
  let dataS = data.toString();
  let resultB = dataS.replace(/{{replace}}/g, head + body + end);
  fs.writeFile("index.html", resultB, (err) => {
    if (err) throw err;
  });
});
*/

/*
//PROVEEDORES
    axios.interceptors.request.use(
      (config) => {
        // perform a task before the request is sent
        replaceContents("index.html", "template.html", (err) => {
          if (err) throw err;
        });
        console.log("Request sent");
        return config;
      },
      (error) => {
        // handle the error
        return Promise.reject(error);
      }
    );
    const head = `
        <h1 style="text-align:center;">Listado de proveedores</h1>
        <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Contacto</th>
        </tr>
        </thead>
        <tbody>`;
    const end = "</tbody>";
    axios
      .get(urlproveedores)
      .then((response) => {
        // handle success
        let i = 0;
        let body = "";
        while (i < response.data.length) {
          body += `<tr>
            <td>${response.data[i].idproveedor}</td>
            <td>${response.data[i].nombrecompania}</td>
            <td>${response.data[i].nombrecontacto}</td>
          </tr>
          `;
          i++;
        }
        fs.readFile("index.html", (err, data) => {
          if (err) throw err;
          let dataS = data.toString();
          let resultB = dataS.replace(/{{replace}}/g, head + body + end);
          fs.writeFile("index.html", resultB, (err) => {
            if (err) throw err;
          });
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
        fs.readFile("index.html", (err, data) => {
          if (err) throw err;
          res.end(data);
          console.log(data.toString());
        });
      });

//CLIENTES
    axios.interceptors.request.use(
      (config) => {
        // perform a task before the request is sent
        replaceContents("index.html", "template.html", (err) => {
          if (err) throw err;
        });
        return config;
      },
      (error) => {
        // handle the error
        return Promise.reject(error);
      }
    );
    axios.get(urlclientes).then((response) => {
      // handle success
      let i = 0;
      let head = `
    <h1 style="text-align:center;">Listado de clientes</h1>
    <thead>
      <tr>
       <th>ID</th>
       <th>Nombre</th>
       <th>Contacto</th>
      </tr>
    </thead>
    <tbody>`;
      let body = "";
      while (i < response.data.length) {
        body += `<tr>
            <td>${response.data[i].idCliente}</td>
            <td>${response.data[i].NombreCompania}</td>
            <td>${response.data[i].NombreContacto}</td>
          </tr>
          `;
        i++;
      }
      let end = "</tbody>";
      fs.readFile("index.html", (err, data) => {
        if (err) throw err;
        let dataS = data.toString();
        let resultB = dataS.replace(/{{replace}}/g, head + body + end);
        fs.writeFile("index.html", resultB, (err) => {
          if (err) throw err;
        });
      });
    });
*/
