export function taskQuestionnaire(jsPsych) { 
  return new Promise((resolve) => { 
    jsPsych = initJsPsych({ 
      experiment_width: 1000, 
      on_finish: function () { 
        resolve() 
      } 
    }); 

    var timeline = [];

    // Combining description with the questionnaire
    var questionnaire = {
      type: jsPsychSurveyLikert,
      preamble: `
        <div class="center">
          <div class="logo-title">
            <img src="img/logo.png" width="20%">
            <h1>Impulsivity Questionnaire</h1>
            <p>People differ in the ways they act and think in different situations. 
            This is a test to measure some of the ways in which you act and think. 
            Read each statement and choose your response. Do not spend too much time on any statement.</p>
          </div>
        </div>
        <strong>Please answer the following questions:</strong>
      `,
      questions: [
        {prompt: "I plan tasks carefully.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I do things without thinking.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I make up my mind quickly.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I am happy-go-lucky.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I don't 'pay attention.'", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I have 'racing' thoughts.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I plan trips well ahead of time.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I am self-controlled.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I concentrate easily.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I save regularly.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I 'squirm' at plays or lectures.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I am a careful thinker.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I plan for job security.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I say things without thinking.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I like to think about complex problems.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I change jobs.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I act 'on impulse.'", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I get easily bored when solving thought problems.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I act on the spur of the moment.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I am a steady thinker.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I change residences.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I buy things on impulse.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I can only think about one thing at a time.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I change hobbies.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I spend or charge more than I earn.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I often have extraneous thoughts when thinking.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I am more interested in the present than the future.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I am restless at the theater or lectures.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I like puzzles.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "I am future oriented.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true}
      ]
    };

    timeline.push(questionnaire);

    // Start the experiment
    jsPsych.run(timeline);
  });
}
