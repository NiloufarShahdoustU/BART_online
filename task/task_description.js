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
      prompt: "This study works properly only on PCs and laptops, and not on smartphones or tablets. Before you proceed, please confirm that you take part via Desktop PC or Laptop.",
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
      setTimeout(() => {
        window.location.reload(); // Reloads the page after showing the message
      }, 3000); // Waits for 3 seconds before reloading
    }
  }
};


timeline.push(confs);




var consent_form = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      prompt: "Do you agree?",
      name: 'DesktopConf',
      options: ['1: I agree.'],
      required: true
    }
  ],
  preamble: `
<p><img src="img/logo.png" width="20%"></p>
  <p><b>Consent form.</b></p>
`
};

timeline.push(consent_form);


var demographic_form = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      prompt: "Is demographic form done?",
      name: 'DesktopConf',
      options: ['1: I agree.'],
      required: true
    }
  ],
  preamble: `
<p><img src="img/logo.png" width="20%"></p>
  <p><b>Consent form.</b></p>
`
};

timeline.push(demographic_form);



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

// Export timeline if using modules
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = timeline;
}
