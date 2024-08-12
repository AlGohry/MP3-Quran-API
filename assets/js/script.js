const apiURL = "https://www.mp3quran.net/api/v3";
const lang = "ar";


const chooseReciters = document.querySelector("#chooseReciters");
const chooseRewaya = document.querySelector("#chooseRewaya");
const chooseSurah = document.querySelector('#chooseSurah');
const audioPlayer = document.querySelector('#audioPlayer');
const videoPlayer = document.querySelector('#videoPlayer');

async function getReciters() {
  const res = await fetch(`${apiURL}/reciters?language=${lang}`);
  const data = await res.json();

  chooseReciters.innerHTML = '<option value="">اختر القارئ</option>'; // empty option for Reciters

  data.reciters.forEach(reciter => chooseReciters.innerHTML += `<option value="${reciter.id}">${reciter.name}</option>`)
  chooseReciters.addEventListener("change", e => {
    getRewaya(e.target.value)
  });

}

getReciters();

async function getRewaya(reciter) {
  const res = await fetch(`${apiURL}/reciters?language=${lang}&reciter=${reciter}`);
  const data = await res.json();
  const rewayat = data.reciters[0].moshaf

  chooseRewaya.innerHTML = '<option value="">اختر الرواية</option>';  // empty option for Rewaya

  rewayat.forEach(rewaya => chooseRewaya.innerHTML += `<option value="${rewaya.id}" data-server="${rewaya.server}" data-surahlist="${rewaya.surah_list}" >${rewaya.name}</option>`)

  chooseRewaya.addEventListener("change", event => {
    const selectedRewaya = chooseRewaya.options[chooseRewaya.selectedIndex];
    const surahServer = selectedRewaya.dataset.server;
    const surahList = selectedRewaya.dataset.surahlist;
    getSurah(surahServer, surahList)
  });

}

async function getSurah(surahServer, surahList) {
  const res = await fetch(`${apiURL}/suwar`);
  const data = await res.json();
  const surahNames = data.suwar;
  surahList = surahList.split(',')

  chooseSurah.innerHTML = '<option value="">اختر السورة</option>';  // empty option for Surah

  surahList.forEach(surah => {
    const padSurah = surah.padStart(3, '0')
    surahNames.forEach(surahName => {
      if (surahName.id == surah) {
        chooseSurah.innerHTML += `<option value="${surahServer}${padSurah}.mp3" >${surahName.name}</option>`
        // console.log(surahName.name)
      }
    })
  })

  chooseSurah.addEventListener('change', event => {
    selectedSurah = chooseSurah.options[chooseSurah.selectedIndex]
    // console.log(selectedSurah.value)
    playSurah(selectedSurah.value)
  })
}

async function playSurah(surahUrl) {
  audioPlayer.src = surahUrl; 
  await audioPlayer.load(); // Load the audio file to prepare for playback
  audioPlayer.play();

  // Handle errors
  audioPlayer.onerror = (error) => {
    console.error('Error playing surah:', error); // Display an error message to the user
  }
}

function playLive(channel) {
  if (Hls.isSupported()) {
    var hls = new Hls();
    hls.loadSource(`${channel}`);
    hls.attachMedia(videoPlayer)
    hls.on(Hls.Event.MANIFEST_PARSED, function(){
      videoPlayer.play();
    })
  }
}

// console.log(data.reciters[0].moshaf)
// console.log(`Reciter: ID= ${reciter.id} Name= ${reciter.name} `)

