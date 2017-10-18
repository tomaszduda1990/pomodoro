const workTime = document.getElementById('work');
const breakTime = document.getElementById('break');
const buttonsTime = document.querySelectorAll('.button__time');
const displayTime = document.querySelector('.timer > p');
const timeline = document.querySelector('.timeline');
const tomatoButton = document.querySelector('.tomato__button');
const pointer = document.querySelector('.pointer');
let countdown;
let timelineInitialPosition = timeline.offsetLeft;
let isPaused = false;
let activity;

function changeTime(){
	let input = this.parentNode.querySelector('input');
	let time = parseInt(input.value);
	if(this.textContent == "+" && time < 60){
		time ++;
	}else if(this.textContent == "-" && time > 1){
		time --;
	}
	input.value = time;
}
function moveTimeline(seconds){
	let move = timelineInitialPosition;
	const unit = timeline.offsetWidth-(seconds*(timeline.offsetWidth/3600));
	move -= unit;
	timeline.style.left = move + "px";
}
function timer(seconds, sessionName){
	activity = sessionName;
	let audio = new Audio('sounds/bell.mp3');
	seconds = seconds * 60;
	clearInterval(countdown);
	const now = Date.now();
	displayTimeLeft(seconds, sessionName);
	moveTimeline(seconds);
	const then = now + seconds*1000;
	countdown = setInterval(()=>{
		const secsLeft = Math.round((then-Date.now())/1000);
		displayTimeLeft(secsLeft, sessionName);
		moveTimeline(secsLeft);
		if(secsLeft<=0){
			audio.play();
			clearInterval(countdown);
			sessionName == 'work' ? timer(breakTime.value, breakTime.id) : timer(workTime.value, workTime.id);
			return;
		}
		
	}, 1000);
}
function displayTimeLeft(seconds, item){
	const minutes = Math.floor(seconds/60);
	const remainderSecs = Math.round(seconds%60);
	const display = `${minutes < 10 ? "0" + minutes : minutes}:${remainderSecs < 10 ? "0" + remainderSecs : remainderSecs}`;
	displayTime.textContent = display;
	document.title = `Time of ${item}: ` + display;
}
function startSession(){
	timeline.classList.add('timeline-active');
	pointer.classList.add('pointer-active');
	displayTime.parentNode.classList.add('timer-active');
	tomatoButton.classList.remove('tomato__button-active');
	timer(workTime.value, workTime.id);
}
function getMins(item){
	let arr = item.textContent.split(':');	
	arr[0] = parseFloat(arr[0]);
	arr[1] = parseFloat(arr[1]);
	let convSecs = arr[1]/60;
	convSecs = Math.round(1000*convSecs)/1000
	arr[1] = convSecs;
	return arr.reduce((a,b) => a+b);
}
function pause(){
	if(!isPaused){
		clearInterval(countdown);
		isPaused = true;
	}else{
		let mins = getMins(displayTime);
		timer(mins, activity);
		isPaused = false;
	}
}
function reset(){
	clearInterval(countdown);
	isPaused = false;
	timeline.classList.remove('timeline-active');
	pointer.classList.remove('pointer-active');
	displayTime.parentNode.classList.remove('timer-active');
	tomatoButton.classList.add('tomato__button-active');
}

tomatoButton.addEventListener('click', startSession);
buttonsTime.forEach(button => button.addEventListener("click", changeTime));
