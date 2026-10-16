(function () {
  const translations = {
    en: {
      eyebrow: "MediAssist care directions",
      browserTitle: "Hospital Indoor Navigation | MediAssist",
      pageTitle: "Hospital Indoor Navigation",
      subtitle: "Find your destination easily.",
      languageLabel: "Language",
      searchLabel: "Search rooms or departments",
      searchPlaceholder: "Try “Reception” or “Room 301”",
      searchButton: "Find route",
      floorLabel: "View floor",
      planLabel: "Demonstration floor plan",
      mapReady: "Map ready",
      arrivedStatus: "Destination reached",
      elevatorStatus: "Elevator reached",
      goToElevator: "Follow the highlighted route to the elevator.",
      legendCare: "Care departments",
      legendFacility: "Facilities",
      legendEmergency: "Emergency",
      legendRoute: "Your route",
      demoNote:
        "Demonstration layout only. Room positions and corridors must be verified against the hospital’s actual blueprint.",
      directionsLabel: "Your journey",
      directionsTitle: "Route instructions",
      routePrompt: "Search for a room or department to get started.",
      startLabel: "Starting point",
      noQuery: "Enter a room number or department to search.",
      noResults: "No matching rooms or departments found. Try another search.",
      multipleResults: "Several destinations match. Choose the one you need:",
      routeTo: "Route to",
      sameFloorStart: "Starting at",
      transferReady:
        "You have reached the elevator. Continue to the destination floor.",
      continueTo: "Continue to",
      floorRoute:
        "Take the elevator to {floor}, then follow the highlighted route to {destination}.",
      reached: "You have arrived at {destination}.",
      step: "Step {number}: Follow the highlighted corridor to {checkpoint}.",
      routeStarted: "Route highlighted. Follow the moving marker.",
      floorGround: "Ground Floor",
      floorSecond: "Second Floor",
      floorThird: "Third Floor",
      startEntrance: "Main Entrance",
      startElevator: "Elevator",
      selected: "Selected destination",
      categories: {
        care: "Care department",
        lab: "Laboratory",
        facility: "Facility",
        emergency: "Emergency",
        patient: "Patient room",
        restroom: "Restroom",
      },
    },
    ta: {
      eyebrow: "மெடிஅசிஸ்ட் மருத்துவ வழிகாட்டி",
      browserTitle: "மருத்துவமனை உட்புற வழிகாட்டி | MediAssist",
      pageTitle: "மருத்துவமனை உட்புற வழிகாட்டி",
      subtitle: "உங்கள் இலக்கை எளிதாகக் கண்டறியுங்கள்.",
      languageLabel: "மொழி",
      searchLabel: "அறை எண் அல்லது பிரிவைத் தேடுங்கள்",
      searchPlaceholder: "“வரவேற்பறை” அல்லது “அறை 301” எனத் தேடுங்கள்",
      searchButton: "வழியைக் காண்க",
      floorLabel: "தளத்தைத் தேர்ந்தெடுக்கவும்",
      planLabel: "மாதிரி தள வரைபடம்",
      mapReady: "வரைபடம் தயார்",
      arrivedStatus: "இலக்கை அடைந்துவிட்டீர்கள்",
      elevatorStatus: "மின்தூக்கியை அடைந்துவிட்டீர்கள்",
      goToElevator:
        "வழிகாட்டப்பட்ட பாதையைப் பின்பற்றி மின்தூக்கிக்குச் செல்லுங்கள்.",
      legendCare: "சிகிச்சைப் பிரிவுகள்",
      legendFacility: "வசதிகள்",
      legendEmergency: "அவசரப் பிரிவு",
      legendRoute: "உங்கள் வழி",
      demoNote:
        "இது ஒரு மாதிரி வரைபடம் மட்டுமே. அறைகள் மற்றும் வழித்தடங்கள் உண்மையான மருத்துவமனை வரைபடத்துடன் சரிபார்க்கப்பட வேண்டும்.",
      directionsLabel: "உங்கள் பயணம்",
      directionsTitle: "வழிமுறைகள்",
      routePrompt: "தொடங்க அறை அல்லது பிரிவைத் தேடுங்கள்.",
      startLabel: "தொடங்கும் இடம்",
      noQuery: "தேட அறை எண் அல்லது பிரிவை உள்ளிடுங்கள்.",
      noResults:
        "பொருந்தும் அறை அல்லது பிரிவு இல்லை. வேறு தேடலை முயற்சிக்கவும்.",
      multipleResults:
        "பல இடங்கள் பொருந்துகின்றன. தேவையான இடத்தைத் தேர்ந்தெடுக்கவும்:",
      routeTo: "செல்ல வேண்டிய இடம்",
      sameFloorStart: "தொடங்கும் இடம்",
      transferReady:
        "மின்தூக்கியை அடைந்துவிட்டீர்கள். இலக்கு தளத்திற்குத் தொடருங்கள்.",
      continueTo: "தொடரவும்:",
      floorRoute:
        "{floor} தளத்திற்குச் செல்லுங்கள். பின்னர் வழிகாட்டப்பட்ட பாதையைப் பின்பற்றி {destination} இடத்தை அடையுங்கள்.",
      reached: "{destination} இடத்தை அடைந்துவிட்டீர்கள்.",
      step: "படி {number}: வழிகாட்டப்பட்ட பாதையில் {checkpoint} இடத்திற்குச் செல்லுங்கள்.",
      routeStarted:
        "வழி குறிக்கப்பட்டுள்ளது. நகரும் குறியீட்டைப் பின்பற்றுங்கள்.",
      floorGround: "தரைத்தளம்",
      floorSecond: "இரண்டாம் தளம்",
      floorThird: "மூன்றாம் தளம்",
      startEntrance: "முக்கிய நுழைவாயில்",
      startElevator: "மின்தூக்கி",
      selected: "தேர்ந்தெடுத்த இடம்",
      categories: {
        care: "சிகிச்சைப் பிரிவு",
        lab: "ஆய்வகம்",
        facility: "வசதி",
        emergency: "அவசரப் பிரிவு",
        patient: "நோயாளர் அறை",
        restroom: "கழிப்பறை",
      },
    },
  };

  const corridorNodes = {
    west: { x: 150, y: 300 },
    center: { x: 500, y: 300 },
    east: { x: 850, y: 300 },
    upperWest: { x: 150, y: 205 },
    upperCenter: { x: 500, y: 205 },
    upperEast: { x: 850, y: 205 },
    lowerWest: { x: 150, y: 405 },
    lowerCenter: { x: 500, y: 405 },
    lowerEast: { x: 850, y: 405 },
  };

  const corridorEdges = [
    ["west", "center"],
    ["center", "east"],
    ["upperWest", "upperCenter"],
    ["upperCenter", "upperEast"],
    ["lowerWest", "lowerCenter"],
    ["lowerCenter", "lowerEast"],
    ["upperWest", "west"],
    ["upperCenter", "center"],
    ["upperEast", "east"],
    ["west", "lowerWest"],
    ["center", "lowerCenter"],
    ["east", "lowerEast"],
  ];

  function room(id, number, en, ta, category, row, x, width) {
    const y = row === "top" ? 28 : 474;
    const height = 116;
    const centerX = x + width / 2;
    const corridor =
      row === "top"
        ? centerX < 325
          ? "upperWest"
          : centerX < 675
            ? "upperCenter"
            : "upperEast"
        : centerX < 325
          ? "lowerWest"
          : centerX < 675
            ? "lowerCenter"
            : "lowerEast";

    return {
      id,
      number,
      names: { en, ta },
      category,
      node: id,
      door: { x: centerX, y: row === "top" ? y + height + 6 : y - 6, corridor },
      rect: { x, y, width, height },
    };
  }

  function buildFloor(id, titleKey, rooms, facilities, entrance) {
    const nodes = Object.assign({}, corridorNodes, {
      elevator: { x: 500, y: 175 },
      stairs: { x: 850, y: 175 },
    });
    const edges = corridorEdges.slice();
    edges.push(["elevator", "upperCenter"], ["stairs", "upperEast"]);

    rooms.forEach((item) => {
      nodes[item.node] = { x: item.door.x, y: item.door.y };
      edges.push([item.node, item.door.corridor]);
    });

    if (id === "ground") {
      nodes.entranceApproach = { x: 500, y: 525 };
      nodes.entranceApproachPoint = { x: 500, y: 455 };
      edges.push(
        ["entranceApproach", "entranceApproachPoint"],
        ["entranceApproachPoint", "lowerCenter"],
      );
    }

    return { id, titleKey, nodes, edges, rooms, facilities, entrance };
  }

  const groundRooms = [
    room("reception", "G01", "Reception", "வரவேற்பறை", "care", "top", 24, 210),
    room(
      "waiting-hall",
      "G02",
      "Waiting Hall",
      "காத்திருப்பு அறை",
      "facility",
      "top",
      265,
      210,
    ),
    room(
      "inquiry-desk",
      "G03",
      "Inquiry Desk",
      "விசாரணை மேசை",
      "facility",
      "top",
      525,
      210,
    ),
    room(
      "general-rooms",
      "G04",
      "General Rooms",
      "பொது அறைகள்",
      "care",
      "top",
      766,
      210,
    ),
    room(
      "emergency-rooms",
      "G05",
      "Emergency Rooms",
      "அவசர அறைகள்",
      "emergency",
      "bottom",
      24,
      210,
    ),
    room(
      "main-entrance",
      "G06",
      "Main Entrance",
      "முக்கிய நுழைவாயில்",
      "facility",
      "bottom",
      265,
      210,
    ),
    room(
      "ground-services",
      "G07",
      "General Services",
      "பொது சேவைகள்",
      "facility",
      "bottom",
      525,
      210,
    ),
  ];
  const mainEntrance = groundRooms.find((item) => item.id === "main-entrance");
  mainEntrance.node = "entranceApproach";
  mainEntrance.door = { x: 500, y: 525, corridor: "entranceApproachPoint" };

  const secondRooms = [
    room(
      "blood-research",
      "2F01",
      "Blood Research Centre",
      "இரத்த ஆராய்ச்சி மையம்",
      "lab",
      "top",
      24,
      210,
    ),
    room(
      "urine-laboratory",
      "2F02",
      "Urine Test Laboratory",
      "சிறுநீர் பரிசோதனைக் கூடம்",
      "lab",
      "top",
      265,
      210,
    ),
    room(
      "mens-restroom-2",
      "2F03",
      "Men's Restroom",
      "ஆண்கள் கழிப்பறை",
      "restroom",
      "top",
      525,
      210,
    ),
    room(
      "womens-restroom-2",
      "2F04",
      "Women's Restroom",
      "பெண்கள் கழிப்பறை",
      "restroom",
      "top",
      766,
      210,
    ),
    room(
      "doctors-restroom",
      "2F05",
      "Doctor's Restroom",
      "மருத்துவர் கழிப்பறை",
      "restroom",
      "bottom",
      24,
      210,
    ),
    room(
      "nurses-restroom",
      "2F06",
      "Nurse's Restroom",
      "செவிலியர் கழிப்பறை",
      "restroom",
      "bottom",
      265,
      210,
    ),
  ];

  const thirdRooms = [
    room(
      "icu",
      "3F01",
      "ICU",
      "தீவிர சிகிச்சைப் பிரிவு",
      "emergency",
      "top",
      24,
      210,
    ),
    room(
      "room-301",
      "301",
      "Patient Room 301",
      "நோயாளி அறை 301",
      "patient",
      "top",
      265,
      210,
    ),
    room(
      "room-302",
      "302",
      "Patient Room 302",
      "நோயாளி அறை 302",
      "patient",
      "top",
      525,
      210,
    ),
    room(
      "room-303",
      "303",
      "Patient Room 303",
      "நோயாளி அறை 303",
      "patient",
      "top",
      766,
      210,
    ),
    room(
      "room-304",
      "304",
      "Patient Room 304",
      "நோயாளி அறை 304",
      "patient",
      "bottom",
      24,
      210,
    ),
    room(
      "room-305",
      "305",
      "Patient Room 305",
      "நோயாளி அறை 305",
      "patient",
      "bottom",
      265,
      210,
    ),
    room(
      "mens-restroom-3",
      "3F02",
      "Men's Restroom",
      "ஆண்கள் கழிப்பறை",
      "restroom",
      "bottom",
      525,
      210,
    ),
    room(
      "womens-restroom-3",
      "3F03",
      "Women's Restroom",
      "பெண்கள் கழிப்பறை",
      "restroom",
      "bottom",
      766,
      210,
    ),
  ];

  const floors = {
    ground: buildFloor(
      "ground",
      "floorGround",
      groundRooms,
      [
        {
          id: "elevator",
          names: { en: "Elevator", ta: "மின்தூக்கி" },
          category: "facility",
          node: "elevator",
        },
        {
          id: "stairs",
          names: { en: "Stairs", ta: "படிக்கட்டுகள்" },
          category: "facility",
          node: "stairs",
        },
      ],
      "entranceApproach",
    ),
    second: buildFloor(
      "second",
      "floorSecond",
      secondRooms,
      [
        {
          id: "elevator",
          names: { en: "Elevators", ta: "மின்தூக்கி" },
          category: "facility",
          node: "elevator",
        },
        {
          id: "stairs",
          names: { en: "Stairs", ta: "படிக்கட்டுகள்" },
          category: "facility",
          node: "stairs",
        },
      ],
      "elevator",
    ),
    third: buildFloor(
      "third",
      "floorThird",
      thirdRooms,
      [
        {
          id: "emergency-exit",
          names: { en: "Emergency Exit", ta: "அவசர வெளியேற்றம்" },
          category: "emergency",
          node: "west",
        },
        {
          id: "elevator",
          names: { en: "Elevators", ta: "மின்தூக்கி" },
          category: "facility",
          node: "elevator",
        },
        {
          id: "stairs",
          names: { en: "Stairs", ta: "படிக்கட்டுகள்" },
          category: "facility",
          node: "stairs",
        },
      ],
      "elevator",
    ),
  };

  window.MEDI_HOSPITAL_DATA = { translations, floors };
})();
