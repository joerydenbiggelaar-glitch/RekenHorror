import { Memory, Puzzle, PuzzleCategory } from './types.ts';

export const MAX_SANITY = 100;
export const SANITY_PENALTY = 20;

export const INTRO_TEXT = `
  Je wordt wakker in een koude, vochtige hal. De deur achter je valt met een zware klap in het slot.
  Een ijzige wind fluistert langs je oren... 
  "Help mij... ik ben vergeten wie ik ben..."
  
  Je bent niet alleen. Een dolende geest zit gevangen in dit huis. 
  Alleen door zijn herinneringen te herstellen, kunnen jullie beiden ontsnappen.
  Los de raadsels op. Maar pas op... elke fout maakt de schaduwen sterker.
`;

export const VICTORY_TEXT = `
  Het huis trilt op zijn grondvesten. De mist trekt op.
  De geest verschijnt voor je, niet langer als een schim, maar als een heldere gedaante.
  "Bedankt... Ik weet weer wie ik was. De weg is vrij."
  De voordeur zwaait open. Het zonlicht wacht.
`;

export const PUZZLES: Puzzle[] = [
  // Room 1: Getallen (Numbers)
  {
    id: 1,
    roomName: "De Hal van Verloren Tijd",
    description: "Oude klokken tikken niet gelijk. De tijd lijkt hier vloeibaar.",
    category: PuzzleCategory.NUMBERS,
    question: "Drie kaarsen branden. De eerste brandt 20% sneller dan normaal, de tweede 10% langzamer. Normaal brandt een kaars 5 cm per uur. Welke kaars is na 4 uur het langst?",
    options: ["Kaars 1 (Sneller)", "Kaars 2 (Langzamer)"],
    correctAnswerIndex: 1,
    explanation: "Kaars 2 brandt langzamer, dus verbruikt minder was per uur, en blijft dus langer.",
    imagePrompt: "A dark hallway filled with melting candles and distorted antique clocks, ominous atmosphere, photorealistic, cinematic lighting, 8k"
  },
  {
    id: 2,
    roomName: "De Kille Keuken",
    description: "Rottend fruit ligt op tafel. Er hangt een geur van azijn en oud bloed.",
    category: PuzzleCategory.NUMBERS,
    question: "Een recept voor gif vraagt om een mengsel. De totale inhoud neemt door gisting toe met 2,5% per uur. Je begint met 200ml. Hoeveel heb je na 3 uur (afgerond)?",
    options: ["215 ml", "218 ml"],
    correctAnswerIndex: 0,
    explanation: "200 * 1.025^3 ≈ 215.38 ml.",
    imagePrompt: "A decaying kitchen with rotten food and strange alchemical liquids in jars, scary, horror style, volumetric fog"
  },
  
  // Room 2: Verhoudingen (Ratios)
  {
    id: 3,
    roomName: "De Spiegelkamer",
    description: "Je ziet jezelf duizend keer, maar één spiegelbeeld beweegt niet mee.",
    category: PuzzleCategory.RATIOS,
    question: "Het aantal schaduwen staat in verhouding 4:5 met de lichtstralen. Samen zijn het er 45. Hoeveel schaduwen zijn er?",
    options: ["20", "25"],
    correctAnswerIndex: 0,
    explanation: "Totaal 9 delen (4+5). 45 / 9 = 5 per deel. Schaduwen = 4 * 5 = 20.",
    imagePrompt: "A room full of cracked mirrors, reflecting a shadowy figure that isn't there, dark blue tones, eerie"
  },
  {
    id: 4,
    roomName: "De Kelder",
    description: "Kettingen hangen aan het plafond. De vloer is bedekt met een vreemde as.",
    category: PuzzleCategory.RATIOS,
    question: "Op een plattegrond van de kerker is de schaal 1:250. De gang is op de kaart 12 cm. Hoe lang is de gang in werkelijkheid?",
    options: ["30 meter", "300 meter"],
    correctAnswerIndex: 0,
    explanation: "12 cm * 250 = 3000 cm = 30 meter.",
    imagePrompt: "A dark damp basement dungeon with rusty chains and a map drawn in dust on the floor, horror photography"
  },

  // Room 3: Meten & Meetkunde (Geometry)
  {
    id: 5,
    roomName: "De Schaduwbrug",
    description: "Een brug over een bodemloze put. Misstap is fataal.",
    category: PuzzleCategory.GEOMETRY,
    question: "De brug heeft een oppervlakte van 60 m². De lengte is 4 meter langer dan de breedte. Wat zijn de afmetingen?",
    options: ["6m bij 10m", "5m bij 12m"],
    correctAnswerIndex: 0,
    explanation: "6 * 10 = 60 en 10 - 6 = 4. (Bij 5x12 is verschil 7).",
    imagePrompt: "A narrow stone bridge crossing a bottomless void, covered in fog, scary, dramatic lighting"
  },
  {
    id: 6,
    roomName: "De Zolder",
    description: "Stofdeeltjes dansen in een eenzame lichtstraal. Een ladder leidt naar een luik.",
    category: PuzzleCategory.GEOMETRY,
    question: "Een ladder van 5 meter staat tegen de muur. De voet van de ladder staat 3 meter van de muur. Hoe hoog komt de ladder?",
    options: ["3 meter", "4 meter"],
    correctAnswerIndex: 1,
    explanation: "Stelling van Pythagoras: a² + b² = c². 3² + ?² = 5². 9 + 16 = 25. Hoogte is 4.",
    imagePrompt: "A creepy attic with old dolls and a ladder leading to a skylight, moonlight beams, dust, scary"
  },

  // Room 4: Verbanden (Relations)
  {
    id: 7,
    roomName: "Het Laboratorium",
    description: "Hier werd geëxperimenteerd met leven en dood.",
    category: PuzzleCategory.RELATIONS,
    question: "De angstmeter begint op 10 en verdubbelt elke minuut. Formule: A = 10 * 2^t. Wat is de angst na 5 minuten?",
    options: ["160", "320"],
    correctAnswerIndex: 1,
    explanation: "10 * 2^5 = 10 * 32 = 320.",
    imagePrompt: "An abandoned vintage laboratory with tesla coils and strange charts on the wall, green glow, horror"
  },
  {
    id: 8,
    roomName: "De Finale Deur",
    description: "De uitgang is in zicht, maar wordt geblokkeerd door een cijferslot.",
    category: PuzzleCategory.RELATIONS,
    question: "De code volgt een lineair verband. Bij t=1 is code 50, bij t=3 is code 40. Wat is de code bij t=5?",
    options: ["30", "20"],
    correctAnswerIndex: 0,
    explanation: "Elke stap van 2 tijdseenheden daalt de code met 10 (50->40). Dus bij t=5 daalt hij weer met 10 naar 30.",
    imagePrompt: "A massive heavy iron door with complex mechanical locks, fog swirling around the feet, cinematic"
  }
];

export const MEMORIES: Memory[] = [
  { id: 1, text: "Ik herinner me... een verjaardag. Iedereen was er. Waarom ging ik weg?", imagePrompt: "A faded vintage photograph of a happy birthday party, edges burned, ghostly overlay", voiceText: "Ik herinner me... een verjaardag." },
  { id: 2, text: "Er was een drankje... het smaakte bitter. Wie gaf het mij?", imagePrompt: "A glass of dark liquid on a lace tablecloth, sepia tone, disturbing", voiceText: "Het smaakte bitter..." },
  { id: 3, text: "Spiegels... ze lieten me dingen zien die er niet waren.", imagePrompt: "A broken mirror reflection showing a different face, horror style", voiceText: "De spiegels logen tegen me." },
  { id: 4, text: "Ze sloten me op in het donker. Ik hoorde ze lachen.", imagePrompt: "Hands scratching against a wooden door from the inside, dark, claustrophobic", voiceText: "Ze lieten me achter in het donker." },
  { id: 5, text: "Ik probeerde te vluchten over de brug, maar het was te glad.", imagePrompt: "Rain falling on slippery cobblestones, night time, fleeing perspective", voiceText: "Ik kon geen grip krijgen." },
  { id: 6, text: "Op zolder verstopte ik mijn dagboek. Is het er nog?", imagePrompt: "An old leather diary hidden under floorboards, dusty, mysterious", voiceText: "Mijn geheimen... liggen ze er nog?" },
  { id: 7, text: "Ze deden tests. Ze zeiden dat het voor mijn eigen bestwil was.", imagePrompt: "Medical instruments on a metal tray, cold lighting, scary", voiceText: "Het was niet voor mijn bestwil." },
  { id: 8, text: "Ik ben niet gek... ze hebben me dit aangedaan. Ik weet het weer!", imagePrompt: "A ghost rising with glowing eyes, realizing the truth, powerful, cinematic", voiceText: "Ik weet het weer. Ik ben vrij!" },
];