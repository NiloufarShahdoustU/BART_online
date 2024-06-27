var jsPsych = initJsPsych({
  experiment_width: 1000,
  on_finish: function() {
    window.location = "http://localhost:8080/task/demo.html";
  },
  override_safe_mode: true
});

var timeline = [];

var title_screen = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <div class="center">
      <div class="logo-title">
        <img src="img/logo.png" width="20%">
        <h1>Balloon Analog Risk Task (BART)</h1>
      </div>
    </div>
  `,
  choices: ['Start']
};
timeline.push(title_screen);

var confs = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      prompt: "This study works properly only on Desktop PCs and Laptops, and not on Smartphones or Tablets. Before you proceed, please confirm that you take part via Desktop PC or Laptop.",
      name: 'DesktopConf',
      options: ['1: I confirm', '2: I do not confirm'],
      required: true
    }
  ],
  preamble: `
    <p><img src="img/logo.png" width="20%"></p>
    <p><b>Welcome to this experiment and thank you very much for your participation.</b></p>
  `,
  on_finish: function(data) {
    var responses = data.response;
    if (responses.DesktopConf === '2: I do not confirm') {
      jsPsych.endExperiment('The experiment has been terminated because you are not using a Desktop PC or Laptop.');
    }
  }
};

timeline.push(confs);

var task_description = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <div class="center">
      <h2>Task description</h2>
      <img src="img/task.png" width="50%">
      <p>The task begins with the initial screen showing a small balloon (yellow/orange/red/grey).</p>
      <p><b>Inflate Start:</b> The balloon starts to inflate once you press inflate button.</p>
      <p><b>Inflation Phase:</b> During the inflation phase, the balloon grows larger, and you decide when to stop inflating it.</p>
      <p><b>Trial End:</b> The trial ends when you either stop inflating the balloon or the balloon pops.</p>
      <p><b>Outcome:</b></p>
      <ul><li>If you stop inflating the balloon before it pops, you <b>bank</b> the money accumulated and the trial ends successfully.</li>
        <li>If the balloon size exceeds a certain maximum threshold, the balloon <b>pops</b>, and you lose the money for that trial.</li>
      </ul>
      <p><b>Note:</b></p>
      <p>A grey balloon is a passive trial, you can just watch it.</p>
    </div>
  `,
  choices: ['Next']
};
timeline.push(task_description);

var balloonColors = ["red", "orange", "yellow"];
var colorMeans = {
  red: 200,
  orange: 300,
  yellow: 400
};
var colorStds = {
  red: 50,
  orange: 50,
  yellow: 50
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
          <h2 class="trial-number">Trial ${i + 1}</h2>
          <h2 class="total-reward">total reward: $ ${totalReward}</h2>
          <div class="balloon-container">
            <div id="balloon" class="balloon" style="background-image: url('img/${balloonColor}.png');">
              <div id="reward" class="reward">0</div>
            </div>
          </div>
          <div class="button-container">
            <button id="inflate" class="inflate-button">inflate</button>
            <button id="bank" class="bank-button">bank</button>
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

      inflateButton.addEventListener('click', function() {
        inflateButton.classList.add('active');
        setTimeout(() => {
          inflateButton.classList.remove('active');
        }, 100); // Remove class after 100ms for visual effect

        if (balloonSize < maxBalloonSize) {
          balloonSize += 20;
          reward += 1; // Increment the reward by 1 with each inflate
          balloon.style.width = `${balloonSize}px`;
          balloon.style.height = `${balloonSize}px`;
          rewardElement.textContent = reward; // Update the reward display
        } else {
          balloon.style.display = 'none';
          inflateButton.style.display = 'none';
          bankButton.style.display = 'none';
          let trialContainer = document.querySelector('.trial-container');
          let popMessage = document.createElement('div');
          popMessage.innerHTML = 'popped!';
          popMessage.style.fontSize = '50px';
          popMessage.style.color = 'red';
          popMessage.style.fontWeight = 'bold';
          trialContainer.appendChild(popMessage);
          setTimeout(jsPsych.finishTrial, 1000);
        }
      });

      bankButton.addEventListener('click', function() {
        totalReward += reward; // Add the current reward to the total reward
        totalRewardElement.textContent = `total reward:  ${totalReward}`; // Update the total reward display
        reward = 0; // Reset the current reward
        rewardElement.textContent = reward; // Update the reward display
        balloon.style.display = 'none'; // Hide the balloon
        inflateButton.style.display = 'none'; // Hide the inflate button
        bankButton.style.display = 'none'; // Hide the bank button
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
  });
}

jsPsych.run(timeline);
