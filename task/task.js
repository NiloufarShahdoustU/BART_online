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

var balloonColors = ["red", "orange", "yellow", "gray"]; // Include "gray" balloon
var colorMeans = {
  red: 200,
  orange: 300,
  yellow: 400,
  gray: 250 // Mean size for gray balloon
};
var colorStds = {
  red: 100,
  orange: 100,
  yellow: 100,
  gray: 50 // Standard deviation for gray balloon
};

function getGaussianRandom(mean, stdDev) {
  let u = Math.random(), v = Math.random();
  return mean + stdDev * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

var totalReward = 0; // Total collected reward

for (let i = 0; i < 10; i++) {
  let balloonColor = balloonColors[Math.floor(Math.random() * balloonColors.length)];
  let maxBalloonSize = getGaussianRandom(colorMeans[balloonColor], colorStds[balloonColor]);
  maxBalloonSize = Math.max(10, Math.round(maxBalloonSize));

  timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus: function() {
      return `
        <div class="trial-container">
          <h2 class="total-reward">total reward: $ ${totalReward}</h2>
          <div class="balloon-container">
            <div id="balloon" class="balloon" style="background-color: ${balloonColor}; border-radius: 50%; width: 50px; height: 50px;">
              <div id="reward" class="reward">0</div>
            </div>
          </div>
          <div class="button-container">
            <button id="inflate" class="inflate-button">inflate</button>
            ${balloonColor !== "gray" ? '<button id="bank" class="bank-button" style="display: none;">bank</button>' : ''}
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

      inflateButton.addEventListener('click', function() {
        inflateButton.style.display = balloonColor === "gray" ? 'none' : 'none'; // Hide inflate after pressing for gray balloon
        if (balloonColor !== "gray") {
          bankButton.style.display = 'block'; // Show bank button for non-gray balloons
        }

        inflationInterval = setInterval(function() {
          if (balloonSize < maxBalloonSize) {
            balloonSize += 20;
            if (balloonColor !== "gray") {
              reward += 1; // Increment reward for non-gray balloons
            }
            balloon.style.width = `${balloonSize}px`;
            balloon.style.height = `${balloonSize}px`;
            balloon.style.borderRadius = '50%';
            rewardElement.textContent = reward;
          } else {
            clearInterval(inflationInterval);
            balloon.style.display = 'none';
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
              setTimeout(jsPsych.finishTrial, 1000); // End trial for gray balloon with no message
            }
          }
        }, 100);
      });

      if (bankButton) {
        bankButton.addEventListener('click', function() {
          clearInterval(inflationInterval);
          totalReward += reward;
          totalRewardElement.textContent = `total reward: $ ${totalReward}`;
          reward = 0;
          rewardElement.textContent = reward;
          balloon.style.display = 'none';
          inflateButton.style.display = 'none';
          bankButton.style.display = 'none';
          let trialContainer = document.querySelector('.trial-container');
          let bankMessage = document.createElement('div');
          bankMessage.innerHTML = 'banked!';
          bankMessage.style.fontSize = '50px';
          bankMessage.style.color = 'green';
          bankMessage.style.fontWeight = 'bold';
          trialContainer.appendChild(bankMessage);
          setTimeout(jsPsych.finishTrial, 1000);
        });
      }
    }
  });
}

jsPsych.run(timeline);
