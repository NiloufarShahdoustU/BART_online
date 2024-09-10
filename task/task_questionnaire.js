export function taskQuestionnaire(jsPsych) { 
  return new Promise((resolve) => { 
    jsPsych = initJsPsych({ 
      experiment_width: 1000, 
      on_finish: function () { 
        window.location = "https://www.neurosmiths.org/tasks.html";
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
      `,
      questions: [
        {prompt: "1. I plan tasks carefully.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "2. I do things without thinking.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "3. I make up my mind quickly.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "4. I am happy-go-lucky.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "5. I don't 'pay attention.'", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "6. I have 'racing' thoughts.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "7. I plan trips well ahead of time.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "8. I am self-controlled.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "9. I concentrate easily.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "10. I save regularly.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "11. I 'squirm' at plays or lectures.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "12. I am a careful thinker.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "13. I plan for job security.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "14. I say things without thinking.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "15. I like to think about complex problems.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "16. I change jobs.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "17. I act 'on impulse.'", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "18. I get easily bored when solving thought problems.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "19. I act on the spur of the moment.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "20. I am a steady thinker.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "21. I change residences.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "22. I buy things on impulse.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "23. I can only think about one thing at a time.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "24. I change hobbies.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "25. I spend or charge more than I earn.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "26. I often have extraneous thoughts when thinking.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "27. I am more interested in the present than the future.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "28. I am restless at the theater or lectures.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "29. I like puzzles.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true},
        {prompt: "30. I am future oriented.", labels: ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"], required: true}
      ]
    };

    timeline.push(questionnaire);

    

    // Start the experiment
    jsPsych.run(timeline);
  });
}
