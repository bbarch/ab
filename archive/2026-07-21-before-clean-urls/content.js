/* Offline fallback for opening the site directly from your computer.
   The live site reads the editable content.json file instead. */
let content = {
  articles: [
    { slug: 'coming-ai-architect', featured: true, type: 'Essay', date: '18.06.24', time: '12 min read', title: 'The coming AI architect', excerpt: 'Artificial intelligence will not replace the architect. But it may finally ask us to become the kind of thinkers we have always claimed to be.', category: 'AI', image: '', body: 'Artificial intelligence will not replace the architect. But it may finally ask us to become the kind of thinkers we have always claimed to be.\n\nThe work of architecture has always been more than producing drawings. It is the patient work of making sense of competing constraints, human needs and an uncertain future.' },
    { slug: 'indian-cities-software', featured: false, type: 'Essay', date: '03.06.24', time: '8 min read', title: 'What Indian cities can learn from software', excerpt: 'The most resilient places are not perfectly planned. They are built to adapt.', category: 'Urbanism', image: '', body: 'The most resilient places are not perfectly planned. They are built to adapt.\n\nCities are not finished products. They are long-running systems, shaped by people who use and alter them every day.' },
    { slug: 'decorative-landscapes', featured: false, type: 'Note', date: '21.05.24', time: '3 min read', title: 'A case against decorative landscapes', excerpt: 'A landscape should do more than make a building look complete.', category: 'Landscape', image: '', body: 'A landscape should do more than make a building look complete. It should cool, collect, shelter, restore and make room for life.' },
    { slug: 'architecture-information', featured: false, type: 'Essay', date: '09.05.24', time: '10 min read', title: 'Architecture is information', excerpt: 'Every drawing is a compact agreement about how the world will be made.', category: 'Technology', image: '', body: 'Every drawing is a compact agreement about how the world will be made. The lines are not only representation; they are instructions, assumptions and promises.' }
  ],
  notes: [
    { date: '24.06.24', title: 'On walking a site before drawing it', body: 'The first sketch should happen after your shoes are dusty, not before.' },
    { date: '14.06.24', title: 'Reading', body: 'The Power Broker, still. It is the best book I know about how a city actually gets made.' },
    { date: '28.05.24', title: 'From a train window', body: 'The edge of every Indian city is an astonishing laboratory of adaptation.' }
  ]
};
