let currentsong = new Audio();
let songs;
let currfolder;
document.querySelector(".loginpage").style.display = 'none';
document.querySelector(".signuppage").style.display = 'none';
function formatTime(seconds) {
    // Convert seconds to whole minutes and remaining seconds
    if (isNaN(seconds || seconds < 0)) {
        return "00:00";
    }
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and remaining seconds with leading zeros
    var formattedMinutes = (minutes < 10 ? '0' : '') + minutes;
    var formattedSeconds = (remainingSeconds < 10 ? '0' : '') + remainingSeconds;

    // Return formatted time
    return formattedMinutes + ':' + formattedSeconds;
}

function toggleSectionVisibility() {
    var a = document.querySelector('.left');
    if (a.style.display === 'none') {
        a.style.display = 'block';
    }
    else {
        a.style.display = 'none';
    }
}
function togglelogin() {
    var b = document.querySelector('.loginpage');
    if (b.style.display === 'none') {
        b.style.display = 'block';
    }
   
}
function togglesignup() {
    var c= document.querySelector('.signuppage');
    if (c.style.display === 'none') {
        c.style.display = 'block';
    }
   
}

function closeSlideInPage() {
    var slideInPage = document.querySelector(".left");
    slideInPage.style.display = 'none';
}
function closeloginpage() {
    var slideInPage = document.querySelector(".loginpage");
    slideInPage.style.display = 'none';
}
function closesignuppage() {
    var slideInPage = document.querySelector(".signuppage");
    slideInPage.style.display = 'none';
}

async function getsongs(folder) {      //i.e getsongs function will take folder name as parameter so as to 
    currfolder = folder;
    let a = await fetch(`/songs/${folder}/`)   //here we removedthe /songs by /${folder} becoz directly we want to create dynamic folders  which are related to the cards.
    let response = await a.text();
    // console.log(response);

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    // console.log(as);         //since it will show all the anchor tags so we will now target only those with extension as mp3(i.e songs) in the href
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])    //here 1 means the later part of the array as the index 1 comes after index 0.   
            //So after the songs/ (in href) sentence coming will be takem as href gives -"http://127.0.0.1:5500/songs/_Ambarsariya_Fukrey__Song_By_Sona_Mohapatra___Pulkit_Samrat%2C_Priya_Anand(128k).mp3" will be separated and first part will be taken
        }
    }

    // this below code section make sure to add the songs in the list and show it
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML=""
    for (const song of songs) {      //sing songs is the array
        songul.innerHTML = songul.innerHTML + `<li class="limusic flex"><img src="music.svg" class="invert" alt="">
                                <div class="info flex justify align">
                                    <div>${song.replaceAll("%20", " ")}</div>
                                    <div>Mayank</div>
                
                                 </div>
                                <div class="playnow flex justify align">
                                    <span>Play Now</span>
                                    <img class="invert" src="play.svg" alt="">
                                </div>
                                </li>`;
        // note that here replace function replaces only first encountered %20 but replaceAll replaces all %20
        //it will give u the song urls and not their name so for that we use split function above while adding elements in the songs.push so that the whole href is not taken he trimmed(splitted) part is taken.
    }

    // below code is taken from googe to how to play the audio
    // var audio=new Audio(songs[0]);
    // audio.play(); 
    // above 2 line code can be runned to run the 1st song in the songs folder but since we need to make a user interactive website so we will play it only when clicked on play button 
    //audio will be played once but will give "Uncaught (in promise) DOMException: play() failed because the user didn't interact with the document first" as the error on console

    // so we will give the eventlistener for user interaction
    // audio.addEventListener("loadeddata",()=>{
    // let duration = audio.duration;
    // console.log(duration);
    // duration variable holds the duration of the audio clips in seconds
    // but note that this will update the duration only one time but we want it to update multiple times
    //     console.log(audio.duration,audio.currentSrc,audio.currentTime);
    // })



    // now attach an event listener
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        
        e.addEventListener("click", element => {

            // console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playmusic(e.querySelector(".info").firstElementChild.innerHTML);
            //note that trim() function removes the each and every spaces 



        })
        

    })
    return songs;
}
// play=false as the second argument of playmusic function
const playmusic = (track,pause=false) => {
    // let audio = new Audio("/84SpotifyClone/songs/" + track);
    // audio.play();

    currentsong.src = `/songs/${currfolder}/` + track;
    if(!pause){
        currentsong.play();
        play.src="pause.svg"
    }
    // currentsong.play();
    // play.src = "pause.svg"
    // sometimes it may happen that on showing the song name on the playbar %20 will come at the place of spaces so to remove that %20 we need to decode the URI and for that we do decodeURI(track) below.This happend when we use the if condition above to make the first song to play as the default song on refreshing
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}

async function displayAlbums() {
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)  
            playmusic(songs[0])

        })
    })
}

function searchfolder() {
    // Find all elements on the webpage that may contain playlist links
    const inputvalue = document.getElementById('inputfolder').value.toLowerCase();
    const songFolders = document.querySelectorAll('.card');
    let matchFound = false;
    console.log("Match finding")
    Array.from(songFolders).forEach(folder => {
        // Get the data-folder attribute value for the current folder
        // console.log(folder.getAttribute('data-folder'))
        const folderName = folder.getAttribute('data-folder');
        console.log(folderName)
        // Check if the input value matches the data-folder attribute value
        if (inputvalue === folderName){
            
            const searchedcard=document.querySelector(`.card[data-folder="${folderName}"]`)
            searchedcard.style.display="block";
            matchFound = true;
        }
        if(inputvalue!==folderName){
            const searchedcard=document.querySelector(`.card[data-folder="${folderName}"]`)
            searchedcard.style.display="none";
        }
        
    });
    if (!matchFound) {
        alert('No match found for folder: ' + inputvalue);
    }
}

async function main() {


    // to get the list of all song
    await getsongs("hits");
    // console.log(songs);   //it will give all the songs one by one on the console
    playmusic(songs[0],true)


    await displayAlbums();


    // attach an event listener on play,previous,next
    play.addEventListener("click", element => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "pause.svg"
        }
        else {
            currentsong.pause();
            play.src = "play.svg"
        }
    })

    // Listen for time update event
    currentsong.addEventListener("timeupdate", () => {
        // console.log(currentsong.currentTime,currentsong.duration)
        // console.log(document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)}:${formatTime(currentsong.duration)})`
        
        document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`;
        document.querySelector('.circle').style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";

    })
    // Add an event listner for seekbar to move the circle by click
    document.querySelector(".seekbar").addEventListener("click", e => {
        document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
        // now to also make the currentTime of the song according to the position of seekbar we set the value of currentTime ,so
        currentsong.currentTime = ((currentsong.duration) * (e.offsetX / e.target.getBoundingClientRect().width) * 100) / 100
        // since (e.offsetX/e.target.getBoundingClientRect().width)*100 is the % value which is completed i.e till where the cicle has been moved
    })
    // getBoundingClientRect() this function tells that where we are pointing by telling the position's width,height,top,width,x,y
    // (e.offsetX/e.target.getBoundingClientRect().width)*100 this a value which is converted to percentage by adding +"%" in it and this is done becoz left property is given in % in the style.css

    // Add an event listner to show the left side of website on clicking on the hamburger so
    document.querySelector('.hamburger').addEventListener('click', function () {
        document.querySelector(".left").style.left = 0;
        toggleSectionVisibility();
    });
    document.querySelector('.login').addEventListener('click', function () {
        document.querySelector('.loginpage').style.zIndex="1000";
        togglelogin();
    });
    document.querySelector('.signup').addEventListener('click', function () {
        document.querySelector('.signuppage').style.zIndex="1000";
        togglesignup();
    });

    // Add an event listener to previous music
    previous.addEventListener("click", () => {
        
        console.log("Previous Clicked");
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);        //this / is given becoz songs shown are in order so the next song after currentsong can be targeted by this method

        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }
        else {
            playmusic(songs[songs.length - 1])
        }

    })

    let users = [];

    // Function to handle login
    const handleLogin = (event) => {
      event.preventDefault();
      const username = document.getElementById('loginUsername').value;
      const password = document.getElementById('loginPassword').value;

      const user = users.find(user => user.username === username && user.password === password);
      if (user) {
        alert('Login successful!');
      } else {
        alert('Invalid username or password.');
      }
    };

    // Function to handle sign up
    const handleSignup = (event) => {
        event.preventDefault();
        const username = document.getElementById('signupUsername').value;
        const password = document.getElementById('signupPassword').value;
  
        if (username && password) {
          users.push({ username, password });
          alert('Sign up successful! You can now login.');
        } else {
          alert('Please enter a username and password.');
        }
      };
  
      // Event listeners
      document.getElementById('loginForm').addEventListener('submit', handleLogin);
      document.getElementById('signupForm').addEventListener('submit', handleSignup);


    // Add an event listener to next music
    next.addEventListener("click", () => {
        
        console.log("Next Clicked");
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);        //this / is given becoz songs shown are in order so the next song after currentsong can be targeted by this method

        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1])
        }
        else {
            playmusic(songs[0])
        }
    })

    // add an event to volume range bar
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log(e,e.target,e.target.value);
        currentsong.volume = parseInt(e.target.value) / 100;
    })

    // Load the playlist when u click a particular card
    // note that here Array.from is used becoz forEach cannot be used directly on tdocument.getElementsByClassName("card") becoz it is a collection so we will convert it into a Array form 
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            // console.log(item, item.currentTarget.dataset)
            songs = await getsongs(`${item.currentTarget.dataset.folder}`);
            // note that target here means the exact element which u click for eg in card also if u click on image,heading or paragraph then the songs will not load in the folder,they will only be loaded when u click on the card particularly at its extreme side.
            // but you can use currentTarget to avoid this so that even if u click on thge inner elements then also the even will occur which is mentioned.
            playmusic(songs[0])

        })
    })

    // to mute or unmute the voice
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentsong.volume= 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentsong.volume= 0.10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 50;
        }

    })

    document.querySelector('.input').addEventListener('keypress', function (e) {

        if (e.key === 'Enter') {
            searchfolder();
        }
    });

}
main();