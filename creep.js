// Declare  vars up here so we can use them in functions
var body
var stage
var eyes
var yuri
var overlay
var stageScale = 1
var heartbeat = new Audio("assets/audio/heartbeat.ogg")
var glitch = new Audio("assets/audio/glitch.ogg")
var loopFrame
var loop
var eyeLoop
var afterHidden = false
var afterReturn = false

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
    fixOffsets()
	
	var onHeartbeat = function() {
        var buffer = .40
        if (this.currentTime > this.duration - buffer) {
			if (!document.hidden || afterReturn || (document.hidden && !afterHidden && Math.random() < 0.98)) {
				this.currentTime = 0
				this.play()
				bounceZoom()
			} else if (!afterHidden) {
				afterHidden = true
				console.log("nao")
				overlay.className += " afterHidden"
				eyes.src = eyes.src.replace("eyes", "eyes2")
				var returnLoop = window.setInterval(function() {
					if (!document.hidden) {
						afterReturn = true
						window.clearInterval(returnLoop)
						window.clearInterval(eyeLoop)
						eyes.style.marginLeft = 0
						eyes.style.marginTop = -yuri.offsetHeight
						heartbeat = new Audio("assets/audio/heartbeat_lower.ogg")
						heartbeat.addEventListener('timeupdate', onHeartbeat, false)
						heartbeat.play()
						bounceZoom()
					}
				}, 1000)
			}
        }
    }

    // Setup heartbeat sound so it loops with a much less noticable gap. Still not perfect.
    heartbeat.addEventListener('timeupdate', onHeartbeat, false)
    heartbeat.loop = false
    glitch.loop = false

    // Schedule an eye movement every 2 seconds
    eyeLoop = window.setInterval(function() {
        moveEyes()
    }, 2000)

    // Starts the heartbeat sound
    heartbeat.play()
    bounceZoom()

    // When the window resizes, we need to fix the eye location again
    window.addEventListener("resize", fixOffsets, false)

    // Schedules the slow zoom
    window.setTimeout(function() {
        var maxTime = 40000
		loopFrame = 0
        loop = window.setInterval(function() {
			var hidden = afterHidden && !afterReturn
			if (!hidden || loopFrame < 30000) {
				if (hidden) {
					loopFrame = 30000
				}
				stageScale = (1 + (loopFrame * 0.0001))
				stage.style.transform = "scale(" + stageScale + ")"
				stage.style.marginLeft = calcStageLeft()
				stage.style.marginTop = ((300 / maxTime) * loopFrame) + "px"
				if (loopFrame++ > maxTime) {
					window.clearInterval(loop)
				}
			}
        }, 10)
    }, 1)
	
})

function moveEyes() {
    eyes.style.marginLeft = getRandomArbitrary(0, 15) + "px"
    eyes.style.marginTop = -yuri.offsetHeight + getRandomArbitrary(-3, 5) + "px"
}

function fixOffsets() {
	stage.style.marginLeft = calcStageLeft()
    eyes.style.marginTop = -yuri.offsetHeight + "px"
}

function calcStageLeft() {
	var yuriWidth = yuri.offsetWidth * stageScale
	return ((window.innerWidth / 2) - (yuriWidth / 2)) + ((yuriWidth * 0.07) * (loopFrame / 40000))
}

function bounceZoom() {
    overlay.style.animationName = "throb"
    overlay.style.filter = "blur(2px)"
    tryGlitch()
    window.setTimeout(function() {
        overlay.style.animationName = ""
        overlay.style.filter = ""
    }, 700)
}

function tryGlitch() {
    if (!document.hidden && Math.random() >= (afterReturn ? 0.95 : 0.99)) {
        var filters = "invert(100%) brightness(200%) contrast(200%)"
        yuri.style.filter = filters
        glitch.play()
        window.setTimeout(function() {
            yuri.style.filter = ""
            glitch.pause()
            glitch.currentTime = 0
        }, 150)
    }
}

function getRandomArbitrary(min, max) {
  return Math.floor((Math.random() * max) + min)
}