# Discord GitHub Preview
"We heard you liked profiles, so we put a profile in your profile so you can be online while you're online"

Generates an SVG representing your current activity state in Discord. You can embed this SVG most anywhere external images are allowed, like your personal website or a GitHub README!

Right now, it'll display:
- Profile photo, avatar decorations, and banner
- Online, idle, DND, and offline states
- Display name and username
- Current activity and custom status

Potential future features:
- Color themes and other configuration
- Nitro profile colors (get in touch with me if you can help test this!)
- Animated profile decorations (see above)
- About Me and connected accounts (does anyone actually want these?)


## Screenshots

<p align="center">
  <img width="400" src="https://github.com/user-attachments/assets/f4c9b564-e24e-4749-ac93-866562393cb7"></img>
  <img width="400" src="https://dsc-readme.tsuni.dev/api/user/214167454291722241"></img>  

  *A screenshot and actual instance of the program, side-by-side (in case I'm offline or doing something boring)*
</p>

## How do I get this set up?

The simplest way is by using my hosted instance at https://dsc-readme.tsuni.dev. 

1. You need to be in the same server as the bot for it to work, so you should [join my Discord server](https://discord.gg/W59fcbydeG)
2. Right-click on the server icon and navigate to "Privacy settings". Make sure your "activity privacy" is set to ON for the
server or else the bot won't be able to see your game activity, just your custom status.
   - If you don't want the bot to display your game activity, then you can turn activity privacy OFF instead.
4. Find your Discord User ID-- it's a number that looks like 214167454291722241. There are two ways to find this:
   - Mention yourself in a message, but put a backslash (`\`) before the mention. Then send the message and copy the numbers:
![Discord_lYicGfP1qd](https://github.com/user-attachments/assets/12aacd86-fd3a-421d-a45e-e8b20c2c5c4a)
   - Turn on User Settings > Advanced > Developer Mode, then click on your profile picture in the
bottom corner of the Discord client and press "Copy User ID"
6. Paste the following code:<br />
`<img width="400" src="https://dsc-readme.tsuni.dev/api/user/<YOUR DISCORD USER ID>"></img>`<br />
into your GitHub README.md, replacing \<YOUR DISCORD USER ID\> with the ID you copied last step.
You can adjust the width here as well, but the images in the card won't look very good past 500px.
## Customizations
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