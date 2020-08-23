const fs = require("fs");
const { google } = require("googleapis");

function createFile(fileName, filePath, mimeType, callback) {
  require("./gdrive-auth")((auth) => {
    const fileMetadata = {
      name: fileName,
    };

    const media = {
      mimeType,
      body: fs.createReadStream(filePath),
    };

    const drive = google.drive({ version: "v3", auth });
    drive.files.create(
      {
        resource: fileMetadata,
        media: media,
        fields: "id",
      },
      function (err, file) {
        if (err) {
          // Handle error
          throw err;
        } else {
          callback(file.data.id);
        }
      }
    );
  });
}

module.exports = { createFile };
