export const versions = [
  {
    version: "2.4.0",
    date: "17 avril 2026",
    title: "Mode multijoueur",
    current: true,
    summary: "Affrontez vos amis en temps réel avec les salles WebSocket.",
    changes: [
      { type: "new", text: "Mode multijoueur jusqu'à 8 joueurs via Socket.io" },
      {
        type: "new",
        text: "Salles de jeu avec code à 6 caractères partageables",
      },
    ],
  },
  {
    version: "2.1.0",
    date: "5 décembre 2025",
    title: "Paramètres de quiz avancés",
    current: false,
    summary: "Page de configuration avec 10 options personnalisables.",
    changes: [
      {
        type: "fixed",
        text: "Sélection multi-catégories avec chips interactives",
      },
      {
        type: "new",
        text: "Stepper + slider pour nombre de questions (5–50) et durée (10–120s)",
      },
      {
        type: "improved",
        text: "Spotlight border cards réactives au curseur sur toute la page",
      },
      {
        type: "removed",
        text: "Responsive mobile-first : résumé affiché avant les formulaires",
      },
    ],
  },
  {
    version: "1.0.0",
    date: "14 janvier 2025",
    title: "Lancement initial",
    current: false,
    summary:
      "Première version publique de Scriptura avec 5 catégories et 150 questions.",
    changes: [
      { type: "new", text: "Quiz solo avec 5 catégories bibliques" },
      { type: "new", text: "Timer de 30 secondes par question" },
      { type: "new", text: "Explication après chaque réponse" },
      { type: "new", text: "3 niveaux de difficulté : Initié, Érudit, Lettré" },
      {
        type: "new",
        text: "150 questions initiales vérifiées par des théologiens",
      },
    ],
  },
];