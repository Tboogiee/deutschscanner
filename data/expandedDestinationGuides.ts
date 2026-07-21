import type {
  DestinationGuide,
  GuidePlace,
  ItineraryStop,
} from "@/data/destinationGuides";

type CompactGuide = Omit<DestinationGuide, "itinerary"> & {
  highlights: [GuidePlace, GuidePlace, GuidePlace];
  itinerary?: ItineraryStop[];
};

function guide(item: CompactGuide): DestinationGuide {
  return {
    ...item,
    itinerary: item.itinerary ?? [
      {
        time: "Morning",
        title: item.highlights[0].name,
        detail: item.highlights[0].detail,
      },
      {
        time: "Afternoon",
        title: item.highlights[1].name,
        detail: item.highlights[1].detail,
      },
      {
        time: "Evening",
        title: item.highlights[2].name,
        detail: item.highlights[2].detail,
      },
    ],
  };
}

export const expandedDestinationGuides: Record<string, DestinationGuide> = {
  luckenwalde: guide({
    intro: "Luckenwalde is a compact surprise: bold industrial modernism, a civic old center, and one of Brandenburg's best bases for wheels-on-pavement adventures.",
    bestFor: "Design & active escapes",
    idealStay: "Half or full day",
    bestSeason: "April–October",
    localTip: "Bring or rent wheels if the Flaeming-Skate is the priority; the town sights themselves fit comfortably into a walking loop.",
    arrivalTip: "Luckenwalde station is west of the center; the market and tourist information are roughly fifteen minutes away on foot.",
    highlights: [
      { name: "Mendelsohn Hat Factory", detail: "A landmark of expressionist industrial architecture with a famously sculptural dyeing hall.", mapsQuery: "Mendelsohn Hutfabrik Luckenwalde" },
      { name: "Market square & St. Johannis", detail: "The civic heart of town, framed by the church, town hall, and historic streets.", mapsQuery: "Marktplatz Luckenwalde St Johannis" },
      { name: "HeimatMuseum Luckenwalde", detail: "Local industrial, social, and city history inside the tourist-information building.", mapsQuery: "HeimatMuseum Luckenwalde" },
    ],
    nearby: [
      { name: "Flaeming-Skate", detail: "A vast smooth-surface network for skating and cycling through the Fläming countryside.", mapsQuery: "Flaeming Skate Luckenwalde" },
      { name: "Kloster Zinna", detail: "A former Cistercian monastery and historic weaving village one regional stop away.", mapsQuery: "Kloster Zinna" },
    ],
  }),
  "bad-freienwalde": guide({
    intro: "Brandenburg becomes unexpectedly hilly in this old spa town, where villas, parkland, wooded trails, and wide Oderbruch views meet.",
    bestFor: "Hills, spa history & views",
    idealStay: "Full day",
    bestSeason: "April–October",
    localTip: "This is one of the few Brandenburg trips where sturdy shoes genuinely improve the day; the best viewpoints sit above town.",
    arrivalTip: "The station is close to the lower old town. The kurpark and hill routes begin beyond the center and climb steadily.",
    highlights: [
      { name: "Kurpark & spa quarter", detail: "Historic spa architecture, landscaped grounds, and the green beginning of the hill walks.", mapsQuery: "Kurpark Bad Freienwalde" },
      { name: "Schloss Freienwalde", detail: "A small castle above town associated with Walther Rathenau and surrounded by parkland.", mapsQuery: "Schloss Freienwalde" },
      { name: "Oderlandmuseum", detail: "The regional museum explains the spa town and the engineered cultural landscape of the Oderbruch.", mapsQuery: "Oderlandmuseum Bad Freienwalde" },
    ],
    nearby: [
      { name: "House of Nature Care", detail: "A nature-education site with gardens and local conservation history on the town's slopes.", mapsQuery: "Haus der Naturpflege Bad Freienwalde" },
      { name: "Oderbruch Museum Altranft", detail: "A manor-house museum and village landscape devoted to life in the Oderbruch.", mapsQuery: "Oderbruch Museum Altranft" },
    ],
  }),
  "fuerstenberg-havel": guide({
    intro: "Three lakes and the Havel shape an easygoing water town whose beautiful setting sits beside one of Germany's most important memorial sites.",
    bestFor: "Paddling, lakes & remembrance",
    idealStay: "Full day or weekend",
    bestSeason: "May–September",
    localTip: "Treat the Ravensbrück Memorial as a focused visit and leave separate time for the lake landscape rather than rushing between them.",
    arrivalTip: "The station is walkable to the center and waterfront; the Ravensbrück Memorial lies south-east of town and can be reached by foot or bike.",
    highlights: [
      { name: "Fürstenberg lake district", detail: "Röblinsee, Baalensee, and Schwedtsee surround the town with paddling and swimming options.", mapsQuery: "Fürstenberg Havel Seenland harbor" },
      { name: "Ravensbrück Memorial", detail: "A major memorial and museum at the former women's concentration camp.", mapsQuery: "Ravensbrück Memorial" },
      { name: "Havel waterfront & old town", detail: "Bridges, boats, and compact streets reveal why Fürstenberg is known as a water town.", mapsQuery: "Fürstenberg Havel waterfront" },
    ],
    nearby: [
      { name: "Himmelpfort", detail: "A waterside village with monastery ruins and Germany's famous Christmas post office.", mapsQuery: "Himmelpfort monastery Fürstenberg" },
      { name: "Stechlinsee", detail: "A remarkably clear forest lake best added with a bicycle or planned bus connection.", mapsQuery: "Großer Stechlinsee" },
    ],
  }),
  rheinsberg: guide({
    intro: "Rheinsberg is a graceful palace-and-lake escape, rich in Frederickian history, music, literature, and forest-edged shoreline.",
    bestFor: "Palace, music & lakes",
    idealStay: "Full day or weekend",
    bestSeason: "April–October",
    localTip: "Regional service can be seasonal or infrequent, so open the live DB result before committing to the day.",
    arrivalTip: "Rheinsberg station sits south of the center; the palace and Grienericksee are about a twenty-minute walk away.",
    highlights: [
      { name: "Rheinsberg Palace", detail: "An elegant lakeside residence associated with the young Frederick the Great and Prince Henry.", mapsQuery: "Schloss Rheinsberg" },
      { name: "Palace park & Grienericksee", detail: "Garden paths, obelisks, and long reflections across the lake make the setting the main event.", mapsQuery: "Schlosspark Rheinsberg Grienericksee" },
      { name: "Rheinsberg old town", detail: "A small cultural center of ceramics, music, cafés, and literary associations.", mapsQuery: "Rheinsberg Altstadt" },
    ],
    nearby: [
      { name: "Kurt Tucholsky Literature Museum", detail: "A palace-based museum exploring the writer and the literary image of Rheinsberg.", mapsQuery: "Kurt Tucholsky Literaturmuseum Rheinsberg" },
      { name: "Zechliner lake country", detail: "A quiet network of forest lakes suited to cycling, paddling, and longer stays.", mapsQuery: "Zechliner Seen Rheinsberg" },
    ],
  }),
  neuruppin: guide({
    intro: "A beautifully ordered Prussian town where broad classical streets meet Fontane's literary legacy and the long blue edge of Ruppiner See.",
    bestFor: "Literature & lakeside calm",
    idealStay: "Full day",
    bestSeason: "April–October",
    localTip: "Use Rheinsberger Tor station when possible: it places you closer to the center and lakeside than Neuruppin West.",
    arrivalTip: "From Rheinsberger Tor, the classical center and Fontane sights begin within a few minutes on foot.",
    highlights: [
      { name: "Classical old town", detail: "Broad squares, reconstructed façades, and a disciplined street plan shaped after the fire of 1787.", mapsQuery: "Neuruppin Altstadt Schulplatz" },
      { name: "Fontane trail", detail: "The writer's birthplace, monument, and namesake pharmacy anchor a literary walk through town.", mapsQuery: "Fontane Denkmal Neuruppin" },
      { name: "Ruppiner See promenade", detail: "A spacious waterfront below the twin-towered monastery church, ideal for the day's slow finish.", mapsQuery: "Seepromenade Neuruppin" },
    ],
    nearby: [
      { name: "Museum Neuruppin", detail: "Regional history, Fontane, and Karl Friedrich Schinkel in a modern museum complex.", mapsQuery: "Museum Neuruppin" },
      { name: "Ruppiner Schweiz", detail: "Wooded lakes north of town for a bike ride, boat trip, or longer nature stay.", mapsQuery: "Ruppiner Schweiz" },
    ],
  }),
  magdeburg: guide({
    intro: "Magdeburg mixes imperial history, Gothic scale, playful Hundertwasser architecture, and generous green space along the Elbe.",
    bestFor: "Architecture & Elbe history",
    idealStay: "Full day or weekend",
    bestSeason: "April–October",
    localTip: "The cathedral and Green Citadel sit together; save transit time for Elbauenpark rather than walking the whole distance.",
    arrivalTip: "The main station is close to the center. Trams make the cathedral, river, and Elbauenpark easy to combine.",
    highlights: [
      { name: "Magdeburg Cathedral", detail: "A monumental Gothic cathedral and the burial place of Emperor Otto the Great.", mapsQuery: "Magdeburg Cathedral" },
      { name: "Green Citadel", detail: "Hundertwasser's pink, planted, deliberately irregular architectural landmark.", mapsQuery: "Green Citadel Magdeburg" },
      { name: "Elbauenpark", detail: "A large riverside park with the timber Jahrtausendturm and broad city views.", mapsQuery: "Elbauenpark Magdeburg" },
    ],
    nearby: [
      { name: "Elbe promenade", detail: "A relaxed river route connecting central sights, bridges, and parks.", mapsQuery: "Elbuferpromenade Magdeburg" },
      { name: "Magdeburg Water Bridge", detail: "An immense navigable aqueduct carrying the Mittelland Canal over the Elbe outside the center.", mapsQuery: "Wasserstraßenkreuz Magdeburg" },
    ],
  }),
  torgau: guide({
    intro: "One of Germany's great Renaissance ensembles, Torgau layers electoral splendor, Reformation history, and the Elbe into a rewarding compact day.",
    bestFor: "Renaissance & Reformation",
    idealStay: "Full day",
    bestSeason: "April–October",
    localTip: "Climb the Hausmann Tower early if it is open; the overview makes the old-town street plan much easier to appreciate.",
    arrivalTip: "Torgau station is east of the old town. The market and Hartenfels Castle are about twenty minutes away on foot.",
    highlights: [
      { name: "Hartenfels Castle", detail: "A complete early-Renaissance palace famous for its self-supporting Grand Wendelstein staircase.", mapsQuery: "Schloss Hartenfels Torgau" },
      { name: "Castle Church", detail: "A foundational Protestant church building personally inaugurated by Martin Luther in 1544.", mapsQuery: "Schlosskirche Torgau" },
      { name: "Torgau old town", detail: "Hundreds of late-Gothic and Renaissance monuments around a handsome market square.", mapsQuery: "Torgau Marktplatz Altstadt" },
    ],
    nearby: [
      { name: "Katharina Luther Memorial", detail: "A small museum in the house where Katharina von Bora spent her final days.", mapsQuery: "Katharina Luther Stube Torgau" },
      { name: "Elbe promenade", detail: "River views, the castle silhouette, and a calm route beyond the historic streets.", mapsQuery: "Elbpromenade Torgau" },
    ],
  }),
  radebeul: guide({
    intro: "Radebeul turns Dresden's edge into a wine-country escape of vineyard paths, historic estates, Karl May, and steam-train nostalgia.",
    bestFor: "Wine, views & steam trains",
    idealStay: "Full day or weekend",
    bestSeason: "April–October",
    localTip: "Choose one side of town as your anchor—Wackerbarth and Altkötzschenbroda in the west, or Hoflößnitz and Karl May in the east.",
    arrivalTip: "S-Bahn and tram stops serve different parts of this long town; Radebeul Ost is best for Karl May and the narrow-gauge railway.",
    highlights: [
      { name: "Schloss Wackerbarth", detail: "A Baroque wine estate offering tastings, tours, gardens, and views of the Saxon Wine Route.", mapsQuery: "Schloss Wackerbarth Radebeul" },
      { name: "Hoflößnitz Wine Museum", detail: "A historic electoral winery and museum beneath the vineyard slopes.", mapsQuery: "Hoflößnitz Radebeul" },
      { name: "Karl May Museum", detail: "The author's home and a museum engaging with his work and Indigenous North American cultures.", mapsQuery: "Karl May Museum Radebeul" },
    ],
    nearby: [
      { name: "Lößnitzgrund Railway", detail: "A heritage narrow-gauge steam line from Radebeul toward Moritzburg and Radeburg.", mapsQuery: "Lößnitzgrundbahn Radebeul Ost" },
      { name: "Altkötzschenbroda", detail: "A restored village green of restaurants, galleries, and wine-town atmosphere.", mapsQuery: "Altkötzschenbroda" },
    ],
  }),
  meissen: guide({
    intro: "Meißen rises dramatically above the Elbe, bringing together a Gothic cathedral, Germany's first purpose-built palace, wine, and world-famous porcelain.",
    bestFor: "Porcelain & castle views",
    idealStay: "Full day or weekend",
    bestSeason: "April–October",
    localTip: "The castle hill is steep; visit it first, then descend through the old town toward the porcelain manufactory.",
    arrivalTip: "Meißen Altstadt station is convenient for both the center and the climb toward Albrechtsburg.",
    highlights: [
      { name: "Albrechtsburg Castle", detail: "A late-Gothic hilltop palace with exhibitions and sweeping views over the Elbe valley.", mapsQuery: "Albrechtsburg Meissen" },
      { name: "Meißen Cathedral", detail: "The twin-towered Gothic partner to Albrechtsburg on the dramatic castle hill.", mapsQuery: "Meissen Cathedral" },
      { name: "House of Meissen", detail: "The porcelain manufactory's demonstration workshops and museum trace more than three centuries of craft.", mapsQuery: "Meissen Porcelain Manufactory" },
    ],
    nearby: [
      { name: "Meißen old town", detail: "Steep lanes, the market, Frauenkirche carillon, and small wine taverns below the castle.", mapsQuery: "Meissen Altstadt Markt" },
      { name: "Saxon Wine Trail", detail: "Vineyard paths and tasting rooms extend along the Elbe toward Radebeul.", mapsQuery: "Sächsischer Weinwanderweg Meissen" },
    ],
  }),
  pirna: guide({
    intro: "Pirna is both a destination and a gateway: an unusually intact old town painted by Canaletto, with Saxon Switzerland beginning just beyond it.",
    bestFor: "Old-town beauty & hiking base",
    idealStay: "Full day or weekend",
    bestSeason: "April–October",
    localTip: "Stay overnight if you want both Pirna and a serious national-park hike; combining them in one regional day is too rushed.",
    arrivalTip: "Cross the Elbe from Pirna station and follow the signs into the market square; buses for the national park leave nearby.",
    highlights: [
      { name: "Canaletto market square", detail: "A preserved ensemble of the town hall, decorated houses, and the painter's famous Pirna viewpoint.", mapsQuery: "Canalettoblick Pirna Markt" },
      { name: "St. Mary's Church", detail: "A vast late-Gothic hall church with an exceptional roof and painted interior vaults.", mapsQuery: "St Marien Pirna" },
      { name: "Sonnenstein Castle", detail: "A hilltop complex with city views and a memorial to victims of Nazi medical murder.", mapsQuery: "Schloss Sonnenstein Pirna memorial" },
    ],
    nearby: [
      { name: "Bastei Bridge", detail: "The region's iconic sandstone viewpoint, reached with onward bus and walking plans.", mapsQuery: "Basteibrücke Saxon Switzerland" },
      { name: "Stadt Wehlen", detail: "A small Elbe town and trail gateway a short S-Bahn ride deeper into the park.", mapsQuery: "Stadt Wehlen Saxon Switzerland" },
    ],
  }),
  "koenigstein-saechsische-schweiz": guide({
    intro: "Königstein pairs one of Europe's most imposing mountain fortresses with river crossings and table-mountain hikes in the Elbe Sandstone landscape.",
    bestFor: "Fortress & sandstone hikes",
    idealStay: "Full day or weekend",
    bestSeason: "April–October",
    localTip: "The fortress alone fills several hours. Pair it with one short walk, not an ambitious second mountain.",
    arrivalTip: "The station sits on the opposite bank from town; cross by ferry, then use the signed climb or shuttle toward the fortress.",
    highlights: [
      { name: "Königstein Fortress", detail: "An 800-year-old plateau fortress with museums, ramparts, and huge views over Saxon Switzerland.", mapsQuery: "Königstein Fortress" },
      { name: "Pfaffenstein", detail: "A nearby table mountain with varied trails and the distinctive Barbarine rock needle.", mapsQuery: "Pfaffenstein Barbarine" },
      { name: "Königstein waterfront", detail: "A ferry-linked Elbe town with classic views up to the fortress plateau.", mapsQuery: "Königstein Elbe ferry" },
    ],
    nearby: [
      { name: "Lilienstein", detail: "A freestanding table mountain with a rewarding summit route across the river.", mapsQuery: "Lilienstein hike" },
      { name: "Bastei", detail: "The region's best-known bridge and sandstone panorama, easier as a separate day.", mapsQuery: "Bastei Saxon Switzerland" },
    ],
  }),
  "bad-schandau": guide({
    intro: "Bad Schandau is the practical heart of Saxon Switzerland: spa facilities, river ferries, a national-park center, and transit straight into the sandstone valleys.",
    bestFor: "National-park weekends",
    idealStay: "Weekend or longer",
    bestSeason: "April–October",
    localTip: "Always check current trail closures and weather with the national-park information service before setting out.",
    arrivalTip: "Bad Schandau station is across the Elbe from the center; continue by ferry, bus, or local connection rather than assuming a short walk.",
    highlights: [
      { name: "National Park Center", detail: "An interactive introduction to the geology, ecology, and responsible exploration of the Elbe Sandstone Mountains.", mapsQuery: "NationalparkZentrum Bad Schandau" },
      { name: "Kirnitzschtal Tram", detail: "A historic tram running from town into the national park's Kirnitzsch valley.", mapsQuery: "Kirnitzschtalbahn Bad Schandau" },
      { name: "Elbe promenade & Toskana Therme", detail: "River views and a thermal-bath option create a restorative counterpoint to hiking.", mapsQuery: "Toskana Therme Bad Schandau" },
    ],
    nearby: [
      { name: "Schrammsteine", detail: "A dramatic chain of sandstone formations for experienced, well-prepared hikers.", mapsQuery: "Schrammsteine hiking" },
      { name: "Schmilka", detail: "A tiny border village and trail hub with mill, bakery, ferry, and national-park access.", mapsQuery: "Schmilka Saxon Switzerland" },
    ],
  }),
  goerlitz: guide({
    intro: "Görlitz is an architectural time capsule and a border-city adventure, with richly preserved streets that have doubled for cities across Europe on film.",
    bestFor: "Architecture, film & borders",
    idealStay: "Weekend",
    bestSeason: "April–October",
    localTip: "Carry identification and cross the footbridge into Zgorzelec—the Polish perspective supplies some of the best views back to Görlitz.",
    arrivalTip: "The main station is south-west of the old town. Trams shorten the trip, while a walk reveals the nineteenth-century quarters.",
    highlights: [
      { name: "Untermarkt & old town", detail: "A layered ensemble of Gothic, Renaissance, Baroque, and nineteenth-century architecture.", mapsQuery: "Untermarkt Görlitz" },
      { name: "St. Peter and Paul", detail: "A twin-towered church above the Neisse, known for its Sun Organ and dramatic riverside position.", mapsQuery: "Peterskirche Görlitz" },
      { name: "Görliwood trail", detail: "Film locations used in productions including The Grand Budapest Hotel and other international features.", mapsQuery: "Görliwood film locations Görlitz" },
    ],
    nearby: [
      { name: "Zgorzelec", detail: "The Polish twin city across the Old Town Bridge, with riverside cafés and views back to Görlitz.", mapsQuery: "Zgorzelec old town bridge" },
      { name: "Berzdorfer See", detail: "A large recreation lake south of the city for cycling, beaches, and a summer extension.", mapsQuery: "Berzdorfer See" },
    ],
  }),
  zittau: guide({
    intro: "Zittau rewards the long journey with Renaissance architecture, extraordinary sacred textiles, and a steam railway into a compact mountain landscape.",
    bestFor: "Textile art & mountain rail",
    idealStay: "Weekend or longer",
    bestSeason: "April–October",
    localTip: "Build the trip around the narrow-gauge timetable if Oybin or Jonsdorf is the main goal; it is a separate ticket from the Deutschlandticket.",
    arrivalTip: "Zittau station is north of the old town and beside the narrow-gauge platforms; the central market is about fifteen minutes away.",
    highlights: [
      { name: "Great Zittau Lenten Cloth", detail: "A monumental fifteenth-century biblical picture cloth displayed in the Museum of Cultural History.", mapsQuery: "Großes Zittauer Fastentuch" },
      { name: "Zittau old town", detail: "A strong ensemble of town hall, churches, fountains, and Renaissance merchant houses.", mapsQuery: "Zittau Marktplatz Rathaus" },
      { name: "Zittau narrow-gauge railway", detail: "Steam trains climb from the city toward the mountain resorts of Oybin and Jonsdorf.", mapsQuery: "Zittauer Schmalspurbahn" },
    ],
    nearby: [
      { name: "Oybin", detail: "A mountain resort beneath romantic castle-and-monastery ruins on a sandstone outcrop.", mapsQuery: "Burg und Kloster Oybin" },
      { name: "Jonsdorf", detail: "A hiking village known for sandstone formations and access to the Zittau Mountains.", mapsQuery: "Jonsdorf Zittauer Gebirge" },
    ],
  }),
  erfurt: guide({
    intro: "Erfurt's medieval center is dense with lived-in history: merchants' houses over water, cathedral steps, and one of Europe's rare surviving medieval synagogues.",
    bestFor: "Medieval city & Jewish heritage",
    idealStay: "Weekend",
    bestSeason: "Year-round",
    localTip: "Reserve the Old Synagogue when demand is high, then let the rest of the center unfold on foot.",
    arrivalTip: "Erfurt Hbf is a short tram ride or an easy walk from Anger and the medieval center.",
    highlights: [
      { name: "Krämerbrücke", detail: "Europe's longest continuously inhabited bridge, lined with small shops and houses.", mapsQuery: "Krämerbrücke Erfurt" },
      { name: "Cathedral & St. Severus", detail: "Two monumental churches reached by the broad Domstufen above one of Germany's grandest squares.", mapsQuery: "Erfurt Cathedral St Severus" },
      { name: "Old Synagogue", detail: "A rare medieval synagogue presenting the Erfurt Treasure and the city's Jewish history.", mapsQuery: "Old Synagogue Erfurt" },
    ],
    nearby: [
      { name: "Petersberg Citadel", detail: "A Baroque fortress above the cathedral square with passages, ramparts, and city views.", mapsQuery: "Petersberg Citadel Erfurt" },
      { name: "egapark", detail: "Extensive horticultural gardens and architecture reached directly by tram.", mapsQuery: "egapark Erfurt" },
    ],
  }),
  weimar: guide({
    intro: "Few compact cities hold as much cultural weight as Weimar, where Goethe and Schiller, Bauhaus, the first German democracy, and Buchenwald demand thoughtful time.",
    bestFor: "Literature, design & history",
    idealStay: "Weekend",
    bestSeason: "Year-round",
    localTip: "Timed entry can limit Goethe's House and the Anna Amalia Library; reserve the one that matters most before arrival.",
    arrivalTip: "The station is north of the center. Buses run down to Goetheplatz, while the walk takes about twenty minutes.",
    highlights: [
      { name: "Goethe House & Park an der Ilm", detail: "The writer's home and garden house connect naturally through Weimar's beautiful central park.", mapsQuery: "Goethe National Museum Weimar" },
      { name: "Bauhaus Museum", detail: "A major collection explaining the movement founded in Weimar and its continuing influence.", mapsQuery: "Bauhaus Museum Weimar" },
      { name: "Anna Amalia Library", detail: "An extraordinary historic library whose Rococo Hall requires controlled admission.", mapsQuery: "Duchess Anna Amalia Library" },
    ],
    nearby: [
      { name: "Buchenwald Memorial", detail: "A major memorial and place of learning at the former concentration camp; allow focused, respectful time.", mapsQuery: "Buchenwald Memorial" },
      { name: "Belvedere Palace", detail: "A Baroque summer residence and gardens south of the city.", mapsQuery: "Belvedere Palace Weimar" },
    ],
  }),
  eisenach: guide({
    intro: "Eisenach gathers the Wartburg, Bach, Luther, and wooded ravines into one of central Germany's most history-rich small-city weekends.",
    bestFor: "Castle history & forest",
    idealStay: "Weekend",
    bestSeason: "April–October",
    localTip: "Reach the Wartburg early, then descend on foot through the forest if conditions are dry and your shoes are suitable.",
    arrivalTip: "The old town begins west of Eisenach station. Buses link the center with the Wartburg access point.",
    highlights: [
      { name: "Wartburg Castle", detail: "A UNESCO-listed castle tied to St. Elizabeth, Martin Luther, and decisive moments in German history.", mapsQuery: "Wartburg Castle" },
      { name: "Bach House", detail: "A lively music museum in the city where Johann Sebastian Bach was born.", mapsQuery: "Bach House Eisenach" },
      { name: "Luther House & old town", detail: "A historic house museum and compact center beneath the castle ridge.", mapsQuery: "Lutherhaus Eisenach" },
    ],
    nearby: [
      { name: "Drachenschlucht", detail: "A narrow mossy ravine and popular forest walk south of town.", mapsQuery: "Drachenschlucht Eisenach" },
      { name: "Burschenschaft Monument", detail: "A hilltop monument with broad views toward the Wartburg and Thuringian Forest.", mapsQuery: "Burschenschaftsdenkmal Eisenach" },
    ],
  }),
  hannover: guide({
    intro: "Hannover is greener and grander than its transit-hub reputation suggests, with formal royal gardens, a domed civic landmark, and lake life near the center.",
    bestFor: "Gardens & urban design",
    idealStay: "Full day or weekend",
    bestSeason: "April–October",
    localTip: "Follow the painted Red Thread for a self-guided center loop, then use the tram for Herrenhausen.",
    arrivalTip: "The main station opens directly into the center. Herrenhausen and other outer sights are easiest by Stadtbahn.",
    highlights: [
      { name: "Herrenhausen Gardens", detail: "One of Europe's best-preserved Baroque gardens, paired with the botanical Berggarten.", mapsQuery: "Herrenhausen Gardens Hannover" },
      { name: "New Town Hall", detail: "A palace-like civic building with city models and a seasonal curved lift to its dome.", mapsQuery: "New Town Hall Hannover" },
      { name: "Maschsee", detail: "A large urban lake for promenades, boating, and an easy green extension from the center.", mapsQuery: "Maschsee Hannover" },
    ],
    nearby: [
      { name: "Sprengel Museum", detail: "A major modern-art museum on the northern shore of Maschsee.", mapsQuery: "Sprengel Museum Hannover" },
      { name: "Eilenriede", detail: "An immense city forest of walking and cycling routes east of the center.", mapsQuery: "Eilenriede Hannover" },
    ],
  }),
  celle: guide({
    intro: "Celle brings nearly five hundred restored timber-framed houses together with a ducal castle, regional museums, and pioneering early-modern housing design.",
    bestFor: "Timber framing & court history",
    idealStay: "Full day or weekend",
    bestSeason: "Year-round",
    localTip: "Look above the shop fronts—the carvings and upper stories carry the real detail of the old-town ensemble.",
    arrivalTip: "Celle station lies west of the old town; buses shorten the route, or allow about twenty minutes to walk.",
    highlights: [
      { name: "Celle old town", detail: "One of Germany's densest ensembles of restored timber-framed houses and carved façades.", mapsQuery: "Celle Altstadt Fachwerk" },
      { name: "Celle Castle", detail: "A Renaissance and Baroque residence with palace theater and exhibitions on the House of Hanover.", mapsQuery: "Celle Castle" },
      { name: "Bomann Museum & Art Museum", detail: "Regional social history and contemporary light art share the museum quarter opposite the castle.", mapsQuery: "Bomann Museum Celle Kunstmuseum" },
    ],
    nearby: [
      { name: "Otto Haesler architecture", detail: "Influential New Building housing estates reveal Celle's unexpected modernist side.", mapsQuery: "Otto Haesler Celle Bauhaus" },
      { name: "Südheide Nature Park", detail: "Heath, forest, and river landscapes north of town for a slower second day.", mapsQuery: "Südheide Nature Park Celle" },
    ],
  }),
  goslar: guide({
    intro: "Goslar's imperial old town and Rammelsberg mine tell one connected story of medieval power, timber-framed wealth, and a millennium of ore extraction.",
    bestFor: "UNESCO history & mining",
    idealStay: "Weekend",
    bestSeason: "April–October",
    localTip: "Reserve an underground Rammelsberg tour, then build the old-town walk around that fixed time.",
    arrivalTip: "Goslar station is close to the northern old town; the market is roughly ten minutes away on foot.",
    highlights: [
      { name: "Imperial Palace", detail: "A monumental Romanesque complex reflecting Goslar's importance to medieval emperors.", mapsQuery: "Imperial Palace Goslar" },
      { name: "Goslar old town", detail: "A UNESCO-listed center of market squares, guild history, and more than a thousand timber-framed buildings.", mapsQuery: "Goslar Marktplatz Altstadt" },
      { name: "Rammelsberg Mine", detail: "A UNESCO mining museum with surface exhibitions and guided underground experiences.", mapsQuery: "Rammelsberg Mine Goslar" },
    ],
    nearby: [
      { name: "Hahnenklee", detail: "A mountain village known for the stave church, cable car, and Liebesbank hiking trail.", mapsQuery: "Hahnenklee Liebesbankweg" },
      { name: "Upper Harz Water Management System", detail: "Historic reservoirs and channels embedded in the Harz mining landscape.", mapsQuery: "Upper Harz Water Regale" },
    ],
  }),
  quedlinburg: guide({
    intro: "Quedlinburg is a living encyclopedia of timber-framed architecture, unfolding across a medieval street plan beneath the Romanesque castle hill.",
    bestFor: "UNESCO streets & romance",
    idealStay: "Weekend",
    bestSeason: "Year-round",
    localTip: "Stay after the day-trippers leave; early morning and evening are when the narrow lanes feel most atmospheric.",
    arrivalTip: "The station is south-east of the old town. The market is about fifteen minutes away, with the castle hill beyond it.",
    highlights: [
      { name: "Castle hill & Collegiate Church", detail: "The Romanesque spiritual and political core of Quedlinburg's UNESCO ensemble.", mapsQuery: "Quedlinburg Castle Hill Collegiate Church" },
      { name: "Quedlinburg old town", detail: "More than two thousand timber-framed houses spanning eight centuries of construction.", mapsQuery: "Quedlinburg Altstadt Marktplatz" },
      { name: "Münzenberg", detail: "A quieter hilltop quarter built through and around the remains of a medieval monastery.", mapsQuery: "Münzenberg Quedlinburg" },
    ],
    nearby: [
      { name: "Lyonel Feininger Gallery", detail: "Modern art in a focused museum close to the castle hill.", mapsQuery: "Lyonel Feininger Gallery Quedlinburg" },
      { name: "Thale & Bodetal", detail: "A dramatic Harz valley and cable-car landscape reached by regional train.", mapsQuery: "Bodetal Thale" },
    ],
  }),
  wernigerode: guide({
    intro: "Wernigerode is the colorful, theatrical face of the Harz: ornate timber framing below a hilltop castle, with steam trains departing toward the Brocken.",
    bestFor: "Castle, timber & steam",
    idealStay: "Weekend or longer",
    bestSeason: "April–October",
    localTip: "The Brocken Railway requires a separate, expensive ticket; check the weather and fare before building the trip around it.",
    arrivalTip: "The DB and Harz narrow-gauge stations sit beside one another. The market is a short walk west through the center.",
    highlights: [
      { name: "Wernigerode Castle", detail: "A romantic hilltop residence with furnished interiors and broad views across town to the Harz.", mapsQuery: "Wernigerode Castle" },
      { name: "Town hall & old town", detail: "An ornate timber-framed town hall anchors streets filled with colorful historic houses.", mapsQuery: "Wernigerode Rathaus Marktplatz" },
      { name: "Harz narrow-gauge railway", detail: "Steam trains begin their mountain journey toward Schierke and the Brocken beside the main station.", mapsQuery: "Harzer Schmalspurbahn Wernigerode" },
    ],
    nearby: [
      { name: "Brocken", detail: "The Harz's highest summit, reached by steam railway or demanding walking routes.", mapsQuery: "Brocken summit" },
      { name: "Schierke", detail: "A mountain village and national-park base below the Brocken.", mapsQuery: "Schierke Harz" },
    ],
  }),
  hamburg: guide({
    intro: "Hamburg is a full-scale maritime weekend of brick warehouses, harbor infrastructure, neighborhood energy, and water running through almost every view.",
    bestFor: "Harbor culture & big-city weekends",
    idealStay: "Weekend or longer",
    bestSeason: "Year-round",
    localTip: "Reserve popular attractions and the Elbphilharmonie Plaza, then use public ferries for a low-cost harbor perspective.",
    arrivalTip: "Hamburg Hbf is central and connected to every district by S-Bahn and U-Bahn; avoid trying to cover the city only on foot.",
    highlights: [
      { name: "Speicherstadt", detail: "UNESCO-listed red-brick warehouses, canals, bridges, and museums beside HafenCity.", mapsQuery: "Speicherstadt Hamburg" },
      { name: "Elbphilharmonie Plaza", detail: "A public viewing level wrapped around Hamburg's landmark concert hall above the harbor.", mapsQuery: "Elbphilharmonie Plaza" },
      { name: "Landungsbrücken & harbor ferry", detail: "The classic starting point for public ferries, harbor views, and the Old Elbe Tunnel.", mapsQuery: "Landungsbrücken Hamburg" },
    ],
    nearby: [
      { name: "Alster lakes", detail: "Central water, promenades, and boat trips that reveal Hamburg's more elegant side.", mapsQuery: "Binnenalster Hamburg" },
      { name: "Blankenese & Elbe beach", detail: "Hillside lanes and waterside paths downstream from the port.", mapsQuery: "Blankenese Treppenviertel Elbstrand" },
    ],
  }),
  luebeck: guide({
    intro: "Lübeck's old-town island is a Hanseatic masterpiece of brick churches, hidden courtyards, literary history, and marzipan traditions.",
    bestFor: "Hanseatic history & marzipan",
    idealStay: "Weekend",
    bestSeason: "Year-round",
    localTip: "Leave the main shopping street and enter the signed passages and courtyards—the city's intimate scale lives behind the façades.",
    arrivalTip: "Lübeck Hbf is west of the old-town island; cross toward the Holstentor to begin the natural walking route.",
    highlights: [
      { name: "Holstentor", detail: "The leaning twin-towered city gate and enduring symbol of Lübeck's Hanseatic wealth.", mapsQuery: "Holstentor Lübeck" },
      { name: "St. Mary's Church", detail: "A hugely influential brick-Gothic church rising above the center beside the town hall.", mapsQuery: "St Mary's Church Lübeck" },
      { name: "European Hansemuseum", detail: "An ambitious museum explaining the Hanseatic League beside the castle monastery.", mapsQuery: "European Hansemuseum Lübeck" },
    ],
    nearby: [
      { name: "Lübeck courtyards", detail: "Tiny historic passages and residential courtyards threaded through the old-town blocks.", mapsQuery: "Lübeck Gänge Höfe" },
      { name: "Travemünde", detail: "A Baltic beach and harbor resort reached directly by regional train from Lübeck.", mapsQuery: "Travemünde beach" },
    ],
  }),
  kiel: guide({
    intro: "Kiel is less a monument city than a maritime experience: ferries, sailing, beaches, shipyards, and open Baltic light along a long fjord.",
    bestFor: "Fjord, ferries & Baltic air",
    idealStay: "Weekend",
    bestSeason: "May–September",
    localTip: "Use a public fjord ferry as part of the sightseeing; it connects the city experience naturally with Laboe or the beaches.",
    arrivalTip: "Kiel Hbf sits directly on the inner fjord. Most waterfront sights unfold north from the station by foot or bus.",
    highlights: [
      { name: "Kiel Fjord ferry", detail: "Public ferries turn local transport into a wide-angle view of ships, shoreline, and naval architecture.", mapsQuery: "Kieler Förde ferry terminal" },
      { name: "Maritime Museum", detail: "Kiel's seafaring, naval, and shipbuilding story inside the former fish market hall.", mapsQuery: "Kiel Maritime Museum" },
      { name: "Kiellinie", detail: "A long waterfront promenade of sailing clubs, research vessels, cafés, and fjord views.", mapsQuery: "Kiellinie Kiel" },
    ],
    nearby: [
      { name: "Laboe Naval Memorial & U-995", detail: "A towering memorial, museum submarine, and Baltic beach reached around the fjord.", mapsQuery: "Laboe Naval Memorial U-995" },
      { name: "Falckenstein beach", detail: "A broad local beach with views of ferries entering and leaving the fjord.", mapsQuery: "Falckensteiner Strand Kiel" },
    ],
  }),
  flensburg: guide({
    intro: "Flensburg's long waterfront and merchant streets hold a distinctive Danish-German border culture shaped by rum, sailing, and trade.",
    bestFor: "Harbor history & border culture",
    idealStay: "Weekend",
    bestSeason: "May–September",
    localTip: "Look for the merchant courtyards branching off Große Straße; much of the city's character hides behind the street fronts.",
    arrivalTip: "Flensburg station lies south of the old town. Buses are useful with luggage; the center is otherwise a manageable walk.",
    highlights: [
      { name: "Flensburg old town", detail: "A walkable spine of market squares, merchant façades, lanes, and historic trading courtyards.", mapsQuery: "Flensburg Altstadt Nordermarkt" },
      { name: "Historic harbor", detail: "Traditional vessels, museum ships, and the Maritime Museum line the inner fjord.", mapsQuery: "Flensburg Museum Harbour" },
      { name: "Rum trail", detail: "Courtyards, trading houses, and tastings tell the story of Flensburg's once-vast rum industry.", mapsQuery: "Flensburg Rum Museum" },
    ],
    nearby: [
      { name: "Glücksburg Castle", detail: "A white Renaissance water castle northeast of the city, reachable by bus.", mapsQuery: "Glücksburg Castle" },
      { name: "Wassersleben & Danish border", detail: "A beach and coastal walking route that can continue across the border into Denmark.", mapsQuery: "Wassersleben beach Flensburg" },
    ],
  }),
  westerland: guide({
    intro: "Westerland is Sylt's energetic rail gateway, placing North Sea surf, a long beach promenade, wellness, and dune landscapes within steps of arrival.",
    bestFor: "North Sea & island reset",
    idealStay: "Two nights or longer",
    bestSeason: "May–September",
    localTip: "Weather changes quickly and beach access may require a seasonal guest card; pack wind protection even in summer.",
    arrivalTip: "Westerland station is central. The main beach and promenade are about ten minutes away on foot.",
    highlights: [
      { name: "Westerland beach", detail: "A long surf-facing North Sea beach backed by dunes, beach chairs, and a lively promenade.", mapsQuery: "Westerland beach Sylt" },
      { name: "Sylter Welle", detail: "A sea-view leisure and wellness pool for windy or cool island days.", mapsQuery: "Sylter Welle Westerland" },
      { name: "Sylt Aquarium", detail: "North Sea and tropical marine exhibits near the southern end of Westerland.", mapsQuery: "Sylt Aquarium Westerland" },
    ],
    nearby: [
      { name: "Keitum", detail: "A quiet historic village of thatched houses, gardens, and Wadden Sea views.", mapsQuery: "Keitum Sylt" },
      { name: "Kampen dunes & Red Cliff", detail: "Classic Sylt dune scenery and a striking coastal cliff north of Westerland.", mapsQuery: "Rotes Kliff Kampen Sylt" },
    ],
  }),
  bremen: guide({
    intro: "Bremen compresses a Hanseatic city break into a wonderfully walkable center of UNESCO civic landmarks, expressionist brick, river life, and storybook lanes.",
    bestFor: "Hanseatic stories & old lanes",
    idealStay: "Weekend",
    bestSeason: "Year-round",
    localTip: "The essential center is compact; spend the saved time slowly exploring Schnoor and the small museums of Böttcherstraße.",
    arrivalTip: "Bremen Hbf is north of the center. Trams reach the market quickly, while the walk through the Wallanlagen is more scenic.",
    highlights: [
      { name: "Market square, Town Hall & Roland", detail: "A UNESCO civic ensemble joined by the cathedral and the beloved Town Musicians statue.", mapsQuery: "Bremen Marktplatz Rathaus Roland" },
      { name: "Böttcherstraße", detail: "A short, extraordinary street combining expressionist brick architecture, art, shops, and a porcelain carillon.", mapsQuery: "Böttcherstraße Bremen" },
      { name: "Schnoor Quarter", detail: "Bremen's oldest district, a maze of tiny houses, lanes, workshops, and cafés.", mapsQuery: "Schnoor Bremen" },
    ],
    nearby: [
      { name: "Schlachte promenade", detail: "Restaurants, boats, and a lively Weser riverfront directly beside the old center.", mapsQuery: "Schlachte Bremen" },
      { name: "Überseestadt", detail: "Former port basins transformed into a district of industrial heritage, design, and waterside spaces.", mapsQuery: "Überseestadt Bremen" },
    ],
  }),
};
