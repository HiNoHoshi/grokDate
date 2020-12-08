# grok.date
A dating app for geeks

## Demo link
- Go to http://grokdating.web.illinois.edu
- You may be asked to sign in to cPanel or you may need connect to the UIUC VPN.

## Install instructions if you prefer to run the code yourself
- Clone the repo
- From within the `my-app` folder,
  - run `npm i` to install dependencies
  - then run `npm start` from within the `my-app` folder
- Go to http://localhost:3000 within your browser

## New features added since presentation on 12/3
- Review the presentation video here: https://youtu.be/FZoiCHPYWBE
- Added profile photos, which can be added in the "Edit Profile" page. They show up in the profile browser and in the chat.
- Added privacy policy and terms of service to sign-in/sign-up page and settings page
- Added ability for users to request account deletion. The account is partially deleted when the button is clicked, but unfortunately Firebase doesn't allow complete deletion via a the API. So, clicking the button sends an email to us to notify us that the user has requested account deletion. We can then go in and manually delete that user by ID.
