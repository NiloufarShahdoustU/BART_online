// If using modules
var timeline;
if (typeof require !== 'undefined') {
  timeline = require('./task_description.js');
}

var jsPsych = initJsPsych({
  experiment_width: 1000,
  on_finish: function() {
    window.location = "file:///Users/niloufarshahdoust/Documents/PhD/0.%20NeuroSmith/Tasks/3_BART_online/BART_online/task/demo.html";
    saveCSV(); // Save the CSV file at the end
    jsPsych.data.displayData(); // Display data at the end
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

// Create an array to store trial data
let trialData = [];

for (let i = 0; i < 10; i++) {
  let balloonColor = balloonColors[Math.floor(Math.random() * balloonColors.length)];
  let maxBalloonSize = getGaussianRandom(colorMeans[balloonColor], colorStds[balloonColor]);
  maxBalloonSize = Math.max(10, Math.round(maxBalloonSize));

  let isSpecial = false;

  // special colorful balloons are the ones with grey cicles.
  if (["yellow", "red", "orange"].includes(balloonColor) && Math.random() < 0.2) { 
    isSpecial = true;
  }

  timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus: function() {
      const fixedCircleSize = Math.round(maxBalloonSize);

      return `
        <div class="trial-container">
          <div id="black-square" class="black-square"></div>
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
      let blackSquare = document.getElementById('black-square');
      let balloonSize = 50;
      let reward = 0;
      let inflationInterval;

      const isGrayBalloon = balloonColor === "gray";
      const isSpecialBalloon = isSpecial;

      let responseTime, inflateTime;

      blackSquare.style.display = 'block';
      setTimeout(() => {
        blackSquare.style.display = 'none';
      }, 200);

      function inflateBalloon() {
        inflateButton.style.display = 'none';
        responseTime = performance.now();
        if (!isGrayBalloon && !isSpecialBalloon) {
          bankButton.style.display = 'block';
        }
      
        inflationInterval = setInterval(function() {
          if (balloonSize < maxBalloonSize) {
            balloonSize += 10;
            if (!isGrayBalloon || isSpecialBalloon) {
              reward += 1;
            }
            balloon.style.width = `${balloonSize}px`;
            balloon.style.height = `${balloonSize}px`;
            rewardElement.textContent = reward;
          } else {
            clearInterval(inflationInterval);
            inflateTime = performance.now();
            balloon.style.display = 'none';
            const fixedCircle = document.querySelector('.fixed-circle');
            if (fixedCircle) {
              fixedCircle.style.display = 'none';
            }
            if (bankButton) bankButton.style.display = 'none';

            let outcome = 'popped';

            if (isSpecialBalloon) {
              totalReward += reward;
              totalRewardElement.textContent = `total reward: $ ${totalReward}`;
              outcome = 'banked';

              let trialContainer = document.querySelector('.trial-container');
              let popMessage = document.createElement('div');
              popMessage.innerHTML = 'banked!';
              popMessage.style.fontSize = '50px';
              popMessage.style.color = 'green';
              popMessage.style.fontWeight = 'bold';
              trialContainer.appendChild(popMessage);
              setTimeout(jsPsych.finishTrial, 1000);
            } else if (!isGrayBalloon) {
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
            } else {
              setTimeout(jsPsych.finishTrial, 1000);
            }

            // Save trial data
            trialData.push({
              balloonType: balloonColor + (isSpecial ? " (special)" : ""),
              outcome: outcome,
              responseTime: responseTime,
              inflateTime: inflateTime,
              reward: totalReward
            });
          }
        }, 100);
      }

      function bankReward() {
        clearInterval(inflationInterval);
        inflateTime = performance.now();
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

        // Save trial data
        trialData.push({
          balloonType: balloonColor + (isSpecial ? "_special" : ""),
          outcome: 'banked',
          responseTime: responseTime,
          inflateTime: inflateTime,
          reward: totalReward
        });
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

// Function to save trial data to CSV
function saveCSV() {
  const header = "balloonType,outcome,responseTime,inflateTime,reward\n";
  const rows = trialData.map(trial => `${trial.balloonType},${trial.outcome},${trial.responseTime},${trial.inflateTime},${trial.reward}\n`);
  const csvContent = header + rows.join('');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', 'task_data.csv');
  a.click();
}

// Initialize the experiment
jsPsych.run(timeline);
