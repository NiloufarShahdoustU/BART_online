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
  red: 150,
  orange: 250,
  yellow: 350,
  gray: 250
};
var colorStds = {
  red: 40,
  orange: 40,
  yellow: 40,
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

  let isSpecial = false;

  // Determine if this is a special trial (trials with no grey circles around them)
  if (["yellow", "red", "orange"].includes(balloonColor) && Math.random() < 0.1) { 
    // 50% chance for special trial (adjust as needed)
    isSpecial = true;
  }

  timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus: function() {
      const fixedCircleSize = Math.round(maxBalloonSize);

      return `
        <div class="trial-container">
          <div id="black-square" class="black-square"></div> <!-- Black square element -->
          <h2 class="total-reward">total reward: $ ${totalReward}</h2>
          <div class="balloon-container">
            <div class="circle-container">
              ${(isSpecial || balloonColor === "gray") ? `<div class="fixed-circle" style="width: ${fixedCircleSize}px; height: ${fixedCircleSize}px;"></div>` : ''}
              <div id="balloon" class="balloon" style="background-color: ${balloonColor}; border-radius: 50%; width: 50px; height: 50px;">
                <div id="reward" class="reward">0</div>
              </div>
            </div>
          </div>
          <div class="button-container">
            ${(!isSpecial && balloonColor !== "gray") ? '<button id="bank" class="bank-button" style="display: none;">bank(space)</button>' : ''}
            <button id="inflate" class="inflate-button">inflate(space)</button>
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
      let blackSquare = document.getElementById('black-square'); // Black square element
      let balloonSize = 50;
      let reward = 0;
      let inflationInterval;

      // Move isSpecial and balloonColor inside on_load so they can be accessed within inflateBalloon
      const isGrayBalloon = balloonColor === "gray";
      const isSpecialBalloon = isSpecial;

      // Display black square and hide it after 200ms
      blackSquare.style.display = 'block';
      setTimeout(() => {
        blackSquare.style.display = 'none';
      }, 200);

      function inflateBalloon() {
        inflateButton.style.display = 'none';
        if (!isGrayBalloon && !isSpecialBalloon) {
          bankButton.style.display = 'block';
        }
      
        inflationInterval = setInterval(function() {
          if (balloonSize < maxBalloonSize) {
            balloonSize += 10;
            if (!isGrayBalloon || isSpecialBalloon) {  // Reward only if not a gray balloon or is a special trial
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
      
            if (isSpecialBalloon) {
              // Add the reward to the total if it's a non-gray balloon
              totalReward += reward;
              totalRewardElement.textContent = `total reward: $ ${totalReward}`;

              let trialContainer = document.querySelector('.trial-container');
              let popMessage = document.createElement('div');
              popMessage.innerHTML = 'banked!';
              popMessage.style.fontSize = '50px';
              popMessage.style.color = 'green';
              popMessage.style.fontWeight = 'bold';
              trialContainer.appendChild(popMessage);
              setTimeout(jsPsych.finishTrial, 1000);
            } 
            else if(!isGrayBalloon){
              totalReward += 0;
              totalRewardElement.textContent = `total reward: $ ${totalReward}`;

              let trialContainer = document.querySelector('.trial-container');
              let popMessage = document.createElement('div');
              popMessage.innerHTML = 'popped!';
              popMessage.style.fontSize = '50px';
              popMessage.style.color = 'red';
              popMessage.style.fontWeight = 'bold';
              trialContainer.appendChild(popMessage);
              setTimeout(jsPsych.finishTrial, 1000);
            }
            else {
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
