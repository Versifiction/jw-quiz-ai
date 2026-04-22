  const faqQuestions = [
  {
    id: "f1",
    cat: "general",
    q: "Qu'est-ce que JWQuiz ?",
    a: "JWQuiz est une application de quiz théocratique proposant des questions bibliques. Elle permet à chacun, débutant ou connaisseur, de tester et approfondir sa connaissance des Écritures de manière ludique.",
  },
  {
    id: "f2",
    cat: "general",
    q: "L'application est-elle gratuite ?",
    a: "Oui, JWQuiz est entièrement gratuit. L'inscription et l'accès aux quiz sont sans frais. Nous ne proposons aucun achat intégré ni abonnement premium à ce jour.",
  },
  {
    id: "f3",
    cat: "general",
    q: "Les questions sont-elles fiables ?",
    a: "Chaque question est rédigée et vérifiée. Une explication sourcée accompagne chaque réponse, qu'elle soit correcte ou non, pour garantir un apprentissage rigoureux.",
  },
  {
    id: "f4",
    cat: "account",
    q: "Comment se connecter ?",
    a: "Cliquez sur l'icône Connexion tout en haut à droite de la page d'accueil. Vous pouvez vous inscrire avec votre compte Google. D'autres fournisseurs seront disponibles à l'avenir.",
  },
  {
    id: "f5",
    cat: "account",
    q: "Comment modifier mes informations personnelles ?",
    a: "Depuis votre page Profil, cliquez sur l'icône de modification à côté de votre nom ou avatar. Vous pouvez changer votre pseudo, votre photo de profil et votre adresse e-mail. Les changements sont sauvegardés instantanément dans Firebase.",
  },
  {
    id: "f6",
    cat: "account",
    q: "Comment supprimer mon compte ?",
    a: "Vous pouvez le faire depuis votre page de profil. Cette action est irréversible et supprime toutes vos données (statistiques et réalisations) de nos serveurs.",
  },
  {
    id: "f7",
    cat: "quiz",
    q: "Peut-on jouer sans connexion Internet ?",
    a: "Non, JWQuiz nécessite une connexion active pour charger les questions depuis la base de données et synchroniser vos scores. Une version hors-ligne avec un jeu de questions local est prévue dans une future version.",
  },
  {
    id: "f8",
    cat: "quiz",
    q: "Combien de temps dure un quiz ?",
    a: "Un quiz standard dispose de 15 questions. Un temps moyen de réponse de 30 secondes vous le fera finir en 7 minutes environ.",
  },
  {
    id: "f9",
    cat: "quiz",
    q: "Qu'est-ce que le mode multijoueur ?",
    a: "Le mode multijoueur permet d'affronter jusqu'à 8 joueurs en temps réel. L'hôte crée une salle et partage un code à 6 caractères. Les réponses de tous les joueurs sont synchronisées via WebSockets — les avatars des adversaires apparaissent en temps réel sur les options.",
  },
  {
    id: "f10",
    cat: "scores",
    q: "Comment débloquer des réalisations ?",
    a: "Les 12 réalisations se débloquent automatiquement selon vos actions : terminer votre premier quiz, maintenir une série de 7 jours, atteindre un score parfait, etc. Chaque réalisation débloquée est visible sur votre profil public.",
  },
  {
    id: "f11",
    cat: "tech",
    q: "L'application fonctionne-t-elle sur mobile ?",
    a: "Oui, JWQuiz est entièrement responsive mais nous recommandons d'utiliser l'application par le site Internet",
  },
  {
    id: "f12",
    cat: "tech",
    q: "Mes données sont-elles sécurisées ?",
    a: "Vos données sont stockées dans Firebase (Google Cloud) avec chiffrement au repos et en transit.Nous ne revendons aucune donnée personnelle.",
  },
  {
    id: "f13",
    cat: "tech",
    q: "Comment signaler un bug ou une erreur dans une question ?",
    a: 'Utilisez le bouton "Signaler" visible sur chaque question après la révélation de la réponse, ou contactez-nous via la page Contact. Nous corrigeons les erreurs signalées dans un délai de 48 heures.',
  },
];
export default faqQuestions;
