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
        document.querySelector('#posterContainer').classList.add('maximized')
        document.querySelector('#poster').classList.add('maximized')
        document.querySelector('.picture').classList.toggle('zoomedBackground')
        // document.querySelector('#pictureContainer').classList.add('noblur')
        // document.querySelector('#movieTitle').style.visibility = 'hidden'
    }
    else {
        document.querySelector('#posterContainer').classList.remove('maximized')
        document.querySelector('#poster').classList.remove('maximized')
        document.querySelector('.picture').classList.remove('zoomedBackground')
        // document.querySelector('#pictureContainer').classList.remove('noblur')
        // document.querySelector('#movieTitle').style.visibility = 'initial'
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
    document.querySelector('#movieTitle').style.visibility = 'initial'
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
        url: "https://m.media-amazon.com/images/M/MV5BMzAyOTc0YTgtM2RmOC00ZGE3LWE5ZmMtMzJjZDA1ZmJiYjQzXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg"
    },
    {
        title: "The Social Network (2010)",
        url: "https://m.media-amazon.com/images/M/MV5BOGUyZDUxZjEtMmIzMC00MzlmLTg4MGItZWJmMzBhZjE0Mjc1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_UY1200_CR90,0,630,1200_AL_.jpg"
    },
    {
        title: "The Girl with the Dragon Tattoo (2011)",
        url: "https://m.media-amazon.com/images/M/MV5BMTczNDk4NTQ0OV5BMl5BanBnXkFtZTcwNDAxMDgxNw@@._V1_UY1200_CR90,0,630,1200_AL_.jpg",
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
    {
        title: "Pulp Fiction (1994)",
        url: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg"
    },
    {
        title: "Avengers: Infinity War (2018)",
        url: "https://m.media-amazon.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_.jpg"
    },
    {
        title: "Mad Max: Fury Road (2015)",
        url: "https://m.media-amazon.com/images/M/MV5BN2EwM2I5OWMtMGQyMi00Zjg1LWJkNTctZTdjYTA4OGUwZjMyXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg"
    },
    {
        title: "Before Sunset (2004)",
        url: "https://m.media-amazon.com/images/M/MV5BMTQ1MjAwNTM5Ml5BMl5BanBnXkFtZTYwNDM0MTc3._V1_FMjpg_UX1000_.jpg",
    },
    {
        title: "La La Land (2016)",
        url: "https://m.media-amazon.com/images/M/MV5BMzUzNDM2NzM2MV5BMl5BanBnXkFtZTgwNTM3NTg4OTE@._V1_.jpg",
    },
    {
        title: "Inherent Vice (2014)",
        url: "https://m.media-amazon.com/images/M/MV5BOTVhMjA0OWEtNzY4MS00YWY0LThlOWYtOWNkYjUwMzE5NDYwXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_FMjpg_UX1000_.jpg"
    },
    {
        title: "Breaking Bad (2008-2013)",
        url: "https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_FMjpg_UX1000_.jpg"
    },
    {
        title: "Sherlock (2010-2017)",
        url: "https://m.media-amazon.com/images/M/MV5BMWEzNTFlMTQtMzhjOS00MzQ1LWJjNjgtY2RhMjFhYjQwYjIzXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_FMjpg_UX1000_.jpg"
    },
    {
        title: "The Devil All the Time (2020)",
        url: "https://m.media-amazon.com/images/M/MV5BZmE1NmVmN2EtMjZmZC00YzAyLWE4MWEtYjY5YmExMjUxODU1XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_FMjpg_UX1000_.jpg"
    },
    {
        title: "Annihilation (2018)",
        url: "https://m.media-amazon.com/images/M/MV5BMTk2Mjc2NzYxNl5BMl5BanBnXkFtZTgwMTA2OTA1NDM@._V1_.jpg"
    }
];

