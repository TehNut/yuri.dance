// Declare  vars up here so we can use them in functions
var body
var stage
var eyes
var yuri
var overlay
var face
var stageScale = 1
var heartbeat = new Audio("assets/audio/heartbeat.ogg")
var glitch = new Audio("assets/audio/glitch.ogg")
var loopFrame
var loop
var eyeLoop
var state = 0

// Don't actually run anything until the page is loaded
document.addEventListener("DOMContentLoaded", function() {
    // Makes sure the scroll bars don't show up
    document.getElementsByTagName("html")[0].style.overflow="hidden"

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
			if (!document.hidden || state == 3 || (document.hidden && state == 0 && Math.random() < 0.98)) {
				this.currentTime = 0
				this.play()
				bounceZoom()
			} else if (state == 0) {
				state = 1
				overlay.className += " afterHidden"
				yuri.src = yuri.src.replace("yuri.", "yuri2.")
				eyes.src = eyes.src.replace("eyes.", "eyes2.")
				stage.style.paddingLeft = stage.offsetWidth + "px"
				var returnLoop = window.setInterval(function() {
					if (!document.hidden) {
						if (state == 1) {
							state = 2
							window.clearInterval(eyeLoop)
							eyes.style.marginLeft = 0
							eyes.style.marginTop = -yuri.offsetHeight + "px"
							face = document.createElement('div')
							face.style.pointerEvents = "all"
							face.style.zIndex = 4
							face.style.position = "absolute"
							face.onmouseover = function() {
								this.onmouseover = null
								state = 3
								this.remove(0)
								stage.style.transition = "padding-left 45s"
								stage.style.paddingLeft = 0
							}
							updateFaceCoords()
							document.body.prepend(face)
						} else if (state == 3) {
							window.clearInterval(returnLoop)
							eyeLoop = window.setInterval(function() {
								moveEyes()
							}, 25)
							heartbeat = new Audio("assets/audio/heartbeat_lower.ogg")
							heartbeat.addEventListener('timeupdate', onHeartbeat, false)
							heartbeat.play()
							bounceZoom()
						}
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
			var hidden = state == 1
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
    eyes.style.marginLeft = (state == 3 ? getRandomArbitrary(-2, 1) : getRandomArbitrary(0, 15)) + "px"
    eyes.style.marginTop = -yuri.offsetHeight + (state == 3 ? getRandomArbitrary(-2, 1) : getRandomArbitrary(-3, 5)) + "px"
}

function fixOffsets() {
	stage.style.marginLeft = calcStageLeft()
    eyes.style.marginTop = -yuri.offsetHeight + "px"
	if (state == 2) {
		stage.paddingLeft = stage.innerWidth
		updateFaceCoords()
	}
}

function calcStageLeft() {
	var yuriWidth = yuri.offsetWidth * stageScale
	return ((window.innerWidth / 2) - (yuriWidth / 2)) + ((yuriWidth * 0.07) * (loopFrame / 40000))
}

function updateFaceCoords() {
	var bgDimRatio = overlay.offsetHeight / overlay.offsetWidth
	if (bgDimRatio <= 0.5625) {
		face.style.left = 0.466 * overlay.offsetWidth
	} else {
		face.style.left = 0.466 * (overlay.offsetHeight / 0.5625)
	}
	if (bgDimRatio <= 0.5625) {
		face.style.top = 0.369 * (overlay.offsetWidth * 0.5625)
	} else {
		face.style.top = 0.369 * overlay.offsetHeight
	}
	face.style.width = (overlay.offsetWidth * 0.042) + "px"
	face.style.height = (overlay.offsetHeight * 0.069) + "px"
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
    if (!document.hidden && Math.random() >= (state == 3 ? 0.95 : 0.99)) {
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