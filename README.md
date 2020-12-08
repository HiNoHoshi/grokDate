# grok.date
A dating app for geeks

## Demo link
- Go to http://grokdating.web.illinois.edu (Chrome preferred)
- You may be asked to sign in to cPanel or you may need connect to the UIUC VPN.

## Recording
- https://www.youtube.com/watch?v=FZoiCHPYWBE&feature=youtu.be

## Slides
- https://docs.google.com/presentation/d/1ew5qkD4xDprjy1yW3gP9xisFNHyI7MeJrqYFBSqfuoA/edit?usp=sharing

## Install instructions (if you prefer to run the code yourself)
- Install Node.js and npm
  - https://nodejs.org/en/download/
- Clone the repo (or open the zipped code)
- From within the `grok.date` folder,
  - run `npm i` to install dependencies
  - then run `npm start`
- Go to http://localhost:3000 within your browser (Chrome preferred)

## New features added since <a href="https://youtu.be/FZoiCHPYWBE">presentation on 12/3</a>
- Privacy policy and terms of service appear on sign-in/sign-up page and settings page.
- Each user can upload 1 profile photo icon, which can be added in the "Edit Profile" page. The icons show up in the profile browser and in the chat.
- Users are now able to request account deletion. The account is partially deleted when the button is clicked, but unfortunately Firebase doesn't allow complete deletion via the API. So, clicking the button sends an email to us to notify us that the user has requested account deletion. We can then go in and manually delete that user by ID. This is described in the privacy policy.
