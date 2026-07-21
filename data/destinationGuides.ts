export type GuidePlace = {
  name: string;
  detail: string;
  mapsQuery: string;
};

export type ItineraryStop = {
  time: string;
  title: string;
  detail: string;
};

export type DestinationGuide = {
  intro: string;
  bestFor: string;
  idealStay: string;
  bestSeason: string;
  localTip: string;
  arrivalTip: string;
  highlights: GuidePlace[];
  nearby: GuidePlace[];
  itinerary: ItineraryStop[];
};

export const destinationGuides: Record<string, DestinationGuide> = {
  potsdam: {
    intro: "A graceful escape where royal gardens, lakeside paths, and handsome old streets fit naturally into one unhurried day.",
    bestFor: "Palaces & slow afternoons",
    idealStay: "Full day",
    bestSeason: "April–October",
    localTip: "Start with the palace grounds while they are quiet, then work back toward the old town.",
    arrivalTip: "Potsdam Hbf is walkable to the center; buses and trams shorten the trip to Sanssouci.",
    highlights: [
      { name: "Sanssouci Palace & Park", detail: "Terraced gardens, royal architecture, and long park walks.", mapsQuery: "Sanssouci Palace Potsdam" },
      { name: "Dutch Quarter", detail: "Red-brick lanes filled with small shops, galleries, and cafés.", mapsQuery: "Dutch Quarter Potsdam" },
      { name: "Cecilienhof Palace", detail: "A Tudor-style palace beside the lakes of the New Garden.", mapsQuery: "Cecilienhof Palace Potsdam" },
    ],
    nearby: [
      { name: "Babelsberg Park", detail: "Lakeside paths and broad views toward Glienicke Bridge.", mapsQuery: "Park Babelsberg Potsdam" },
      { name: "Museum Barberini", detail: "A strong art collection directly on Alter Markt.", mapsQuery: "Museum Barberini Potsdam" },
    ],
    itinerary: [
      { time: "Morning", title: "Sanssouci before the crowds", detail: "Walk the terraces and choose one palace interior if you want a timed visit." },
      { time: "Afternoon", title: "Old town and Dutch Quarter", detail: "Lunch in the center, then wander north through the red-brick streets." },
      { time: "Evening", title: "Havel-side finish", detail: "Return toward the station through Alter Markt or pause beside the water." },
    ],
  },
  oranienburg: {
    intro: "A close northern escape that brings palace gardens, riverside calm, and difficult twentieth-century history into one thoughtful day.",
    bestFor: "History & riverside walks",
    idealStay: "Half or full day",
    bestSeason: "Year-round",
    localTip: "Treat the palace and Sachsenhausen Memorial as separate visits; each deserves enough time and a different pace.",
    arrivalTip: "The palace is roughly a twenty-minute walk from Oranienburg station; local buses also serve the memorial.",
    highlights: [
      { name: "Oranienburg Palace", detail: "Brandenburg's oldest Baroque palace with a museum and riverside setting.", mapsQuery: "Oranienburg Palace" },
      { name: "Schlosspark Oranienburg", detail: "Formal gardens and relaxed paths beside the Havel.", mapsQuery: "Schlosspark Oranienburg" },
      { name: "Sachsenhausen Memorial", detail: "A major memorial and museum on the grounds of the former concentration camp.", mapsQuery: "Sachsenhausen Memorial Oranienburg" },
    ],
    nearby: [
      { name: "Lehnitzsee", detail: "A quieter lakeside extension north of the center.", mapsQuery: "Lehnitzsee Oranienburg" },
      { name: "Havel promenade", detail: "An easy waterside walk near the palace quarter.", mapsQuery: "Havelpromenade Oranienburg" },
    ],
    itinerary: [
      { time: "Morning", title: "Palace and riverside", detail: "Walk from the station to the palace museum and gardens." },
      { time: "Afternoon", title: "A focused memorial visit", detail: "Continue to Sachsenhausen and allow at least two quiet hours." },
      { time: "Evening", title: "Return by the Havel", detail: "Have an early meal in the center before the train home." },
    ],
  },
  "werder-havel": {
    intro: "A gentle island-town trip of orchards, water views, compact lanes, and one of the easiest holiday feelings west of Berlin.",
    bestFor: "Water, wine & café time",
    idealStay: "Half or full day",
    bestSeason: "April–October",
    localTip: "The old island town is the main reward; do not judge the destination from the station surroundings.",
    arrivalTip: "Bus 631 usually shortens the station-to-island journey, while the walk takes you gradually toward the Havel.",
    highlights: [
      { name: "Werder Island Town", detail: "Historic lanes, fishermen's houses, cafés, and water on every side.", mapsQuery: "Inselstadt Werder Havel" },
      { name: "Heilig-Geist-Kirche", detail: "The island's landmark church and an easy orientation point.", mapsQuery: "Heilig-Geist-Kirche Werder Havel" },
      { name: "Wachtelberg vineyard", detail: "A small wine-growing landscape with broad views over Werder.", mapsQuery: "Wachtelberg Werder Havel vineyard" },
    ],
    nearby: [
      { name: "Glindow Brickworks Museum", detail: "Industrial heritage beside the lakes south of Werder.", mapsQuery: "Ziegeleimuseum Glindow" },
      { name: "Schwielowsee", detail: "A lake circuit and waterside villages for a longer outdoor day.", mapsQuery: "Schwielowsee Brandenburg" },
    ],
    itinerary: [
      { time: "Morning", title: "Arrive on the island", detail: "Start with the church, old lanes, and a slow waterfront loop." },
      { time: "Afternoon", title: "Orchards or vineyard views", detail: "Choose Wachtelberg or a longer walk toward Glindow." },
      { time: "Evening", title: "Waterside table", detail: "Eat near the island before returning to the station." },
    ],
  },
  "brandenburg-havel": {
    intro: "Three historic town centers, brick churches, and the River Havel make this a layered day trip with more character than its quiet reputation suggests.",
    bestFor: "Medieval streets & water",
    idealStay: "Full day",
    bestSeason: "April–October",
    localTip: "The sights are spread across Neustadt, Altstadt, and Dominsel, so use the tram for at least one leg.",
    arrivalTip: "Trams connect Brandenburg Hbf with Neustädtischer Markt, the Altstadt, and routes toward Dominsel.",
    highlights: [
      { name: "Brandenburg Cathedral", detail: "A Romanesque and Gothic landmark on the peaceful cathedral island.", mapsQuery: "Brandenburg Cathedral Dominsel" },
      { name: "Altstädtisches Rathaus & Roland", detail: "A handsome Gothic town hall guarded by the city's Roland figure.", mapsQuery: "Altstädtisches Rathaus Brandenburg an der Havel" },
      { name: "St. Katharinenkirche", detail: "A monumental brick-Gothic church in the Neustadt.", mapsQuery: "St Katharinenkirche Brandenburg Havel" },
    ],
    nearby: [
      { name: "Industrial Museum", detail: "A preserved steelworks story and a striking Siemens-Martin furnace.", mapsQuery: "Industriemuseum Brandenburg an der Havel" },
      { name: "Beetzsee", detail: "A lake landscape north of town for cycling and swimming extensions.", mapsQuery: "Beetzsee Brandenburg" },
    ],
    itinerary: [
      { time: "Morning", title: "Neustadt to cathedral island", detail: "Begin at St. Katharinen, then follow the water toward Dominsel." },
      { time: "Afternoon", title: "Altstadt details", detail: "Cross to the old town for the Rathaus, Roland, and café streets." },
      { time: "Evening", title: "Havel promenade", detail: "Take a final riverside loop before catching the tram to the station." },
    ],
  },
  "beelitz-heilstaetten": {
    intro: "Forest, monumental sanatorium architecture, and elevated woodland views combine in one of Brandenburg's most unusual short escapes.",
    bestFor: "Architecture & forest",
    idealStay: "Half or full day",
    bestSeason: "March–November",
    localTip: "The major attractions use timed admission and seasonal hours, so confirm them before choosing your train.",
    arrivalTip: "The main treetop-walk complex is close to Beelitz-Heilstätten station; follow signed paths through the historic grounds.",
    highlights: [
      { name: "Baum & Zeit Treetop Walk", detail: "An elevated route above forest and historic sanatorium buildings.", mapsQuery: "Baum und Zeit Beelitz-Heilstätten" },
      { name: "Beelitz sanatorium grounds", detail: "Guided architecture and history tours through selected buildings.", mapsQuery: "Beelitz Heilstätten sanatorium" },
      { name: "Beelitz old town", detail: "A small historic center associated with the region's asparagus tradition.", mapsQuery: "Beelitz Altstadt" },
    ],
    nearby: [
      { name: "Barfußpark Beelitz", detail: "A seasonal barefoot nature park beside the historic complex.", mapsQuery: "Barfußpark Beelitz-Heilstätten" },
      { name: "Nieplitz lowlands", detail: "Flat Brandenburg countryside for cycling or a quiet extension.", mapsQuery: "Naturpark Nuthe-Nieplitz Beelitz" },
    ],
    itinerary: [
      { time: "Morning", title: "Climb above the forest", detail: "Start on the treetop walk before the busiest visitor window." },
      { time: "Afternoon", title: "Architecture in context", detail: "Join a guided building tour or explore the permitted grounds." },
      { time: "Evening", title: "Beelitz detour", detail: "If connections work, stop in the old town for a seasonal meal." },
    ],
  },
  "bad-belzig": {
    intro: "A hilltop castle, restorative thermal baths, and a compact medieval center make Bad Belzig an easy mix of culture and wellness.",
    bestFor: "Castle views & thermal baths",
    idealStay: "Full day",
    bestSeason: "Year-round",
    localTip: "Reserve a spa window first, then plan the castle and old town around it.",
    arrivalTip: "The old town and castle are uphill from the station; local buses can save energy before a longer walk.",
    highlights: [
      { name: "Eisenhardt Castle", detail: "A medieval hilltop complex with a tower and views over the Fläming.", mapsQuery: "Burg Eisenhardt Bad Belzig" },
      { name: "SteinTherme", detail: "Thermal pools and sauna facilities supplied by local brine.", mapsQuery: "SteinTherme Bad Belzig" },
      { name: "Bad Belzig old town", detail: "Quiet lanes, the town church, and remnants of the historic center.", mapsQuery: "Bad Belzig Altstadt" },
    ],
    nearby: [
      { name: "Hoher Fläming Nature Park", detail: "Woodland trails and rolling countryside around the town.", mapsQuery: "Naturpark Hoher Fläming Bad Belzig" },
      { name: "Kunstwanderweg", detail: "An art trail through the Fläming landscape, best for a longer day.", mapsQuery: "Kunstwanderweg Hoher Fläming" },
    ],
    itinerary: [
      { time: "Morning", title: "Climb to Eisenhardt", detail: "Explore the castle complex while the hilltop is quiet." },
      { time: "Afternoon", title: "Old-town lunch and spa", detail: "Descend through the center before an unhurried thermal session." },
      { time: "Evening", title: "A relaxed return", detail: "Leave enough time to walk or bus back to the station." },
    ],
  },
  "bad-saarow": {
    intro: "A low-effort lake escape where wooded shoreline, spa time, and quiet cafés create an easy reset from Berlin.",
    bestFor: "Wellness & water",
    idealStay: "Half or full day",
    bestSeason: "Year-round",
    localTip: "Reserve spa entry before departure, especially on colder weekends.",
    arrivalTip: "Bad Saarow station is close to the spa quarter and northern promenade of Scharmützelsee.",
    highlights: [
      { name: "SaarowTherme", detail: "Thermal pools and saunas in the heart of the resort town.", mapsQuery: "SaarowTherme Bad Saarow" },
      { name: "Scharmützelsee promenade", detail: "An easy waterside route with piers, cafés, and open lake views.", mapsQuery: "Scharmützelsee promenade Bad Saarow" },
      { name: "Rauener Berge", detail: "Wooded hills and large glacial boulders for a more active extension.", mapsQuery: "Rauener Berge Markgrafensteine" },
    ],
    nearby: [
      { name: "Aussichtsturm Rauener Berge", detail: "A forest observation tower with wide Brandenburg views.", mapsQuery: "Aussichtsturm Rauener Berge" },
      { name: "Stan Eby golf course", detail: "A resort-area option for travelers planning a longer stay.", mapsQuery: "Golf Bad Saarow" },
    ],
    itinerary: [
      { time: "Morning", title: "Walk the lakeshore", detail: "Begin with the promenade while the water and paths are calm." },
      { time: "Afternoon", title: "Thermal reset", detail: "Spend a few hours in the pools and saunas." },
      { time: "Evening", title: "Lake-view meal", detail: "Choose a restaurant near the water before the short walk to the station." },
    ],
  },
  "frankfurt-oder": {
    intro: "A border-city day built around the Oder, bold brick architecture, Kleist, and the simple pleasure of walking into Poland for lunch.",
    bestFor: "Border culture & architecture",
    idealStay: "Full day",
    bestSeason: "April–October",
    localTip: "Carry identification for the border crossing and leave roaming enabled if your phone plan requires it.",
    arrivalTip: "Trams link Frankfurt (Oder) station to the center; the pedestrian bridge to Słubice starts at the riverfront.",
    highlights: [
      { name: "St. Mary's Church", detail: "A major brick-Gothic church known for its remarkable medieval stained glass.", mapsQuery: "St Marienkirche Frankfurt Oder" },
      { name: "Kleist Museum", detail: "Literature and exhibitions devoted to Heinrich von Kleist.", mapsQuery: "Kleist Museum Frankfurt Oder" },
      { name: "Oder promenade & border bridge", detail: "A riverside walk that continues directly into Słubice, Poland.", mapsQuery: "Stadtbrücke Frankfurt Oder Slubice" },
    ],
    nearby: [
      { name: "Słubice", detail: "A Polish university town for lunch, markets, and a two-country day.", mapsQuery: "Słubice Poland center" },
      { name: "Lennépark", detail: "A long landscaped park running through central Frankfurt.", mapsQuery: "Lennépark Frankfurt Oder" },
    ],
    itinerary: [
      { time: "Morning", title: "Brick Gothic and Kleist", detail: "Start around St. Mary's and the museum quarter." },
      { time: "Afternoon", title: "Walk across a border", detail: "Cross the Oder for lunch and a short circuit through Słubice." },
      { time: "Evening", title: "River light", detail: "Return along the promenade before taking the tram uphill." },
    ],
  },
  eberswalde: {
    intro: "Canals, industrial heritage, and deep Barnim forests give Eberswalde a practical outdoorsy character just beyond Berlin's edge.",
    bestFor: "Canals & green adventures",
    idealStay: "Full day",
    bestSeason: "April–October",
    localTip: "Bring a bike if you want to connect the canal, family garden, and surrounding forest efficiently.",
    arrivalTip: "Local buses and the distinctive trolleybus network connect Eberswalde Hbf with the center and family garden.",
    highlights: [
      { name: "Finow Canal", detail: "Germany's oldest operating artificial waterway, lined with towpaths and industrial traces.", mapsQuery: "Finowkanal Eberswalde" },
      { name: "Familiengarten Eberswalde", detail: "An industrial-landscape park with play areas, viewpoints, and event spaces.", mapsQuery: "Familiengarten Eberswalde" },
      { name: "Eberswalde Zoo", detail: "A forest-set zoo particularly suited to family day trips.", mapsQuery: "Zoo Eberswalde" },
    ],
    nearby: [
      { name: "Barnim Nature Park", detail: "Broad forest and lake landscapes south and west of town.", mapsQuery: "Naturpark Barnim Eberswalde" },
      { name: "Werbellinsee", detail: "A clear glacial lake for swimming and cycling extensions.", mapsQuery: "Werbellinsee Brandenburg" },
    ],
    itinerary: [
      { time: "Morning", title: "Meet the Finow Canal", detail: "Follow a towpath section and look for the city's industrial layers." },
      { time: "Afternoon", title: "Choose your green space", detail: "Spend the main part of the day at the family garden or zoo." },
      { time: "Evening", title: "Center and return", detail: "Stop around the market before taking the trolleybus back." },
    ],
  },
  chorin: {
    intro: "A landmark brick monastery surrounded by quiet beech forest makes Chorin one of the purest culture-and-nature escapes near Berlin.",
    bestFor: "Monastery & forest",
    idealStay: "Half or full day",
    bestSeason: "March–November",
    localTip: "Check concert and event days: they can make the abbey magical, but also much busier.",
    arrivalTip: "Chorin station is outside the village; walking and cycling routes lead through forest toward the abbey.",
    highlights: [
      { name: "Chorin Abbey", detail: "A celebrated example of North German brick Gothic in a serene landscape.", mapsQuery: "Kloster Chorin" },
      { name: "Chorin forest", detail: "Beech woodland paths within the Schorfheide-Chorin biosphere reserve.", mapsQuery: "Choriner Wald" },
      { name: "Amtsee", detail: "A small lake beside the monastery, ideal for a quiet loop.", mapsQuery: "Amtsee Chorin" },
    ],
    nearby: [
      { name: "Niederfinow Boat Lift", detail: "Two immense ship lifts and one of Brandenburg's most striking engineering sights.", mapsQuery: "Schiffshebewerk Niederfinow" },
      { name: "Parsteiner See", detail: "A rural lake landscape for cycling and longer summer days.", mapsQuery: "Parsteiner See" },
    ],
    itinerary: [
      { time: "Morning", title: "Forest approach", detail: "Walk or cycle from the station through the biosphere landscape." },
      { time: "Afternoon", title: "Abbey in depth", detail: "Explore the architecture, exhibitions, and Amtsee shore." },
      { time: "Evening", title: "Quiet return trail", detail: "Head back before forest paths become dark outside summer." },
    ],
  },
  angermuende: {
    intro: "A beautifully preserved Uckermark town surrounded by lakes and bird-rich countryside, well suited to a slower regional day.",
    bestFor: "Old town & wildlife",
    idealStay: "Full day",
    bestSeason: "April–October",
    localTip: "Many nature highlights lie outside town, so align any bus or bike plan with the regional timetable first.",
    arrivalTip: "The historic center is a short walk from Angermünde station; a bicycle unlocks much more of the surrounding Uckermark.",
    highlights: [
      { name: "Angermünde old town", detail: "Restored streets, a handsome market square, and medieval details.", mapsQuery: "Angermünde Altstadt Markt" },
      { name: "Mündesee", detail: "A lake directly beside town with a scenic walking circuit.", mapsQuery: "Mündesee Angermünde" },
      { name: "St. Marien Church", detail: "A substantial brick church with a historically important organ.", mapsQuery: "St Marien Angermünde" },
    ],
    nearby: [
      { name: "Blumberger Mühle", detail: "A NABU nature center and gateway to the biosphere reserve.", mapsQuery: "NABU Blumberger Mühle" },
      { name: "Grumsin beech forest", detail: "UNESCO-listed ancient woodland best approached with advance route planning.", mapsQuery: "Buchenwald Grumsin" },
    ],
    itinerary: [
      { time: "Morning", title: "Market and medieval lanes", detail: "Take a compact old-town circuit from the station." },
      { time: "Afternoon", title: "Choose lake or wildlife", detail: "Loop Mündesee or continue to Blumberger Mühle." },
      { time: "Evening", title: "Uckermark pause", detail: "Have an early meal near the market before your regional train." },
    ],
  },
  templin: {
    intro: "Complete medieval walls, forest-fringed lakes, and thermal baths give Templin the feel of a genuine small-town holiday.",
    bestFor: "Lakes, walls & wellness",
    idealStay: "Full day or weekend",
    bestSeason: "Year-round",
    localTip: "The regional journey can be slow, so a one-night stay makes the surrounding lakes much easier to enjoy.",
    arrivalTip: "Templin Stadt station is the most convenient stop for the old town; confirm which station your selected train serves.",
    highlights: [
      { name: "Templin town wall", detail: "A remarkably complete fortification circuit with towers and historic gates.", mapsQuery: "Templin Stadtmauer" },
      { name: "NaturTherme Templin", detail: "Indoor and outdoor thermal pools for a year-round wellness stop.", mapsQuery: "NaturTherme Templin" },
      { name: "Lübbesee", detail: "A long forest lake with beaches, walking paths, and clear water.", mapsQuery: "Lübbesee Templin" },
    ],
    nearby: [
      { name: "Boitzenburg Castle", detail: "A fairytale-like manor landscape requiring extra onward planning.", mapsQuery: "Schloss Boitzenburg" },
      { name: "Schorfheide-Chorin Biosphere", detail: "Forest, lakes, and wildlife routes around the wider region.", mapsQuery: "Biosphärenreservat Schorfheide Chorin Templin" },
    ],
    itinerary: [
      { time: "Morning", title: "Walk the walls", detail: "Circle the gates and towers before pausing in the market square." },
      { time: "Afternoon", title: "Water your way", detail: "Choose Lübbesee in warm weather or the thermal baths year-round." },
      { time: "Evening", title: "Make it a weekend", detail: "Stay for a quiet dinner if the return journey would cut the day short." },
    ],
  },
  neustrelitz: {
    intro: "A planned Baroque city with a star-shaped center, elegant gardens, and direct access to the lakes of Mecklenburg.",
    bestFor: "Gardens & lake country",
    idealStay: "Full day or weekend",
    bestSeason: "April–October",
    localTip: "The harbor and palace garden work as one long walk; add the national park only with a bike or onward transport plan.",
    arrivalTip: "Neustrelitz Hbf is west of the center; buses or a twenty-minute walk lead to the market and palace garden.",
    highlights: [
      { name: "Neustrelitz palace garden", detail: "Formal avenues, sculptures, and surviving royal-era buildings.", mapsQuery: "Schlossgarten Neustrelitz" },
      { name: "Market square", detail: "The hub of the city's distinctive radial street plan.", mapsQuery: "Marktplatz Neustrelitz" },
      { name: "Zierker See harbor", detail: "Boats, waterside paths, and a relaxed finish close to the center.", mapsQuery: "Hafen Neustrelitz Zierker See" },
    ],
    nearby: [
      { name: "Müritz National Park", detail: "Lakes, forest, and birdlife beginning west of the city.", mapsQuery: "Müritz National Park Neustrelitz entrance" },
      { name: "Slavic Village", detail: "A family-oriented reconstruction exploring early regional settlement.", mapsQuery: "Slawendorf Neustrelitz" },
    ],
    itinerary: [
      { time: "Morning", title: "Read the star-shaped city", detail: "Begin at the market and follow one radial street toward the gardens." },
      { time: "Afternoon", title: "Royal garden to harbor", detail: "Walk the landscaped grounds, then continue to Zierker See." },
      { time: "Evening", title: "Harbor pause", detail: "Eat by the water or return through the center for the train." },
    ],
  },
  "waren-mueritz": {
    intro: "A relaxed base on Germany's largest inland lake, ideal for open-water views, cycling, and an easy dose of national-park nature.",
    bestFor: "Lakes & outdoor time",
    idealStay: "Full day or weekend",
    bestSeason: "April–October",
    localTip: "Check seasonal boat and bus timetables before choosing the farthest point on your route.",
    arrivalTip: "Waren station is walkable to the old town and harbor; national-park routes begin beyond the center.",
    highlights: [
      { name: "Müritzeum", detail: "A modern nature museum and aquarium introducing the Mecklenburg lake district.", mapsQuery: "Müritzeum Waren" },
      { name: "Waren harbor", detail: "A lively waterfront for boat trips, cafés, and sunset walks.", mapsQuery: "Waren Müritz harbor" },
      { name: "Müritz National Park", detail: "Forest, lakes, and wildlife routes best explored by bike or seasonal bus.", mapsQuery: "Müritz National Park Waren entrance" },
    ],
    nearby: [
      { name: "Kölpinsee", detail: "A quieter neighboring lake on cycling routes west of town.", mapsQuery: "Kölpinsee Waren Müritz" },
      { name: "Federow", detail: "A small national-park gateway known for birdwatching access.", mapsQuery: "Nationalpark-Information Federow" },
    ],
    itinerary: [
      { time: "Morning", title: "Understand the lake district", detail: "Begin at the Müritzeum, then step into the old town." },
      { time: "Afternoon", title: "Ride, sail, or hike", detail: "Choose one national-park route or a seasonal boat trip." },
      { time: "Evening", title: "Harbor sunset", detail: "Finish beside the Müritz—ideally without rushing for the last train." },
    ],
  },
  luebbenau: {
    intro: "The gateway to the Spreewald pairs storybook lanes with waterways, forest shade, and a pace that feels far from the city.",
    bestFor: "Waterways & nature",
    idealStay: "Full day or weekend",
    bestSeason: "April–October",
    localTip: "Reserve a boat trip on warm weekends and leave a little time to explore beyond the main harbor.",
    arrivalTip: "Lübbenau station is an easy walk from the old town and boat harbors; bicycles widen your options considerably.",
    highlights: [
      { name: "Spreewald punt tour", detail: "A traditional low-boat journey through the region's branching waterways.", mapsQuery: "Kahnfahrt Lübbenau Spreewald harbor" },
      { name: "Lehde open-air museum", detail: "Historic farmsteads and everyday Spreewald culture in a waterside village.", mapsQuery: "Freilandmuseum Lehde" },
      { name: "Lübbenau old town", detail: "A compact center connecting the station, castle park, and harbors.", mapsQuery: "Lübbenau Altstadt" },
    ],
    nearby: [
      { name: "Lehde village", detail: "A beautiful network of footbridges, channels, and traditional houses.", mapsQuery: "Lehde Spreewald village" },
      { name: "Spreewald Biosphere Reserve", detail: "Protected wetland landscape for paddling, walking, and cycling.", mapsQuery: "Spreewald Biosphere Reserve Lübbenau" },
    ],
    itinerary: [
      { time: "Morning", title: "Get onto the water", detail: "Take an early punt or kayak before the busiest departure window." },
      { time: "Afternoon", title: "Lehde and local culture", detail: "Visit the open-air museum and follow village footpaths." },
      { time: "Evening", title: "Pickles and old-town lanes", detail: "Return via the harbor for a regional meal before the train." },
    ],
  },
  luebben: {
    intro: "Smaller and calmer than Lübbenau, Lübben offers easy paddling, green islands, and a relaxed introduction to the Spreewald.",
    bestFor: "Paddling & easy nature",
    idealStay: "Full day",
    bestSeason: "April–October",
    localTip: "Choose Lübben when you want flexible water access and fewer tour-group rhythms than the busier southern gateway.",
    arrivalTip: "The station is south of the center; buses or a twenty-minute walk lead to Schlossinsel and the main harbors.",
    highlights: [
      { name: "Schlossinsel Lübben", detail: "A green island park with footbridges, play areas, and waterside paths.", mapsQuery: "Schlossinsel Lübben" },
      { name: "SpreeLagune", detail: "A seasonal swimming and recreation area directly on the Spree.", mapsQuery: "SpreeLagune Lübben" },
      { name: "Punt and kayak harbors", detail: "Multiple starting points for guided or self-powered water routes.", mapsQuery: "Kahnfahrt Lübben Spreewald" },
    ],
    nearby: [
      { name: "Wotschofska", detail: "A classic waterside destination reached by boat, bike, or foot.", mapsQuery: "Wotschofska Spreewald" },
      { name: "Biosphere reserve trails", detail: "Flat cycling and walking routes through meadows and channels.", mapsQuery: "Spreewald Biosphere Lübben trails" },
    ],
    itinerary: [
      { time: "Morning", title: "Launch into the Spreewald", detail: "Rent a kayak or join a punt from one of the central harbors." },
      { time: "Afternoon", title: "Island and lagoon", detail: "Relax on Schlossinsel and add a swim when conditions allow." },
      { time: "Evening", title: "Riverside return", detail: "Walk back through the center, allowing time for the station leg." },
    ],
  },
  cottbus: {
    intro: "A compact city with a remarkable landscape-architecture legacy, a handsome old center, and a strong Sorbian and Lusatian identity.",
    bestFor: "Parks & regional culture",
    idealStay: "Full day",
    bestSeason: "April–October",
    localTip: "Branitz is the essential sight but not in the center—use the tram and bus instead of trying to walk every leg.",
    arrivalTip: "Trams leave from Cottbus Hbf for the center; buses continue toward Branitz Park.",
    highlights: [
      { name: "Branitz Park & Palace", detail: "Prince Pückler's landscape masterpiece, famous for its earth pyramids.", mapsQuery: "Branitz Park Cottbus" },
      { name: "Cottbus old market", detail: "Colorful façades, cafés, and the historic heart of the city.", mapsQuery: "Altmarkt Cottbus" },
      { name: "Wendish Museum", detail: "An introduction to Lower Sorbian culture, language, and traditions.", mapsQuery: "Wendisches Museum Cottbus" },
    ],
    nearby: [
      { name: "Spremberger Tower", detail: "A central city tower with views over Cottbus.", mapsQuery: "Spremberger Turm Cottbus" },
      { name: "Cottbuser Ostsee", detail: "A vast former mine becoming a new lake landscape east of the city.", mapsQuery: "Cottbuser Ostsee viewpoint" },
    ],
    itinerary: [
      { time: "Morning", title: "Go straight to Branitz", detail: "Give the park, palace, and pyramids the freshest part of the day." },
      { time: "Afternoon", title: "Altmarkt and Sorbian culture", detail: "Return to the center for lunch and the Wendish Museum." },
      { time: "Evening", title: "Tower and tram", detail: "Climb the Spremberger Tower if open, then ride back to the station." },
    ],
  },
  leipzig: {
    intro: "A creative, music-rich city where grand civic history, post-industrial art spaces, canals, and late-night neighborhoods reward a long day or weekend.",
    bestFor: "Music, art & nightlife",
    idealStay: "Weekend",
    bestSeason: "Year-round",
    localTip: "Regional-only Deutschlandticket routes take longer than intercity trains; verify that every selected service is ticket-valid.",
    arrivalTip: "Leipzig Hbf opens directly onto the center and an extensive tram network.",
    highlights: [
      { name: "St. Thomas Church", detail: "Bach's principal Leipzig church and one of the city's musical anchors.", mapsQuery: "Thomaskirche Leipzig" },
      { name: "Spinnerei", detail: "A former cotton mill transformed into studios and contemporary galleries.", mapsQuery: "Leipziger Baumwollspinnerei" },
      { name: "Monument to the Battle of the Nations", detail: "A monumental landmark with a panoramic viewing platform.", mapsQuery: "Völkerschlachtdenkmal Leipzig" },
    ],
    nearby: [
      { name: "Karl-Heine Canal", detail: "Waterside paths, boat tours, and industrial architecture in Plagwitz.", mapsQuery: "Karl-Heine-Kanal Leipzig" },
      { name: "Clara-Zetkin Park", detail: "A broad green corridor linking the center with western neighborhoods.", mapsQuery: "Clara-Zetkin-Park Leipzig" },
    ],
    itinerary: [
      { time: "Morning", title: "Music and market streets", detail: "Walk from the station through Nikolaikirche, Markt, and Thomaskirche." },
      { time: "Afternoon", title: "Choose east, west, or monument", detail: "Focus on one district rather than crossing the whole city repeatedly." },
      { time: "Evening", title: "Stay for the neighborhoods", detail: "Eat in Plagwitz or Südvorstadt and make a weekend of it if possible." },
    ],
  },
  dresden: {
    intro: "Grand riverside architecture, world-class collections, and characterful neighborhoods make Dresden rewarding from morning until evening.",
    bestFor: "Art & architecture",
    idealStay: "Weekend",
    bestSeason: "Year-round",
    localTip: "Book timed museum entry in advance and build the rest of your route around it.",
    arrivalTip: "Trams connect Dresden Hbf with the old town; walking via Prager Straße is straightforward.",
    highlights: [
      { name: "Frauenkirche & Neumarkt", detail: "The reconstructed Baroque heart of Dresden's old town.", mapsQuery: "Frauenkirche Dresden Neumarkt" },
      { name: "Zwinger", detail: "Palace architecture, courtyards, and major museum collections.", mapsQuery: "Zwinger Dresden" },
      { name: "Brühl's Terrace", detail: "A raised promenade overlooking the Elbe and historic riverfront.", mapsQuery: "Brühlsche Terrasse Dresden" },
    ],
    nearby: [
      { name: "Dresden Neustadt", detail: "Courtyards, bars, street life, and a strong contrast to the old town.", mapsQuery: "Äußere Neustadt Dresden" },
      { name: "Pillnitz Palace", detail: "A riverside palace and garden complex reached by tram and bus or boat.", mapsQuery: "Pillnitz Palace Dresden" },
    ],
    itinerary: [
      { time: "Morning", title: "Old-town panorama", detail: "Begin around Neumarkt, the Fürstenzug, and Brühl's Terrace." },
      { time: "Afternoon", title: "One great collection", detail: "Choose the Zwinger, Albertinum, or Royal Palace instead of rushing all three." },
      { time: "Evening", title: "Cross into Neustadt", detail: "Walk over the Elbe for dinner and a livelier neighborhood atmosphere." },
    ],
  },
  rostock: {
    intro: "A Hanseatic city break with brick-Gothic streets, a lively harbor, and the Baltic coast close enough to add sea air to the day.",
    bestFor: "Hanseatic city & harbor",
    idealStay: "Weekend",
    bestSeason: "May–September",
    localTip: "For a beach extension, keep enough time for the local connection between Rostock and Warnemünde.",
    arrivalTip: "Trams connect Rostock Hbf with Neuer Markt and Kröpeliner Tor; S-Bahn trains continue to Warnemünde.",
    highlights: [
      { name: "Neuer Markt & St. Mary's", detail: "The historic center's main square and monumental brick-Gothic church.", mapsQuery: "Neuer Markt St Marien Rostock" },
      { name: "Rostock city harbor", detail: "A broad promenade of ships, cafés, and waterfront events.", mapsQuery: "Stadthafen Rostock" },
      { name: "Kröpeliner Straße", detail: "The central pedestrian route through preserved gates and university buildings.", mapsQuery: "Kröpeliner Straße Rostock" },
    ],
    nearby: [
      { name: "Warnemünde", detail: "Beach, lighthouse, and the Alter Strom reached directly by S-Bahn.", mapsQuery: "Warnemünde beach lighthouse" },
      { name: "IGA Park", detail: "Riverside parkland and maritime exhibits northwest of the center.", mapsQuery: "IGA Park Rostock" },
    ],
    itinerary: [
      { time: "Morning", title: "Hanseatic center", detail: "Start at Neuer Markt and trace Kröpeliner Straße west." },
      { time: "Afternoon", title: "Harbor or Baltic", detail: "Choose the city harbor or take the S-Bahn all the way to the coast." },
      { time: "Evening", title: "Stay by the sea", detail: "An overnight trip removes pressure from the long regional return." },
    ],
  },
  warnemuende: {
    intro: "A broad Baltic beach, working harbor, lighthouse, and fish-sandwich energy make Warnemünde feel like a true seaside holiday.",
    bestFor: "Beach & Baltic air",
    idealStay: "Full day or weekend",
    bestSeason: "May–September",
    localTip: "The beach is busy around the lighthouse; walk west for more space or east toward the harbor entrance for ship views.",
    arrivalTip: "Warnemünde station sits between Alter Strom and the cruise harbor, only a short walk from the beach.",
    highlights: [
      { name: "Warnemünde beach", detail: "A wide sandy Baltic beach with swimming, dunes, and a long promenade.", mapsQuery: "Warnemünde Strand" },
      { name: "Lighthouse & Teepott", detail: "The resort's defining skyline and central promenade landmark.", mapsQuery: "Warnemünde lighthouse Teepott" },
      { name: "Alter Strom", detail: "Fishing boats, small shops, and seafood along the old harbor channel.", mapsQuery: "Alter Strom Warnemünde" },
    ],
    nearby: [
      { name: "Westmole", detail: "A long harbor wall for Baltic views and passing ships when conditions permit.", mapsQuery: "Westmole Warnemünde" },
      { name: "Rostock old town", detail: "Add Hanseatic architecture with a direct S-Bahn ride inland.", mapsQuery: "Rostock Altstadt" },
    ],
    itinerary: [
      { time: "Morning", title: "Alter Strom arrival", detail: "Walk the fishing harbor before the promenade becomes busy." },
      { time: "Afternoon", title: "Beach and lighthouse", detail: "Claim a stretch of sand, then climb the lighthouse when open." },
      { time: "Evening", title: "Baltic sunset", detail: "Eat fish by the harbor and stay overnight if the regional return is too long." },
    ],
  },
  schwerin: {
    intro: "A compact lakeside capital centered on one of Germany's most theatrical castles, with gardens and old-town streets made for wandering.",
    bestFor: "Castle & lakes",
    idealStay: "Full day or weekend",
    bestSeason: "April–October",
    localTip: "The castle looks especially striking from the paths across the water—save time for the longer garden loop.",
    arrivalTip: "Schwerin Mitte is often convenient for the center; from the main station, buses and trams also reach the old town quickly.",
    highlights: [
      { name: "Schwerin Castle", detail: "A spectacular island palace housing the state parliament and a museum.", mapsQuery: "Schwerin Castle" },
      { name: "Castle gardens", detail: "Formal terraces and lakeside paths with the city's best palace views.", mapsQuery: "Schlossgarten Schwerin" },
      { name: "Schwerin Cathedral", detail: "A soaring brick-Gothic landmark in the old-town center.", mapsQuery: "Schwerin Cathedral" },
    ],
    nearby: [
      { name: "Pfaffenteich", detail: "An urban lake edged by handsome buildings and a popular promenade.", mapsQuery: "Pfaffenteich Schwerin" },
      { name: "Zippendorf beach", detail: "A local swimming beach on the southern shore of Schweriner See.", mapsQuery: "Zippendorfer Strand Schwerin" },
    ],
    itinerary: [
      { time: "Morning", title: "Castle first", detail: "Tour the island exterior, gardens, and museum before peak hours." },
      { time: "Afternoon", title: "Old town and cathedral", detail: "Walk north through the market streets and around Pfaffenteich." },
      { time: "Evening", title: "Lakeside finale", detail: "Return to the castle shore for late light before heading to the train." },
    ],
  },
};

export function getDestinationGuide(slug: string) {
  return destinationGuides[slug] ?? destinationGuides.potsdam;
}
