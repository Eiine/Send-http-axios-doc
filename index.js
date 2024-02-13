#!/usr/bin/env node
import list from "express-list-endpoints";
import { fileURLToPath } from 'url';
import  fs from 'fs';
import  fsExtra from "fs-extra"
import * as path from 'path';
import lodash from 'lodash';


const isEqual = lodash.isEqual;
const currentModuleFile = import.meta.url;
const currentModulePath = fileURLToPath(currentModuleFile);
const currentModuleDir = path.dirname(currentModulePath);
const dataFolderPath = path.join(currentModuleDir, 'data'); // Ruta de la carpeta "data" de origen
const twoFoldersUpPath = path.join(currentModuleDir, '..', '..');
const destinationFolderPath = path.resolve(twoFoldersUpPath, 'send'); // Ruta de la carpeta de destino con nombre "data"

// Verificar si la carpeta "send" existe en la ruta de destino
if (fs.existsSync(destinationFolderPath)) {
  console.log('La carpeta "send" ya existe en la ruta de destino. No se realizará ninguna acción adicional.');
} else {
  fsExtra.ensureDirSync(destinationFolderPath); // Crea la carpeta de destino si no existe
  fsExtra.copySync(dataFolderPath, destinationFolderPath); // Copia los archivos de la carpeta "data" a la carpeta de destino
  console.log('Carpeta copiada exitosamente.');
}

const createJsonApi = (app, port) => {
  
  let dato = list(app);
  let endpointData = [];

  dato.forEach(element => {
    const existingIndex = endpointData.findIndex(existing => existing.path === element.path);
    if (existingIndex === -1) {
      // No se encontró un objeto con la misma ruta, se agrega uno nuevo
      let datoJson = {
        url: `http://localhost:${port}`,
        path: element.path,
        description:"",
        methods: element.methods,
        data: {}
      };
      endpointData.push(datoJson);
    } else {
      // Se encontró un objeto con la misma ruta, se combinan los métodos
      endpointData[existingIndex].methods = Array.from(
        new Set([...endpointData[existingIndex].methods, ...element.methods])
      );

    }
  });

  const currentModuleFile = import.meta.url;
  const currentModulePath = path.dirname(fileURLToPath(currentModuleFile));
  const publicFolderPath = path.join(currentModulePath, '../../send');
  const outputPath = path.join(publicFolderPath, 'endpointApi.json');

  const existingContent = fs.readFileSync(outputPath, 'utf8');
  const existingData = JSON.parse(existingContent);
  
  if (fs.existsSync(outputPath)) {
    
    if (isEqual(existingData, endpointData)) {
      console.log('El archivo JSON ya existe y contiene los mismos datos. No se realizará ninguna acción.');
      return;
    }
  }
  
  //obtiene los objetos que tienen letras

  let filtrado= existingData.filter(element=>{
   if(typeof element.data== 'string'){
     return element
   }
  })
  
  let resultado = endpointData.map(item => {
    const encontrado = filtrado.find(element => element.path === item.path);
  
    return encontrado ? encontrado : item;
  });
  
  console.log(resultado.length);
  
}


const saveQueryBack = async (req, res) => {
  const dato=req.body;
 
  const currentFilePath = fileURLToPath(import.meta.url);
  const rootPath = path.resolve(path.dirname(currentFilePath), '../..');
  const filePath = path.join(rootPath, 'send/endpointApi.json');

  const data = await fs.promises.readFile(filePath, 'utf8');
  let oldList = JSON.parse(data);
  let oldList_filtrado= oldList.filter((element) => element.path !== dato.path)
  
  let listNew=[...oldList_filtrado,dato]
  let guardar=JSON.stringify(listNew)
   fs.writeFileSync(filePath,guardar , 'utf8');
  

  res.send('Contenido actualizado exitosamente');
};



export { createJsonApi, saveQueryBack };

