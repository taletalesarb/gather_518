function echo(text){
    console.log('%c'+'+'.repeat(text.length+20), 'background: #222; color: #bada55');
    console.log('%c'+'+++ Gather 518% '+text+' +++', 'background: #222; color: #bada55');
}

function echored(text){
    console.log('%c'+'+'.repeat(text.length+20), 'background: rgb(217 33 50); color: #bada55');
    console.log('%c'+'+++ Gather 518% '+text+' +++', 'background: rgb(217 33 50); color: #bada55');
}

echo("contentScript.js: SCRIPT LOADED");

let tp = setInterval(() => 
{
    //echo("document has audio-element?: "+ document.getElementById("audio-element"));
    //echored("window has Maps?: "+ window.hasOwnProperty("Maps"));

    if(document.getElementsByClassName("Layout css-1oteowz"))
    {
        inject();
        clearInterval(tp);
    }
}, 518)

var zombieModeEnabled = false;

function inject()
{
    echo('contentScript.js: INJECT FUNCTION CALLED');

    function teleportTo(targetName) 
    {
        let playersOnServer = getPlayers();

        game.teleport(game.players[playersOnServer[targetName]].map, game.players[playersOnServer[targetName]].x,
            game.players[playersOnServer[targetName]].y)
    }
	 //game.players[gameSpace.id].name
    function getPlayers() 
    {
        let playersOnServer = [];
        for (player in game.players) {
            playersOnServer[game.players[player].name] = player;
        }
        return playersOnServer;
    }

    function teleportToMe(targetName) 
    {
        let playersOnServer = getPlayers();
        
        let x = gameSpace.gameState[gameSpace.id].x;
        let y = gameSpace.gameState[gameSpace.id].y;
        let m = gameSpace.gameState[gameSpace.id].map;
        if (playersOnServer[targetName] != undefined){  
            game.teleport(m, x, y, playersOnServer[targetName]);
        }
    }

    function getOverHere(targetName) 
    {
        let time = Math.round(new Date().getTime() / 1000) + 30;

        let playersOnServer = getPlayers();
        let x = gameSpace.gameState[gameSpace.id].x;
        let y = gameSpace.gameState[gameSpace.id].y;
        let m = gameSpace.gameState[gameSpace.id].map;

        if (playersOnServer[targetName] != undefined) {
            console.log(targetName + " was located with the ID:" + playersOnServer[targetName]);
            
            let px = game.players[playersOnServer[targetName]].x;
            let py = game.players[playersOnServer[targetName]].y;
            let pm = game.players[playersOnServer[targetName]].map;
            if (px<2){
                px = px + 2;
            }
            else{
                px = px - 2;
            }
            game.teleport(pm, px, py);

            game.enterWhisper(playersOnServer[targetName]);

            game.teleport(m, x, y)
            game.setFollowTarget(''); 
            game.leaveWhisper(); 
            gameSpace.cancelFollow();
            gameSpace._cancelMove();
            game.move(3);
            game.move(2);

            var tp = setInterval(function () {
                //game.teleport(gameSpace.mapId, x, y);
                 //game.setFollowTarget(''); 
                 //game.leaveWhisper(); 
                 //gameSpace.cancelFollow();
                 //gameSpace._cancelMove();

                let px = game.players[playersOnServer[targetName]].x;
                let py = game.players[playersOnServer[targetName]].y;

                let targetIsNextToPlayer = (1 == (((x - px) * (x - px)) + ((y - py) * (y - py))));
                let timeOut = time < Math.round(new Date().getTime() / 1000);

                if (targetIsNextToPlayer) {
                    echo("Teleporting loop was stopped since "+ targetName +" is now here");
                    clearInterval(tp);
                }

                if (timeOut)  //or after a minute
                {
                    echo("Teleporting loop was stopped since 30 seconds passed");
                    clearInterval(tp);
                }
            }, 200);
            
            game.setFollowTarget('');
        } else {
            echo("Player not found");
        }
    }

            //fernsteuerbar

    let tp = setInterval(() => { //Stellt sicher das die Elemente erscheinen nach dem man Videos fullscreen gemacht hat
        if (document.getElementsByClassName("GameCanvasContainer-main").length && !document.getElementById("getOverHereButton"))
        {
            createTwoButtonWithTextbox("getOverHereButton","TpToMeButton" , "Get over here","TP to me", "targetnameTextbox");
            createButtonWithTextbox("teleportToButton", "Teleport to", "targetteleportTextbox");
            createButton("zombie","Make me a Robot");

            document.getElementById("zombie").addEventListener("click", function() {
                zombieModeEnabled = !zombieModeEnabled;
                let userName = zombieModeEnabled ? "[🤖]"+game.players[gameSpace.id].name : game.players[gameSpace.id].name.replace("[🤖]","");
                game.setName(userName);
                document.getElementById("zombie").style.background = zombieModeEnabled ? "rgb(247, 88, 130)" : "rgb(130, 88, 247)";
                document.getElementById("zombie").innerHTML = zombieModeEnabled ? "Make me a Human" : "Make me a Robot";
                echo("zombieMode(global): "  +zombieModeEnabled);
		if (zombieModeEnabled){
			var walk_i = 0;
			zombie_walk = setInterval(function () {
        			game.move(walk_i)
				if (walk_i == 0){
					walk_i = 3;
				} else if (walk_i == 3){
					walk_i = 1;
				}else if (walk_i == 1){
					walk_i = 2;
				}else if (walk_i == 2){
					walk_i = 0;
				}
    			}, 2000);
		} else {
			clearInterval(zombie_walk);
		}
	
            }, false);

            document.getElementById("getOverHereButton").addEventListener("click", function() {
                getOverHere(document.getElementById("targetnameTextbox").value);
            }, false);

            document.getElementById("TpToMeButton").addEventListener("click", function() {
                teleportToMe(document.getElementById("targetnameTextbox").value);
            }, false);
            
            document.getElementById("teleportToButton").addEventListener("click", function() {
                teleportTo(document.getElementById("targetteleportTextbox").value);
            }, false);
            echo("UI elements were now added.");
        }
    }, 256);

}


function createButton(buttonID, buttonText)
{
    let buttonstyle = "display: flex; position: relative; box-sizing: border-box; outline: none; \
    -webkit-box-align: center; align-items: center; -webkit-box-pack: center; justify-content: center; \
    font-family: inherit; font-weight: 700; transition: background-color 200ms ease 0s, border-color 200ms ease 0s; \
    cursor: pointer; opacity: 1; overflow: hidden; background-color: rgb(130, 88, 247); \
    border: 2px solid transparent; width: auto; height: 32px; border-radius: 16px; \
    font-size: 15px; color: rgb(255, 255, 255) !important; width:100%"

    var blueButton = document.createElement("button")
    blueButton.setAttribute("id", buttonID);
    blueButton.setAttribute("type", "submit");
    blueButton.setAttribute("shape", "rounded");
    blueButton.setAttribute("class", "css-7fr7eg");
    blueButton.setAttribute("kind", "tertiary");
    blueButton.setAttribute("style", buttonstyle);

    blueButton.innerHTML = buttonText;
    
    
    var container = document.createElement("form");
    container.setAttribute("class", "css-1xt6zos css-ixaah3");
    container.setAttribute("action", "javascript:void(0);");
    container.setAttribute("style", "background-color:rgb(40, 45, 78);height: auto !important; min-height: auto; border-radius: 20px; padding: 5px;");  
    
    container.appendChild(blueButton);

    document.getElementsByClassName("Layout css-1oteowz")[0].appendChild(container);

}

function createButtonWithTextbox(buttonID, buttonText, texboxID)
{

    let buttonstyle = "display: flex; position: relative; box-sizing: border-box; outline: none; \
    -webkit-box-align: center; align-items: center; -webkit-box-pack: center; justify-content: center; \
    font-family: inherit; font-weight: 700; transition: background-color 200ms ease 0s, border-color 200ms ease 0s; \
    cursor: pointer; opacity: 1; overflow: hidden; background-color: rgb(88, 130, 247); \
    border: 2px solid transparent; width: auto; height: 32px; margin-top: 5px; \
    border-radius: 16px; font-size: 15px; color: rgb(255, 255, 255) !important; width:100%"

    var blueButton = document.createElement("button")
    blueButton.setAttribute("id", buttonID);
    blueButton.setAttribute("type", "submit");
    blueButton.setAttribute("shape", "rounded");
    blueButton.setAttribute("class", "css-7fr7eg");
    blueButton.setAttribute("kind", "tertiary");
    blueButton.setAttribute("style", buttonstyle);

    blueButton.innerHTML = buttonText;
    
    var textboxWrapper = document.createElement("div") 
    textboxWrapper.setAttribute("class", "Input light lg")
    textboxWrapper.setAttribute("style", "height: 30px;");
    
    var textbox = document.createElement("input")
    textbox.setAttribute("id", texboxID)
    textbox.setAttribute("placeholder", "Target name")
    textbox.setAttribute("autocomplete", "off")
    textbox.setAttribute("style", "font-weight: 400;")
    
    
    var container = document.createElement("form");
    container.setAttribute("class", "css-1xt6zos css-ixaah3");
    container.setAttribute("action", "javascript:void(0);");
    container.setAttribute("style", "background-color:rgb(40, 45, 78);height: auto !important; min-height: auto; border-radius: 20px; padding: 5px;");  
    
    textboxWrapper.appendChild(textbox);
    
    container.appendChild(textboxWrapper);
    container.appendChild(blueButton);

    document.getElementsByClassName("Layout css-1oteowz")[0].appendChild(container);

}

function createTwoButtonWithTextbox(buttonID1, buttonID2, buttonText1, buttonText2, texboxID)
{

    let buttonstyle = "display: inline-block; position: relative; box-sizing: border-box; outline: none; \
    -webkit-box-align: center; align-items: center; -webkit-box-pack: center; justify-content: center; \
    font-family: inherit; font-weight: 700; transition: background-color 200ms ease 0s, border-color 200ms ease 0s; \
    cursor: pointer; opacity: 1; overflow: hidden; background-color: rgb(88, 130, 247); \
    border: 2px solid transparent; width: auto; height: 32px; margin-top: 5px; \
    border-radius: 16px; font-size: 15px; color: rgb(255, 255, 255) !important; width:100%"

    var blueButton1 = document.createElement("button")
    blueButton1.setAttribute("id", buttonID1);
    blueButton1.setAttribute("type", "submit");
    blueButton1.setAttribute("shape", "rounded");
    blueButton1.setAttribute("class", "css-7fr7eg");
    blueButton1.setAttribute("kind", "tertiary");
    blueButton1.setAttribute("style", buttonstyle);

    var blueButton2 = document.createElement("button")
    blueButton2.setAttribute("id", buttonID2);
    blueButton2.setAttribute("type", "submit");
    blueButton2.setAttribute("shape", "rounded");
    blueButton2.setAttribute("class", "css-7fr7eg");
    blueButton2.setAttribute("kind", "tertiary");
    blueButton2.setAttribute("style", buttonstyle);

    blueButton1.innerHTML = buttonText1;
    blueButton2.innerHTML = buttonText2;
    
    var textboxWrapper = document.createElement("div") ;
    textboxWrapper.setAttribute("class", "Input light lg");
    textboxWrapper.setAttribute("style", "height: 30px;");
    
    var textbox = document.createElement("input")
    textbox.setAttribute("id", texboxID)
    textbox.setAttribute("placeholder", "Target name")
    textbox.setAttribute("autocomplete", "off")
    textbox.setAttribute("style", "font-weight: 400;")

    // var select = document.createElement("select");
    // select.setAttribute("id", texboxID);
    // select.setAttribute("option","Choose a player");
    // select.setAttribute("style", "font-weight: 400;");

    // var select = document.getElementById("texboxID");
    // var options = getPlayers();

    // for(var i = 0; i < options.length; i++) {
    //     var opt = options[i];
    //     var el = document.createElement("option");
    //     el.textContent = opt;
    //     el.value = opt;
    //     select.appendChild(el);
    // }
    
    var container = document.createElement("form");
    container.setAttribute("class", "css-1xt6zos css-ixaah3");
    container.setAttribute("action", "javascript:void(0);");
    container.setAttribute("style", "background-color:rgb(40, 45, 78);height: auto !important; min-height: auto; border-radius: 20px; padding: 5px;");  
    
    textboxWrapper.appendChild(textbox);
    
    container.appendChild(textboxWrapper);
    container.appendChild(blueButton1);
    container.appendChild(blueButton2);

    document.getElementsByClassName("Layout css-1oteowz")[0].appendChild(container);

}