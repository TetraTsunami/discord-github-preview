# Discord GitHub Preview
"We heard you liked profiles, so we put a profile in your profile so you can be online while you're online"

Generates an SVG representing your current activity state in Discord. You can embed this SVG most anywhere external images are allowed, like your personal website or a GitHub README!

Right now, it'll display:
- Profile photo, avatar decorations, and banner
- Online, idle, DND, and offline states
- Display name and username
- Current activity and custom status
- Animated profile decorations
- Nitro profile colors
- About Me

Potential future features:
- Color themes and other configuration


## Screenshots

<p align="center">
  <img width="400" src="https://github.com/user-attachments/assets/f4c9b564-e24e-4749-ac93-866562393cb7"></img>
  <img width="400" src="https://dsc-readme.tsuni.dev/api/user/214167454291722241"></img>  

  *A screenshot and actual instance of the program, side-by-side (in case I'm offline or doing something boring)*
</p>

## Web Interface

The project includes a sleek, Discord-themed web interface to help you create and customize your profile preview:

<p align="center">
  <img width="600" src="https://raw.githubusercontent.com/violetlaire/discord-github-preview/refs/heads/main/UI.png"></img>
</p>

### Features

- **User-friendly Form**: Simply enter your Discord User ID to generate a preview
- **Live Preview**: See how your profile will look in real-time
- **Customization Options**:
  - Add or edit an About Me section
  - Override your banner with a custom image URL
  - Hide avatar decorations if desired
  - Choose between default colors, your profile's colors, or a custom color
- **Copy URL**: Easily copy the generated URL for embedding in your GitHub README or website
- **Responsive Design**: Works on desktop and mobile devices
- **Keyboard Shortcuts**: Press Ctrl+Enter to quickly generate a preview

### How to Use the UI

1. Visit the web interface at https://dsc-readme.tsuni.dev
2. Enter your Discord User ID in the input field
3. Customize your profile preview with the available options
4. Click "Generate Preview" to see the result
5. Copy the generated URL using the "Copy URL" button
6. Paste the URL into your GitHub README or website

## How do I get this set up?

The simplest way is by using my hosted instance at https://dsc-readme.tsuni.dev. 

1. You need to be in the same server as the bot for it to work, so you should [join my Discord server](https://discord.gg/W59fcbydeG)
2. Right-click on the server icon and navigate to "Privacy settings". Make sure your "activity privacy" is set to ON for the
server or else the bot won't be able to see your game activity, just your custom status.
   - If you don't want the bot to display your game activity, then you can turn activity privacy OFF instead.
4. Find your Discord User ID-- it's a number that looks like 214167454291722241. There are two ways to find this:
   - Mention yourself in a message, but put a backslash (`\`) before the mention. Then send the message and copy the numbers:<br />
![Discord_lYicGfP1qd](https://github.com/user-attachments/assets/12aacd86-fd3a-421d-a45e-e8b20c2c5c4a)
   - Turn on User Settings > Advanced > Developer Mode, then click on your profile picture in the
bottom corner of the Discord client and press "Copy User ID"
6. Paste the following code:<br />
`<img width="400" src="https://dsc-readme.tsuni.dev/api/user/<YOUR DISCORD USER ID>"></img>`<br />
into your GitHub README.md, replacing \<YOUR DISCORD USER ID\> with the ID you copied last step.
You can adjust the width here as well, but the images in the card won't look very good past 500px.

## Customizations

You can customize your profile preview in two ways:
1. Using URL parameters (as shown below)
2. Using the [Web Interface](#web-interface) for a more visual experience

### URL Parameter Customizations

- Center the profile: surround the `<img>` tags with `<p align="center">` and `</p>`, like so:<br />
```md
<p align="center">
  <img width="400" src="https://dsc-readme.tsuni.dev/api/user/214167454291722241"></img>  
</p>
```
<br />
<p align="center">
  <img width="300" src="https://dsc-readme.tsuni.dev/api/user/214167454291722241"></img>  
</p>

- Change the banner: provide an image URL after your user ID, like so:<br />
```md
<img width="400" src="https://dsc-readme.tsuni.dev/api/user/214167454291722241?banner=https://tsuni.dev/images/sobanner.png"></img>
```
<br />
<img width="300" src="https://dsc-readme.tsuni.dev/api/user/214167454291722241?banner=https://tsuni.dev/images/sobanner.png"></img>

- Add an About Me section: use the aboutMe parameter, like so:<br />
```md
<img width="400" src="https://dsc-readme.tsuni.dev/api/user/214167454291722241?aboutMe=Hello%20world!%20I'm%20a%20developer%20who%20loves%20to%20code."></img>
```
<br />
<img width="300" src="https://dsc-readme.tsuni.dev/api/user/214167454291722241?aboutMe=Hello%20world!%20I'm%20a%20developer%20who%20loves%20to%20code."></img>

- Hide avatar decoration: use the hideDecoration parameter, like so:<br />
```md
<img width="400" src="https://dsc-readme.tsuni.dev/api/user/214167454291722241?hideDecoration=true"></img>
```

- Use profile color: apply your Discord profile's color theme, like so:<br />
```md
<img width="400" src="https://dsc-readme.tsuni.dev/api/user/214167454291722241?useProfileColor=true"></img>
```

- Use custom color: set a custom theme color with a hex value, like so:<br />
```md
<img width="400" src="https://dsc-readme.tsuni.dev/api/user/214167454291722241?themeColor=%235865F2"></img>
```

## Self-Hosting

If you prefer to host your own instance, follow these steps:

1. Clone this repository
2. Create a `.env` file with the following variables:
   ```
   DISCORD_TOKEN=your_discord_bot_token
   TEST_USER_ID=your_discord_user_id
   ```
3. Install dependencies: `npm install`
4. Run the server: `npm run dev`
5. Visit `http://localhost:3000` to access the web interface
