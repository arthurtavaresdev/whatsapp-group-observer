# Whatsapp group observer (In progress)

A bot that will download the images, documents and log all WhatsApp conversations of a certain group.

## Installation

```bash
> npm install or yarn install
```

## Usage

Put the group name of your whatsapp in the <b>.env</b> file.

Then, run the command:

```bash
> npm start ou yarn start
```

If it is the first run, a QR code appears on the console, for authentication, log in as if it were the WEB version of whatsapp.

### Google drive

If you want to connect to google, go to the page https://developers.google.com/drive/api/v3/quickstart/nodejs
and get the `credentials.json` file by clicking on the blue button labeled **Enable the drive API**.

Add the `credentials.json` file to the root of the project. Run the project, in the first execution it will provide you with a link to consent to the auth, allowing the app to work.

## Technologies Used

- NodeJS (Development version: 12.18.1)
- [wa-automate-nodejs](https://github.com/open-wa/wa-automate-nodejs)
