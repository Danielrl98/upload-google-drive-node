/*https://drive.google.com/drive/folders/1Yzr6rVS_9P8lwOrxI3uqZUcukgCre5nH?usp=sharing*/
const fs = require('fs')
const { google } = require('googleapis')
const path = require('path');

const GOOGLE_API_FOLDER_ID = "1XiRtYIHtzTYznYxhthLbOG_0dk5xeVtl"

async function uploadFile(nameFile, file,extension){

    try{
        const auth = new google.auth.GoogleAuth({
            keyFile: './google-drive.json',
            scopes: ['https://www.googleapis.com/auth/drive']
        })

        const driveService = google.drive({
            version: 'v3',
            auth
        })

        const fileMetaData = {
            'name': nameFile,
            'parents': [GOOGLE_API_FOLDER_ID]
        }

        const media = {
            mimeType: `image/${extension}`,
            body: fs.createReadStream(file)
        }

        const response = await driveService.files.create({
            resource: fileMetaData,
            media: media,
            field: 'id'
        })
        return response.data.id

    }catch(err){
        console.log('Upload file error', err)
    }
}

function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36)
}
//https://drive.google.com/uc?id=

 function createFile(folderName, file) {
  
    let fontFile = folderName + '/' + file

    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName, { recursive: true });
        fs.chmodSync(folderName, 0o777);
    }

    try {
        fs.writeFileSync(fontFile, "teste");
        console.log('Arquivo criado com sucesso!');
    } catch (err) {
        fontFile = false
    }
    return fontFile
}

function deleteFolderRecursive(namePath) {

    const folderPath = path.join(__dirname, namePath); 

    fs.rm(folderPath, { recursive: true, force: true }, (err) => {
      if (err) {
        console.error(`Erro ao excluir a pasta ${folderPath}:`, err);
      } else {
        console.log(`A pasta ${folderPath} foi excluída com sucesso.`);
      }
    });
}

(async function(){

    const nameImage = generateUniqueId() + '.jpeg'

    const nameFolder = "tmp/"

    const result =  await createFile(nameFolder, `${nameImage}`)

    if(!result) {
        console.log('Arquivo não criado')
        return false
    }

    const teste = await uploadFile(nameImage, nameFolder + nameImage,'txt')

    if(!teste){
        console.log('Arquivo não criado')
        return false
    }

    console.log(`https://drive.google.com/uc?id=${teste}`)

    await deleteFolderRecursive(nameFolder)
    
}())


