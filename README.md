# Discord GitHub Preview
"We heard you liked profiles, so we put a profile in your profile so you can be online while you're online"

Generates an SVG representing your current activity state in Discord. You can embed this SVG most anywhere external images are allowed, like your personal website or a GitHub README!

Right now, it'll display:
- Profile photo, avatar decorations, and banner
- Online, idle, DND, and offline states
- Display name and username
- Current activity and custom status
- Avatar decorations (but they won't animate)
- A custom About Me section and one of a number of color themes (Bots aren't allowed to see your bio or Nitro colors).

## Screenshots

<p align="center">
  <img width="400" src="https://github.com/user-attachments/assets/f4c9b564-e24e-4749-ac93-866562393cb7"></img>
  <img width="400" src="https://dsc-readme.tsuni.dev/api/user/214167454291722241?banner=https%3A%2F%2Ftsuni.dev%2Fimages%2Fsobanner.png&theme=nitroLight&primaryColor=8080FF&accentColor=FF80C0"></img>  

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

# How do I get this set up?

The simplest way is by using my hosted instance, but you can also host your own. Look at the [Self-Hosting](#self-hosting) section for more details.

1. You need to be in the same server as the bot for it to work, so you should [join my Discord server](https://discord.gg/W59fcbydeG)
2. Right-click on the server icon and navigate to "Privacy settings". Make sure your "activity privacy" is set to ON for the server or else the bot won't be able to see your game activity, just your custom status.
3. Visit the web interface at https://dsc-readme.tsuni.dev
4. Enter your Discord User ID in the input field (see below for how to get this)
5. Customize your profile preview with the available options
6. Click "Generate Preview" to see the result
7. Copy the generated URL using the "Copy URL" button
8. Paste the URL into your GitHub README or website

### How to get your Discord User ID

It's a number that looks like 214167454291722241. There are two ways to find this:
  - Mention yourself in a message, but put a backslash (`\`) before the mention. Then send the message and copy the numbers:<br />
![Discord_lYicGfP1qd](https://github.com/user-attachments/assets/12aacd86-fd3a-421d-a45e-e8b20c2c5c4a)
  - Turn on User Settings > Advanced > Developer Mode, then click on your profile picture in the bottom corner of the Discord client and press "Copy User ID"

## Customizations

You can customize your profile preview in two ways:

1. Using the [Web Interface](#web-interface) for a more visual experience
2. Using URL parameters (as shown below)

### URL Parameter Customizations

- **Center the profile:** surround the `<img>` tags with `<p align="center">` and `</p>`, like so:
  ```md
  <p align="center">
    <img src="https://dsc-readme.tsuni.dev/api/user/214167454291722241?width=400">
  </p>
  ```

  <p align="center">
    <img src="https://dsc-readme.tsuni.dev/api/user/214167454291722241?width=300">
  </p>

- **Change the banner:** provide an image URL after your user ID, for example:
```md
![](https://dsc-readme.tsuni.dev/api/user/214167454291722241?banner=https://tsuni.dev/images/sobanner.png)
```

![](https://dsc-readme.tsuni.dev/api/user/214167454291722241?banner=https://tsuni.dev/images/sobanner.png)

- **Add an About Me section:** use the `aboutMe` parameter, for example:
```md
![](https://dsc-readme.tsuni.dev/api/user/214167454291722241?aboutMe=Hello%20world!%20I'm%20a%20developer%20who%20loves%20to%20code.)
```

- **Hide avatar decoration:** use the `hideDecoration` parameter:
```md
![](https://dsc-readme.tsuni.dev/api/user/214167454291722241?hideDecoration=true&width=400)
```

- **Hide Spotify activity:** use the `hideSpotify` parameter to hide Spotify listening status:
```md
![](https://dsc-readme.tsuni.dev/api/user/214167454291722241?hideSpotify=true&width=400)
```
- **Display animated avatar/banner/decoration:** use the `animate` parameter:
  Before turning this on, please read the note in the [A note on animated avatars, banners, and decorations](#a-note-on-animated-avatars-banners-and-decorations) section. It might not do what you think it does!
```md
![](https://dsc-readme.tsuni.dev/api/user/214167454291722241?animate=true&width=400)
```
- **Set the width:** use the `width` parameter to set the width of the image. The default is 512px, but you can set it to any value you like. This affects the resolution of embedded images, so thinner previews will be faster to load, and vice versa.
```md
![](https://dsc-readme.tsuni.dev/api/user/214167454291722241?width=400)
```
- **Theme Customizations**
  - Set the theme via the `theme` parameter, choosing one of: `dark`, `light`, `nitroDark`, `nitroLight`, or `custom`.
  - For **Nitro themes** (`nitroDark` or `nitroLight`):
    - Use the parameters `primaryColor` and `accentColor` with hex values provided **without** a `#`.  
      Example:
      ```md
      ![](https://dsc-readme.tsuni.dev/api/user/214167454291722241?theme=nitroDark&primaryColor=5865F2&accentColor=99AAB5&width=400)
      ```
  - For the **Custom theme**:
    - Use the parameters `colorB1`, `colorB2`, `colorB3`, `colorT1`, and `colorT2` with hex values provided **without** a `#`.  
      Example:
      ```md
      ![](https://dsc-readme.tsuni.dev/api/user/214167454291722241?theme=custom&colorB1=111214&colorB2=313338&colorB3=505059&colorT1=FFFFFF&colorT2=D2D6D8)
      ```

## A note on animated avatars, banners, and decorations:

Animated avatars, banners, and decorations **will not animate on GitHub**, most Markdown renderers, or when placed in an `<img>` tag. If you want to see the animation, you need to place the SVG in an `<object>` tag, like so:

```html
<object data="https://dsc-readme.tsuni.dev/api/user/214167454291722241?banner=https%3A%2F%2Ftsuni.dev%2Fimages%2Fsobanner.png&amp;theme=nitroLight&amp;primaryColor=8080FF&amp;accentColor=FF80C0" class="mx-auto my-2 max-w-full" width="500">Discord status</object>
```

Obviously, this will only work on platforms where you can write HTML, like your personal website. GitHub does not allow `<object>` tags in Markdown. Additionally, embedding animated images significantly increases the filesize of the resulting SVG, resulting in slower load times and more work for my server. So really think about whether this needs to be turned on!

## Self-Hosting

If you prefer to host your own instance, follow these steps:

1. Clone this repository
2. Create a `.env` file with the following variables:
   ```
   DISCORD_TOKEN=your_discord_bot_token
   DISCORD_GUILD_ID=your_discord_guild_id
   ```
   - `DISCORD_TOKEN`: Your Discord bot token (you can create a bot at the [Discord Developer Portal](https://discord.com/developers/applications))
   - `DISCORD_GUILD_ID`: The ID of the server where the bot will be used (you can find this by right-clicking the server icon in Discord and selecting "Copy Server ID")
3. Install dependencies: `pnpm install`
4. Run the server: `pnpm run start`
5. Visit `http://localhost:3000` to access the web interface

You can substitute `pnpm` with `npm` or `yarn` if you prefer.

There's also a Dockerfile and docker-compose.yml included, so you can run it in a container if you like. Follow steps 1-2, then run `docker-compose up` to start the server. You can access it at `http://localhost:3000`.
