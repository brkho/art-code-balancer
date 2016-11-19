// The implementation of a small time balancer application for personal usage.
// Brian Ho (brianh@brkho.com)

let totalArtSeconds = 0;
let totalCodingSeconds = 0;
let currentTimer = null;
let startTime = null;
let currentTime = null;
let intervalId = null;
let artTimeElem = null;
let codingTimeElem = null;
let currentDeficitElem = null;
let currentlyTrackingElem = null;

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return parseInt(c.substring(name.length,c.length));
        }
    }
    return 0;
}

function main() {
  $('#start-art').click(() => startArtTimer());
  $('#stop-timer').click(() => stopTimer());
  $('#start-coding').click(() => startCodingTimer());
  artTimeElem = $('#art-time');
  codingTimeElem = $('#coding-time');
  currentDeficitElem = $('#current-deficit');
  currentlyTrackingElem = $('#currently-tracking');
  totalArtSeconds = getCookie('totalArtSeconds');
  totalCodingSeconds = getCookie('totalCodingSeconds');
  updatePage();
}

function updatePage() {
  currentlyTrackingElem.text(currentTimer !== null ? currentTimer : 'none');

  const elapsedTime = getElapsedTime();
  let adjustedArtSeconds = parseInt(totalArtSeconds);
  let adjustedCodingSeconds = parseInt(totalCodingSeconds);
  if (currentTimer == 'art') {
    adjustedArtSeconds += elapsedTime;
  } else if (currentTimer == 'coding') {
    adjustedCodingSeconds += elapsedTime;
  }

  artTimeElem.text(formatSecondsToTime(adjustedArtSeconds));
  codingTimeElem.text(formatSecondsToTime(adjustedCodingSeconds))

  const deficit = adjustedArtSeconds - adjustedCodingSeconds;
  if (deficit == 0) {
    currentDeficitElem.text(formatSecondsToTime(0));
    $('#deficit-art').text('\xa0');
    $('#deficit-code').text('\xa0');
    $('#deficit-none').text('\u25CF');
  } else if (deficit < 0) {
    currentDeficitElem.text(formatSecondsToTime(-deficit));
    $('#deficit-art').text('\xa0');
    $('#deficit-none').text('\xa0');
    $('#deficit-code').text('\u25CF');
  } else {
    currentDeficitElem.text(formatSecondsToTime(deficit));
    $('#deficit-none').text('\xa0');
    $('#deficit-code').text('\xa0');
    $('#deficit-art').text('\u25CF');
  }
}

function formatSecondsToTime(seconds_to_convert) {
  const days = parseInt(seconds_to_convert / 86400);
  const hours = parseInt(seconds_to_convert / 3600) % 24;
  const minutes = parseInt(seconds_to_convert / 60) % 60;
  const seconds = seconds_to_convert % 60;
  const daysString = days == 0 ? '' : (days < 10 ? "0" + days : days) + ":";
  return daysString +
      (hours < 10 ? "0" + hours : hours) + ":" +
      (minutes < 10 ? "0" + minutes : minutes) + ":" +
      (seconds  < 10 ? "0" + seconds : seconds);
}

function onLeave() {
  stopTimer();
}

function getElapsedTime() {
  if (startTime === null) {
    return 0;
  }
  currentTime = Date.now();
  return Math.round((currentTime - startTime) / 1000);
}

function handleTimer() {
  updatePage();
}

function startTimer() {
  intervalId = window.setInterval(handleTimer, 1000);
  startTime = Date.now();
  updatePage();
}

function startArtTimer() {
  if (currentTimer !== 'art') {
    stopTimer();
    currentTimer = 'art';
    startTimer();
  }
  $('#start-art').prop("disabled", true);
  $('#start-coding').prop("disabled", false);
}

function startCodingTimer() {
  if (currentTimer !== 'coding') {
    stopTimer();
    currentTimer = 'coding';
    startTimer();
  }
  $('#start-art').prop("disabled", false);
  $('#start-coding').prop("disabled", true);
}

function stopTimer() {
  $('#start-art').prop("disabled", false);
  $('#start-coding').prop("disabled", false);
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
    const elapsedTime = getElapsedTime();
    if (currentTimer == 'art') {
      totalArtSeconds = parseInt(totalArtSeconds) + parseInt(elapsedTime);
    } else if (currentTimer == 'coding') {
      totalCodingSeconds = parseInt(totalCodingSeconds) + parseInt(elapsedTime);
    }
    currentTimer = null;
    document.cookie = `totalArtSeconds=${totalArtSeconds}`;
    document.cookie = `totalCodingSeconds=${totalCodingSeconds}`;
  }
  updatePage();
}

$(document).ready(main);
$(window).bind('beforeunload', onLeave);
