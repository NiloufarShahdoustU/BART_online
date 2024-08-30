// If using modules
var timeline;
if (typeof require !== 'undefined') {
  timeline = require('./task_description.js');
}

var jsPsych = initJsPsych({
  experiment_width: 1000,
  on_finish: function() {
    window.location = "file:///Users/niloufarshahdoust/Documents/PhD/0.%20NeuroSmith/Tasks/3_BART_online/BART_online/task/demo.html";
  },
  override_safe_mode: true
});

var balloonColors = ["red", "orange", "yellow", "gray"];
var colorMeans = {
  red: 200,
  orange: 300,
  yellow: 400,
  gray: 300
};
var colorStds = {
  red: 100,
  orange: 100,
  yellow: 100,
  gray: 0
};

function getGaussianRandom(mean, stdDev) {
  let u = Math.random(), v = Math.random();
  return mean + stdDev * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

var totalReward = 0;

for (let i = 0; i < 10; i++) {
  let balloonColor = balloonColors[Math.floor(Math.random() * balloonColors.length)];
  let maxBalloonSize = getGaussianRandom(colorMeans[balloonColor], colorStds[balloonColor]);
  maxBalloonSize = Math.max(10, Math.round(maxBalloonSize));

  timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus: function() {
      const isGrayBalloon = balloonColor === "gray";
      const maxBalloonSize = getGaussianRandom(colorMeans[balloonColor], colorStds[balloonColor]);
      const fixedCircleSize = Math.round(maxBalloonSize);
  
      return `
        <div class="trial-container">
          <h2 class="total-reward">total reward: $ ${totalReward}</h2>
          <div class="balloon-container">
            <div class="circle-container">
              ${isGrayBalloon ? `<div class="fixed-circle" style="width: ${fixedCircleSize}px; height: ${fixedCircleSize}px;"></div>` : ''}
              <div id="balloon" class="balloon" style="background-color: ${balloonColor}; border-radius: 50%; width: 50px; height: 50px;">
                <div id="reward" class="reward">0</div>
              </div>
            </div>
          </div>
          <div class="button-container">
            <button id="inflate" class="inflate-button">inflate(space)</button>
            ${balloonColor !== "gray" ? '<button id="bank" class="bank-button" style="display: none;">bank(space)</button>' : ''}
          </div>
        </div>
      `;
    },
    choices: [],
    on_load: function() {
      let balloon = document.getElementById('balloon');
      let rewardElement = document.getElementById('reward');
      let inflateButton = document.getElementById('inflate');
      let bankButton = document.getElementById('bank');
      let totalRewardElement = document.querySelector('.total-reward');
      let balloonSize = 50;
      let reward = 0;
      let inflationInterval;

      function inflateBalloon() {
        inflateButton.style.display = balloonColor === "gray" ? 'none' : 'none';
        if (balloonColor !== "gray") {
          bankButton.style.display = 'block';
        }
      
        inflationInterval = setInterval(function() {
          if (balloonSize < maxBalloonSize) {
            balloonSize += 10;
            if (balloonColor !== "gray") {
              reward += 1;
            }
            balloon.style.width = `${balloonSize}px`;
            balloon.style.height = `${balloonSize}px`;
            rewardElement.textContent = reward;
          } else {
            clearInterval(inflationInterval);
            
            // Hide balloon and circle when the max size is reached
            balloon.style.display = 'none';
            const fixedCircle = document.querySelector('.fixed-circle');
            if (fixedCircle) {
              fixedCircle.style.display = 'none';
            }
            
            if (bankButton) bankButton.style.display = 'none';
      
            if (balloonColor !== "gray") {
              let trialContainer = document.querySelector('.trial-container');
              let popMessage = document.createElement('div');
              popMessage.innerHTML = 'popped!';
              popMessage.style.fontSize = '50px';
              popMessage.style.color = 'red';
              popMessage.style.fontWeight = 'bold';
              trialContainer.appendChild(popMessage);
              setTimeout(jsPsych.finishTrial, 1000);
            } else {
              setTimeout(jsPsych.finishTrial, 1000);
            }
          }
        }, 100);
      }
      

      function bankReward() {
        clearInterval(inflationInterval);
        totalReward += reward;
        totalRewardElement.textContent = `total reward: $ ${totalReward}`;
        reward = 0;
        rewardElement.textContent = reward;
        balloon.style.display = 'none';
        inflateButton.style.display = 'none';
        if (bankButton) bankButton.style.display = 'none';
        let trialContainer = document.querySelector('.trial-container');
        let bankMessage = document.createElement('div');
        bankMessage.innerHTML = 'banked!';
        bankMessage.style.fontSize = '50px';
        bankMessage.style.color = 'green';
        bankMessage.style.fontWeight = 'bold';
        trialContainer.appendChild(bankMessage);
        setTimeout(jsPsych.finishTrial, 1000);
      }

      inflateButton.addEventListener('click', inflateBalloon);
      if (bankButton) {
        bankButton.addEventListener('click', bankReward);
      }

      document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
          if (inflateButton.style.display !== 'none') {
            inflateBalloon();
          } else if (bankButton && bankButton.style.display !== 'none') {
            bankReward();
          }
        }
      });
    }
  });
}

jsPsych.run(timeline);
