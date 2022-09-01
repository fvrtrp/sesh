import { createElement, loadStyle } from '../../utils.js'

export function loadTheme() {
    console.log(`loading movie posters`)
    loadCss()
}

function resumeLoading() {
    createElement("vignetteBackground","", "#seshParent")
    createElement("vignetteContainer","", "#vignetteBackground")
    createElement("pictureContainer","pictureContainer", "#vignetteBackground")
    createElement("","picture", "#pictureContainer", "img")
    createElement("posterContainer","posterContainer", "#vignetteBackground")
    const poster = createElement("poster","picture", "#posterContainer", "img")
    createElement("movieTitle","movieTitle", "#posterContainer")

    poster.addEventListener('mouseenter', ()=>toggleZoom(true))
    poster.addEventListener('mouseleave', ()=>toggleZoom(false))

    setBackgroundAndText()
}

function loadCss() {
    loadStyle("addons/movie-posters/index.css")
    .then(() => {
        document.querySelector("#seshParent").className = `theme-movies`
        resumeLoading()
    }).catch(err => alert(err))
}

let movieTitle = ""

function toggleZoom(flag) {
    if(flag) {
        //document.querySelector('#poster').classList.add('zoomedPicture');
        document.querySelector('.picture').classList.toggle('zoomedBackground')
        document.querySelector('#pictureContainer').classList.add('noblur')
        document.querySelector('#movieTitle').style.visibility = 'initial'
    }
    else {
        //document.querySelector('#poster').classList.remove('zoomedPicture');
        //document.querySelector('.picture').classList.remove('zoomedBackground')
        document.querySelector('#pictureContainer').classList.remove('noblur')
        //document.querySelector('#movieTitle').style.visibility = 'hidden'
    }
}

function setBackgroundAndText() {
    const randomIndex = Math.floor(Math.random()*imageList.length)
    const randomItem = imageList[randomIndex]
    movieTitle = randomItem.title
    const link = randomItem.url
    const pictures = document.getElementsByClassName("picture")
    for(let item of pictures){
        item.src = link;
    }
    document.querySelector('#movieTitle').style.visibility = 'hidden'
    document.querySelector('#movieTitle').innerText = movieTitle
    //toggleZoom(true)
}

export function cleanup() {
    console.log(`cleaning up movies`)
    let container = document.getElementById("vignetteBackground")
    if(container)   container.remove()
    container = document.getElementById("vignetteContainer")
    if(container)   container.remove()
    container = document.getElementById("pictureContainer")
    if(container)   container.remove()
    container = document.getElementById("posterContainer")
    if(container)   container.remove()
}

const imageList = [
    {
        title: 'Interstellar (2016)',
        url: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_UY1200_CR90,0,630,1200_AL_.jpg",
    },
    {
        title: 'Blade Runner 2049 (2017)',
        url: "https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_UY1200_CR90,0,630,1200_AL_.jpg"
    },
    {
        title: 'You Were Never Really Here (2017)',
        url: "https://m.media-amazon.com/images/M/MV5BMDkwOTE0ZjMtZmRiYS00M2M3LWE3MzUtNzNmNmExNTNmNjg5XkEyXkFqcGdeQXVyODE1MjMyNzI@._V1_UY1200_CR90,0,630,1200_AL_.jpg",
    },
    {
        title: "The Dark Knight (2008)",
        url: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_UY1200_CR90,0,630,1200_AL_.jpg",
    },
    {
        title: "The Dark Knight Rises (2012)",
        url: "https://m.media-amazon.com/images/M/MV5BMTk4ODQzNDY3Ml5BMl5BanBnXkFtZTcwODA0NTM4Nw@@._V1_UY1200_CR90,0,630,1200_AL_.jpg",
    },
    {
        title: "Inglourious Basterds (2009)",
        url: "https://m.media-amazon.com/images/M/MV5BOTJiNDEzOWYtMTVjOC00ZjlmLWE0NGMtZmE1OWVmZDQ2OWJhXkEyXkFqcGdeQXVyNTIzOTk5ODM@._V1_UY1200_CR90,0,630,1200_AL_.jpg",
    },
    {
        title: "Coherence (2013)",
        url: "https://m.media-amazon.com/images/M/MV5BNzQ3ODUzNDY2M15BMl5BanBnXkFtZTgwNzg0ODY2MTE@._V1_UY1200_CR90,0,630,1200_AL_.jpg",
    },
    {
        title: "Batman v Superman: Dawn of Justice (2016)",
        url: "https://m.media-amazon.com/images/M/MV5BZDlhYWEzNGUtODM5YS00ZDA2LWJhNTQtMWZhMjVkMGE2NDU5XkEyXkFqcGdeQXVyNTIzOTk5ODM@._V1_SY1000_CR0,0,666,1000_AL_.jpg",
    },
    {
        title: "Moonlight (2016)",
        url: "https://m.media-amazon.com/images/M/MV5BNzQxNTIyODAxMV5BMl5BanBnXkFtZTgwNzQyMDA3OTE@._V1_UY1200_CR90,0,630,1200_AL_.jpg",
    },
    {
        title: "Fight Club (1999)",
        url: "https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UY1200_CR85,0,630,1200_AL_.jpg",
    },
    {
        title: "The Social Network (2010)",
        url: "https://m.media-amazon.com/images/M/MV5BOGUyZDUxZjEtMmIzMC00MzlmLTg4MGItZWJmMzBhZjE0Mjc1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_UY1200_CR90,0,630,1200_AL_.jpg"
    },
    {
        title: "Zodiac (2007)",
        url: "https://m.media-amazon.com/images/M/MV5BN2UwNDc5NmEtNjVjZS00OTI5LWE5YjctMWM3ZjBiZGYwMGI2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UY1200_CR91,0,630,1200_AL_.jpg",
    },
    {
        title: "The Girl with the Dragon Tattoo (2011)",
        url: "https://m.media-amazon.com/images/M/MV5BMTczNDk4NTQ0OV5BMl5BanBnXkFtZTcwNDAxMDgxNw@@._V1_UY1200_CR90,0,630,1200_AL_.jpg",
    },
    {
        title: "The Machinist (2004)",
        url: "https://m.media-amazon.com/images/M/MV5BNjk1NzBlY2YtNjJmNi00YTVmLWI2OTgtNDUxNDE5NjUzZmE0XkEyXkFqcGdeQXVyNTc1NTQxODI@._V1_UY1200_CR90,0,630,1200_AL_.jpg",
    },
    {
        title: "Terminator Salvation (2009)",
        url: "https://m.media-amazon.com/images/M/MV5BODE1MTM1MzA2NF5BMl5BanBnXkFtZTcwODQ5MTA2Mg@@._V1_UY1200_CR129,0,630,1200_AL_.jpg",
    },
    {
        title: "Taxi Driver (1976)",
        url: "https://m.media-amazon.com/images/M/MV5BM2M1MmVhNDgtNmI0YS00ZDNmLTkyNjctNTJiYTQ2N2NmYzc2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg",
    },
    {
        title: "Joker (2019)",
        url: "https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
    },
    {
        title: "Mindhunter (2017-)",
        url: "https://m.media-amazon.com/images/M/MV5BYzA3ZWZkYjMtZTk3Yi00MzQxLTgyOGUtYmE0ZTkwMTYwYzM5XkEyXkFqcGdeQXVyMTA3MzQ4MTc0._V1_.jpg",
    },
    {
        title: "Tenet (2020)",
        url: "https://m.media-amazon.com/images/M/MV5BOGE2NmU0YmEtNzVmYy00YzcxLWExM2MtNDhmYjUwMzA3YjMzXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
    },
    {
        title: "Inception (2010)",
        url: "https://m.media-amazon.com/images/M/MV5BMjExMjkwNTQ0Nl5BMl5BanBnXkFtZTcwNTY0OTk1Mw@@._V1_.jpg",
    },
    {
        title: "Batman v Superman: Dawn of Justice (2016)",
        url: "https://m.media-amazon.com/images/M/MV5BYThjYzcyYzItNTVjNy00NDk0LTgwMWQtYjMwNmNlNWJhMzMyXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
    },
    {
        title: "Man of Steel (2013)",
        url: "https://m.media-amazon.com/images/M/MV5BMTkxNzM1NDg1NV5BMl5BanBnXkFtZTcwNzk0ODQ1OQ@@._V1_.jpg",
    },
    {
        title: "Sicario (2015)",
        url: "https://m.media-amazon.com/images/M/MV5BMjA5NjM3NTk1M15BMl5BanBnXkFtZTgwMzg1MzU2NjE@._V1_FMjpg_UX1000_.jpg",
    },
    {
        title: "Sicario: Day of the Soldado (2018)",
        url: "https://m.media-amazon.com/images/M/MV5BMjM2Mzc0NTM4MF5BMl5BanBnXkFtZTgwNDgwMjMyNTM@._V1_.jpg",
    },
    {
        title: "Dune (2021)",
        url: "https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_FMjpg_UX1000_.jpg",
    },
    {
        title: "Arrival (2016)",
        url: "https://m.media-amazon.com/images/M/MV5BMTExMzU0ODcxNDheQTJeQWpwZ15BbWU4MDE1OTI4MzAy._V1_.jpg",
    },
    {
        title: "Archenemy (2020)",
        url: "https://m.media-amazon.com/images/M/MV5BMzhlMTE0NjgtZjQ1Ni00MDRhLTg5NWItYTRjMTgzODE1MDk0XkEyXkFqcGdeQXVyMzQwMTY2Nzk@._V1_UY1200_CR90,0,630,1200_AL_.jpg",
    },
    {
        title: "Watchmen (2009)",
        url: "https://m.media-amazon.com/images/M/MV5BY2IzNGNiODgtOWYzOS00OTI0LTgxZTUtOTA5OTQ5YmI3NGUzXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    },
];

