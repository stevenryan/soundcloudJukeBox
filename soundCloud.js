SC.initialize({client_id: ENV})
var searchMusic = document.getElementById("searchMusic")
var outputContainer = document.getElementById("outputContainer")
var searchOptions = outputContainer.children
var albumArt = document.getElementById("albumArt")
var right = document.getElementById("right")
var trackTitle = document.getElementById("trackTitle")
var trackDate = document.getElementById("trackDate")
var trackGenre = document.getElementById("trackGenre")

var previousBttn = document.getElementById("previousBttn")
var playBttn = document.getElementById("playBttn")
var pauseBttn = document.getElementById("pauseBttn")
var nextBttn = document.getElementById("nextBttn")

var songList = [];
var currentSong = 0;

$("#searchMusic").on("keyup", function(e){
    if (e.keyCode == 13){
    outputContainer.style.visibility = "visible"
    SC.get("/tracks/",
      {q: searchMusic.value}
      ).then(function(response){
      console.log(response)

      if (searchOptions.length > 0){
        for(let i=0; i<searchOptions.length;){
          outputContainer.removeChild(outputContainer.childNodes[i]);
        }
        songList = [];
      }

      for(let i=0; i<response.length; i++){
        songList.push(response[i])
        var songOption = document.createElement("div")
        songOption.className = "songOption"
        var songIcon = document.createElement("img")
        songIcon.className = "songIcon"
        var songTitle = document.createElement("p")
        songTitle.className = "songTitle"
        outputContainer.appendChild(songOption);
        songOption.appendChild(songIcon);
        songOption.appendChild(songTitle);
        songIcon.src = response[i].artwork_url
        songTitle.innerHTML = response[i].title
      }

      for(let i=0; i<searchOptions.length; i++){
        currentSong = i;
        SC.stream("/tracks/" + songList[currentSong].id).then(function(player){
          searchOptions[i].addEventListener('click', function(){
            player.pause();
            player.currentTime = 0;
            right.style.visibility = "visible"
            albumArt.style.backgroundImage = "url("+response[i].artwork_url+")"
            trackTitle.innerHTML = response[i].title
            var date = response[i].created_at.split(" ")
            trackDate.innerHTML = date[0]
            trackGenre.innerHTML = response[i].genre
            player.seek(0);
            player.play();

            playBttn.addEventListener('click', function(){
              player.play();
            })

            pauseBttn.addEventListener('click', function(){
              player.pause();
            })

            // nextBttn.addEventListener('click', function(){
            //   player.pause();
            //   player.seek(0);
            //   if (currentSong === songList.length-1){
            //     currentSong = 0;
            //     player.play();
            //   } else{
            //     currentSong++;
            //     player.play();
            //   }
            // })
            //
            // previousBttn.addEventListener('click', function(){
            //   player.pause();
            //   player.seek(0);
            //   if (currentSong === 0){
            //     currentSong = songList.length-1;
            //     player.play();
            //   } else{
            //     currentSong--;
            //     player.play();
            //   }
            // })
          })
        })
      }
    })
  }
})
