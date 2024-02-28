# ♖ Multiplayer 3D Chess Game ♖
A Multiplayer 3D Chess Game built with Vanilla JavaScript, ThreeJS and Socket.io. My first ever JavaScript and web project. This was my university final year project so focus was on features and functionality. This was before I learnt HTML and CSS more in-depth so the UI is quite literally a random mixture of css animations from codepen that I thought were cool, but now realise may be a bit over-the-top. I learnt JavaScript as I went along, filling the gaps in my knowledge - I will say the game works fine but needs some optimisation. I will solidify my JavaScript knowledge and make this game AMAZING!

## 🚀 Tech Stack
`🧊 ThreeJS`
`🌐 JavaScript` 
`🖧 Node.js` 
`🔌Socket.io`
`⚙️ Vite`

## 🎯 Features 
- **Object-oriented Programming** - A Chess Game Rules engine that follows the principles of object-oriented design
- **3D Game Experience** - An immersive 3D interactive scene to deliver the feeling of 'real Chess' created with ThreeJS. Seamlessly linked with a 2D Chess Rule engine.
- **Customisation** - The ability to customise piece sets, piece-colours and every colour of the board for a truly tailored experience

## 📚 What I Learnt
I acquired valuable skills and insights that have contributed to my growth as this was the first project done with no technical guidance or enforced structure as University projects tend to have.
### **🕋 Working in 3D** 
	I gained a deeper understanding of both the ThreeJS library and how to integrate 3D into my web projects
### **🕹️ Complex Game Logic** 
	Developing the rules-heavy game involved implementing and managing complex game logic, improving my problem-solving abilities.
### **🖥 Real-time Communication with Socket.io** 
	I learned how to facilitate real-time communication between players as well as how to implement a lobby system on my server.
### **🎨 3D Modelling with Blender**
	I had to learn the basics of Blender in order to ensure all the pieces were consistent in size, centre-origin, name, etc. so 
 	that the loading of the different pieces and piecesets would be consistent.
### **🧑🏻‍💻 Client-Specific Rendering**
	I had to implement a way so that clients would only see their own customised Chess set as well as the colour/team (black or 
 	white) they would be playing as. The host of the lobby was also shown different privileges.
  
## 💭 How can it be improved? (To one day rival Chess.com)
- **Optimisation** - The initial loading of the pieces is fine, but when customising and choosing different piecesets, the 3D models are constantly being deleted and reloaded. I'm sure there must be a more efficient way of this
- **Improved UI** - The UI was not a focus at all but I did want it to look nice with my limited CSS ability (at the time). It can be cleaned up and made to be much more user-friendly.
- **Increased Customisation** - Introducing more customisation options. My focus was on functionality so there are only 2 sets that can be chosen as of current. However, there are unlimited colour choices available.
- **Expanded Gameplay Features** - Introducing more gameplay features such as different modes could be a cool addition to this such as bullet Chess or daily Chess problem-solving challenge.
- **User Profiles** - The addition of user profiles would then subsequently allow me to implement a leaderboard andranking system and even a friends list.


## 🚦 Running the Project 
To run the project in your local environment, follow these steps:

1. 'git clone' the **online** branch (default branch) or download the .zip file
2. Once cloned, make sure you are in the ../3DChessProject directory (You should be by default after cloning)
3. 'npm install' to install necessary packages
4. 'node app.js' to run the server
5. Type 'localhost:2000' into your browser to launch the game as a client. Repeat this for however many clients you wish to have.
6. **IMPORTANT:** Currently offline gameplay is disabled so you must launch 2 clients and make them join the same lobby in order to play.
