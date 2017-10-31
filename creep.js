// Declare  vars up here so we can use them in functions
var body
var stage
var eyes
var yuri
var overlay
var heartbeat = new Audio("assets/audio/heartbeat.ogg")

// Don't actually run anything until the page is loaded
document.addEventListener("DOMContentLoaded", function() {
    // Makes sure the scroll bars don't show up
    document.getElementsByTagName("html")[0].style.overflow="hidden"
    // Darken the page
    document.getElementsByTagName("body")[0].style.filter="brightness(0.1)"

    // Assign the vars above
    body = document.getElementsByTagName("body")[0]
    stage = document.getElementsByClassName("stage")[0]
    eyes = document.getElementsByClassName("eyes")[0]
    yuri = document.getElementsByClassName("yuri")[0]
    overlay = document.getElementsByClassName("overlay")[0]
    // Initially sets the eye margin so it sits on top of Yuri's face instead of way below
    fixEyeLocation()

    // Setup heartbeat sound so it loops with a much less noticable gap. Still not perfect.
    heartbeat.addEventListener('timeupdate', function() {
        var buffer = .40
        if (this.currentTime > this.duration - buffer) {
            this.currentTime = 0
            this.play()
            bounceZoom()
        }
    }, false);
    heartbeat.loop = false

    // Schedule an eye movement every 2 seconds
    window.setInterval(function() {
        moveEyes()
    }, 2000)

    // Starts the heartbeat sound
    heartbeat.play() // TODO - Uncomment when it stops being annoying :aquaThumbsUp:
    bounceZoom()

    // When the window resizes, we need to fix the eye location again
    window.addEventListener("resize", fixEyeLocation)

    // Schedules the slow zoom
    window.setTimeout(function() {
        var maxTime = 40000
        var frame = 0
        var stage = document.getElementsByClassName("stage")[0]
        var loop = window.setInterval(function() {
            stage.style.transform = "scale(" + (1 + (frame * 0.0001)) + ")"
            stage.style.marginTop = (300 / maxTime) * frame
            stage.style.marginLeft = getStageOffset() + ((1000 / maxTime) * frame)
            if (frame++ > maxTime) {
                window.clearInterval(loop)
            }
        }, 10)
    }, 1)
})

function moveEyes() {
    eyes.style.marginLeft = getRandomArbitrary(0, 15) + "px"
    eyes.style.marginTop = -yuri.offsetHeight + getRandomArbitrary(-3, 5) + "px"
}

function fixEyeLocation() {
    eyes.style.marginTop = -yuri.offsetHeight + "px"
}

function bounceZoom() {
    overlay.style.animationName = "throb";
    overlay.style.filter = "blur(2px)"
    window.setTimeout(function() {
        overlay.style.animationName = "";
        overlay.style.filter = "";
    }, 600);
}

function getStageOffset() {
    return (window.innerWidth / 2) - (stage.innerWidth / 2)
}

function getRandomArbitrary(min, max) {
  return Math.floor((Math.random() * max) + min);
}
