// If using modules


//in the code bellow:
// balloonTime: when balloon appears on the screen
// inflateTime: when inflate button is pressed
// outcomeTime: when bank is pressed or is popped
//reactionTime = inflateTime - balloonTime    these are behavioral measures 
// inflationTime = outcomeTime - inflateTime  these are behavioral measures 


export function runTask(jsPsych) {
  // Initialize jsPsych here if it's not initialized elsewhere
  return new Promise((resolve) => {
    jsPsych = initJsPsych({ 
      experiment_width: 1000, 
      on_finish: function () { 
        resolve() 
      } 
    });

var totalReward = 0;
let trialData = [];
let TrialNum = 250;
let StimProbability = 0.25; // this is the probability of the learning trials and control trials


var timeline = [];

// var jsPsych = initJsPsych({
//   experiment_width: 1000,
//   on_finish: function() {
//     // window.location = "https://www.neurosmiths.org/bart/demo.html";
//     jsPsych.data.displayData(); // Display data at the end
//   },
//   override_safe_mode: true
// });

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


for (let i = 0; i < TrialNum; i++) {
  let balloonColor;

  // Determine if the gray balloon should appear based on StimProbability
  if (Math.random() < StimProbability) {
    balloonColor = "gray";
  } else {
    // Randomly pick a non-gray balloon color from the remaining colors
    let otherBalloonColors = ["red", "orange", "yellow"];
    balloonColor = otherBalloonColors[Math.floor(Math.random() * otherBalloonColors.length)];
  }

  let maxBalloonSize = getGaussianRandom(colorMeans[balloonColor], colorStds[balloonColor]);
  maxBalloonSize = Math.max(10, Math.round(maxBalloonSize));

  let isSpecial = false;

  // Special colorful balloons are the ones with gray circles.
  if (["yellow", "red", "orange" ].includes(balloonColor) && Math.random() < StimProbability) {
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

      // Time variables
      let balloonTime, inflateTime, outcomeTime, reactionTime, inflationTime;
      // balloonTime: when balloon appears on the screen
      // inflateTime: when inflate button is pressed
      // outcomeTime: when bank is pressed or the balloon pops
      // reactionTime = inflateTime - balloonTime    (behavioral measure)
      // inflationTime = outcomeTime - inflateTime   (behavioral measure)

      balloonTime = performance.now(); // Record the time when the balloon appears

      blackSquare.style.display = 'block';
      setTimeout(() => {
        blackSquare.style.display = 'none';
      }, 200);

      function inflateBalloon() {
        inflateButton.style.display = 'none';
        inflateTime = performance.now(); // Record the time when the inflate button is pressed

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
            balloon.style.display = 'none';
            const fixedCircle = document.querySelector('.fixed-circle');
            if (fixedCircle) {
              fixedCircle.style.display = 'none';
            }
            if (bankButton) bankButton.style.display = 'none';

            outcomeTime = performance.now();

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

            // Calculate reactionTime and inflationTime
            reactionTime = inflateTime - balloonTime;
            inflationTime = outcomeTime - inflateTime;

            // Save trial data
            trialData.push({
              balloonType: balloonColor + (isSpecial ? " (special)" : ""),
              outcome: outcome,
              reactionTime: reactionTime,
              inflationTime: inflationTime,
              reward: totalReward
            });
          }
        }, 100);
      }

      function bankReward() {
        clearInterval(inflationInterval);
        outcomeTime = performance.now(); // Record the time when bank button is pressed

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

        // Calculate reactionTime and inflationTime
        reactionTime = inflateTime - balloonTime;
        inflationTime = outcomeTime - inflateTime;

        // Save trial data
        trialData.push({
          balloonType: balloonColor + (isSpecial ? " (special)" : ""),
          outcome: 'banked',
          reactionTime: reactionTime,
          inflationTime: inflationTime,
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

  timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '',
    choices: 'NO_KEYS', // No keypress allowed during ITI
    trial_duration: 750, // Set ITI duration to 750 ms
  });

}



// Function to save trial data to CSV
function saveCSV() {
  // Get current date and time for file naming
  var date = new Date();
  var year = date.getFullYear();
  var month = ("0" + (date.getMonth() + 1)).slice(-2); // Add leading zero
  var day = ("0" + date.getDate()).slice(-2); // Add leading zero
  var hours = ("0" + date.getHours()).slice(-2); // Add leading zero
  var minutes = ("0" + date.getMinutes()).slice(-2); // Add leading zero
  var seconds = ("0" + date.getSeconds()).slice(-2); // Add leading zero

  var dateTime = `${day}_${month}_${year}_${hours}_${minutes}_${seconds}`;
  
  const header = "balloonType,outcome,reactionTime (ms),inflationTime (ms),reward\n";
  const rows = trialData.map(trial => `${trial.balloonType},${trial.outcome},${trial.reactionTime},${trial.inflationTime},${trial.reward}\n`);
  const csvContent = header + rows.join('');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  // Use dateTime in the filename
  const fileName = `task_data_${dateTime}.csv`;
  a.setAttribute('href', url);
  a.setAttribute('download', fileName);
  a.click();
}


timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div style="font-size: 24px; text-align: center;">
      <h3>Press 'C' to continue to the questionnaire part.</h3>
    </div>`,
  choices: ['c'],
  on_finish: function() {
    // Save the data and end the experiment when 'C' is pressed
    saveCSV();
  }
});


// Initialize the experiment
jsPsych.run(timeline);
})

}