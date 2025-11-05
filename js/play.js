    var pid_missile, pid_ufo;
    var score = 0;
    var themissile, theufo;

    var isMissileInFlight = false; 
    var ufo_hstep = 5; 

    window.onload = function () {
        themissile = document.getElementById('missile');
        theufo = document.getElementById('ufo');
        document.onkeydown = keyboardController;
        UFOlaunch(); 
    };


    function UFOlaunch() {
        pid_ufo = setInterval(MoveUFO, 25);
    }

    function MoveUFO() {
        var Rlimit = window.innerWidth;
        var hpos_ufo = parseInt(theufo.style.left);
        var width_ufo = parseInt(theufo.style.width);

        if (hpos_ufo + width_ufo + ufo_hstep > Rlimit || hpos_ufo + ufo_hstep < 0) {
            ufo_hstep *= -1; 
        }
        hpos_ufo += ufo_hstep;
        theufo.style.left = hpos_ufo + 'px';
    }

    function keyboardController(theEvent) {
        let code = theEvent.key;
        switch (code) {
            case 'ArrowRight':
                moveMissileRight();
                break;
            case 'ArrowLeft':
                moveMissileLeft();
                break;
            case ' ': 
                pullTrigger();
                break;
        }
    }

    function moveMissileRight() {
        if (isMissileInFlight) return;

        var rLimit = window.innerWidth;
        var hpos_m = parseInt(themissile.style.left);
        var misWidth = parseInt(themissile.style.width);
        var hstep = 15; 
        if (hpos_m + misWidth < rLimit) {
            hpos_m += hstep;
            themissile.style.left = hpos_m + 'px';
        }
    }

    function moveMissileLeft() {
        if (isMissileInFlight) return;

        var hstep = 15; 
        var hpos_m = parseInt(themissile.style.left);
        if (hpos_m > 0) {
            hpos_m -= hstep;
            themissile.style.left = hpos_m + 'px';
        }
    }

    function pullTrigger() {
        if (!isMissileInFlight) { 
            isMissileInFlight = true;
            pid_missile = setInterval(launch, 20); 
        }
    }
    
    function checkforaHit() {
        const rectUFO = theufo.getBoundingClientRect();
        const rectMissile = themissile.getBoundingClientRect();

        return !(
            rectUFO.right < rectMissile.left ||
            rectUFO.left > rectMissile.right ||
            rectUFO.bottom < rectMissile.top ||
            rectUFO.top > rectMissile.bottom
        );
    }

    function launch() {
        var uLimit = window.innerHeight;
        var vpos_m = parseInt(themissile.style.bottom);
        var misHeight = parseInt(themissile.style.height);
        var vstep = 10; 

        if (checkforaHit()) {
            clearInterval(pid_missile); 
            score += 100;
            document.getElementById('points').innerHTML = score;

            themissile.style.bottom = '10px'; 
            isMissileInFlight = false;

            theufo.src = 'imgs/explosion.gif';
            setTimeout(function(){
                eliminateUfo(), newUfo();
            }, 1000);

        } else if (vpos_m > uLimit) { 
            clearInterval(pid_missile);
            score -= 25;
            document.getElementById('points').innerHTML = score;

            themissile.style.bottom = '10px'; 
            isMissileInFlight = false;
        } else {
            vpos_m += vstep;
            themissile.style.bottom = vpos_m + 'px';
        }
    }

    function eliminateUfo(){
        clearInterval(pid_ufo);
        document.getElementById('container').removeChild(theufo);   
    }

    function newUfo(){
        let newUfo = document.createElement('img');
        let newleft = parseInt(Math.random()* window.innerWidth);
        let newbottom = parseInt(Math.random()* window.innerHeight);
        newUfo.setAttribute('src', 'imgs/ufo.png');
        newUfo.setAttribute('id', 'ufo');
        newUfo.setAttribute('style', 'left:' + newleft + 'px; bottom:' + newbottom + 'px; height: 60px; width: 60px;' );
        document.getElementById('container').appendChild(newUfo);
        theufo = document.getElementById('ufo');
        UFOlaunch();
    

    }