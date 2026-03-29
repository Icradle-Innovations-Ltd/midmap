export const gameData = {
  app: {
    title: "Mind Bloom",
    subtitle: "A gentle mind-map game for stressed minds",
    supportNote:
      "This experience offers calming exercises and reflection prompts. It is not a substitute for professional mental health care.",
    crisisNote:
      "If someone feels unsafe or at risk of self-harm, pause the game and contact local emergency services, a crisis line in your country, or a trusted person right away."
  },
  moods: [
    {
      id: "crowded",
      label: "Crowded mind",
      description: "Too many thoughts are running at once.",
      aura: "Mist Gold",
      prompt:
        "We start by creating one small pocket of space. Choose the branch that feels possible right now.",
      summary:
        "Your map leaned toward creating space and slowing the pace around you."
    },
    {
      id: "heavy",
      label: "Heavy heart",
      description: "Everything feels weighty and hard to move through.",
      aura: "Clay Rose",
      prompt:
        "We begin with something soft and doable. Pick the first kind move you can make for yourself.",
      summary:
        "Your map leaned toward compassion, steadiness, and small relief."
    },
    {
      id: "restless",
      label: "Restless body",
      description: "Your body feels activated and cannot settle easily.",
      aura: "Sea Teal",
      prompt:
        "We begin with grounding through your senses and body. Choose the branch that feels most natural.",
      summary:
        "Your map leaned toward grounding, body awareness, and rhythm."
    },
    {
      id: "disconnected",
      label: "Feeling far away",
      description: "You feel distant from yourself or the people around you.",
      aura: "Moon Linen",
      prompt:
        "We begin by rebuilding connection in small ways. Choose the branch that feels safe enough.",
      summary:
        "Your map leaned toward reconnecting with your body, values, and support."
    }
  ],
  stages: [
    {
      id: "notice",
      title: "Notice",
      prompt: "Which first branch helps you land in this moment?",
      choices: [
        {
          id: "scan",
          label: "Do a quick room scan",
          detail: "Name 3 things you can see, 2 you can hear, and 1 you can feel.",
          practice: "Look around and quietly name those details.",
          duration: 35,
          tone: "Grounding"
        },
        {
          id: "unclench",
          label: "Release your jaw and shoulders",
          detail: "Unclench, drop your shoulders, and take one slower breath out.",
          practice: "Let the exhale be longer than the inhale.",
          duration: 30,
          tone: "Body"
        },
        {
          id: "name-it",
          label: "Name the feeling softly",
          detail: "Say: 'Something in me feels stressed right now.'",
          practice: "You are noticing the feeling, not becoming it.",
          duration: 20,
          tone: "Awareness"
        }
      ]
    },
    {
      id: "steady",
      title: "Steady",
      prompt: "Pick the next branch that can lower the pressure a little more.",
      choices: [
        {
          id: "breathe-box",
          label: "Follow a 4-count breath",
          detail: "Inhale 4, hold 4, exhale 4, hold 4.",
          practice: "Repeat the square breath until the timer ends.",
          duration: 40,
          tone: "Breath"
        },
        {
          id: "plant-feet",
          label: "Press both feet into the floor",
          detail: "Notice the support holding you up.",
          practice: "Push down gently and feel the floor push back.",
          duration: 30,
          tone: "Stability"
        },
        {
          id: "drink-water",
          label: "Take one sip of water",
          detail: "Give your body one caring signal.",
          practice: "Notice the temperature and the swallow.",
          duration: 20,
          tone: "Care"
        }
      ]
    },
    {
      id: "reframe",
      title: "Reframe",
      prompt: "Choose a branch that speaks to your mind with more kindness.",
      choices: [
        {
          id: "smaller-task",
          label: "Make the problem smaller",
          detail: "Ask: what is the next 5-minute step, not the whole mountain?",
          practice: "Write a tiny next action in a few words.",
          duration: 25,
          tone: "Clarity"
        },
        {
          id: "borrow-voice",
          label: "Borrow a kinder voice",
          detail: "Imagine what a calm friend would say to you.",
          practice: "Use one kind sentence as your anchor.",
          duration: 25,
          tone: "Compassion"
        },
        {
          id: "enough-for-now",
          label: "Choose 'enough for now'",
          detail: "You do not need to solve your whole life in this moment.",
          practice: "Say: 'For now, I only need the next safe step.'",
          duration: 20,
          tone: "Permission"
        }
      ]
    },
    {
      id: "reach",
      title: "Reach",
      prompt: "Pick the final branch that leaves you with a steadier path forward.",
      choices: [
        {
          id: "message-someone",
          label: "Draft a short check-in text",
          detail: "You can send: 'I’m having a hard day. Can you check on me later?'",
          practice: "Write the message or save it for later.",
          duration: 30,
          tone: "Connection"
        },
        {
          id: "comfort-list",
          label: "Choose one comfort ritual",
          detail: "Tea, sunlight, a shower, music, a blanket, or a walk.",
          practice: "Pick one thing you can do within the next hour.",
          duration: 20,
          tone: "Restore"
        },
        {
          id: "future-note",
          label: "Leave yourself a note",
          detail: "Write one sentence for later-you to read tonight.",
          practice: "Keep it short, honest, and kind.",
          duration: 25,
          tone: "Hope"
        }
      ]
    }
  ]
};
